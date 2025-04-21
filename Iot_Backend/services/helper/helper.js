async function isParkingFull(vehicle_type_id) {
    const [space, parkedCount] = await Promise.all([
      ParkingSpace.findOne({ where: { vehicle_type_id } }),
      Vehicle.count({ where: { vehicle_type_id, status: 'parking' } }),
    ]);
  
    return parkedCount >= space.total_spaces;
  }
  