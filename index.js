/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// AA-96 5.9.2019
import * as React from 'react';
import {DefaultTheme, DarkTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DarkTheme,
  roundness: 4,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: '#FF0000',
    accent: 'red',
    disabled: 'red'
  }
};

export default function Main() {
    return (
      <PaperProvider theme={DarkTheme}>
        <App />
      </PaperProvider>
    );
  }
  
// AA-96 5.9.2019
AppRegistry.registerComponent(appName, () => Main);
//AppRegistry.registerComponent(appName, () => App);
