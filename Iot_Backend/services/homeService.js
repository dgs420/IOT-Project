const Vehicle = require("../models/vehicleModel");
const Request = require("../models/requestModel");
const TrafficLog = require("../models/trafficLogModel");
const sequelize = require('../config/database');
const { Op } = require("sequelize");
const moment = require("moment");

exports.getHomeCounts = async () => {
    const startOfDay = moment().startOf("day").toDate();

    const [
        vehiclesCount,
        vehiclesIn,
        vehiclesExited,
        pendingRequests,
        trafficToday
    ] = await Promise.all([
        Vehicle.count(),
        Vehicle.count({ where: { status: "parking" } }),
        Vehicle.count({ where: { status: "exited" } }),
        Request.count({ where: { status: "pending" } }),
        TrafficLog.count({
            where: {
                time: { [Op.gte]: startOfDay },
                is_valid: true
            }
        })
    ]);

    return {
        pending_requests: pendingRequests,
        total_vehicles: vehiclesCount,
        vehicles_in: vehiclesIn,
        vehicles_exited: vehiclesExited,
        traffic_today: trafficToday,
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
