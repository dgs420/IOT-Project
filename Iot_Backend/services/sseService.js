const clients = new Map(); // userId -> { res, keepAliveInterval }

function addClient(userId, res) {
  console.log(`Client ${userId} connected. Total: ${clients.size + 1}`);

  // Write initial comment to open SSE
  res.write(': connected\n\n');

  // Start keep-alive ping every 30 seconds
  const keepAliveInterval = setInterval(() => {
    res.write(': keep-alive\n\n');
  }, 30000);

  clients.set(userId, { res, keepAliveInterval });
}

function removeClient(userId) {
  const client = clients.get(userId);
  if (client) {
    clearInterval(client.keepAliveInterval);
    clients.delete(userId);
    console.log(`Client ${userId} disconnected. Total: ${clients.size}`);
  }
}

function sendToUser(userId, data) {
  const client = clients.get(userId);
  if (client) {
    console.log(`Sending data to client ${userId}: ${JSON.stringify(data)}`);
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

module.exports = { addClient, removeClient, sendToUser };
