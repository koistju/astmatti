import React from 'react';
import {
  AsyncStorage,
  View,
  StyleSheet,
  ImageBackground
} from 'react-native';

import { Container, Content, Text, Header, InputGroup, Input, Icon, Form, Item, H1, H2, H3, ListItem, CheckBox, Body, List, Row } from 'native-base';
// 23.8.2019 AA-99 Package not needed anymore
//import  CodePin  from 'react-native-pin-code'
import I18n from './i18n';
// AA- 6.9.2019
//import Switch from 'react-native-switch-pro'

// AA-96 6.9.2019
import { Button, Switch, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

/*
  SignInScreen shows only terms of use. User must accept all terms before he/she can continue to use app.
*/

class SignInScreen_raw extends React.Component {

  constructor() {
    super();

    this.state = {
      termsChecked: false,
    }
  }

  termsInUsePressed = async () => {
    console.log("termsInUsePressed")
    this.props.navigation.navigate('TermsOfUse', {type: 'terms_of_use'});
  };

  privacyPressed = async () => {
    console.log("privacyPressed")
    this.props.navigation.navigate('TermsOfUse', {type: 'privacy_terms'});
  };

  render() {

    let button_color = 'rgba(0,0,0, 0.12)';
    let button_text_color = 'rgba(0,0,0, 0.38)' //#61000000
    let button_disabled = true;

    if (this.state.termsChecked) {
      button_color = "#00838f";
      button_text_color = "#ffffff";
      button_disabled = false;
    }

    return (
      <View style={{ flex: 1, marginTop: 48, marginLeft: 24, marginRight: 24 }}>
        <Text style={styles.label}>{I18n.t('terms_of_use')}</Text>
        <View style={{ marginTop: 24 }}>
          <Text style={styles.labelBeforeUse}>
            {I18n.t('before_use_start_text')}
          <Text style={[styles.labelBeforeUse], {textDecorationLine:'underline'}} onPress={this.termsInUsePressed}> {I18n.t('terms_of_use_text')}</Text> {I18n.t('and_text')}
          <Text style={[styles.labelBeforeUse], {textDecorationLine:'underline'}} onPress={this.privacyPressed}> {I18n.t('privacy_text')}.</Text>
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop:24 }}>
          <Text style={[styles.labelBeforeUse, { flex: 4 }]}>{I18n.t('give_permission')}</Text>
          <Switch color="#0097a7" style={{ flex: 1, }} onValueChange={() => this.setState((state) => ({ termsChecked: !state.termsChecked }))}
            value={this.state.termsChecked} width={60} height={30} />
        </View>
        <Button mode="outlined" disabled={button_disabled} onPress={this.logInAsync}
          style={{ marginTop: 24, backgroundColor: button_color, width: "100%", height: 36 }}>
          <Text style={{ color: button_text_color, fontSize: 14, lineHeight: 16, letterSpacing: 1.25, fontFamily: theme.fonts.medium }}>
            {I18n.t('next')}
          </Text>
        </Button>
      </View>
    );
  }

  logInAsync = async () => {
    this.props.navigation.navigate('PinCode');
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


export class SignInScreen extends React.Component {
  static navigationOptions = () => {

    return {
      title: I18n.t('app_title'),
      header: null
    }
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <PaperProvider theme={theme}>
        <SignInScreen_raw {...this.props} />
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'left',
    fontSize: 24,
    marginTop: 24,
    color: "#00838f",
  },
  labelBeforeUse: {
    textAlign: 'left',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  linkki: {
    fontSize: 20,
    textDecorationLine: "underline"
  }
});  