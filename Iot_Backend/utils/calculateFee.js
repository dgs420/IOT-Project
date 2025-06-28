const VehicleType = require("../models/vehicleTypeModel");
async function calculateFee(entryTime, exitTime, vehicleTypeId) {
  if (exitTime <= entryTime) {
    throw new Error("Exit time must be after entry time");
  }
  const vehicleType = await VehicleType.findByPk(vehicleTypeId);

  if (!vehicleType) {
    throw new Error("Vehicle type not found");
  }

  const ratePerHour = vehicleType.fee_per_hour;
  const durationMs = exitTime - entryTime;
  const durationMinutes = Math.ceil(durationMs / (1000 * 60));
  const durationHours = durationMs / (1000 * 60 * 60);
  // const finalFee = parseFloat((durationHours * ratePerHour).toFixed(2));
  const ratePerMinute = ratePerHour / 60;
  const finalFee = durationMinutes * ratePerMinute;
  // const finalFee = Math.round(baseFee * Math.pow(10, 2)) / Math.pow(10, 2);
  console.log("durationMinutes", durationMinutes, "ratePerMinute",ratePerMinute, "finalFee", finalFee);
  return  Math.ceil(finalFee * 100) / 100;
}

module.exports = calculateFee;
