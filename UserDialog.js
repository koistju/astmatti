import React from 'react';
import { Platform, StyleSheet, View, AsyncStorage, Alert, WebView, ActivityIndicator, FlatList, 
  TouchableOpacity, TouchableHighlight, Image, ImageBackground, Modal, Keyboard } 
from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, withNavigation } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Container, Content, Text, Button, InputGroup, Input, Icon, Form, Item, Label, Grid, Col  } from 'native-base';
import { GiftedChat, InputToolbar, Actions, Bubble, SystemMessage  } from 'react-native-gifted-chat';
import NavigationService from './NavigationService';
import 'moment/locale/nb'
import Dialog, { DialogTitle, DialogContent, DialogButton, SlideAnimation, DialogFooter } from 'react-native-popup-dialog';
import I18n from './i18n';
import { getLanguages } from 'react-native-i18n';
import VideoPlayer from 'react-native-video-controls';
// 23.8.2019 AA-99 Package not needed anymore
//import { material } from 'react-native-typography'
import { List, ListItem, Header } from "react-native-elements";
import { UserForm } from './UserForm';

export class UserDialog extends React.Component {

    constructor(props)
    {
      super(props);

      this.handleUserFormChange = this.handleUserFormChange.bind(this);
      this.setIsValid = this.setIsValid.bind(this);

      this.state = {
        age : null,
        weight : null,
        height : null,
        dialogButtonDisabled : false,
        isValid : false
      }
    }

    setIsValid(isValid)
    {
        console.log("setIsValid:" + isValid);
        this.setState({ isValid : isValid });
    }

    dialogButtonPressed(key)
    {
        this.refs.userForm.showErrors();
        
        var isValid = true;
        if ( key == "buttonSave" )
            isValid = this.state.isValid;

        console.log("isValid:" + isValid + ", key=" + key);
        if ( isValid ){
            Keyboard.dismiss();
            this.props.dialogButtonPressed(key);
        }
    }

    handleUserFormChange(key, value)
    {
        this.props.handleUserFormChange(key, value);

        //console.log("handleUserFormChange, name:" + name + ", value:" + value);
        const disabled = this.state.age == null || this.state.weight == null || this.state.height == null;
        this.setState({ dialogButtonDisabled : false, [key]: value });
        
        console.log("disabled=" + disabled);
    }

    render()
    {
      return(
    
      <Dialog
            onDismiss={() => {
              this.setState({ showDialog: false });
            }}
            width={0.9}
            visible={this.props.showDialog}
            rounded
            dialogAnimation={new SlideAnimation({ slideFrom: 'top', toValue:100000 })}
            //dialogAnimation={new FadeAnimation({ animationDuration: 5000, toValue:2000 })}

            dialogTitle={
              <DialogTitle
                title={I18n.t('basic_info_dialog_title')}
                style={{
                  backgroundColor: '#F7F7F8',
                }}
                hasTitleBar={false}
                align="left"
              />
            }
            // // 23.8.2019 AA-99
            //actions={[
            footer={
              <DialogFooter>
              <DialogButton
                text={I18n.t('basic_info_dialog_cancel')}
                onPress={() => {
                  this.dialogButtonPressed("buttonCancel");
                }}
                key="buttonCancel"
              />
              <DialogButton
                text={I18n.t('basic_info_dialog_save')}
                onPress={() => {
                  this.dialogButtonPressed("buttonSave");
                }}
                // 14.1.2019 Commented out, does not work as intended
                //disabled={this.state.dialogButtonDisabled}
                key="buttonSave"
              />
              </DialogFooter>
            //]}
            }
          >
            <DialogContent
              style={{
                backgroundColor: '#F7F7F8',
              }}>
              <UserForm ref='userForm' handleUserFormChange={this.handleUserFormChange} setIsValid={this.setIsValid} showChildName={this.props.showChildName }/>
            </DialogContent>
          </Dialog>
      )
    }
}