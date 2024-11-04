const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com:1883'); // Connect to your MQTT broker

// Simulate a device sending data to the broker
function sendCardData(card_number, action) {
  const topic = action === 'enter' ? 'barrier/enter' : 'barrier/exit';
  const message = JSON.stringify({ card_number, action });

  // Publish card data to the corresponding topic
  client.publish(topic, message, () => {
    console.log(`Published to ${topic}:`, message);
  });
}

// Simulate device subscribing to the response topic (for enter or exit gates)
function listenForResponse(action) {
  const topic = action === 'enter' ? 'barrier/enter/response' : 'barrier/exit/response';

  // Subscribe to response topic to receive validation result from the server
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Subscribed to ${topic}`);
    }
  });

  // Handle received messages from the server
  client.on('message', (topic, message) => {
    const response = JSON.parse(message.toString());
    console.log(`Received from ${topic}:`, response);

    if (response.status === 'valid') {
      console.log(`Gate ${action}: Opening gate...`);
    } else {
      console.log(`Gate ${action}: Error - ${response.message}`);
    }
  });
}

// // Example usage
// sendCardData('12345', 'enter'); // Simulate scanning at the entry gate
// listenForResponse('enter'); // Simulate listening for entry gate response

// sendCardData('RFID0001', 'enter'); // Simulate scanning at the exit gate
// listenForResponse('enter'); // Simulate listening for exit gate response

// sendCardData('RFID0003', 'exit'); // Simulate scanning at the exit gate
// listenForResponse('exit'); // Simulate listening for exit gate response
// sendCardData('RFID0003', 'exit'); // Simulate scanning at the exit gate
// listenForResponse('exit');
sendCardData('F39C6A1D', 'enter'); // Simulate scanning at the exit gate
listenForResponse('enter'); // Simulate listening for exit gate response
// listenForResponse('enter'); 