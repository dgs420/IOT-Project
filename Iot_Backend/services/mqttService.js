const mqtt = require('mqtt');
const RfidCard = require('../models/rfidCardModel');
const TrafficLog = require('../models/trafficLogModel');
const Device = require('../models/deviceModel');

const connectMqtt = () => {
  const MQTT_CREDENTIALS = {
    port: 8883,
    username: 'username1',   // Optional: Username for your broker
    password: 'userPassword1',    // Optional: Password for your broker
    protocol:'mqtts'
  };
  const client = mqtt.connect(process.env.BROKER_URL,MQTT_CREDENTIALS);

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
        await device.update({
          status: status || 'offline',
          last_seen: now,
        });

        console.log(`Device ${embed_id} updated to status: ${status} at ${now}`);
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
};

module.exports = connectMqtt;
