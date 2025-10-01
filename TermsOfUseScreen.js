import React from 'react';
import {
  View,
  Text, ScrollView,
} from 'react-native';
import { Button, Switch, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import I18n from './i18n';
import { WebView } from 'react-native-webview';

/*
  TermsOfUseScreen shows only terms of use.
*/

class TermsOfUseScreen_raw extends React.Component {

  constructor(props) {
    super(props);

    const type = this.props.navigation.getParam('type', '');
    console.log("type:", type);
    //console.log("props", this.props);
    //var type = "terms_of_use";
    var url = type== "terms_of_use" ? 'https://s4h.fi/policy/Terms_and_conditions.html' : 'https://s4h.fi/policy/Privacy_Policy.html';

    this.state = {
      url : url
    };
  }

  _onNavigationError(){
    console.log("navigation error in TermOfUseScreen");
  }

  render() {

    return (
      <View style={{ flex: 1, marginTop: 48, marginLeft: 24, marginRight: 24 }}>
        <WebView
                style={{ flex: 1 }}
                source= {{uri: this.state.url }}
                scalesPageToFit
                startInLoadingState
                onError={this._onNavigationError.bind(this)}
        />
      </View>
    );
  }
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


export class TermsOfUseScreen extends React.Component {
  static navigationOptions = (navigation) => {
    const type = navigation.navigation.getParam('type', '');
    let title = type== "terms_of_use" ? I18n.t('terms_of_use') : I18n.t('privacy_terms');

    return {
      title: title,
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
    //const type = this.props.navigation.getParam('type', '');
    //console.log("type:", type);

    return (
      <PaperProvider theme={theme}>
        <TermsOfUseScreen_raw {...this.props} />
      </PaperProvider>
    );
  }
}

