const clients = new Map(); // userId -> { res, keepAliveInterval }

function addClient(userId, res, channel = "default") {
  const key = `${userId}:${channel}`;
  console.log(`Client ${key} connected. Total: ${clients.size + 1}`);

  res.write(': connected\n\n');

  const keepAliveInterval = setInterval(() => {
    res.write(': keep-alive\n\n');
  }, 30000);

  clients.set(key, { res, keepAliveInterval });
}

function removeClient(userId, channel = "default") {
  const key = `${userId}:${channel}`;
  const client = clients.get(key);
  if (client) {
    clearInterval(client.keepAliveInterval);
    clients.delete(key);
    console.log(`Client ${key} disconnected. Total: ${clients.size}`);
  }
}

function sendToUser(userId, data, channel = "default") {
  const key = `${userId}:${channel}`;
  const client = clients.get(key);
  if (client) {
    console.log(`Sending data to ${key}: ${JSON.stringify(data)}`);
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

function sendToChannel(channel, data) {
  for (const [key, client] of clients.entries()) {
    if (key.endsWith(`:${channel}`)) {
      console.log(`Sending to ${key}`);
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }
}


module.exports = { addClient, removeClient, sendToUser, sendToChannel };

