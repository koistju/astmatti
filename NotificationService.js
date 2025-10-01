import PushNotification from 'react-native-push-notification';
import { AsyncStorage } from 'react-native';
import moment from 'moment';  
// 23.8.2019 AA-99 Package not needed anymore
//import { systemWeights } from 'react-native-typography';
import StorageHelper from './StorageHelpers';

// 20.5.2019 Refactored code so that all notifications are handled here.
export default class NotificationService {

    constructor(onRegister, onNotification, navigation) {
        
        this.onNotification = this.onNotification.bind(this);
        this.onRegister = this.onRegister.bind(this);

        this.configure(onRegister, onNotification);
        this.lastId = 0;
        this.navigation = navigation;
    }

    onNotification(notification)
    {
        console.log("Notification received");
        
        if ( this.navigation != null )
        {
            console.log("Navigate to ... Notofications");
            this.navigation.navigate('Notifications');
        }
    }

    onRegister(token) {
        console.log("onRegister:", token);
    }

    async createSchedule(forceNewSchedule)
    {
      //let scheduled = await AsyncStorage.getItem('scheduled');
      let scheduled = await StorageHelper.getScheduled();
      if ( scheduled != null && !forceNewSchedule ) return;
  
      this.cancelAllLocalNotifications();

      /*
      let fullcode = await AsyncStorage.getItem('fullPinCode');
      let data = fullcode.substring(0,3) + fullcode.substring(4);
      let minutes= parseInt(data);
      let reception_time = moment.utc("2019-01-01 00:00").add(minutes, 'm');
  
      // TODO:
      if ( fullcode.startsWith("222222222") )
      {
        let m = parseInt(fullcode.substring(10));
        reception_time = moment.utc(new Date()).add(m, 'm');  
      }
      // TODO:
      await AsyncStorage.setItem('reception_time', reception_time);
      */
      let configuration = await StorageHelper.getCurrentConfiguration();
      let reception_time = moment.utc(new Date(configuration.appointment));

      console.log("Now = " + new Date().toString() + ", reception_time:" + reception_time.toString());
  
      let notifications = [];
      // Medicine break time will be 7 days before reception time 
      let medicine_break_time = moment(reception_time).subtract(7, 'days');
      //let text = moment(medicine_break_time).format("DD.MM.YYYY HH:mm");
      let text = moment(moment(medicine_break_time).toDate()).format("DD.MM.YYYY HH:mm");
  
      // First message 9 days before reception time 
      let message_time = moment(reception_time).subtract(9, 'days');
      let message_text = "Ennen vastaanottokäyntiä on erittäin tärkeää pitää tauko avaavan lääkkeen käytöstä. Taukosi alkaa " + text;
      let message_title = "Lääketauko";
      // AA-100 20.5.2019
      notifications.push({"id":1, "title" : message_title, "text": message_text, "time" : message_time.toDate(), "group" : "MEDICINE_BREAK", status : 0});
      //this.notificationService.sendLocalNotification(1, "Lääketauko", "Ennen vastaanottokäyntiä on erittäin tärkeää pitää tauko avaavan lääkkeen käytöstä. Taukosi alkaa " + text, message_time.toDate(), "MEDICINE_BREAK");
      this.sendLocalNotification(1, message_title, message_text, message_time.toDate(), "MEDICINE_BREAK");
  
      // Second message 8 days before reception time 
      message_time = moment(reception_time).subtract(8, 'days');
      message_text = "Ennen vastaanottokäyntiä on erittäin tärkeää pitää tauko avaavan lääkkeen käytöstä. Taukosi alkaa " + text;
      message_title = "Lääketauko";
      // AA-100 20.5.2019
      notifications.push({"id":2, "title" : message_title, "text": message_text, "time" : message_time.toDate(), "group" : "MEDICINE_BREAK", status : 0});
      //this.notificationService.sendLocalNotification(2, "Lääketauko", "Ennen vastaanottokäyntiä on erittäin tärkeää pitää tauko avaavan lääkkeen käytöstä. Taukosi alkaa " + text, message_time.toDate(), "MEDICINE_BREAK");
      this.sendLocalNotification(2, message_title, message_text, message_time.toDate(), "MEDICINE_BREAK");
  
      // Medicine break time starts
      message_text = "Lääketaukosi alkaa tänään. Älä ota avaavaa lääkettä ennen vastaanottokäyntiä";
      message_title = "Lääketauko tänään";
      // AA-100 20.5.2019
      notifications.push({"id":3, "title" : message_title, "text": message_text, "time" : medicine_break_time.toDate(), "group" : "MEDICINE_BREAK", status : 0});
      //this.notificationService.sendLocalNotification(3, "Lääketauko tänään", "Lääketaukosi alkaa tänään. Älä ota avaavaa lääkettä ennen vastaanottokäyntiä", medicine_break_time.toDate(), "MEDICINE_BREAK");
      this.sendLocalNotification(3, message_title, message_text, medicine_break_time.toDate(), "MEDICINE_BREAK");
  
      // Reminder 2 days before reception time
      let name = "";
      text = moment(moment(reception_time).toDate()).format("DD.MM.YYYY HH:mm");
      let new_text = "Hei " + name + ". Sinulle on varattu aika astmatutkimukseen " + text + " Oys lastenpolille. Vastaan ottokäynnillä tehdään juoksurasituskoe, puethan sopivat vaatteet ja kengät.";
      message_time = moment(reception_time).subtract(2, 'days');
      message_title = "Astmalääkärin vastaanotto";
      // AA-100 20.5.2019
      notifications.push({"id":4, "title" : message_title, "text": new_text, "time" : message_time.toDate(), "group" : "RECEPTION_TIME", status : 0});
      this.sendLocalNotification(4, message_title, new_text, message_time.toDate(), "RECEPTION_TIME");
  
      new_text = "ASTMATUTKIMUS ja JUOKSURASITUSKOE tänään. Juoksuun sopiva vaatetus ja kengät mukaan.";
      message_title = "Astmalääkärin vastaanotto";
      // AA-100 20.5.2019
      notifications.push({"id":5, "title" : message_title, "text": new_text, "time" : reception_time.toDate(), "group" : "RECEPTION_TIME", status : 0});
      this.sendLocalNotification(5, message_title, new_text, reception_time.toDate(), "RECEPTION_TIME");
  
      //await AsyncStorage.setItem('scheduled', 'true');
      await StorageHelper.storeScheduled(true);
      // AA-100 20.5.2019
      //await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
      await StorageHelper.storeNotifications(notifications);
    }
  
    sendLocalNotification(id, title, message, date, group)
    {
        this.lastId++;
        console.log("Schedule notification at " + date);
  
        PushNotification.localNotificationSchedule({
            /* Android Only Properties */
            id: '' + id, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            ticker: "My Notification Ticker", // (optional)
            autoCancel: true, // (optional) default: true
            largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
            smallIcon: "ic_launcher", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            bigText: message, // (optional) default: "message" prop
            subText: "Viesti Astmatilta", // (optional) default: none
            color: "#29cc96", // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            //tag: 'some_tag', // (optional) add tag to message. 
            //NOTE ! If you define tag, you must also add tag to a function call which cancels the notification (but there is no place for tag at the moment)
            group: group, // (optional) add group to message
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            priority: "high", // (optional) set notification priority, default: high
            visibility: "private", // (optional) set notification visibility, default: private
            importance: "high", // (optional) set notification importance, default: high
        
            /* iOS only properties */
            alertAction: "view", // (optional) default: view
            category: null, // (optional) default: null
            //userInfo: null, // (optional) default: null (object containing additional notification data)
            userInfo: { id: JSON.stringify(id) },
        
            /* iOS and Android properties */
            title: title, // (optional)
            message: message, // (required)
            playSound: false, // (optional) default: true
            soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            number: '1', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
            //repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
            actions: '["Avaa"]',  // (Android only) See the doc for notification actions to know more
  
            date : date
        });
    }

    cancelLocalNotification(id) {
        PushNotification.cancelLocalNotifications({id: id});
      }
      
    cancelAllLocalNotifications() {
        PushNotification.cancelAllLocalNotifications();
    }

    configure(onRegister, onNotification, gcm="")
    {
        console.log("configureNotifications ...");

        PushNotification.configure({

            // (optional) Called when Token is generated (iOS and Android)
            onRegister: this.onRegister,
        
            // (required) Called when a remote or local notification is opened or received
            onNotification: this.onNotification,
        
            // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID: gcm,
        
            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
        
            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,
        
            /**
              * (optional) default: true
              * - Specified if permissions (ios) and token (android and ios) will requested or not,
              * - if not, you must call PushNotificationsHandler.requestPermissions() later
              */
            requestPermissions: true,
        });
    }


}