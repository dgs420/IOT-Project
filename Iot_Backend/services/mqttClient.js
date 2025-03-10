// mqttClient.js
const mqtt = require('mqtt');

let client = null;

function connectMqtt() {
    if (client) return client;  // Reuse existing client.

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
            if (err) {
                console.error('Failed to subscribe:', err.message);
            } else {
                console.log('Subscribed to topics: barrier/enter, barrier/exit, device/+/status');
            }
        });
    });

    client.on('error', (err) => {
        console.error('MQTT client error:', err.message);
    });

    return client;
}

function getClient() {
    if (!client) {
        throw new Error('MQTT client not initialized. Did you forget to call connectMqtt()?');
    }
    return client;
}

module.exports = { connectMqtt, getClient };
