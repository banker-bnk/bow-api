const WebSocketService = require('./src/helpers/websocket-service');

// Parse command line arguments
function parseUserId() {
  const args = process.argv.slice(2);
  
  // Get userId from command line or use default
  const userIdArg = args.find(arg => !arg.startsWith('-'));
  const userId = userIdArg ? parseInt(userIdArg, 10) : 1;
  
  // Validate userId
  if (isNaN(userId) || userId < 1) {
    console.error('❌ Error: userId must be a positive number');
    console.error('Usage: node test-websocket.js [userId]');
    process.exit(1);
  }
  
  return userId;
}

// Get user ID from command line
const id = parseUserId();

console.log(`🚀 Starting WebSocket test for user ID: ${id}`);
console.log('');

// Create a new service instance
const wsService = new WebSocketService();

// Connect and test
wsService.connect()
  .then(() => {
    // Join a room
    wsService.joinRoom(id);
    
    // Keep the connection open for testing
    setTimeout(() => {
      console.log('\n✅ WebSocket gateway is running and responding!');
      wsService.disconnect();
      process.exit(0);
    }, 300000);
  })
  .catch((error) => {
    console.error('❌ Failed to connect:', error);
    process.exit(1);
  });
