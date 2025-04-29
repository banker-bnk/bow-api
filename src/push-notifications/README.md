# Push Notifications Module

Este módulo proporciona funcionalidad para enviar notificaciones push a dispositivos móviles usando Expo Push Notifications.

## Endpoints

### POST `/send-push-notification`

Envía una notificación push a uno o más dispositivos.

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

### POST `/register-device`

Registra un dispositivo para recibir notificaciones push.

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
  "deviceId": "550e8400-e29b-41d4-a716-446655440000" // UUID v4
}
```

## Uso en la aplicación cliente (React Native con Expo)

Para recibir notificaciones en tu aplicación React Native, necesitas registrar el dispositivo para recibir notificaciones push y luego enviar el token de Expo al backend.

### Ejemplo de código en React Native

```javascript
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Registrar el dispositivo para notificaciones push
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

// Enviar el token al backend
async function sendTokenToBackend(token) {
  try {
    const apiUrl = 'http://your-api.com/register-device';
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        userId: 'USER_ID', // ID del usuario autenticado
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