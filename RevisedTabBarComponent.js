import React from 'react';
import { Platform, Keyboard } from 'react-native';
import { BottomTabBar, TabBarComponent } from 'react-navigation-tabs'; // need version 2.0 react-navigation of course... it comes preinstalled as a dependency of react-navigation.

// AA-92 20.5.2019 
// Component that hides tab bar when keyboard is visible (this is bug in Andoroid)
export default class RevisedTabBarComponent extends React.Component {
  state = {
    visible: true
  }

  componentDidMount() {
      console.log("RevisedTabBarComponent .......................................");
    if (Platform.OS === 'android') {
      this.keyboardEventListeners = [
        Keyboard.addListener('keyboardDidShow', this.visible(false)),
        Keyboard.addListener('keyboardDidHide', this.visible(true))
      ];
    }
  }

  componentWillUnmount() {
    this.keyboardEventListeners && this.keyboardEventListeners.forEach((eventListener) => eventListener.remove());
  }

  visible = visible => () => this.setState({visible});

  render() {
    if (!this.state.visible) {
      return null;
    } else {
      return (
        <BottomTabBar {...this.props} />
      );
    }
  }
}