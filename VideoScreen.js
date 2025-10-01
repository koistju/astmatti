import React from 'react';
import { StyleSheet, View, AsyncStorage, Alert, WebView, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator  } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Container, Content, Text, Button, Header, InputGroup, Input, Icon, Form, Item } from 'native-base';
import { GiftedChat, InputToolbar  } from 'react-native-gifted-chat';
// 23.8.2019 AA-99 Package not needed anymore
//import Video   from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import I18n from './i18n';

export class VideoScreen extends React.Component{

  static navigationOptions = {
    title: I18n.t('tab_title_video'),
    header: null
  };

  constructor(props) {
    super(props);
  }

  render()
  {
    const url = this.props.navigation.getParam('url', '');
    return(
      <View style={styles.container}>
          <VideoPlayer 
        //source= {{uri: "https://terveyskyla.flowboard.fi/videos/P5WC6VKZ74/video.mp4?quality=full"}}
        source= {{uri: url}}
        navigator={ this.props.navigation }
        //onBack={() => this.onBackPressed }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  