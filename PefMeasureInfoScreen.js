import React from 'react';
import { Modal, StyleSheet, View, AsyncStorage, Alert, Activit, FlatList, TouchableOpacity, Image, TouchableHighlight, Platform, Dimensions } from 'react-native';
import { Left, Body, Right, Container, Content, Text, Button, InputGroup, Input, Icon, Form, Item } from 'native-base';
import { VideoScreen } from "./VideoScreen"
import VideoPlayer from 'react-native-video-controls';
import Video from 'react-native-video';
import I18n from './i18n';
import { List, ListItem, Header, Avatar } from "react-native-elements";
import { getLanguages } from 'react-native-i18n';
import { WebView } from 'react-native-webview';
import StorageHelper from './StorageHelpers';

//import Pdf from 'react-native-pdf';
/*
  This screen is responsible for showing links to the videos and to the html-pages that contain textual information.
*/

export class PefMeasureInfoScreen extends React.Component {
  constructor(props)
  {
    super(props);
  
    this.onBackButtonPress = this.onBackButtonPress.bind(this);

    this.state={
       url : '',
       displayVideo : false,
       displayWeb : false,
       data: [],
       displayPdf : false,
    }
  }

  static navigationOptions = () => {
    return {
      title: I18n.t('tab_title_pef_measure_info'),

      // 23.8.2019 AA-99 tab bar icon logic is moved to here from createBottomTabNavigator
      tabBarIcon: ({tintColor}) =>
      <Image
            source={require('./assets/teppo_icons/drawable-hdpi/ic_instructions.png')}
            resizeMode = {'contain'}
            style={{ height: 25, width: 25, tintColor : tintColor}}
      />  
     
    }
  };

  async componentWillMount() {
    // Fetch decsription of material from server
    // For testing purposes
    //const url = "http://10.0.2.2:8085/astmatti/Material_description.json";
    // AA-109 material_description.json is unique for each client and it is stored in customer folders

    const config = await StorageHelper.getCurrentConfiguration();
    let org_short_name = config.org_short_name;
    const url = "https://s4h.fi/materials/" + org_short_name + "/material_description.json";

    getLanguages().then(languages => {
      console.log(languages);
      // Default language is FI
      let lang = "FI";

      if ( languages.length > 0)
      {
        let default_lang = languages[0].split('-');
        lang = default_lang[0].toUpperCase();    
      }

      fetch(url)
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        if ( responseJson.length > 0 )
        {
          // Find correct language, if it is not found, use FI
          var index = responseJson.findIndex(t => t.lang == lang);
          console.log("index = " + index);
          if ( index < 0 )
            index = responseJson.findIndex(t => t.lang == "FI");
          
          // If FI is not found, get the first one
          if ( index < 0 ) index = 0;

          this.setState({ data: responseJson[index].material });
        }
      })

    });
  }

  showVideo(url)
  {
    this.setState((state) => ({
      displayVideo: true,
      displayWeb: false,
      url: url,
      // 7.2.2019 AA-74
      displayPdf : false
    }))
  }

  showWeb(url)
  {
    console.log("showWeb: " + url);
    this.setState((state) => ({
      displayWeb: true,
      displayVideo: false,
      url: url,
      // 7.2.2019 AA-74
      displayPdf : false
    }))
  }

  // 7.2.2019 AA-74
  showPDF(url)
  {
    console.log("showPDF: " + url);
    this.setState((state) => ({
      displayWeb: false, 
      displayVideo: false,
      url: url,
      displayPdf : true
    }))
  }

  onBuffer(event)
  {
    console.log("onBuffer");
  }

  videoError(error)
  {
    console.log("videoError");
  }


  onPress(item)
  {
    if ( item.Type == "VIDEO")
      this.showVideo(item.Url);
    else if ( item.Type == "HTML")
      this.showWeb(item.Url);
    // 7.2.2019 AA-74 Added support also for pdf
    else if ( item.Type == "PDF")
      this.showPDF(item.Url);

  }

  _onNavigationStateChange (webViewState) {
    this.hideWeb()
  }

  hideWeb () {
    this.setState({ displayWeb: false })
  }

  onBackButtonPress()
  {
    console.log("onBackButtonPressed ...");
    this.setState((state) => ({
      displayVideo: false,
      videoUrl: "",
    }))
  }

  render() {

    let component_to_show;

    if ( this.state.displayVideo )
      component_to_show = 
      <Modal
      style={{flex:1}}
      animationType={'slide'}
      visible={this.state.displayVideo}
      //onRequestClose={this.hideWeb.bind(this)}
      // AA-55
      onRequestClose={this.onBackButtonPress}
      transparent
      >
{/*        
      <Video 
          source= {{uri: this.state.url}}
          ref={(ref) => {
            this.player = ref
          }} 
          fullscreen={true}
          controls={true}
          //fullscreenOrientation={'portrait'}
          style={{position: 'absolute',top: 0,left: 0,bottom: 0,right: 0,}}
          navigator={ this.props.navigation }
          onBuffer={this.onBuffer}                // Callback when remote video is buffering
          onError={this.videoError}               // Callback when video cannot be loaded
          //resizeMode="cover"
          bufferConfig={{
            minBufferMs: 35000,
            maxBufferMs: 85000,
            bufferForPlaybackMs: 2500,
            bufferForPlaybackAfterRebufferMs: 5000
          }}
          // AA-55
          onBack={this.onBackButtonPress }
          onEnd={ this.onBackButtonPress }
        />
        */}
  {
      <VideoPlayer 
          source= {{uri: this.state.url}}
          navigator={ this.props.navigation }
          // AA-55
          onBack={this.onBackButtonPress }
          onEnd={ this.onBackButtonPress }
        />
  }
        </Modal>;
    else if ( this.state.displayWeb )
      component_to_show = 
          <Modal
          style={{flex:1}}
          animationType={'slide'}
          visible={this.state.displayWeb}
          onRequestClose={this.hideWeb.bind(this)}
          transparent
          >
          <View style={{ flex: 1 }}>
              <Header
                placement="left"                
                //outerContainerStyles={{height: Platform.OS === 'ios' ? 70 :  70 - 24}}
                backgroundColor={'#DEF8EF'}
                leftComponent={{ icon: 'close', color: 'black', onPress: () => this.hideWeb() }}
                centerComponent={{ text: '', style: { color: 'black' } }}
              />
              <WebView
                style={[{ flex: 1 }, this.props.styles]}
                source= {{uri: this.state.url }}
                scalesPageToFit
                startInLoadingState
                //onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                onError={this._onNavigationStateChange.bind(this)}
              />
          </View>    
          </Modal >
          ;
      else if ( this.state.displayPdf )
      component_to_show = 
          <Modal
          style={{flex:1}}
          animationType={'slide'}
          visible={this.state.displayPdf}
          onRequestClose={this.hideWeb.bind(this)}
          transparent
          >
          <View style={{ flex: 1 }}>
              <Header
                placement="left"                
                //outerContainerStyles={{height: Platform.OS === 'ios' ? 70 :  70 - 24}}
                backgroundColor={'#DEF8EF'}
                leftComponent={{ icon: 'close', color: 'black', onPress: () => this.hideWeb() }}
                centerComponent={{ text: '', style: { color: 'black' } }}
              />
                <Pdf
                    source= {{uri: this.state.url }}
                    onError={(error)=>{
                        console.log(error);
                    }}
                    style={{flex:1, width : Dimensions.get('window').width}}/>
          </View>    
          </Modal >
          ;
      else 
      component_to_show = 
        <FlatList
        data={this.state.data}
        renderItem={({ item,separators }) => (
          <TouchableHighlight
              onPress={() => this.onPress(item)}
              //onShowUnderlay={separators.highlight}
              //onHideUnderlay={separators.unhighlight}
              underlayColor={'gray'}>
          <ListItem
            //roundAvatar
            topDivider
            title={item.Title}
            subtitle={item.Description}
            //leftAvatar={{ uri: item.Thumbnail }}
            leftAvatar={{ rounded:false, source: { uri: item.Thumbnail }, avatarStyle:listStyles.avatarStyle, containerStyle:listStyles.avatarStyle }}
            avatarStyle={listStyles.avatarStyle}
            avatarContainerStyle={listStyles.avatarStyle}
          />
          </TouchableHighlight>
          )}
        keyExtractor={item => item.Url}
        />
      ;

    return (

      //<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flex: 1 }}>
        {component_to_show}
      </View>
    );
  }
}

const listStyles = StyleSheet.create({
  avatarStyle: {
    width: 150,
    height: 85
  }
});

const buttonStyles = StyleSheet.create({
    centerButton: {
      alignSelf:'center',
      marginTop: 10,
      width: '75%',
    }
  });
