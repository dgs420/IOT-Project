const Device = require("../models/deviceModel");
const TrafficLog = require("../models/trafficLogModel");
const { getClient } = require("./mqttClient");
const { Op } = require("sequelize");

const createDevice = async ({
  embed_id,
  location,
  type,
  status = "offline",
}) => {
  const client = getClient();

  const existingDevice = await Device.findOne({ where: { embed_id } });
  if (existingDevice)
    throw { code: 400, message: "Device with this ID already exists." };

  const newDevice = await Device.create({ embed_id, location, type, status });

  const topic = `device/${embed_id}/status`;
  client.subscribe(topic);

  setTimeout(() => {
    console.log("Unsubscribing from MQTT topic:", topic);
    client.unsubscribe(topic);
  }, 5000);

  return newDevice;
};

const getAllDevices = async () => {
  return await Device.findAll();
};

const getDeviceById = async (deviceId) => {
  const device = await Device.findByPk(deviceId);
  if (!device) throw { code: 404, message: "Device not found." };
  return device;
};

const getDeviceByEmbedId = async (embed_id) => {
  const device = await Device.findOne({ where: { embed_id } });
  if (!device) throw { code: 404, message: "Device not found." };
  return device;
};

const updateDevice = async (deviceId, updateData) => {
  const device = await Device.findByPk(deviceId);
  if (!device) throw { code: 404, message: "Device not found." };

  await device.update({
    location: updateData.location ?? device.location,
    type: updateData.type ?? device.type,
    status: updateData.status ?? device.status,
    last_seen: updateData.last_seen ?? device.last_seen,
  });

  return device;
};

const deleteDevice = async (deviceId) => {
  const device = await Device.findByPk(deviceId);
  if (!device) throw { code: 404, message: "Device not found." };

  await device.destroy();
};

const commandDevice = async ({ embed_id, command }) => {
  const client = getClient();
  const device = await Device.findOne({ where: { embed_id } });
  if (!device) throw { code: 404, message: "Device not found." };
  if (device.status === "offline")
    throw { code: 400, message: "Device is offline" };

  const topic = `barrier/${command}/response/${embed_id}`;
  const payload = JSON.stringify({ status: "valid", message: command });

  await new Promise((resolve, reject) => {
    client.publish(topic, payload, async (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  const actionType = command === "enter" ? "admin enter" : "admin exit";
  await TrafficLog.create({
    card_id: null,
    device_id: device.device_id,
    action: actionType,
    is_valid: true,
    time: new Date(),
  });

  return { message: "Command sent successfully", action: actionType };
};

module.exports = {
  createDevice,
  getAllDevices,
  getDeviceById,
  getDeviceByEmbedId,
  updateDevice,
  deleteDevice,
  commandDevice,
};
