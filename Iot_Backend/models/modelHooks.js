const Vehicle = require('./vehicleModel');
const ParkingSession = require('./parkingSessionModel');

Vehicle.beforeUpdate(async (vehicle, options) => {
  if (vehicle.status === 'exited') {
    const activeSession = await ParkingSession.findOne({
      where: {
        vehicle_id: vehicle.vehicle_id,
        status: 'active',
      },
    });

    if (activeSession) {
      throw new Error('Cannot set vehicle to exited with an active parking session');
    }
  }
});
