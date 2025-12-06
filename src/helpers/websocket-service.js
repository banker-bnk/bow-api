const io = require('socket.io-client');

class WebSocketService {
  constructor(serverUrl = null) {
    this.serverUrl = serverUrl || process.env.SERVER_URL || 'https://mpm.ddns.net';
    this.socket = null;
    this.isConnected = false;
  }

  /**
   * Connect to the WebSocket server
   */
  connect() {
    return new Promise((resolve, reject) => {
      console.log(`Connecting to ${this.serverUrl}...`);

      this.socket = io(this.serverUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
      });

      this.socket.on('connect', () => {
        console.log('Successfully connected to WebSocket server!');
        console.log(`Socket ID: ${this.socket.id}`);
        this.isConnected = true;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error.message);
        console.log('Make sure the server is running and the gateway is properly initialized.');
        this.isConnected = false;
        reject(error);
      });

      this.socket.on('joinedRoom', (data) => {
        console.log('Successfully joined room:', data);
      });

      this.socket.on('newNotification', (notification) => {
        console.log('📬 Received notification:', notification);
      });

      this.socket.on('error', (error) => {
        console.error('Error:', error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
        this.isConnected = false;
      });
    });
  }

  /**
   * Join a user room
   * @param {number|string} userId - User ID to join room for
   */
  joinRoom(userId) {
    if (!this.isConnected || !this.socket) {
      throw new Error('Socket is not connected. Call connect() first.');
    }
    this.socket.emit('joinRoom', { userId });
  }

  /**
   * Leave a user room
   * @param {number} userId - User ID to leave room for
   */
  leaveRoom(userId) {
    if (!this.isConnected || !this.socket) {
      throw new Error('Socket is not connected. Call connect() first.');
    }
    this.socket.emit('leaveRoom', userId);
  }

  /**
   * Register an event handler
   * @param {string} eventName - Event name
   * @param {Function} handler - Event handler function
   */
  on(eventName, handler) {
    if (!this.socket) {
      throw new Error('Socket is not initialized. Call connect() first.');
    }
    this.socket.on(eventName, handler);
  }

  /**
   * Emit a custom event
   * @param {string} eventName - Event name
   * @param {any} data - Data to send
   */
  emit(eventName, data) {
    if (!this.isConnected || !this.socket) {
      throw new Error('Socket is not connected. Call connect() first.');
    }
    this.socket.emit(eventName, data);
  }

  /**
   * Disconnect from the server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
      console.log('Disconnected from WebSocket server');
    }
  }

  /**
   * Check if currently connected
   * @returns {boolean}
   */
  getConnected() {
    return this.isConnected;
  }
}

module.exports = WebSocketService;
