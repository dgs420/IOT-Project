const mqtt = require('mqtt');
const RfidCard = require('../models/rfidCardModel');
const TrafficLog = require('../models/trafficLogModel');

const connectMqtt = () => {
  const client = mqtt.connect('mqtt://broker.hivemq.com:1883');

  // Subscribe to "enter" and "exit" topics
  client.on('connect', () => {
    client.subscribe('barrier/enter', (err) => {
      if (!err) console.log('Subscribed to barrier/enter');
    });

    client.subscribe('barrier/exit', (err) => {
      if (!err) console.log('Subscribed to barrier/exit');
    });
  });

  // Handle card validation logic
  client.on('message', async (topic, message) => {
    const data = JSON.parse(message.toString());
    const { card_number, action } = data;

    const rawMessage = message.toString();
    console.log(`Received message on topic ${topic}:`, rawMessage);

    // Check if the message is empty
    if (!rawMessage) {
      console.error('Received an empty message');
      return;
    }
    // Use the RfidCard model to find the card by its number
    const card = await RfidCard.findOne({ where: { card_number } });
    let responseTopic;

    if (action === 'enter') {
      responseTopic = 'barrier/enter/response';
    } else {
      responseTopic = 'barrier/exit/response';
    }

    if (!card) {
      return client.publish(responseTopic, JSON.stringify({ status: 'invalid', message: 'Card not found' }));
    }

    if (card.status === 'parking' && action === 'enter') {
      return client.publish(responseTopic, JSON.stringify({ status: 'invalid', message: 'Card is already parked' }));
    }

    if (card.status === 'parking' && action === 'exit') {
      await card.update({ status: 'exited' });
      await TrafficLog.create({ card_id: card.card_id, action: 'exit', time: new Date() });
      return client.publish(responseTopic, JSON.stringify({ status: 'valid', message: 'Exit logged' }));
    }

    if (card.status === 'exited' && action === 'enter') {
      await card.update({ status: 'parking' });
      await TrafficLog.create({ card_id: card.card_id, action: 'enter', time: new Date() });
      return client.publish(responseTopic, JSON.stringify({ status: 'valid', message: 'Entry logged' }));
    }

    if (card.status === 'exited' && action === 'exit') {
      return client.publish(responseTopic, JSON.stringify({ status: 'invalid', message: 'Card is already exited' }));
    }
  });
};

module.exports = connectMqtt;
