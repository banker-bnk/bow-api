# Push Notifications Module

This module provides functionality to send push notifications to mobile devices using Expo Push Notifications.

## Endpoints

### POST `/send-push-notification`

Sends a push notification to one or more devices.

#### Request Body

```json
{
  "title": "Notification title",
  "body": "Notification content",
  "tokens": ["ExponentPushToken[xxxxx]", "..."],
  "subtitle": "Subtitle (optional)",
  "sound": "default (optional)",
  "data": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

#### Response

```json
{
  "success": true,
  "message": "Notification sent",
  "sent": 1,
  "failed": 0,
  "result": {
    "success": ["ExponentPushToken[xxxxx]"],
    "failure": []
  }
}
```

### POST `/push-notifications/register-device`

Registers a device to receive push notifications.

#### Request Body

```json
{
  "token": "ExponentPushToken[xxxxx]",
  "userId": "user123", // Optional: Identifier for the user
  "deviceInfo": {
    "platform": "ios",
    "model": "iPhone 12",
    "osVersion": "15.0"
  }
}
```

#### Response

```json
{
  "success": true,
  "message": "Device registered successfully",
  "deviceId": "device_1650123456_789"
}
```

## Usage in the client application (React Native with Expo)

To receive notifications in your React Native application, you need to register the device to receive push notifications and then send the Expo token to the backend.

### Example code in React Native

```javascript
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Register the device for push notifications
async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get permission to send notifications!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('You must use a physical device to receive notifications');
  }

  return token;
}

// Send the token to the backend
async function sendTokenToBackend(token) {
  try {
    const apiUrl = 'https://your-api.com/push-notifications/register-device';
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        userId: 'USER_ID', // ID of the authenticated user
        deviceInfo: {
          platform: Platform.OS,
          model: Device.modelName,
          osVersion: Platform.Version.toString()
        }
      }),
    });
  } catch (error) {
    console.error('Error sending token to backend:', error);
  }
}
``` 