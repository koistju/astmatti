import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Image
  } from 'react-native';
  
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator  } from 'react-navigation';
import StorageHelper from './StorageHelpers';

/*
  AuthLoadingScreen is used to show something to the user while app is fecthing something from server and/or from local storage.
  Once loading is completed this screen will be unmounted and app will switch to a new screen.
*/

export class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    // AA-23
    // Read all available pincodes from config file (plus all other configuration information)
    //var config = require('./config.json');
    //var data = "";
    //var config_file = await fetch('http://s4h.fi/indemand/config.json');
    //var config = await config_file.json();

    // TODO: Remove, only for testing
    //await AsyncStorage.removeItem('pinCodeUsed');

    // Save configuration for later use (so this is only place when configuration is read from server)
    //await AsyncStorage.setItem('configuration', JSON.stringify(config));
    //var pincode = await AsyncStorage.getItem('pinCodeUsed');
    // AA-90 20.5.2019
    var config = await StorageHelper.getCurrentConfiguration();
    
    console.log(" FOUND configuration: ", config);
    // If configuration is already set jump directly to chatbot, otherwise ask for pincode

    // AA-97 6.9.2019
    await this.waitForFewSeconds();

    this.props.navigation.navigate(config ? 'App' : 'Auth');

  };

  waitForFewSeconds = async() => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        1000
      )
    );
  }
  
  // AA-97 6.9.2019 
  render() {
    return (
      <View style={styles.container}>
          <Image style={{width:184, height:60}} source={require('./assets/teppo_icons/drawable-hdpi/group.png')}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#008591',
      alignItems: 'center',
      justifyContent: 'center',
    },
});