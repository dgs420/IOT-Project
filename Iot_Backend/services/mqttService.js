const mqtt = require('mqtt');
const RfidCard = require('../models/rfidCardModel');
const TrafficLog = require('../models/trafficLogModel');
const Device = require('../models/deviceModel');
const EventEmitter = require('events');

const mqttEventEmitter = new EventEmitter(); // For emitting MQTT events
let client;

const connectMqtt = () => {
  if (client) return client;

  const MQTT_CREDENTIALS = {
    port: process.env.MQTT_PORT,
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD,
    protocol: 'mqtts',
  };

  client = mqtt.connect(process.env.BROKER_URL, MQTT_CREDENTIALS);

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(['barrier/enter', 'barrier/exit', 'device/+/status'], (err) => {
      if (!err) {
        console.log('Subscribed to topics: barrier/enter, barrier/exit, device/+/status');
      } else {
        console.error('Failed to subscribe to topics:', err.message);
      }
    });
  });

  client.on('message', async (topic, message) => {
    try {
      const rawMessage = message.toString();
      console.log(`Received message on topic ${topic}:`, rawMessage);

      // mqttEventEmitter.emit('mqttMessage', { topic, message: rawMessage }); // Emit for real-time monitoring

      const topicParts = topic.split('/');
      const data = JSON.parse(rawMessage);

      if (topicParts[0] === 'device' && topicParts[2] === 'status') {
        const embed_id = topicParts[1];
        const { status } = data;

        const device = await Device.findOne({ where: { embed_id } });
        if (!device) return console.warn(`Device ${embed_id} not found.`);

        const now = new Date();
        if (status === 'offline' && device.status === 'online') {
          await device.update({ status: 'offline', last_seen: now });
        } else if (status === 'online') {
          await device.update({ status: 'online', last_seen: now });
        }

        mqttEventEmitter.emit('deviceStatus', { embed_id, message: status });
        return;
      }

      if (topic === 'barrier/enter' || topic === 'barrier/exit') {
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
          mqttEventEmitter.emit('mqttMessage', { embed_id, card_number, action, message: error });
          return client.publish(`${topic}/response/${embed_id}`, JSON.stringify({ status: 'invalid', message: error }));
        }

        const logAction = action === 'enter' ? 'enter' : 'exit';
        if (action === 'enter' && card.status === 'exited') {
          await card.update({ status: 'parking' });
        } else if (action === 'exit' && card.status === 'parking') {
          await card.update({ status: 'exited' });
        } else {
          mqttEventEmitter.emit('mqttMessage', { embed_id, card_number, action, message:  `Invalid ${logAction} status`  });
          return client.publish(`${topic}/response/${embed_id}`, JSON.stringify({ status: 'invalid', message: `Invalid ${logAction} status` }));
        }

        await TrafficLog.create({ card_id: card.card_id, device_id: device.device_id, action: logAction, time: new Date() });
        client.publish(`${topic}/response/${embed_id}`, JSON.stringify({ status: 'valid', message: `${logAction} logged` }));
        mqttEventEmitter.emit('mqttMessage', { embed_id, card_number, action, message: `${logAction} logged` });

      }
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  });

  client.on('error', (err) => {
    console.error('MQTT client error:', err.message);
  });

  return client;
};

module.exports = { connectMqtt, mqttEventEmitter };
