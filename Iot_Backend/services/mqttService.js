const mqtt = require('mqtt');
const RfidCard = require('../models/rfidCardModel');
const TrafficLog = require('../models/trafficLogModel');
const Device = require('../models/deviceModel');
let client;

const connectMqtt = () => {
  if (client) return client;
  const MQTT_CREDENTIALS = {
    port: process.env.MQTT_PORT,
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD,
    protocol:'mqtts'
  };
  client = mqtt.connect(process.env.BROKER_URL,MQTT_CREDENTIALS);

  // Subscribe to topics
  client.on('connect', () => {
    client.subscribe('barrier/enter', (err) => {
      if (!err) console.log('Subscribed to barrier/enter');
    });

    client.subscribe('barrier/exit', (err) => {
      if (!err) console.log('Subscribed to barrier/exit');
    });

    client.subscribe('device/+/status', (err) => {
      if (!err) console.log('Subscribed to device/+/status');
    });
  });

  const sendDeviceCommand = ( embed_id, command) => {
    const topic = `device/${embed_id}/command`;
    const payload = JSON.stringify({ command });

    console.log(`[COMMAND] Sending command to device ${embed_id}:`, payload);
    client.publish(topic, payload, (err) => {
      if (err) {
        console.error(`[COMMAND] Failed to send command to device ${embed_id}:`, err.message);
      } else {
        console.info(`[COMMAND] Command sent to device ${embed_id}`);
      }
    });
  };

  // Unified message handler
  client.on('message', async (topic, message) => {
    try {
      const rawMessage = message.toString();
      console.log(`Received message on topic ${topic}: ${rawMessage}`);

      const topicParts = topic.split('/');
      const data = JSON.parse(rawMessage);

      // Handle "device status" topics
      if (topicParts[0] === 'device' && topicParts[2] === 'status') {
        const embed_id = topicParts[1];
        const { status } = data;

        console.log(`Processing device status update for embed_id: ${embed_id}, status: ${status}`);

        const device = await Device.findOne({ where: { embed_id } });
        if (!device) {
          console.warn(`Device with embed_id ${embed_id} not found.`);
          return;
        }

        const now = new Date();
        if (status === 'offline' && device.status === 'online') {
          await device.update({
            status: 'offline',
            last_seen: now,
          });
          console.log(`Device ${embed_id} updated to status: offline at ${now}`);
        } else if (status === 'online') {
          await device.update({
            status: 'online',
            last_seen: now,
          });
          console.log(`Device ${embed_id} updated to status: online at ${now}`);
        } else {
          console.log(`No status change for device ${embed_id}.`);
        }
        return;
      }

      // Handle "barrier" topics
      if (topic === 'barrier/enter' || topic === 'barrier/exit') {
        const { card_number, embed_id, action } = data;

        if (!embed_id || !card_number || !action) {
          console.error('Invalid barrier message format:', data);
          const responseTopic = `${topic}/response/${embed_id}`;
          return client.publish(responseTopic, JSON.stringify({ status: 'invalid', message: 'Missing required fields' }));
        }

        // Find the device and card
        const device = await Device.findOne({ where: { embed_id } });
        const card = await RfidCard.findOne({ where: { card_number } });

        const responseTopic = `${topic}/response/${embed_id}`;
        if (!device) {
          return client.publish(responseTopic, JSON.stringify({ status: 'invalid', message: 'Device not found' }));
        }

        if (!card) {
          return client.publish(responseTopic, JSON.stringify({ status: 'invalid', message: 'Card not found' }));
        }

        // Handle card action logic
        if (action === 'enter' && card.status === 'parking') {
          return client.publish(responseTopic, JSON.stringify({ status: 'invalid', message: 'Card is already parked' }));
        }

        if (action === 'exit' && card.status === 'exited') {
          return client.publish(responseTopic, JSON.stringify({ status: 'invalid', message: 'Card is already exited' }));
        }

        if (action === 'exit' && card.status === 'parking') {
          await card.update({ status: 'exited' });
          await TrafficLog.create({
            card_id: card.card_id,
            device_id: device.device_id,
            action: 'exit',
            time: new Date(),
          });
          return client.publish(responseTopic, JSON.stringify({ status: 'valid', message: 'Exit logged' }));
        }

        if (action === 'enter' && card.status === 'exited') {
          await card.update({ status: 'parking' });
          await TrafficLog.create({
            card_id: card.card_id,
            device_id: device.device_id,
            action: 'enter',
            time: new Date(),
          });
          return client.publish(responseTopic, JSON.stringify({ status: 'valid', message: 'Entry logged' }));
        }
      }

      console.warn(`Unhandled topic: ${topic}`);
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  });

  return client;
};
module.exports = connectMqtt;

