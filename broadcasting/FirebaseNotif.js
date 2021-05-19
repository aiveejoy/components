import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { Helper } from 'common';
import { fcmService } from 'services/broadcasting/FCMService';
import { localNotificationService } from 'services/broadcasting/LocalNotificationService';
import NetInfo from "@react-native-community/netinfo";

class FirebaseNotif{
  firebaseNotification(){
    fcmService.registerAppWithFCM()
    fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
    localNotificationService.configure(this.onOpenNotification, Helper.APP_NAME)
    fcmService.subscribeTopic(user.id)
    // fcmService.subscribeTopic('Notifications-' + user.id)
    // fcmService.subscribeTopic('Requests')
    // fcmService.subscribeTopic('Payments-' + user.id)
    // fcmService.subscribeTopic('Comments-' + user.id)
    this.retrieveNotification()
    return () => {
      fcmService.unRegister()
      localNotificationService.unRegister()
    }
  }

  
}

export const firbaseNotif = new FirebaseNotif()