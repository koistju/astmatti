import React from "react";
import { View } from "react-native";
import { WheelPicker } from '@delightfulstudio/react-native-wheel-picker-android'

export class PefValueDialogContent extends React.Component {
	constructor(props) {
		super(props);

		var index = 60;
		value = 5 * index + 50;

        let new_measurement = true;
		let selectedItem = null;
		if (props.value != null && props.value != " ") {
			console.log("props.value: ", props.value);
			value = props.value;
			index = (value - 50) / 5;
			new_measurement = false;
		}

		this.state = {
			selectedIndex: index,
			valueItems: [],
			new_measurement: new_measurement,
			value: value,
		};
	}

	componentDidMount() {

		let items = [];
		// Generate pef values
		for (let i = 50; i <= 700; i += 5) items.push(i);
		    this.setState({ valueItems: items });
    }
    
	onPickerSelect(event) {
		let index = event.position;
		let value = this.state.valueItems[index];
		
		this.setState((prevState) => ({
			selectedIndex: index,
			value: value,
		}));

		if ( this.props.valueSelected ) this.props.valueSelected(index, value);
	}

    render()
    {
        return(
            <View style={{flexDirection: "column", alignItems: "center"}}>
                <WheelPicker style={{ height: 178, width:64 }}
                    data={this.state.valueItems}
                    visibleItemCount={3}
                    isCurved={false}
                    isCurtain
                    isAtmospheric={true}
                    itemSpace={24}
                    renderIndicator={true}
                    indicatorSize={6}
                    indicatorColor={'black'}
                    itemTextSize={48}
                    itemTextColor={'grey'}
                    selectedItemTextColor={"black"}
                    selectedItemPosition={this.state.selectedIndex}
                    onItemSelected={(event) => this.onPickerSelect(event)}
                />
        </View>
        )
    }
}