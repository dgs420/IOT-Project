const Device = require('../../models/deviceModel.js');
const RfidCard = require('../../models/rfidCardModel');
const TrafficLog = require('../../models/trafficLogModel');

const { mqttEventEmitter } = require('../eventEmitter');
const {getClient } = require('../mqttClient');
// const EventEmitter = require("events");
// const client  = getClient ();

async function barrierHandler(client, topic,data) {
    // const client = getClient();
    // console.log(data);
    const { card_number, embed_id, action } = data;
    // mqttEventEmitter.emit('mqttMessage', { embed_id, card_number, action, message: null });
    if (!embed_id || !card_number || !action) {
        console.error('Invalid barrier message:', data);
        mqttEventEmitter.emit('mqttMessage', { embed_id, card_number, action, message: 'Missing fields' });
        return client.publish(`${topic}/response/${embed_id}`, JSON.stringify({ status: 'invalid', message: 'Missing fields' }));
    }

    const device = await Device.findOne({ where: { embed_id } });
    const card = await RfidCard.findOne({ where: { card_number } });
    if (!device || !card) {
        const error = !device ? 'Device not found' : 'Card not found';
        mqttEventEmitter.emit('mqttMessage', { embed_id, card_number,vehicle_number:null,action, message: error });
        return client.publish(`${topic}/response/${embed_id}`, JSON.stringify({ status: 'invalid', message: error }));
    }

    const logAction = action === 'enter' ? 'enter' : 'exit';
    if (action === 'enter' && card.status === 'exited') {
        await card.update({ status: 'parking' });
    } else if (action === 'exit' && card.status === 'parking') {
        await card.update({ status: 'exited' });
    } else {
        mqttEventEmitter.emit('mqttMessage', { embed_id, card_number,vehicle_number:card.vehicle_number, action, message:  `Invalid ${logAction} status`  });
        return client.publish(`${topic}/response/${embed_id}`, JSON.stringify({ status: 'invalid', message: `Invalid ${logAction} status` }));
    }

    await TrafficLog.create({ card_id: card.card_id, device_id: device.device_id, action: logAction, time: new Date() });
    client.publish(`${topic}/response/${embed_id}`, JSON.stringify({ status: 'valid', message: `${logAction} logged` }));
    mqttEventEmitter.emit('mqttMessage', { embed_id, card_number,vehicle_number:card.vehicle_number, action, message: `${logAction} logged` });

}

module.exports = { barrierHandler };