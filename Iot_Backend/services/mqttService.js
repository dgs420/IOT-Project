const mqtt = require("mqtt");
const { handleDeviceStatus } = require("./handler/deviceStatusHandler");

const { barrierHandler, cashConfirm } = require("./handler/barrierHandler");
const { connectMqtt, getClient } = require("./mqttClient"); // For emitting MQTT events
// let client;

function startMqttService() {
  const client = connectMqtt();

  client.on("message", async (rawTopic, rawMessage) => {
    const topic = rawTopic.toString();
    const messageStr = rawMessage.toString();
    if (!messageStr || messageStr.trim() === "") {
      console.warn(`[MQTT] Empty message received on topic ${topic}`);
      return;
    }

    let message;
    try {
      message = JSON.parse(messageStr);
    } catch (err) {
      console.error(
        `[MQTT] Failed to parse JSON from topic ${topic}:`,
        messageStr
      );
      return;
    }

    console.log(`Received MQTT message on topic ${topic}:`, message);
    try {
      const topicParts = topic.split("/");
      const embedId = topicParts[1];

      switch (topicParts[0]) {
        case "device": {
          if (topicParts[2] === "status") {
            await handleDeviceStatus(client, embedId, message);
          }
          break;
        }

        case "barrier": {
          switch (topicParts[1]) {
            case "enter":
            case "exit":
              await barrierHandler(client, topic, message);
              break;

            case "exit-cash":
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
