const mqtt = require('mqtt');
const RfidCard = require('../models/rfidCardModel');
const TrafficLog = require('../models/trafficLogModel');
const Device = require('../models/deviceModel');
const {handleDeviceStatus} = require("./handler/deviceStatusHandler");

const {barrierHandler,cashConfirm,barrierHandler2} = require("./handler/barrierHandler");
const {connectMqtt} = require("./mqttClient"); // For emitting MQTT events
// let client;

function startMqttService() {
  const client = connectMqtt();

  client.on('message', async (rawTopic, rawMessage) => {
    const topic = rawTopic.toString();
    const message = JSON.parse(rawMessage.toString());
    console.log(`Received MQTT message on topic ${topic}:`, message);
    try {
      const topicParts = topic.split('/');
      const embedId = topicParts[1];

      switch (topicParts[0]) {
        case 'device': {
          if (topicParts[2] === 'status') {
            await handleDeviceStatus(client, embedId, message);
          }
          break;
        }

        case 'barrier': {
          switch (topicParts[1]) {
            case 'enter':
            case 'exit':
              await barrierHandler2(client, topic, message);
              break;

            case 'exit-cash':
              await cashConfirm(client, message);
              break;
          }
          break;
        }
      }

    } catch (error) {
      console.error(`Error processing MQTT message on topic ${topic}:`, error);
    }
  });
}

module.exports = { startMqttService };
