import React from 'react';
import { Platform, StyleSheet, Image, View, AsyncStorage, Alert, WebView, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
// 23.8.2019 AA-99 Added createAppContainer
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, createAppContainer   } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthLoadingScreen } from "./AuthLoading";
import { SignInScreen } from "./SignInScreen";
import { PefMeasureScreen } from "./PefMeasureScreen";
import { PefMeasureInfoScreen } from "./PefMeasureInfoScreen";
import { ChatScreen } from "./ChatScreen"
import { WebScreen } from "./WebScreen"
import { PinCodeScreen} from "./PinCodeScreen"

// AA-59
import { UserProfileScreen } from './UserProfileScreen'
// AA-87 20.5.2019
import NotificationsScreen  from './NotificationsScreen'; 
import RevisedTabBarComponent from './RevisedTabBarComponent';

import { YellowBox } from 'react-native'
import { VideoScreen } from './VideoScreen';
import I18n from './i18n';

import { Button, Text, DefaultTheme, DarkTheme, Provider as PaperProvider, withTheme } from 'react-native-paper';
// AA-100 24.9.2019
import {TermsOfUseScreen} from './TermsOfUseScreen' 


// AA-99 26.8.2019
//YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated'])
YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Warning: componentWillUpdate is deprecated',
  'Module RCTImageLoader requires',
  'Warning: Async Storage has been extracted from react-native core',
  'Accessing view manager configs',
  'Require cycle'
]);

// 3.6.2019
import { ProfileList } from './ProfileList';
import { ReceptionTimeScreen } from './ReceptionTimeScreen';

/*
  App.js is responsible for navigating. This does not contain any screens.
*/

// 29.5.2019
/* Creates stack so that tabs are visible */
const UserProfileStack = createStackNavigator({ 
    ProfileList: {
      screen: ProfileList, 
      navigationOptions: {
          header: null,
        },
      },
    UserProfile: { 
        screen: UserProfileScreen,   
    },
    ReceptionTime: {
        screen : ReceptionTimeScreen,
    }
  },
  {
    initialRouteName: 'ProfileList',
    backBehavior: 'initialRoute'
  });  

const RootStack = createBottomTabNavigator (
  {
    // Order of tabs is this order
    Chat : ChatScreen,
    PefInfo: PefMeasureInfoScreen,
    PefMeasure: PefMeasureScreen,
    // AA-87 20.5.2019
    //Notifications: NotificationsScreen,
    // AA-59 14.1.2019 Tab for user profile
    UserProfile : {
      screen: UserProfileStack,
      navigationOptions: {
        title: I18n.t('user_profile_title'),
        // 23.8.2019 AA-99 tab bar icon logic is moved to here from createBottomTabNavigator
        tabBarIcon: ({tintColor}) =>
        <Image
                source={require('./assets/teppo_icons/drawable-hdpi/ic_profile.png')}
                resizeMode = {'contain'}
                style={{ height: 25, width: 25, tintColor : tintColor}}
        />      
      },
    },  
  },
  {
    initialRouteName: 'Chat',
    // 13.6.2019 Needed for Notifications tab (onTabPress)
    lazy : false,
    tabBarComponent : props =>
      <RevisedTabBarComponent
        {...props}
      />,

    navigationOptions: ({ navigation }) => ({

      // 23.8.2019 AA-99  This is not called anymore from react-navigation v3, this logic is moved to screens
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;

        // NOTE! Icons are from react-native-vector-icons/Ionicons! Not all icons has its focused version.
        if (routeName === 'Chat') {
          // AA-91 20.5.2019
          //iconName = `ios-chatbubbles${focused ? '' : ''}`;
          return <Image
                source={require('./assets/teppo_icons/drawable-hdpi/ic_astmatti.png')}
                //resizeMode = {Image.resizeMode.contain}
                resizeMode = {'contain'}
                style={{ height: 25, width: 25, tintColor : tintColor}}
        />  
        } 
        else if (routeName === 'PefInfo') {
          // AA-91 20.5.2019
          //iconName =  `ios-information-circle${focused ? '' : '-outline'}`;
          return <Image
                source={require('./assets/teppo_icons/drawable-hdpi/ic_instructions.png')}
                //resizeMode = {Image.resizeMode.contain}
                resizeMode = {'contain'}
                style={{ height: 25, width: 25, tintColor : tintColor}}
        />  
        }
        else if (routeName === 'PefMeasure') {
          // AA-91 20.5.2019
          //iconName =  `ios-medical${focused ? '' : ''}`;
          return <Image
                source={require('./assets/teppo_icons/drawable-hdpi/ic_pef.png')}
                //resizeMode = {Image.resizeMode.contain}
                resizeMode = {'contain'}
                style={{ height: 25, width: 25, tintColor : tintColor}}
        />  
        }
        // AA-59 14.1.2019 Tab for user profile
        else if (routeName === 'UserProfile') {
          //iconName =  `ios-build${focused ? '' : ''}`;
          return <Image
                source={require('./assets/teppo_icons/drawable-hdpi/ic_profile.png')}
                //resizeMode = {Image.resizeMode.contain}
                resizeMode = {'contain'}
                style={{ height: 25, width: 25, tintColor : tintColor}}
        />  
        }
        // AA-87 20.5.2019 
        else if (routeName === 'Notifications') {
          return <Image
                source={require('./assets/teppo_icons/drawable-hdpi/ic_notifications.png')}
                //resizeMode = {Image.resizeMode.contain}
                resizeMode = {'contain'}
                style={{ height: 25, width: 25, tintColor : tintColor}}
        />  
        }

        //return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
      // 16.1.2018
      /*
      tabBarOnPress: (param) => {
        const { routeName } = param.navigation.state;
        console.log('tabBarOnPress:', routeName);
        // Disable Pef measurement tab 
        if ( routeName != 'PefMeasure')
          param.defaultHandler();

    },*/
    }),
    tabBarOptions: {
      activeTintColor: '#00838f',//'tomato',
      inactiveTintColor: 'gray', //'gray',
    },  
  },
);


const AuthStack = createStackNavigator({ 
  SignIn: SignInScreen,
  PinCode: PinCodeScreen,
  // AA-100 24.9.2019
  TermsOfUse: TermsOfUseScreen  
});

// 23.8.2019 AA-99
//export default class App extends React.Component {
class AppStack extends React.Component {
  constructor(props){
    super(props);
  }

  componentWillMount() {
 
  }

  componentWillUnmount() {
    console.log("App: componentWillUnmount!");
  }

  render() {
    return (
        <SwitchStack />
    );
  }
}

// 23.8.2019 AA-99
//export default createSwitchNavigator(
//const SwitchStack = createSwitchNavigator(

//export default createAppContainer(
const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: RootStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);

const AppContainerWithTheme = withTheme(({ theme }) => {
  return <AppContainer screenProps={{ theme }} />;
});

export default AppContainerWithTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
