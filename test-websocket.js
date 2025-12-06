const WebSocketService = require('./websocket-service');

// Create a new service instance
const wsService = new WebSocketService();

const id = 1; // user.id

// Connect and test
wsService.connect()
  .then(() => {
    // Join a room
    wsService.joinRoom(id);
    
    // Keep the connection open for testing
    setTimeout(() => {
      console.log('\nWebSocket gateway is running and responding!');
      wsService.disconnect();
      process.exit(0);
    }, 30000);
  })
  .catch((error) => {
    console.error('Failed to connect:', error);
    process.exit(1);
  });
