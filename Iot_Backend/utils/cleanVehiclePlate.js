function normalizeVehiclePlate(input) {
  if (typeof input !== "string") {
    throw { code: 400, message: "Vehicle plate must be a string" };
  }
  const cleaned = input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  if (!/^[A-Z]{3}[0-9]{4}$/.test(cleaned)) {
    throw {
      code: 400,
      message: "Invalid vehicle plate format. Expected format: ABC1234",
    };
  }

  return cleaned;
}

module.exports = normalizeVehiclePlate;
