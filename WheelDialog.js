import React from 'react';
import { Keyboard, View, Text } 
from 'react-native';
//import Dialog, { DialogTitle, DialogContent, DialogButton, SlideAnimation, DialogFooter } from 'react-native-popup-dialog';
import I18n from './i18n';
import { WheelPicker } from '@delightfulstudio/react-native-wheel-picker-android'
import { Button,  Paragraph, Dialog, Portal } from 'react-native-paper';
import { ThemeColors } from 'react-navigation';
import { throwStatement } from '@babel/types';

export class WheelDialog extends React.Component {

    constructor(props)
    {
      super(props);

      this.onItemSelected = this.onItemSelected.bind(this); 

      this.state = {
//        valueItems : [],
//        selectedItemPosition : 10
        value : null
      }
    }

    onItemSelected(item)
    {
      this.setState({value : item.data});
      //this.props.handleUserFormChange(this.props.type, item.data);
    }

    dialogButtonPressed(key)
    {
      this.props.dialogButtonPressed(key, this.state.value, this.props.type);
    }

    render()
    {
      return(
        <Portal>
          <Dialog
             visible={this.props.showDialog}
             onDismiss={this._hideDialog}>
            <Dialog.Title>
              <Text style={{color: 'rgba(0,0,0,0.87)', fontSize:20, letterSpacing: 0.25, fontFamily : 'sans-serif-medium'}}>
                {this.props.title}
              </Text>
            </Dialog.Title>
            <Dialog.Content>
            <View style={{flexDirection:'row', justifyContent :'center'}}>
                <WheelPicker style={{height:200, width:"30%"  }}
											data={this.props.items}
											visibleItemCount={3}
											isCurved={false}
											isCurtain
											isAtmospheric={true}
											//itemSpace={16}
											renderIndicator={true}
											indicatorColor={'black'}
											indicatorSize={5}
											itemTextSize={52}
											itemTextColor={'grey'}
											selectedItemTextColor={"black"}
											selectedItemPosition={this.props.selectedItemIndex}
											onItemSelected={(event) => this.onItemSelected(event)}
                    />
                </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => this.dialogButtonPressed("buttonCancel")}>
                <Text style={{color: '#00838f', fontSize:14, lineHeight:16, letterSpacing: 1.25, fontFamily : 'sans-serif-medium' }}>
                {I18n.t('cancel_text')}
                </Text>
              </Button>
              <Button onPress={() => this.dialogButtonPressed("buttonSave")}>
              <Text style={{color: '#00838f', fontSize:14, lineHeight:16, letterSpacing: 1.25, fontFamily : 'sans-serif-medium' }}>
              {I18n.t('ok_text')}
              </Text>
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )
    }
}