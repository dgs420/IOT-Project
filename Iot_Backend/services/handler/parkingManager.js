const Device = require("../../models/deviceModel.js");
const RfidCard = require("../../models/rfidCardModel");
const TrafficLog = require("../../models/trafficLogModel");
const ParkingSession = require("../../models/parkingSessionModel");
const User = require("../../models/userModel");
const Notification = require("../../models/notificationModel");
const Vehicle = require("../../models/vehicleModel");
const VehicleType = require("../../models/vehicleTypeModel");
const Transaction = require("../../models/transactionModel");
const { sendNotification } = require("../../controllers/notificationController.js");
const { isParkingFull } = require("../helper/helper.js");

class ParkingManager {
    /**
     * Calculate parking fee based on entry and exit times
     * @param {Date} entryTime - Time of entry
     * @param {Date} exitTime - Time of exit
     * @param {number} vehicleTypeId - ID of vehicle type
     * @returns {Promise<number>} Calculated parking fee
     */
    static async calculateFee(entryTime, exitTime, vehicleTypeId) {
        const vehicleType = await VehicleType.findByPk(vehicleTypeId);
        if (!vehicleType) {
            throw new Error("Vehicle type not found");
        }

        const durationMs = exitTime - entryTime;
        const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
        return durationHours * vehicleType.fee_per_hour;
    }

    /**
     * Handle barrier entry/exit for vehicles
     * @param {Object} client - MQTT client
     * @param {string} topic - MQTT topic
     * @param {Object} data - Message data
     */
    static async barrierHandler(client, topic, data) {
        const { card_number, embed_id, action } = data;

        // Validate input
        if (!this.validateInput(client, topic, embed_id, card_number, action)) {
            return;
        }

        try {
            const device = await this.findDevice(client, topic, embed_id);
            if (!device) return;

            const card = await this.findRfidCard(client, topic, card_number);
            if (!card) return;

            const vehicle = await this.findVehicle(client, topic, card);
            if (!vehicle) return;

            // Check vehicle and user status
            if (vehicle.status === "blocked") {
                return this.publishResponse(client, topic, embed_id, {
                    status: "invalid",
                    vehicle_number: vehicle.vehicle_number,
                    message: "Vehicle is blocked"
                });
            }

            const user = card.user;
            if (user.balance <= 0) {
                return this.handleInsufficientBalance(client, topic, embed_id, user, vehicle);
            }

            // Handle entry or exit based on action
            return action === "enter" 
                ? await this.handleEntry(client, topic, embed_id, vehicle, device)
                : await this.handleExit(client, topic, embed_id, vehicle, user);
        } catch (error) {
            console.error("Barrier handler error:", error);
            this.publishResponse(client, topic, embed_id, {
                status: "invalid",
                message: "Internal server error"
            });
        }
    }

    /**
     * Validate input parameters
     */
    static validateInput(client, topic, embed_id, card_number, action) {
        if (!embed_id || !card_number || !action) {
            this.publishResponse(client, topic, embed_id, {
                status: "invalid", 
                message: "Missing fields"
            });
            return false;
        }
        return true;
    }

    /**
     * Find device by embed_id
     */
    static async findDevice(client, topic, embed_id) {
        const device = await Device.findOne({ where: { embed_id } });
        if (!device) {
            this.publishResponse(client, topic, embed_id, {
                status: "invalid", 
                message: "Device not found"
            });
        }
        return device;
    }

    /**
     * Find RFID card with associated user
     */
    static async findRfidCard(client, topic, card_number) {
        const card = await RfidCard.findOne({
            where: { card_number },
            include: [{ model: User }]
        });

        if (!card || !card.user) {
            this.publishResponse(client, topic, card_number, {
                status: "invalid",
                vehicle_number: "N/A",
                message: "Card or user not found"
            });
        }
        return card;
    }

    /**
     * Find vehicle associated with RFID card
     */
    static async findVehicle(client, topic, card) {
        const vehicle = await Vehicle.findOne({
            where: { card_id: card.card_id },
            include: [{ model: VehicleType }]
        });

        if (!vehicle) {
            this.publishResponse(client, topic, topic, {
                status: "invalid",
                vehicle_number: "N/A",
                message: `Vehicle not found for card ${card.card_number}`
            });
        }
        return vehicle;
    }

    /**
     * Handle insufficient balance scenario
     */
    static handleInsufficientBalance(client, topic, embed_id, user, vehicle) {
        sendNotification(user.user_id, `Insufficient balance to park`, "warning");
        return this.publishResponse(client, topic, embed_id, {
            status: "invalid",
            vehicle_number: vehicle.vehicle_number,
            message: "Insufficient balance"
        });
    }

    /**
     * Handle vehicle entry
     */
    static async handleEntry(client, topic, embed_id, vehicle, device) {
        // Check if vehicle is already inside
        if (vehicle.status !== "exited") {
            return this.publishResponse(client, topic, embed_id, {
                status: "invalid",
                vehicle_number: vehicle.vehicle_number,
                message: "Vehicle is already inside"
            });
        }

        // Check parking space availability
        if (await isParkingFull(vehicle.vehicle_type_id)) {
            return this.publishResponse(client, topic, embed_id, {
                status: "invalid",
                vehicle_number: vehicle.vehicle_number,
                message: "Parking space full"
            });
        }

        // Update vehicle status and create parking session
        await vehicle.update({ status: "parking" });
        await ParkingSession.create({
            vehicle_id: vehicle.vehicle_id,
            entry_time: new Date(),
            status: "active",
        });

        // Log traffic
        await this.logTraffic(device.device_id, vehicle.card_id, "enter");

        return this.publishResponse(client, topic, embed_id, {
            status: "valid",
            message: "Entry logged",
            vehicle_number: vehicle.vehicle_number,
        });
    }

    /**
     * Handle vehicle exit
     */
    static async handleExit(client, topic, embed_id, vehicle, user) {
        const session = await ParkingSession.findOne({
            where: { vehicle_id: vehicle.vehicle_id, status: "active" }
        });

        if (!session) {
            return this.publishResponse(client, topic, embed_id, {
                status: "invalid",
                vehicle_number: vehicle.vehicle_number,
                message: "No active parking session found"
            });
        }

        const exit_time = new Date();
        const fee = await this.calculateFee(session.entry_time, exit_time, vehicle.vehicle_type_id);

        // Check if user has sufficient balance
        if (user.balance < fee) {
            sendNotification(
                user.user_id,
                `Insufficient balance for exit fee of $${fee} for vehicle ${vehicle.vehicle_number}`,
                "warning"
            );

            return this.publishResponse(client, topic, embed_id, {
                status: "Invalid",
                message: "Insufficient balance",
                vehicle_number: vehicle.vehicle_number,
                fee: fee,
            });
        }

        // Process payment and update records
        await user.update({ balance: user.balance - fee });
        await session.update({
            exit_time,
            status: "completed",
            payment_status: "paid",
            fee,
        });

        // Create transaction record
        await Transaction.create({
            user_id: user.user_id,
            balance: user.balance,
            amount: fee,
            status: "completed",
            payment_method: "rfid_balance",
            transaction_type: "fee",
            session_id: session.session_id,
        });

        // Update vehicle status
        await vehicle.update({ status: "exited" });

        // Log traffic
        await this.logTraffic(device.device_id, vehicle.card_id, "exit");

        return this.publishResponse(client, topic, embed_id, {
            status: "valid",
            message: "Exit logged",
            vehicle_number: vehicle.vehicle_number,
            fee: fee,
        });
    }

    /**
     * Publish response to MQTT topic
     */
    static publishResponse(client, topic, embed_id, responseData) {
        client.publish(`${topic}/response/${embed_id}`, JSON.stringify(responseData));
    }

    /**
     * Log traffic entry/exit
     */
    static async logTraffic(device_id, card_id, action) {
        await TrafficLog.create({
            card_id,
            device_id,
            action,
            time: new Date(),
        });
    }

   
    static async cashConfirm(client, data) {
        const { vehicle_number, embed_id, fee } = data;
        const topic = "exit";
        if (!vehicle_number || !embed_id || !fee) {
            return this.publishResponse(client, topic, embed_id, {
                status: "invalid",
                message: "Missing fields",
            });
        }

        try {
            // Find vehicle
            const vehicle = await Vehicle.findOne({
                where: { vehicle_number },
                include: [{ model: User }]
            });

            if (!vehicle) {
                return this.publishResponse(client, topic, embed_id, {
                    status: "invalid",
                    message: "Vehicle not found",
                });
            }

            // Find active parking session
            const session = await ParkingSession.findOne({
                where: { vehicle_id: vehicle.vehicle_id, status: "active" }
            });

            if (!session) {
                return this.publishResponse(client, topic, embed_id, {
                    status: "invalid",
                    vehicle_number: vehicle.vehicle_number,
                    message: "No active parking session found",
                });
            }

            const exit_time = new Date();
            const user = vehicle.user; // Assuming vehicle has a user association

            // Update session
            await session.update({
                exit_time,
                status: "completed",
                payment_status: "paid",
                fee,
            });

            // Create transaction
            await Transaction.create({
                user_id: user.user_id,
                balance: user.balance,
                amount: fee,
                status: "completed",
                payment_method: "cash",
                transaction_type: "fee",
                session_id: session.session_id,
            });

            // Update vehicle status
            await vehicle.update({ status: "exited" });

            // Send notification
            sendNotification(
                user.user_id,
                `Cash payment of ${fee} received for vehicle ${vehicle.vehicle_number}`,
                "info"
            );

            // Log traffic
            await this.logTraffic(device.device_id, vehicle.card_id, "exit-cash");

            // Publish response
            this.publishResponse(client, topic, embed_id, {
                status: "valid",
                message: "Cash payment confirmed",
                vehicle_number: vehicle.vehicle_number,
                fee,
                payment_method: "cash",
            });
        } catch (error) {
            console.error("Cash confirm error:", error);
            this.publishResponse(client, topic, embed_id, {
                status: "invalid",
                message: "Internal server error"
            });
        }
    }
}

// Export the class methods
module.exports = { 
    barrierHandler: ParkingManager.barrierHandler.bind(ParkingManager),
    cashConfirm: ParkingManager.cashConfirm.bind(ParkingManager)
};