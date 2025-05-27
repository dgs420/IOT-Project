const TrafficLog = require('../models/trafficLogModel');
const User = require('../models/userModel');
const RfidCard = require('../models/rfidCardModel');
const Device = require('../models/deviceModel');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const {getClient,connectMqtt } = require('../services/mqttClient');
const EventEmitter = require("events");
const { is } = require('express/lib/request');
const client  = connectMqtt ();
const mqttEventEmitter   = new EventEmitter();


exports.createDevice = async (req, res) => {
    const { embed_id, location, type, status } = req.body;

    try {
        // Check if a device with the same embed_id already exists
        const existingDevice = await Device.findOne({ where: { embed_id } });
        if (existingDevice) {
            return res.status(400).json({
                code: 400,
                message: 'Device with this ID already exists.',
            });
        }

        // Default the device status to 'offline' initially
        const initialStatus = status || 'offline';

        // Create the device in the database
        const newDevice = await Device.create({
            embed_id,
            location,
            type,
            status: initialStatus,
        });

        // Subscribe to the status topic for the new device
        const topic = `device/${embed_id}/status`;
        client.subscribe(topic, (err) => {
            if (err) {
                console.error(`Failed to subscribe to topic ${topic}:`, err.message);
                return res.status(500).json({
                    code: 500,
                    message: 'Failed to create device. Could not subscribe to status topic.',
                });
            }

            console.log(`Subscribed to status topic for device ${embed_id}`);
        });

        const timeout = setTimeout(async () => {
            console.warn(`No status message received for device ${embed_id} within timeout period.`);

            // Optionally update the status to "unknown" or handle as needed
            // await Device.update({ status: 'offline' }, { where: { embed_id } });

            // Unsubscribe from the topic after the timeout
            client.unsubscribe(topic, (err) => {
                if (err) {
                    console.error(`Failed to unsubscribe from topic ${topic}:`, err.message);
                } else {
                    console.log(`Unsubscribed from topic: ${topic} due to timeout`);
                }
            });
        }, 10000); // Timeout period in milliseconds (e.g., 10 seconds)

        // Listen for the retained status message
        client.once('message', async (receivedTopic, message) => {
            if (receivedTopic === topic) {
                clearTimeout(timeout);
                try {
                    const statusMessage = JSON.parse(message.toString());

                    if (statusMessage.status) {
                        // Update the device status in the database
                        await Device.update(
                            { status: statusMessage.status },
                            { where: { embed_id } }
                        );
                        console.log(`Device ${embed_id} status updated to: ${statusMessage.status}`);
                    }

                    // Unsubscribe from the topic after handling the message
                    client.unsubscribe(topic, (err) => {
                        if (err) {
                            console.error(`Failed to unsubscribe from topic ${topic}:`, err.message);
                        } else {
                            console.log(`Unsubscribed from topic: ${topic}`);
                        }
                    });
                } catch (error) {
                    console.error('Error parsing retained status message:', error);
                }
            }
        });

        // Respond to the client
        res.status(200).json({
            code: 200,
            message: 'Device created successfully. Waiting for status update...',
            info: newDevice,
        });
    } catch (error) {
        console.error('Error creating device:', error);
        res.status(500).json({
            code: 500,
            error: 'Failed to create device.',
        });
    }
};


exports.getAllDevice = async (req, res) => {
    try {
        const devices = await Device.findAll();
        res.status(200).json({
            code: 200,
            message: 'Devices found',
            info: devices
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            error: 'Failed to retrieve devices' });
    }
};

// Get a single device by ID
exports.getDeviceById = async (req, res) => {
    const { deviceId } = req.params;

    try {
        const device = await Device.findByPk(deviceId);
        if (!device) {
            return res.status(404).json({
                code: 404,
                message: 'Device not found.',
            });
        }

        res.status(200).json({
            code: 200,
            message: 'Device retrieved successfully.',
            info: device,
        });
    } catch (error) {
        console.error('Error retrieving device:', error);
        res.status(500).json({
            code: 500,
            error: 'Failed to retrieve device.',
        });
    }
};

exports.getDeviceByEmbedId = async (req, res) => {
    const { embedId } = req.params; // Change to embedId

    try {
        // Find the device by the embed ID
        const device = await Device.findOne({ where: { embed_id: embedId } }); // Assuming the column in the database is named 'embed_id'

        if (!device) {
            return res.status(404).json({
                code: 404,
                message: 'Device not found.',
            });
        }

        res.status(200).json({
            code: 200,
            message: 'Device retrieved successfully.',
            info: device,
        });
    } catch (error) {
        console.error('Error retrieving device:', error);
        res.status(500).json({
            code: 500,
            error: 'Failed to retrieve device.',
        });
    }
};

// Update a device
exports.updateDevice = async (req, res) => {
    const { deviceId } = req.params;
    const { location, type, status, last_seen } = req.body;

    try {
        const device = await Device.findByPk(deviceId);
        if (!device) {
            return res.status(404).json({
                code: 404,
                message: 'Device not found.',
            });
        }

        // Update device details
        await device.update({
            location: location || device.location,
            type: type || device.type,
            status: status || device.status,
            last_seen: last_seen || device.last_seen,
        });

        res.status(200).json({
            code: 200,
            message: 'Device updated successfully.',
            info: device,
        });
    } catch (error) {
        console.error('Error updating device:', error);
        res.status(500).json({
            code: 500,
            error: 'Failed to update device.',
        });
    }
};

// Delete a device
exports.deleteDevice = async (req, res) => {
    const { deviceId } = req.params;

    try {
        const device = await Device.findByPk(deviceId);
        if (!device) {
            return res.status(404).json({
                code: 404,
                message: 'Device not found.',
            });
        }

        // Delete the device
        await device.destroy();

        res.status(200).json({
            code: 200,
            message: 'Device deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting device:', error);
        res.status(500).json({
            code: 500,
            error: 'Failed to delete device.',
        });
    }
};

exports.commandDevice =async (req,res) =>{
    const { embed_id, command } = req.body;

    try {
        const device = await Device.findOne({ where: { embed_id } });
        if (!device) {
            return res.status(404).json({
                code: 404,
                message: 'Device not found.',
            });
        }
        if (device.status === 'offline') {
            return res.status(400).json({
                code: 400,
                message: 'Device is offline'
            });
        }
        if (!embed_id || !command) {
            return res.json({
                code: 400,
                message:'embed_id and command are required' });
        }

        // Publish command using the existing MQTT connection
        const topic = `barrier/${command}/response/${embed_id}`;
        const payload = JSON.stringify({ status: 'valid', message: command });

        client.publish(topic, payload, async (err) => {
            if (err) {
                console.error(`[COMMAND] Failed to send command to device ${embed_id}:`, err.message);
                return res.status(500).json({code: 500, message: 'Failed to send command'});
            }
            console.info(`[COMMAND] Command sent to device ${embed_id}:`, payload);
            const actionType = command === "enter" ? "admin enter" : "admin exit"; // Determine action type
            mqttEventEmitter.emit('mqttMessage', { embed_id, card_number: null,vehicle_number:null, action:actionType, message: `${actionType} logged` });

            await TrafficLog.create({
                card_id: null,
                device_id: device.device_id,
                action: actionType,
                is_valid: true,
                time: new Date(),
            });
            res.status(200).json({code: 200, message: 'Command sent successfully'});
        });
    } catch (error) {
        console.error('Error deleting device:', error);
        res.status(500).json({
            code: 500,
            error: 'Failed to delete device.',
        });
    }
}