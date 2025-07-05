const Vehicle = require("../../models/vehicleModel");
const ParkingSpace = require("../../models/parkingSpaceModel");
const ParkingSession = require("../../models/parkingSessionModel");
async function isParkingFull(vehicle_type_id) {
    const [space, parkedCount] = await Promise.all([
        ParkingSpace.findOne({ where: { vehicle_type_id } }),
        ParkingSession.count({ where: { vehicle_type_id, status: 'active' } }),

        // Vehicle.count({ where: { vehicle_type_id, status: 'parking' } }),
    ]);
    return parkedCount >= space.total_spaces;
}

module.exports = { isParkingFull };