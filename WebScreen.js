import React from 'react';
import { StyleSheet, View, AsyncStorage, Alert, WebView, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator  } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Container, Content, Text, Button, Header, InputGroup, Input, Icon, Form, Item } from 'native-base';
import I18n from './i18n';

/*
  Simple screen used to show html-pages. Page to show is sent as parameter.
*/

export class WebScreen extends React.Component {
  static navigationOptions = {
    title: I18n.t('tab_title_web'),
    header: null
  };

  constructor(props) {
    super(props);
  }

  render() {
    const url = this.props.navigation.getParam('url', '');
    return (
      <WebView
        source = {{uri : url}}
        style={{marginTop: 20}}
      />    
    );
  }
}