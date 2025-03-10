const Device = require('../../models/deviceModel.js');
const { mqttEventEmitter } = require('../eventEmitter');

async function handleDeviceStatus(client, embed_id, data) {
    const { status } = data;
    const device = await Device.findOne({ where: { embed_id } });
    console.log("Handler: " + status);
    if (!device) {
        console.warn(`Device ${embed_id} not found.`);
        return;
    }
    if (!mqttEventEmitter) {
        console.error("Error: mqttEventEmitter is undefined!");
        return;
    }
    const now = new Date();
    await device.update({ status, last_seen: now });

    mqttEventEmitter.emit('deviceStatus', { embed_id, status });
}

module.exports = { handleDeviceStatus };
