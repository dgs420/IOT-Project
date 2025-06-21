const mqtt = require("mqtt");
const { handleDeviceStatus } = require("./handler/deviceStatusHandler");

const { handleCardScan, cashConfirm } = require("./handler/barrierHandler");
const { connectMqtt, getClient } = require("../config/mqttClient"); // For emitting MQTT events
// let client;

function handleMqttMessage() {
  const client = getClient();

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
            await handleDeviceStatus(embedId, message);
          }
          break;
        }

        case "barrier": {
          switch (topicParts[2]) {
            case "enter":
            case "exit":
              await handleCardScan(topicParts[2], message);
              console.log("topic:", topic);
              break;

            case "exit-cash":
              await cashConfirm(message);
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

module.exports = { handleMqttMessage };
