const Vehicle = require("../models/vehicleModel");
const Request = require("../models/requestModel");
const TrafficLog = require("../models/trafficLogModel");
const sequelize = require('../config/database');
const { Op } = require("sequelize");
const moment = require("moment");
const User = require("../models/userModel");
const ParkingSpace = require("../models/parkingSpaceModel");
const Device = require("../models/deviceModel");
exports.getHomeCounts = async () => {
    const startOfDay = moment().startOf("day").toDate();

    const [
        vehiclesCount,
        usersCount,
        vehiclesIn,
        vehiclesExited,
        pendingRequests,
        trafficToday,
        totalParkingSpaces,
        devicesCount,
        onlineDevicesCount
    ] = await Promise.all([
        Vehicle.count(),
        User.count(),
        Vehicle.count({ where: { status: "parking" } }),
        Vehicle.count({ where: { status: "exited" } }),
        Request.count({ where: { status: "pending" } }),
        TrafficLog.count({
            where: {
                time: { [Op.gte]: startOfDay },
                is_valid: true
            }
        }),
        ParkingSpace.sum('total_spaces'),
        Device.count(),
        Device.count({ where: { status: "online" } })
    ]);

    return {
        user_count: usersCount,
        pending_requests: pendingRequests,
        total_vehicles: vehiclesCount,
        vehicles_in: vehiclesIn,
        vehicles_exited: vehiclesExited,
        traffic_today: trafficToday,
        total_spaces: totalParkingSpaces,
        devices_count: devicesCount,    
        online_devices_count: onlineDevicesCount
    };
};

exports.getVehicleCountsByType = async () => {
    return await Vehicle.findAll({
        attributes: [
            'vehicle_type_id',
            [sequelize.fn('COUNT', sequelize.col('vehicle_type_id')), 'count']
        ],
        group: ['vehicle_type_id']
    });
};
