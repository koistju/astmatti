import React from 'react';
import {
  View, Text
} from 'react-native';
import I18n from './i18n';

// AA-100 24.9.2019 Replaced by simple Textbox
// 11.6.2019
//import ReceptionTimeComponent from './ReceptionTimeComponent';
import { Button, TextInput, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import ReceptionTimeComponent from './ReceptionTimeComponent';
import StorageHelper from './StorageHelpers'; 
import NotificationService from './NotificationService';

/*
  This screen is responsible for asking the pin code from the user. Pin code options are hardcoded to the software.
  Once pin code is correct, app should fetch appropriate conversation values and use them in ChatScreen.

*/

// AA-78 Component (screen) which is used when user enters PIN code for the first time.
class PinCodeScreen_raw extends React.Component {

  constructor() {
    super();

    this.onComplete = this.onComplete.bind(this);
    this.onCodeCorrect = this.onCodeCorrect.bind(this);
    this.onCodeInCorrect = this.onCodeInCorrect.bind(this);

    this.state = {
      code_correct: false,
      status_text: I18n.t('enter_pin_code'),
      current_config: null,
      code : ''
    }
  }

  navigateToApp() {
    this.props.navigation.navigate('App');
  }

  onCodeCorrect(current_config)
  {
    this.setState({code_correct : true, current_config : current_config, code : current_config.full_pincode});
  }

  onCodeInCorrect()
  {
    this.setState({code_correct : false,});
  }

  async onComplete() {
    await StorageHelper.storeCurrentConfiguration(this.state.current_config);
    this.notificationService = new NotificationService(null, null, this.props.navigation);
    this.notificationService.createSchedule(true);      

    // Wait for 1s before move forward
    //setTimeout(() => this.logInAsync(), 1000);
    this.logInAsync();
  }

  render() {
    let save_button_color = 'rgba(0,0,0, 0.12)';
		let save_button_text_color = 'rgba(0,0,0,0.38)'
		let save_button_disabled = true;

		if ( this.state.code_correct )
		{
			save_button_color = "#00838f";
			save_button_text_color = "#ffffff";
			save_button_disabled = false;
		}

    return (
      <View style={{ flex: 1, marginTop: 48, marginLeft:24, marginRight:24 }}>
          <Text style={{color:'rgba(0,0,0,0.603)', fontSize:14, lineHeight:20, letterSpacing:0.25, fontFamily: theme.fonts.regular}}>
            {I18n.t('pincode_guidance')}
          </Text>
          <View style={{marginTop:24}}>
            <ReceptionTimeComponent 
              onCodeCorrect={this.onCodeCorrect} 
              onCodeInCorrect={this.onCodeInCorrect}
              navigation={this.props.navigation}
              code={this.state.code}              
              />
          </View>
          <Button
            mode="outlined"
            disabled={save_button_disabled}
            onPress={this.onComplete}
            style={{ marginTop:24,  backgroundColor: save_button_color, width: "100%", height:36 }}>
            <Text style={{ color: save_button_text_color, fontSize: 14, lineHeight: 16, letterSpacing: 1.25, fontFamily: theme.fonts.medium }}>
              {I18n.t("confirm_button")}
            </Text>
          </Button>

      </View>
    );
  }

  logInAsync = async () => {
    //console.log("logInAsync pincode:" + this.state.pincode + ", fullPincode:" + this.state.fullPincode);
    console.log("logInAsync ...");
    this.props.navigation.navigate('App');
  };

}

const theme = {
  ...DefaultTheme,
  roundness: 4,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00838f',
    accent: 'rgba(0,151,167, 0.12)',
    disabled: 'rgba(0,0,0, 0.12)'
  },
  fonts: {
    thin: 'Roboto Thin',
    light: 'Roboto Light',
    regular: 'Roboto Regular',
    medium: 'Roboto Medium',
  }
};


export class PinCodeScreen extends React.Component {
  static navigationOptions = (navigation) => {
    return {
      title: I18n.t('enter_pin_code'),
      headerStyle: {
        backgroundColor: '#00838f',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontFamily: theme.fonts.medium,
        fontSize: 20,
        letterSpacing: 0,
      },
    }
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <PaperProvider theme={theme}>
        <PinCodeScreen_raw {...this.props} />
      </PaperProvider>
    );
  }
}
