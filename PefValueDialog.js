import React from "react";
import { View } from "react-native";
import {PefValueDialogContent} from './PefValueDialogContent';
import { Dialog, Portal, Button } from 'react-native-paper';


export class PefValueDialog extends React.Component {


	constructor(props) {
        super(props);        

        this.valueSelected = this.valueSelected.bind(this);

		this.state = {
            value : null,
            index : -1
        };
	}
    
	okPressed()
	{
		console.log("okPressed")
        if ( this.props.hideDialog)
            this.props.hideDialog(this.state.index, this.state.value);
    }

    cancelPressed()
    {
        if ( this.props.hideDialog)
            this.props.hideDialog(null, null);
    }

    valueSelected(index, value)
    {
        this.setState({value : value, index: index});
    }

    render()
    {
        return(
            <View>
                <Portal>
                    <Dialog
                        visible={this.props.pefValueDialogVisible}>
                        <Dialog.Title>{this.props.dialogTitle}</Dialog.Title>
                        <Dialog.Content>
                            <PefValueDialogContent value={this.props.value} valueSelected={this.valueSelected}/>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button style={{marginRight:24, fontSize: 14, fontFamily: 'sans-serif-medium', letterSpacing: 1.25, lineHeight: 16}} onPress={() => this.cancelPressed()}>Peruuta</Button>
                            <Button style={{marginRight:18, fontSize: 14, fontFamily: 'sans-serif', letterSpacing: 1.25, lineHeight: 16}} onPress={() => this.okPressed()}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>						
        )
    }
}