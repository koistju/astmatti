import React from "react";
import { View, TouchableOpacity  } from "react-native";
import { Text, Button} from "native-base";
import I18n from "./i18n";
import Dialog, { DialogTitle, DialogContent, DialogButton, SlideAnimation } from "react-native-popup-dialog";
import { PefMeasureDialogContent } from "./PefMeasureDialogContent";

export class PefMeasureDialog extends React.Component {    

	constructor(props)
	{
		super(props);

		this.hideDialog = this.hideDialog.bind(this);
		this.deleteMeasurement = this.deleteMeasurement.bind(this);
	}
  
	hideDialog(isSaved)
	{
		this.props.closeDialog(isSaved);
	}

	deleteMeasurement(item)
	{
		this.props.deleteMeasurement(item);
	}

	render() {

		return (      
			<Dialog
				onDismiss={() => {
					//                  this.setState({ showPefMeasurementDialog: false });
				}}
				visible={this.props.showDialog}
				width={1.0}
				height={1.0}
				rounded={false}
				>
				<DialogContent style={{flex:1, borderColor: "red", borderWidth: 0, paddingLeft:0, paddingRight:0}}>
					{
					<PefMeasureDialogContent
						closeDialog={this.hideDialog} 
						saveValues={this.props.saveValues} 
						selectedItem={this.props.selectedItem}
						deleteMeasurement={this.deleteMeasurement}
						/>
					}
				</DialogContent>
			</Dialog>
		);
	}
}

