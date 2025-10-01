import React from 'react';
import { Platform, StyleSheet, View, AsyncStorage, Alert, ActivityIndicator, FlatList, 
  TouchableOpacity, TouchableHighlight, Image, ImageBackground, Modal } 
from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, withNavigation } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Container, Content, Text, Button, InputGroup, Input, Icon, Form, Item, Label, Grid, Col  } from 'native-base';
import { GiftedChat, InputToolbar, Actions, Bubble, SystemMessage, Time  } from 'react-native-gifted-chat';
import NavigationService from './NavigationService';
import 'moment/locale/nb'
import Dialog, { DialogTitle, DialogContent, DialogButton, SlideAnimation } from 'react-native-popup-dialog';
import I18n from './i18n';
import { getLanguages } from 'react-native-i18n';
import VideoPlayer from 'react-native-video-controls';
// 23.8.2019 AA-99 Package not needed anymore
//import { material } from 'react-native-typography'
import { List, ListItem, Header } from "react-native-elements";
import { UserForm } from './UserForm';
import { UserDialog } from './UserDialog';
import { PinCodeScreen } from './PinCodeScreen';
import NotificationService from './NotificationService';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
import StorageHelper from './StorageHelpers';
// AA-99 26.8.2019
import { WebView } from 'react-native-webview';


/*
  ChatScreen is responsible for showing the chat conversation. 
  Chat conversation flow is hard coded to the app and there are 3 different conversation based on user age.
  Conversation used will be loaded once user has entered correct pin code in PinCodeScreen.
  This is in construction at the moment ...
*/

export class ChatScreen extends React.Component {
  static navigationOptions = {
    title: I18n.t('chatbot_title'),
  };

  constructor(props) {
    super(props);
    this.renderFooter = this.renderFooter.bind(this);
    this.buttonPressed = this.buttonPressed.bind(this);
    this.dialogButtonPressed = this.dialogButtonPressed.bind(this);    
    this.getNextMessageId = this.getNextMessageId.bind(this);
    //this.incrementCount = this.incrementCount.bind(this);
    this.addChatMessage = this.addChatMessage.bind(this);
    this.addUserMessage = this.addUserMessage.bind(this);
    this.addChatVideoMessage = this.addChatVideoMessage.bind(this);
    this.renderMessageImage = this.renderMessageImage.bind(this);
    this.handleUserFormChange = this.handleUserFormChange.bind(this);
    // 21.1.2019  AA-68
    this.addChatMessagesToQueue = this.addChatMessagesToQueue.bind(this);
    // 18.2.2019  AA-68
    this.processVariablesInText = this.processVariablesInText.bind(this);
    // 18.4.2019 AA-89
    this.componentDidFocus = this.componentDidFocus.bind(this);
    //this.createSchedule = this.createSchedule.bind(this);
    this.handleNotification = this.handleNotification.bind(this);

    this.state = {
      messages: [],
      //currentid: 1,
      //tila: 0,
      currentState : null,
      chat_data: null,
      showDialog: false,
      firstname : '',
      height : null,
      weight : null,
      age : null,
      //inputFirstNameSuccess : true,
      //inputFirstNameError : false,
      videoUrl : '',
      displayVideo : false,
      displayWeb : false,
      webUrl : '',
      scrollPosition : 0, // FOR AA-47
      // 18.2.2019  AA-68
      showChildName : false,
      child_firstname : null,
      // 21.5.2019 AA-46
      isMounting : false
    }
  }

  static navigationOptions = () => {
    return {
      tabBarOnPress({ navigation, defaultHandler }) {

        // perform your logic here
        console.log("Chat tab activated");

        // this is mandatory to perform the actual switch
        // don't call this if you want to prevent focus
        defaultHandler();
      },
      
      // 23.8.2019 AA-99 tab bar icon logic is moved to here from createBottomTabNavigator
      tabBarIcon: ({tintColor}) =>
       <Image
            source={require('./assets/teppo_icons/drawable-hdpi/ic_astmatti.png')}
            resizeMode = {'contain'}
            style={{ height: 25, width: 25, tintColor : tintColor}}
      />  

    };
  };

  async loadConversationContentFromServer()
  {
    // AA-18
    // Read current language and read correct json file based on that
    try
    {
      /*
        var languages = await getLanguages(); 
        console.log(languages);
        let lang = 'fi';

        if ( languages.length > 0)
        {
          let default_lang = languages[0].split('-');
          lang = default_lang[0];
        }*/

        let c = await StorageHelper.getCurrentConfiguration();
        let lang = c.language_name;
        // AA-24 Select correct conversation based on pincode and language
        /*
        var pincode = await AsyncStorage.getItem('pinCodeUsed');
        var config = await AsyncStorage.getItem('configuration');
        var config_json = await JSON.parse(config);

        var c = config_json.find(t => t.pincode == pincode);
        */
        var filename = c.chat_file_name; 
        // AA-109 Changed url
        let org_short_name = c.org_short_name;
        var url_chat = 'https://s4h.fi/materials/' + org_short_name + "/" + lang.toLowerCase() + '/chat/' + filename;
        //var file_data = await fetch('https://s4h.fi/materials/' + org_short_name + "/" + lang.toLowerCase() + '/chat/' + filename);
        //var file_data = await fetch(url_chat);
        // Ony for internal testing
        var file_data = await fetch('http://10.0.2.2:8085/astmatti/chat_youngs.json');
        var coversation_data = await file_data.json(); 
        

        // AA-4 Chatbot receives its content (the configuration) from the configuration file. 
        // Configuration is probably in JSON-format.
        // Implemented as static files at the moment      
        //var coversation_data = require('./chat_children_no.json');

        // 18.2.2019
        var showChildName = c.options != null ? c.options.showChildName : false;

        this.setState({
          chat_data : coversation_data,
          // 18.2.2019
          showChildName : showChildName
        })

        //this.addChatMessage(0, null, null);
    }
    catch(error)
    {
        console.log("Error when reading configuration file, reason: " + error.message);
    }
  }

  onRegister(token) {
    console.log("onRegister:", token);
  }

  onNotificationReceived(notification) {
    console.log("On onNotificationReceived ...");
    
    console.log(notification);
    // Do not put anything to Chatbot, just show the notification "normally"
    //this.handleNotification({text: notification.bigText, id: notification.id, title: notification.title});
    //this.props.navigation.navigate('Chat', { data : {text: notification.bigText, id: notification.id, title: notification.title}});

    // 
    //PushNotification.setApplicationIconBadgeNumber(2);
  }

  handleNotification(notification)
  {
    console.log("On handleNotification ");
    //let notification = this.props.navigation.getParam('data', null);

    if (notification != null )
    {
      console.log("On handleNotification, notification: ", notification);

      // Add the message to all messages list loaded from server
      let data = this.state.chat_data;  
      let id = 3000 + notification.id; 
      let nextId = 0;
      if ( this.state.currentState != null ) nextId = this.state.currentState.Id;


      let current_state = {
        "Id": id,
        "Text": notification.title + "|" + notification.text,
        "Buttons": [
          {
            "Id": 3000 + notification.id,
            "Text": "Jatketaanko?",
            "NextId": nextId
          }
        ],
        "Action": null,
        "NextId": null,
        "Tag": null,
        "Url_extra": []
      };

      data.push(current_state);
      this.setState({chat_data : data});

      let message_id = this.getNextMessageId(3000 + '_n');
      let text = notification.title + "\n\n" + notification.text;
      let msg = {"currentState" : current_state, "id" : message_id, text: text};
      let msg_array=[];
      msg_array.push(msg);

      this.addChatMessagesToQueue(msg_array, null);
    }

    this.props.navigation.navigate('Chat', null);
  }


  componentDidFocus()
  {
    console.log("On componentDidFocus ");
  }

  componentWillBlur()
  {
    console.log("On componentWillBlur ");
  }

  // 21.5.2019 Event changed to earlier one ...
  //async componentDidMount() {
  async componentWillMount() {

    // 21.5.2019 AA-46
    this.setState({isMounting : true});

    // For navigation
    this.subs = [
      this.props.navigation.addListener('didFocus', this.componentDidFocus),
      this.props.navigation.addListener('willBlur', this.componentWillBlur),
    ];
      

      //this.saveSchedule();

      // TODO: Only for testing
      //let keys = ['chat_data', 'messages', 'current_state'];
      //await AsyncStorage.multiRemove(keys);

      // 18.2.2019
      /*
      var config_options = await AsyncStorage.getItem('configuration');
      var pincode = await AsyncStorage.getItem('pinCodeUsed');
      var config_json = JSON.parse(config_options);
      var c = config_json.find(t => t.pincode == pincode);
      */
      let c = await StorageHelper.getCurrentConfiguration();
      var showChildName = c.options != null ? c.options.showChildName : false;
      console.log("Chat -> showChildName=" + showChildName);

      // AA-46 Load saved conversation if it exists
      // Load first all conversation data
      //var coversation_data = await AsyncStorage.getItem('chat_data');
      var coversation_data = await StorageHelper.getChatData();
      if ( coversation_data != null )
      {
        this.setState({
          chat_data : coversation_data,
          // 18.2.2019
          showChildName : showChildName
        })
      }
      else
      {
        await this.loadConversationContentFromServer();
      }

      // And then current state on conversation
      //var messages = await AsyncStorage.getItem('messages');
      var messages = await StorageHelper.getChatMessages();
      //var current_state = await AsyncStorage.getItem('currentState');
      var current_state = await StorageHelper.getChatCurrentState();

      console.log("componentDidMount: current_state = " + current_state);
      console.log(" ------ MESSAGES -----------------");
      console.log("componentDidMount: messages = " + messages);
      console.log(" ------ MESSAGES -----------------");
      
    // 21.1.2019  AA-68 
      // Added && current_state != null ...
      if ( messages != null && current_state != null && current_state != "null" && messages != "[]")
      {        
        console.log("LOAD previous messages ...");
        console.log("Load: currentState = " + current_state);
        console.log(" ------ MESSAGES -----------------");
             
        this.setState(previousState => ({
          messages: GiftedChat.prepend(previousState.messages, messages),
          currentState : current_state
        }))
      }
      else{
        // 21.1.2019  AA-68
        //this.addChatMessage(0, null, null);
        let msg_array = this.addChatMessage(0, null, null);
        // First message will appear without typing-animation
        for (let t=0; t < msg_array.length; t++)
        {    
          this.setState(previousState => ({
            currentState: msg_array[t].currentState,
            messages: GiftedChat.append(previousState.messages, 
            {
                _id: msg_array[t].id,
                text: msg_array[t].text,
                createdAt: new Date(),
                user: {
                  _id: 2,
                }
              })
            }));            
        } 
    
        //this.addChatMessagesToQueue(msg_array, null);
      }

      this.notificationService = new NotificationService(this.onRegister.bind(this), this.onNotificationReceived.bind(this), this.props.navigation);
      this.notificationService.createSchedule(false);
      //this.createSchedule();

      // 21.5.2019  AA-46
      this.setState({isMounting : false});
  }

  componentWillUnmount()
  {
    console.log("Chat -> componentWillUnmount");
    this.saveConversation();
    console.log("Chat -> componentWillUnmount DONE!");
  }

  async saveConversation()
  {
    // 21.5.2019  AA-46
    if ( this.state.isMounting ) return;

    // AA-46 Save conversation for later use
    /*
    console.log("saveConversation: currentState = " + JSON.stringify(this.state.currentState));
    console.log(" ------ MESSAGES -----------------");
    console.log("saveConversation: messages = " + JSON.stringify(this.state.messages));
    console.log(" ------ MESSAGES -----------------");
    */
   console.log("saveConversation ... currentState.id=" + (this.state.currentState != null ? this.state.currentState.Id : ""));
   //console.log(" ------ MESSAGES -----------------");

    //await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    await StorageHelper.storeChatMessages(this.state.messages);
    //await AsyncStorage.setItem('chat_data', JSON.stringify(this.state.chat_data));
    await StorageHelper.storeChatData(this.state.chat_data);
    // 21.5.2019 Added if statement
    //if ( this.state.currentState != null )
      //await AsyncStorage.setItem('currentState', JSON.stringify(this.state.currentState));
      await StorageHelper.storeChatCurrentState(this.state.currentState);
  }

  componentDidUpdate(prevProps) 
  {
    // 21.5.2019
    this.saveConversation();

    // AA-47 Adjust scrollbars after view has been updated
    // 21.1.2019  AA-68 Commented out, no need to adjust scrollbars anymore.
    /*
    if ( this.chat != null )
    {
      requestAnimationFrame(() => {
        
          // 
          let wait = new Promise((resolve) => setTimeout(resolve, 150)); 
          wait.then( () => {
            if ( this.chat._messageContainerRef != null )
            {
              var fl = this.chat._messageContainerRef.flatListRef;
              if ( fl != null )
              {
                var visibleLength = fl._listRef._scrollMetrics.visibleLength; 
                var prevScrollPosition = this.state.scrollPosition;
                var offset = fl._listRef._scrollMetrics.contentLength - prevScrollPosition - visibleLength;
                //if ( offset > visibleLength ) 
                if ( offset > 0 )
                  fl.scrollToOffset({offset:offset+(2*80)}); // +80 is for button height
              }
            }
          });  
        
      });
    }*/
  }


  // Return unique id. Id is generated from current date, but because Date.now() function might
  // return same value in subsequent calls and that's why function adds prefix in Date.now() value.
  // Prefix will be set by caller.
  getNextMessageId(prefix)
  {
    /*
    let id = this.state.currentid + 1;
    this.incrementCount();
    return id;
    */
    let id = prefix + "_" + Date.now(); 
    
    return id;
  }
/*
  incrementCount() {
    this.setState(prevState => ({ currentid: prevState.currentid + 1 }));
  }*/

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderChatFooter(props)
  {
    return null;
  }

  renderInputToolbar (props) {
    //Add the extra styles via containerStyle
   //return <InputToolbar {...props} containerStyle={{borderTopWidth: 1.5, borderTopColor: '#333'}} />
   return null;
   /*
   return 
        <View>
            <Button success rounded block>
                <Text>Videoon</Text>
            </Button>
        </View>*/
  }

  onPressHashtag(url){
    //this.props.navigation.navigate('Video', { url : url })  
    this.setState((state) => ({
      displayWeb: true,
      webUrl: url,
    }))
  }

  handleUserFormChange(name, value) {
   // console.log("handleUserFormChange, name:" + name + ", value:" + value);
    this.setState(() => ({ [name]: value}));
  }

  showVideo(url)
  {
    this.setState((state) => ({
      displayVideo: true,
      videoUrl: url,
    }))
  }

  showWeb(url)
  {
    //console.log("showWeb, url:" + url);
    this.setState((state) => ({
      displayWeb: true,
      webUrl: url,
    }))
  }

  renderMessageImage(props)
  {
    //console.log("thumbnail: " + props.currentMessage.thumbnail);
    
    let thumbnail_url = props.currentMessage.thumbnail;
    let type = props.currentMessage.type;

    let data;
    if ( type == 200)
    {
      data = 
      <View>
        <Image
          style={{width: 40, height: 22, padding:10, margin:10}}
          //source={{uri:'https://cdn.dribbble.com/users/55974/screenshots/3967147/dribbble.gif'}}
          //source={ require('./assets/play_black.png')}
          source={ require('./assets/loading_dots.gif')}
          //source={{uri: 'http://www.clicktorelease.com/code/gif/1.gif'}}  
        />
      </View>
    }
    else
    {
      data =  
        <View>
          <TouchableHighlight style={styles.thumbnail} 
            onPress={() => {
              if ( type == 1)
                this.showVideo(props.currentMessage.image)
              else
                this.showWeb(props.currentMessage.image)
              }}>
            <ImageBackground 
              //source={thumbnail_url} 
              source={{uri: thumbnail_url}}
              style={{width: 150, height: 100, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={ type == 1 ? require('./assets/play.png') : null }
            />
            </ImageBackground>
          </TouchableHighlight>
        </View>;
    }

    return(
      <View>
        {data}
      </View>
    );
  }

  renderTime(props) {
    //console.log("renderTime ...")

    // Hide time always ...
    return null;

    var color = 'gray';
    if ( props.currentMessage.type == 200 )
    {
      color = 'white';
      //console.log("renderTime ... WHITE");
      return null;
    }

    return <Time
     {...props}
      textStyle={{
          right: {
              color: "gray",
              fontFamily: 'Montserrat-Light',
              fontSize: 14
          },
          left: {
              color: color,
              fontFamily: 'Montserrat-Light',
              fontSize: 14
          }
      }}
    />
  }

  renderBubble(props) {
    return (
      // Return your normal Bubble component if message has been sent.
      // <Bubble {...props}  />
        <Bubble
        {...props}
        textStyle={{
          left: {
            color: 'black',
            fontFamily: 'Montserrat-Light',
            fontSize: 14,
            lineHeight: 20,
          },
          
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#ffffff',
            borderBottomLeftRadius: 0,
            marginStart: 20,
            marginTop: 10,
          },
          right: {
            backgroundColor : '#29cc96',
            borderBottomRightRadius: 0,
            marginEnd: 20,
          },

        }}
      />
    );
  }

  addChatVideoMessage(nextId, url, text, thumbnail)
  {
    /*
    this.setState(previousState => ({
      currentState: previousState.chat_data[nextId],
      messages: GiftedChat.append(previousState.messages, 
      {
          _id: this.getNextMessageId(nextId),
          text: text.trim(),
          createdAt: new Date(),
          image : url,
          thumbnail : thumbnail,
          type: 1,
          user: {
            _id: 2,
          }
        })
      }));            
      */
     let _id = this.getNextMessageId(nextId);
     let txt = text.trim();

     return { currentState: this.state.chat_data[nextId], id: _id, text:txt, image:url, thumbnail : thumbnail, type : 1};
  }

  addChatHtmlMessage(nextId, url, text, thumbnail)
  {
    /*
    this.setState(previousState => ({
      currentState: previousState.chat_data[nextId],
      messages: GiftedChat.append(previousState.messages, 
      {
          _id: this.getNextMessageId(nextId),
          text: text.trim(),
          createdAt: new Date(),
          thumbnail : thumbnail,
          image : url,
          type: 2,
          user: {
            _id: 2,
          }
        })
      })); 
      */
     let _id = this.getNextMessageId(nextId);
     let txt = text.trim();

     return { currentState: this.state.chat_data[nextId], id: _id, text:txt, image:url, thumbnail : thumbnail, type : 2};

  }

  addChatMessage(nextId, parameterName, parameterValue)
  {
    // 18.2.2019
    //let text = this.state.chat_data[nextId].Text.replace(parameterName, parameterValue);
    let text = this.state.chat_data[nextId].Text;
    
    if ( parameterName instanceof Array)
    {
        for (let i=0; i < parameterName.length; i++)
        {
          console.log("text=" + text);
          console.log("parameterName[i] = " + parameterName[i]);
          console.log("parameterValue[i] = " + parameterValue[i]);
          text = text.replace(parameterName[i], parameterValue[i]);
        }
    }
    else
    {
        text = text.replace(parameterName, parameterValue);
    }

    // Split text so that each sentence is represented in own message bubble.
    var text_array = [];
    text_array = text.split('|');
/*    
    var t=0, len=text_array.length-1;

    // First message will shown immediately
    var id = this.getNextMessageId(nextId + '_' + t);
    var chatText = text_array[t].trim();

    this.setState(previousState => ({
      currentState: previousState.chat_data[nextId],
      messages: GiftedChat.append(previousState.messages, 
      {
          _id: id,
          text: chatText,
          createdAt: new Date(),
          user: {
            _id: 2,
          }
        })
      }));            

    
    t=t+1;
    console.log("c " + t + ", " + len);
    if ( t <= len )
    {
      console.log("addChatMessage: next setTimeout");
      
      var timerId = setTimeout(() =>
      {
        console.log("in setInterval");
        console.log("add next message: [" + t + "]:" + text_array[t]);

        this.setState(previousState => ({
          currentState: previousState.chat_data[nextId],
          messages: GiftedChat.append(previousState.messages, 
          {
              _id: this.getNextMessageId(nextId + '_' + t),
              text: text_array[t].trim(),
              createdAt: new Date(),
              user: {
                _id: 2,
              }
            })
          }));            

        t++;
        if ( t == len)
          clearInterval(timerId); 
      }, 2000); 
    }
*/    
    var msg_array=[];

    for (let t=0; t < text_array.length; t++)
    {
      let id = this.getNextMessageId(nextId + '_' + t);
      let text = text_array[t].trim(); 
      let msg = {"currentState" : this.state.chat_data[nextId], "id" : id, text: text};
      msg_array.push(msg);
    }

    return msg_array;
/*
    for (let t=0; t < text_array.length; t++)
    {
      var id = this.getNextMessageId(nextId + '_' + t);

      this.setState(previousState => ({
        currentState: previousState.chat_data[nextId],
        messages: GiftedChat.append(previousState.messages, 
        {
            _id: this.getNextMessageId(nextId + '_' + t),
            text: text_array[t].trim(),
            createdAt: new Date(),
            user: {
              _id: 2,
            }
          })
        }));            
    } 
*/
  }

  // 21.1.2019  AA-68 Changed to return values to be added to chat
  addUserMessage(id, text)
  {
    /*
    // User side chat -> echo text of button user selected    
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, 
        {
          _id: id + 1000,
          text: text,
          createdAt: new Date(),
          user: {
            _id: 1,
          }
        })
    }));
    */
   let _id = id + 1000;
   let txt = text.trim();

   return {id: _id, text: txt};
  }


  async dialogButtonPressed(key)
  {
      //Alert.alert("dialogButtonPressed, key = " + key);

      if ( key == "buttonSave")
      {
        // Dialog data is already saved by dialog to STATE variables (not to AsyncStorage)
        // So, save values here to AsyncStorage
        let user_profile_data = {"Firstname" : this.state.firstname, "Height" : this.state.height, "Weight" : this.state.weight, "Age" : this.state.age, "ChildFirstname" : this.state.child_firstname};
        console.log("Save to AsyncStorage [Chat]: " + JSON.stringify(user_profile_data));
        await AsyncStorage.setItem('user_profile', JSON.stringify(user_profile_data));

        // Find index of array based on next state's Id
        let nextId = this.getStateIndex(this.state.currentState.NextId);
        // 21.1.2019  AA-68
        //this.addChatMessage(nextId, '%name%', this.state.firstname);
        // 18.2.2019
        //let msg_array = this.addChatMessage(nextId, '%name%', this.state.firstname);
        let msg_array = [];
        if ( this.state.showChildName )
        {
          let paramName_array = [];
          paramName_array.push('%name%');
          paramName_array.push('%child_name%');
          let paramValue_array = [];
          paramValue_array.push(this.state.firstname);
          paramValue_array.push(this.state.child_firstname);

          msg_array = this.addChatMessage(nextId, paramName_array, paramValue_array);
        }
        else
        {
          msg_array = this.addChatMessage(nextId, '%name%', this.state.firstname);
        }

        this.addChatMessagesToQueue(msg_array, null);
      }
      else
      {
          // Cancel pressed -> read from Tag-property next state 
          // This is special case because current state contains only next state when "positive" button is pressed
          let id = this.getNextMessageId(key);
          // 21.1.2019  AA-68
          //this.addUserMessage(id, I18n.t('cancel_action')); 
          let userMessage = this.addUserMessage(id, I18n.t('cancel_action'));
          
          let tag = this.state.currentState.Tag;
          console.log("Cancel pressed, tag=" + tag + ", currentState=" + this.state.currentState.Id);
          if ( tag != null )
          {
            let nextId = this.getStateIndex(tag);
            // 21.1.2019  AA-68
            //this.processNextState(nextId);
            let msg_array = this.processNextState(nextId);
            this.addChatMessagesToQueue(msg_array, userMessage);
          }
      }

      // Always close the dialog
      this.setState({ showDialog: false });

  }

  printTest()
  {
    console.log("printTest");
  }

  // 
  processNextState(nextStateId)
  {
    let nextId = nextStateId;
    let nextIdAfterAction = -1;

    let value_array_video = [];
    let value_array_html = [];

    // Check if next state contains action to be done
    if ( nextId >= 0 )
    {
      let nextState = this.state.chat_data[nextId]; 
      if ( nextState.Action != null )
      {
        let action = nextState.Action;

        if ( action == "PERSONAL_DATA" ){
          this.setState(previousState => ({
            showDialog : true
          }));  
        }
        else if ( action == "OPEN_GUIDE")
        {
          // Tag contains JSON array of HTML-pages and their names
          value_array_html = nextState.Url_extra;

          // User opens web page, but in chat view user should see next state
          if ( nextState.NextId != null)
            nextIdAfterAction = this.state.chat_data.findIndex(t => t.Id == nextState.NextId);
        }
        else if ( action == "SHOW_VIDEO")
        {
          // Tag contains JSON array of videos and their names
          value_array_video = nextState.Url_extra;

          // User watches the video, but in chat view user should see next state
          if ( nextState.NextId != null)
            nextIdAfterAction = this.state.chat_data.findIndex(t => t.Id == nextState.NextId);
        }

      }
    }

    // 21.1.2019  AA-68
    //this.addChatMessage(nextId, null, null);
    var msg_array = this.addChatMessage(nextId, null, null);

    // Render videos
    for (let x=0; x < value_array_video.length; x++)
    {
      // 21.1.2019  AA-68
      //this.addChatVideoMessage(nextId + "v_" + x, value_array_video[x].Url, value_array_video[x].Name, value_array_video[x].Thumbnail);
      msg_array.push(this.addChatVideoMessage(nextId + "v_" + x, value_array_video[x].Url, value_array_video[x].Name, value_array_video[x].Thumbnail));
    }

    // Render links to html pages
    for (x=0; x < value_array_html.length; x++)
    {
      // 21.1.2019  AA-68
      //this.addChatHtmlMessage(nextId + "h_" + x, value_array_html[x].Url, value_array_html[x].Name, value_array_html[x].Thumbnail);
      msg_array.push(this.addChatHtmlMessage(nextId + "h_" + x, value_array_html[x].Url, value_array_html[x].Name, value_array_html[x].Thumbnail));
    }

    // If current state contains action, chat screen shows some text regarding action and moves to the next state
    if ( nextIdAfterAction >= 0 )
    {
      // 21.1.2019  AA-68
      //this.processNextState(nextIdAfterAction);
      msg_array.push(...this.processNextState(nextIdAfterAction));
    }

    return msg_array;
  }

  // AA-2
  // User must be able to respond to questions that chatbot shows. 
  // User can respond by pressing correct button
  buttonPressed(nextStateId, buttonText)
  {
    console.log("buttonPressed: nextId=" + nextStateId + ", buttonText=" + buttonText);

    // AA-47 Store current position before button is pressed
    var fl = this.chat._messageContainerRef.flatListRef;
    // // 23.8.2019 AA-99 not working???
    //var scrollMetrics = fl._listRef._scrollMetrics;
    var scrollMetrics = 0;
    console.log("buttonPressed: scrollPosition" + this.state.scrollPosition + ", contentLength:" + scrollMetrics.contentLength);
    this.setState({scrollPosition: scrollMetrics.contentLength});

    // User side chat -> echo text of button user selected    
    let id = this.getNextMessageId("patient");
    // 21.2.2019
    //this.addUserMessage(id, buttonText);
    let userMessage = this.addUserMessage(id, buttonText);

    // Avatar side chat -> process what to do next
    // 21.1.2019  AA-68
    //this.processNextState(nextStateId);
    let msg_array = this.processNextState(nextStateId);
    this.addChatMessagesToQueue(msg_array, userMessage);
  }

  // 18.2.2019  AA-68
  processVariablesInText(text)
  {
    //console.log("processVariablesInText IN " + text);
    text = text.replace('%name', this.state.firstname == null ? '' : this.state.firstname);
    text = text.replace('%child_name%', this.state.child_firstname == null ? '' : this.state.child_firstname);
    //console.log("processVariablesInText OUT " + text);
    return text;
  }

  // 21.1.2019 AA-68
  addChatMessagesToQueue(msg_array, userMessage)
  {
    let len = msg_array.length-1;
    let t=0;
    console.log("in addChatMessagesToQueue, len=" + len);

    if ( userMessage != null )
    {
      // 18.2.2019  AA-68
      var text = this.processVariablesInText(userMessage.text);
      // 18.2.2019  AA-68

      this.setState(previousState => ({
        currentState:null,  // clear buttons
        messages: GiftedChat.append(previousState.messages, 
          {
            _id: userMessage.id,
            text: text, // 18.2.2019 userMessage.text,
            createdAt: new Date(),
            user: {
              _id: 1,
            }
          })
      }));  
    }

    let system_message_id = this.getNextMessageId("system_is_typing");
    let system_message = {
      _id: system_message_id,
      text: null, //"System is typing ...",
      image : "xx", // Need to have some value
      type : 200,
      createdAt: new Date(),
      user: {
        _id: 2,
      }
    };

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, system_message)
    }));  

    var timerId = setInterval(() =>
    {
      let id = msg_array[t].id;
      let text = this.processVariablesInText(msg_array[t].text); // 18.2.2019  AA-68 msg_array[t].text;
      let image = msg_array[t].image;
      let thumbnail = msg_array[t].thumbnail;
      let type = msg_array[t].type;
      let currentState = null;
      let tmp = "null"
      if ( t == len )
      {
        currentState = msg_array[t].currentState;
        tmp = currentState.Id;
      }

      console.log("in setInterval");

      // First, remove "System is typing" from messages
      this.setState(previousState => ({
        //messages: GiftedChat.append(previousState.messages, system_message)
        messages: previousState.messages.filter(message => message._id !== system_message_id)
      }));  
  
      console.log("add next message: [" + t + "]:" + text + ", currentState: " + tmp);

      this.setState(previousState => ({
        currentState: currentState,
        messages: GiftedChat.append(previousState.messages, 
        {
            _id: id,
            text: text,
            image: image,
            thumbnail : thumbnail,
            type : type,
            createdAt: new Date(),
            user: {
              _id: 2,
            }
          })
        }));            

      if ( t == len )
        clearInterval(timerId); 
      else
      {
        // And add "System is typing message again"
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, system_message)
        }));    
      }

      t++;
    }, 3000); 


    /*
    let len = msg_array.length-1;
    for (let t=0; t <= len; t++)
    {
      var timerId = setInterval(() =>
      {
        let id = msg_array[t].id;
        let text = msg_array[t].text;
        let image = msg_array[t].image;
        let thumbnail = msg_array[t].thumbnail;
        let type = msg_array[t].type;
        let currentState = msg_array[t].currentState;

        console.log("in setInterval");
        console.log("add next message: [" + t + "]:" + text);

        this.setState(previousState => ({
          currentState: currentState,
          messages: GiftedChat.append(previousState.messages, 
          {
              _id: id,
              text: text,
              image: image,
              thumbnail : thumbnail,
              type : type,
              createdAt: new Date(),
              user: {
                _id: 2,
              }
            })
          }));            
  
        if ( t == len )
          clearInterval(timerId); 
      }, 1000); 
    } 
*/
  }

  getStateIndex(state_id)
  {
    let index = this.state.chat_data.findIndex(t => t.Id == state_id);
    return index;
  }

  renderButtons()
  {
    // If there are no Buttons in currentState, render nothing
    // 21.1.2019 AA-68 Added 'if ( this.currentState == null )'
    if ( this.state.currentState == null ) return null

    if ( this.state.currentState.Buttons )
    {
      if ( this.state.currentState.Buttons.length >= 0)
      {        
        const buttonItems = this.state.currentState.Buttons.map((button, i) => {

          let index = this.state.chat_data.findIndex(t => t.Id == button.NextId);

          // 18.2.2019 AA-68
          var text = this.processVariablesInText(button.Text);
          // 18.2.2019 AA-68
          console.log("index=" + index + ", xx: " + JSON.stringify(button) + ", text=" + text);

          return <Button key={i} success style={buttonStyles.alignRightButton}
              onPress={() => this.buttonPressed(index, text)}>
              <Text style={buttonStyles.buttonText}>{text}</Text>
          </Button>
        });

        return (
          <View style={styles.footerContainer}>
            {buttonItems}
          </View>  
        );
      }
    }
    else
    {
      return null;
    }
  }

  renderFooter(props) {
    
    return (
      <View>
        {this.renderButtons()}
      </View>  
    );
  }

  renderText(matchingString, matches) {
    return "Avaa linkki"
  }

  hideVideo () {
    this.setState({ displayVideo: false })
  }

  hideWeb() {
    this.setState({ displayWeb: false })
  }

  _onNavigationStateChange()
  {
    this.hideWeb()
  }

  render() {
    
    return (
        // NOTE! GiftedChat is not shown if it is wrapped inside View-component without style flex:1
        <View style={{flex: 1, backgroundColor:'#DEF8EF'}}>
           {(this.state.displayVideo || this.state.displayWeb) ? (
            <Modal
            style={{flex:1}}
            animationType={'slide'}
            visible={this.state.displayVideo || this.state.displayWeb}
            onRequestClose={this.hideVideo.bind(this)}
            transparent
            >
            {this.state.displayVideo ? (
            <VideoPlayer 
              source= {{uri: this.state.videoUrl}}
              navigator={ this.props.navigation }
              onBack={() => this.setState((state) => ({
                displayVideo: false,
                videoUrl: "",
              })) }
              onEnd={this.hideVideo.bind(this)}
            />) : 
            (
              <View style={{ flex: 1 }}>
                <Header
                  placement="left"                
                  backgroundColor={'#DEF8EF'}
                  leftComponent={{ icon: 'close', color: 'black', onPress: () => this.hideWeb() }}
                  centerComponent={{ text: '', style: { color: 'black' } }}
                />
                <WebView
                  style={[{ flex: 1 }, this.props.styles]}
                  source= {{uri: this.state.webUrl}}
                  //source= {this.state.url}
                  scalesPageToFit
                  startInLoadingState
                  //onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                  onError={this._onNavigationStateChange.bind(this)}
                />
              </View>
            )
            }
            </Modal> ) : (

            <GiftedChat
              listViewProps={{
                //onLayout:this.onChatList,
                //onEndReached: this.onEndReached,
                //onViewableItemsChanged : this.onViewableItemsChanged,
                onScroll : this.handleScroll,
                //scrollEventThrottle : 16
                //maintainVisibleContentPosition:{
                //  minIndexForVisible: 0,
                //}

                maxToRenderPerBatch : 100,   
                updateCellsBatchingPeriod : 10,   
                initialNumToRender : 100,
                windowSize : 100
              }}
              ref={(c) => this.chat = c}
              //ref="chat"
              locale='fi-FI'
              dateFormat={'DD.MM.YYYY'}
              timeFormat={'HH.mm'}
              renderAvatarOnTop={true}
              renderAvatar={null}
              renderBubble={this.renderBubble}
              renderMessageImage={this.renderMessageImage}
              //inverted={false}
              isAnimated={true}
              renderInputToolbar={this.renderInputToolbar} 
              messages={this.state.messages}
              onSend={messages => this.onSend(messages)}
              renderFooter={this.renderFooter}
              renderChatFooter={this.renderChatFooter}
              //renderDay={this.renderDay}
              renderTime={this.renderTime}
              minInputToolbarHeight={3}
              parsePatterns={(linkStyle) => [
                  //{ pattern: /#(\w+)/, style: linkStyle, onPress: props => this.onPressHashtag(props), renderText: this.renderText }
                  { pattern: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/i, style: styles.hashtag, onPress: props => this.onPressHashtag(props), renderText: this.renderText }
              ]}
              
              user={{
                _id: 1,
              }}
            />
            )
        }

        <UserDialog 
          dialogButtonPressed={this.dialogButtonPressed} 
          showDialog={this.state.showDialog} 
          handleUserFormChange={this.handleUserFormChange}
          showChildName={this.state.showChildName} />      

        </View>
            
    );
            
  }
}

/*
      <Dialog
            onDismiss={() => {
              this.setState({ showDialog: false });
            }}
            width={0.9}
            visible={this.state.showDialog}
            rounded
            dialogAnimation={new SlideAnimation({ slideFrom: 'top', toValue:100000 })}
            //dialogAnimation={new FadeAnimation({ animationDuration: 5000, toValue:2000 })}

            dialogTitle={
              <DialogTitle
                title={I18n.t('basic_info_dialog_title')}
                style={{
                  backgroundColor: '#F7F7F8',
                }}
                hasTitleBar={false}
                align="left"
              />
            }
            actions={[
              <DialogButton
                text={I18n.t('basic_info_dialog_cancel')}
                onPress={() => {
                  this.dialogButtonPressed("buttonCancel");
                }}
                key="buttonCancel"
              />,
              <DialogButton
                text={I18n.t('basic_info_dialog_save')}
                onPress={() => {
                  this.dialogButtonPressed("buttonSave");
                }}
                disabled={ buttonDisabled }
                key="buttonSave"
              />,
            ]}
          >
            <DialogContent
              style={{
                backgroundColor: '#F7F7F8',
              }}>
              <UserForm handleChange={this.handleUserFormChange} />
            </DialogContent>
          </Dialog>


*/

const styles = StyleSheet.create({
    hashtag: {
      alignSelf:'center',
      marginTop: 10,
      width: '75%',
      color: 'blue',
      textDecorationLine: 'underline',
    },
    thumbnail: {
      alignItems: 'center',
      //backgroundColor: '#DDDDDD',
      padding: 10
    },
  });
  
  const buttonStyles = StyleSheet.create({
    centerButton: {
      alignSelf:'center',
      marginTop: 10,
      width: '75%',
    },
    alignRightButton: {
      alignSelf:'flex-end',
      marginTop: 20,
      marginEnd: 20,
      backgroundColor : '#29cc96',
      borderBottomLeftRadius: 20,
      //borderBottomRightRadius: 15, 
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20
    },
    buttonText : {
      fontSize : 12
    }
  });
