const mqtt = require('mqtt');
const RfidCard = require('../models/rfidCardModel');
const TrafficLog = require('../models/trafficLogModel');
const Device = require('../models/deviceModel');
const {handleDeviceStatus} = require("./handler/deviceStatusHandler");

const mqttEventEmitter = require('./eventEmitter');
const {barrierHandler} = require("./handler/barrierHandler");
const {connectMqtt} = require("./mqttClient"); // For emitting MQTT events
// let client;

function startMqttService() {
  const client = connectMqtt();

  client.on('message', async (topic, message) => {
    try {
      const rawMessage = message.toString();
      console.log(`Received message on topic ${topic}:`, rawMessage);

      const topicParts = topic.split('/');
      const data = JSON.parse(rawMessage);

      if (topicParts[0] === 'device' && topicParts[2] === 'status') {
        const embed_id = topicParts[1];
        await handleDeviceStatus(client, embed_id, data);
      } else if (topic === 'barrier/enter' || topic === 'barrier/exit') {
        await barrierHandler(client, topic, data);
      }

      // Optionally broadcast the raw message to any listeners (for real-time UI)
      // mqttEventEmitter.emit('mqttMessage', { topic, message: rawMessage });

    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  });
}

module.exports = { startMqttService };
