import React from "react";
import { Image, StyleSheet, View, TouchableOpacity, Alert, Dimensions, KeyboardAvoidingView, ScrollView, ShadowPropTypesIOS } from "react-native";
import { Text, Icon } from "native-base";
import { Header, ThemeConsumer } from "react-native-elements";
import I18n from "./i18n";
// 23.8.2019 AA-99 Package not needed anymore
//import Picker from "react-native-wheel-picker";
//var PickerItem = Picker.Item;
import DatePicker from "react-native-datepicker";
import moment from "moment";

// AA-99 26.8.2019 Changed to a new library
//import { WheelPicker } from 'react-native-wheel-picker-android'
import { WheelPicker } from '@delightfulstudio/react-native-wheel-picker-android'
import ViewOverflow from 'react-native-view-overflow';
const { width, height } = Dimensions.get('window');
// 9.2.2019 Not needed anymore, this was not working
//import KeyboardShift from './KeyboardShift';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
//import 'moment/min/moment-with-locales'
//import 'moment/locale/fi';
// AA-98 6.9.2019
import { Dialog, Portal, Button, TextInput, DefaultTheme, DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {PefValueDialogContent} from './PefValueDialogContent';
import {PefValueDialog} from './PefValueDialog';

const mid_part_height = 0.3;


// AA-94 20.5.2019
//export class PefMeasureDialogContent extends React.Component {
class PefMeasureDialogContent_raw extends React.Component {
	constructor(props) {
		super(props);

		this.hideDialog = this.hideDialog.bind(this);
		this.onToggleFirstPicker = this.onToggleFirstPicker.bind(this);
		this.onToggleSecondPicker = this.onToggleSecondPicker.bind(this);
		this.onToggleThirdPicker = this.onToggleThirdPicker.bind(this);
		this.onPickerSelectFirst = this.onPickerSelectFirst.bind(this);
		this.onPickerSelectSecond = this.onPickerSelectSecond.bind(this);
		this.onPickerSelectThird = this.onPickerSelectThird.bind(this);
		this.saveValues = this.saveValues.bind(this);
		this.setDate = this.setDate.bind(this);

		// 8.2.2019
		this.morgningBlowPressed = this.morgningBlowPressed.bind(this);
		this.symptomsBlowPresses = this.symptomsBlowPresses.bind(this);
		this.beforeMedicePressed = this.beforeMedicePressed.bind(this);
		this.afterMedicinePressed = this.afterMedicinePressed.bind(this);

		this.validateValues = this.validateValues.bind(this);
		this.deleteMeasurement = this.deleteMeasurement.bind(this);
		this.getDateStr = this.getDateStr.bind(this);
		this.getTimeStr = this.getTimeStr.bind(this);

		// AA-107
		this.showPefValueDialog = this.showPefValueDialog.bind(this);
		this.onPickerItemSelected = this.onPickerItemSelected.bind(this);

		var date = moment().format("DD.MM.YYYY"); //new Date();
		let time = moment().format("HH:mm"); //new Date();
		var orderno = moment().unix();
		var index_first = 60, index_second = 60, index_third = 60;
		// AA-107
		//value_1 = 5 * index_first + 50;
		value_1 = " ";
		value_2 = " ";
		value_3 = " "; 
		//value_2 = 5 * index_second + 50;
		//value_3 = 5 * index_third + 50;

		// 8.2.2019
		var blowType = null;
		var measureType = null;
		var notes = null;

		console.log("props.selectedItem: " + JSON.stringify(props.selectedItem));

		let new_measurement = true;
		let selectedItem = null;
		if (props.selectedItem != null) {
			console.log("props.selectedItem: " + JSON.stringify(props.selectedItem));
			value_1 = props.selectedItem.Value1;
			value_2 = props.selectedItem.Value2;
			value_3 = props.selectedItem.Value3;
			//date = new Date(Date.parse(props.selectedItem.Date));
			date = moment(new Date(Date.parse(props.selectedItem.Date))).format("DD.MM.YYYY");
			time = moment(new Date(Date.parse(props.selectedItem.Date))).format("HH:mm");
			orderno = props.selectedItem.Orderno;
			index_first = (value_1 - 50) / 5;
			index_second = (value_2 - 50) / 5;
			index_third = (value_3 - 50) / 5;
			// 8.2.2019
			blowType = props.selectedItem.BlowType;
			measureType = props.selectedItem.MeasureType;
			notes = props.selectedItem.Notes;

			new_measurement = false;
			selectedItem = props.selectedItem;
		}

		this.state = {
			firstPickerVisible: false,
			selectedIndexFirst: index_first,
			selectedItemFirst: value_1,

			secondPickerVisible: false,
			selectedIndexSecond: index_second,
			selectedItemSecond: value_2,

			thirdPickerVisible: false,
			selectedIndexThird: index_third,
			selectedItemThird: value_3,

			valueItems: [],

			date: date,
			orderno: orderno,

			// 8.2.2019
			blowType: blowType,
			measurementType: measureType,
			notes: notes,

			// 26.6.2019
			values_not_valid: false,

			new_measurement: new_measurement,
			selectedItem: selectedItem,
			time: time,
			isChanged: false,

			// AA-107
			pefValueDialogVisible : false,
			currentDialogValue : null,
			currentItemNo : -1
		};

		// 8.2.2019
		//moment.locale('fi')
	}

	componentDidMount() {

		let items = [];
		// Generate pef values
		//items.push('No value');
		for (let i = 50; i <= 700; i += 5) items.push(i);
		this.setState({ valueItems: items });
	}

	hideDialog(isSaved) {
		console.log("dialog.hideDialog ...");
		if (this.state.isChanged && !isSaved) {
			Alert.alert(
				I18n.t("pef_measeurement_confirm_close_title"),
				I18n.t("pef_measeurement_confirm_close_text"),
				[
					{ text: I18n.t("pef_measeurement_confirm_close_ok_text"), onPress: () => this.props.closeDialog(isSaved) },
					{ text: I18n.t("pef_measeurement_confirm_close_cancel_text"), onPress: () => shouldDelete = false, style: 'cancel' }
				],
				{ cancelable: false }
			);
		}
		else
			this.props.closeDialog(isSaved);
	}

	deleteMeasurement() {
		Alert.alert(
			I18n.t("pef_measeurement_confirm_delete_title"),
			I18n.t("pef_measeurement_confirm_delete_text"),
			[
				{ text: I18n.t("pef_measeurement_confirm_delete_ok_text"), onPress: () => this.props.deleteMeasurement(this.state.selectedItem) },
				{ text: I18n.t("pef_measeurement_confirm_delete_cancel_text"), onPress: () => shouldDelete = false, style: 'cancel' }
			],
			{ cancelable: false }
		);

	}

	onPickerSelectFirst(event) {
		let index = event.position;
		let value = this.state.valueItems[index];

		// AA-54 Close automatically the picker if value is selected.
		// But do not close picker when it was just opened
		let currentValue = this.state.selectedItemFirst;
		var pickerVisible = true;
		if (currentValue != value && currentValue != I18n.t("pef_measurement_choose_1")) pickerVisible = false;
		pickerVisible = true;

		this.setState((prevState) => ({
			selectedIndexFirst: index,
			selectedItemFirst: value,
			firstPickerVisible: pickerVisible,
			isChanged: true
		}));
	}

	onToggleFirstPicker() {
		// 10.1.2019 User can't select the default value, he must change value first and reselect it again
		var currentValue = this.state.selectedItemFirst;
		if (this.state.firstPickerVisible) {
			var index = this.state.selectedIndexFirst;
			currentValue = this.state.valueItems[index];
		}

		this.setState((prevState) => ({
			firstPickerVisible: !prevState.firstPickerVisible,
			secondPickerVisible: false,
			thirdPickerVisible: false,
			// 10.1.2019
			selectedItemFirst: currentValue
		}));
	}

	onPickerSelectSecond(index, value) {
		if ( index == null || value == null )
			this.setState((prevState) => ({ pefValueDialogVisible: false }));
		else
			this.setState((prevState) => ({ selectedIndexSecond: index, selectedItemSecond: value, pefValueDialogVisible: false, isChanged: true }));
	}
	
	onToggleSecondPicker() {
		// 10.1.2019 User can't select the default value, he must change value first and reselect it again
		var currentValue = this.state.selectedItemSecond;
		if (this.state.secondPickerVisible) {
			var index = this.state.selectedIndexSecond;
			currentValue = this.state.valueItems[index];
		}

		this.setState((prevState) => ({
			secondPickerVisible: !prevState.secondPickerVisible,
			firstPickerVisible: false,
			thirdPickerVisible: false,
			// 10.1.2019
			selectedItemSecond: currentValue
		}));
	}

	onPickerSelectThird(event) {
		let index = event.position;
		let value = this.state.valueItems[index];
		// AA-54 Close automatically the picker if value is selected.
		// But do not close picker when it was just opened
		let currentValue = this.state.selectedItemThird;
		var pickerVisible = true;
		if (currentValue != value && currentValue != I18n.t("pef_measurement_choose_1")) pickerVisible = false;
		pickerVisible = true;

		this.setState((prevState) => ({ selectedIndexThird: index, selectedItemThird: value, thirdPickerVisible: pickerVisible, isChanged: true }));
	}

	onToggleThirdPicker() {
		// 10.1.2019 User can't select the default value, he must change value first and reselect it again
		var currentValue = this.state.selectedItemThird;
		if (this.state.thirdPickerVisible) {
			var index = this.state.selectedIndexThird;
			currentValue = this.state.valueItems[index];
		}

		this.setState((prevState) => ({
			thirdPickerVisible: !prevState.thirdPickerVisible,
			secondPickerVisible: false,
			firstPickerVisible: false,
			// 10.1.2019
			selectedItemThird: currentValue
		}));
	}

	validateValues(value_1, value_2, value_3) {
		var shouldAbort = false;
		if (this.state.blowType == null || (this.state.blowType == 1 && this.state.measurementType == null)) {
			shouldAbort = true;

			Alert.alert(
				I18n.t("pef_measurement_data_missing_title"),
				I18n.t("pef_measurement_data_missing_text"),
				[
					{ text: I18n.t("pef_measurement_ok_button_text"), onPress: () => shouldAbort = true }
				],
				{ cancelable: false }
			);
		}
		else {
			// Check that pef measurement values are valid: difference between two best values should be less than 20 litres.
			let values = [value_1, value_2, value_3];
			let v = values.sort((a, b) => b - a);
			if (Math.abs(v[0] - v[1]) > 20) {
				shouldAbort = true;
				this.setState({ values_not_valid: true });
			}
			else {
				this.setState({ values_not_valid: false });
			}
		}

		return shouldAbort;
	}

	saveValues() {
		var value_1 = this.state.selectedItemFirst == I18n.t("pef_measurement_choose_1") ? null : this.state.selectedItemFirst;
		var value_2 = this.state.selectedItemSecond == I18n.t("pef_measurement_choose_2") ? null : this.state.selectedItemSecond;
		var value_3 = this.state.selectedItemThird == I18n.t("pef_measurement_choose_3") ? null : this.state.selectedItemThird;

		let shouldAbort = this.validateValues(value_1, value_2, value_3);
		if (shouldAbort) return;

		console.log("saveValues : " + this.state.date);
		// Convert date to ISO8601 format, this is the format used to save values
		// Note! Date and time are stored separately -> merge them into one variable!
		var d = moment(this.state.date + this.state.time, "DD.MM.YYYY HH:mm").format();

		var data = {
			Title: I18n.t("pef_measurement_measure_description"),
			Value1: value_1,
			Value2: value_2,
			Value3: value_3,
			Date: d,
			Comment: "Test",
			Orderno: this.state.orderno.toString(),    // EPOC time is used as key
			// 8.2.2019
			BlowType: this.state.blowType,
			MeasureType: this.state.measurementType,
			Notes: this.state.notes,
			Date_title: this.getMonthName(moment(d).format("M")) + "\n" + moment(d).format("DD"),
			// AA-99 19.8.2019
			UTCDate: moment(d).utc().format(),
			LocalDate: moment(d).local().format(),
		};

		this.props.saveValues(data);
		// Close the dialog
		this.hideDialog(true);
	}

	// Moment uses e.g. joulu as short name for month but we need only 3 character version ...
	getMonthName(month) {
		var x = month;

		switch (month) {
			case "1": return "Tam";
			case "2": return "Hel";
			case "3": return "Maa";
			case "4": return "Huh";
			case "5": return "Tou";
			case "6": return "Kes";
			case "7": return "Hei";
			case "8": return "Elo";
			case "9": return "Syy";
			case "10": return "Lok";
			case "11": return "Mar";
			case "12": return "Jou";
			default: return "???";
		}
	}

	setDate(date) {
		this.setState({ date: date, isChanged: true });
	}

	morgningBlowPressed() {
		this.setState({ blowType: 1, isChanged: true });
	}

	symptomsBlowPresses() {
		this.setState({ blowType: 2, isChanged: true });
	}

	beforeMedicePressed() {
		this.setState({ measurementType: 1, isChanged: true });
	}

	afterMedicinePressed() {
		this.setState({ measurementType: 2, isChanged: true });
	}

	getDateStr(d) {
		console.log("getDateStr:", d)
		let c_d = this.state.date;
		return moment(d, "DD.MM.YYYY").format("DD.MM.YYYY");
	}

	getTimeStr(d) {
		console.log("getTimeStr:", d)
		let c_d = this.state.date;
		return moment(d).format("HH:mm");
	}

	showPefValueDialog	(item_no)
	{
		let v = null, title=""; 
		if ( item_no == 1 ) {
			v = this.state.selectedItemFirst; 
			title=I18n.t('pef_measurement_value_1_caption')
		}
		else if ( item_no == 2 ) 
		{ 
			v = this.state.selectedItemSecond; 
			title=I18n.t('pef_measurement_value_2_caption')
		}
		else { 
			v = this.state.selectedItemThird;
			title=I18n.t('pef_measurement_value_3_caption')
		}

		this.setState({pefValueDialogVisible : true, currentDialogValue: v, dialogTitle: title, currentItemNo : item_no});
	}

	onPickerItemSelected(index, value)
	{
		if ( index == null || value == null )
			this.setState((prevState) => ({ pefValueDialogVisible: false }));
		else
		{
			if ( this.state.currentItemNo == 1 )
				this.setState((prevState) => ({ selectedIndexFirst: index, selectedItemFirst: value, pefValueDialogVisible: false, isChanged: true }));
			else if ( this.state.currentItemNo == 2 )
				this.setState((prevState) => ({ selectedIndexSecond: index, selectedItemSecond: value, pefValueDialogVisible: false, isChanged: true }));
			else
				this.setState((prevState) => ({ selectedIndexThird: index, selectedItemThird: value, pefValueDialogVisible: false, isChanged: true }));
		}
	}

	hidePefValueDialog()
	{
		console.log("hidePefValueDialog ...")
		this.setState({pefValueDialogVisible : false});		
	}

	render() {

		// Variables for blowType
		let m_color = 'white';
		let m_text_color = 'black'
		let s_color = 'white'
		let s_text_color = 'black'
		let m_selected = false
		let s_selected = false
		let m_border_color = 'rgba(0,0,0, 0.12)';
		let s_border_color = 'rgba(0,0,0, 0.12)';

		if (this.state.blowType == 1) {
			// Morning/evening blow selected
			m_color = 'rgba(0,151,167, 0.12)' //'#0097a7'
			m_text_color = "#00838f";
			m_selected = true;
			m_border_color = "#00838f";
		}
		else if (this.state.blowType == 2) {
			// Symptoms blow selected
			s_color = 'rgba(0,151,167, 0.12)' //'#0097a7'
			s_text_color = "#00838f";
			s_selected = true;
			s_border_color = "#00838f";
		}

		// Variables for measurementType
		let b_color = 'white'
		let b_text_color = 'black'
		let a_color = 'white'
		let a_text_color = 'black'
		let b_selected = false
		let a_selected = false
		let m_disabled = false
		let a_border_color = '#0000001E';
		let b_border_color = 'rgba(0,0,0, 0.12)';

		console.log("blowType:" + this.state.blowType);

		if (this.state.blowType == null) {
			m_disabled = true;
			//a_text_color = 'rgba(0,0,0, 0.38)';
			a_text_color = "#00000061"; 
			b_text_color = 'rgba(0,0,0, 0.38)';
		}

		console.log("m_disabled:" + m_disabled);

		if (this.state.measurementType == 1) {
			// Before medicine selected
			b_color = 'rgba(0,151,167, 0.12)'; //'#0097a7'
			b_text_color = "#00838f";
			b_selected = true;
			b_border_color = "#00838f";
		}
		else if (this.state.measurementType == 2) {
			// After medicine selected
			a_color = 'rgba(0,151,167, 0.12)'; //'#0097a7'
			a_text_color = "#00838f";
			a_selected = true;
			a_border_color = "#00838f";	
		}

		let save_button_color = 'rgba(0,0,0, 0.12)';
		let save_button_text_color = 'rgba(61,0,0, 0.12)'
		let save_button_disabled = true;
		let note_disabled = true;
		let wheel_picker_disabled = true;

		if (this.state.isChanged) {
			save_button_color = "#00838f";
			save_button_text_color = "#ffffff";
			save_button_disabled = false;
		}

		if (this.state.blowType != null && this.state.measurementType != null) {
			note_disabled = false;
			wheel_picker_disabled = false;
		}
		else {
			save_button_color = 'rgba(0,0,0, 0.12)';
			save_button_text_color = 'rgba(61,0,0, 0.12)'
			save_button_disabled = true;
		}


		let rightComponent = { icon: "delete",  underlayColor:'#00838f', color: "#ffffff", onPress: () => this.deleteMeasurement() };
		if (this.state.new_measurement)
			rightComponent = {};

		return (
			// Remember to assign flex to DialogContent!!!
			// AA-54 Changed layout so that mid number is centered and picker should open/close by tapping.
			// Changed also wheelpicker component to a new one.
			// AA-64 Layout changes applies also to Save-button
			<View style={{ borderColor: "blue", borderWidth: 0, flex: 1 }}>
				<Header
					placement="left"
					backgroundColor={"#00838f"}
					leftComponent={{ icon: "close", underlayColor:'#00838f', borderRadius:10,  color: "#ffffff", onPress: () => this.hideDialog(false) }}
					centerComponent={{ text: I18n.t('pef_measurement_measure_description'), style: { color: "#ffffff", fontSize: 20, letterSpacing: 0.0 } }}
					rightComponent={rightComponent}
					style={{ flex: 1, height: 56 }}
				/>

				<ScrollView keyboardShouldPersistTaps={"always"}>
					<KeyboardAvoidingView behavior="position">

						<View style={{ borderColor: "red", borderWidth: 0, flex: 1, paddingLeft: 24, paddingRight: 24 }}>
							{this.state.new_measurement ? null :
								<View>
									<View style={{ marginTop: 32, flexDirection: "row", }}>
										<TextInput
											mode="outlined"
											editable={false}
											label={I18n.t('pef_measurement_date_choose_text')}
											//style={{ height: 76 }}
											style={{ height: 56, flex: 1, color: "rgba(0,0,0,0.87)", fontSize: 16, fontFamily: theme.fonts.regular, letterSpacing: 0.15, lineHeight: 24 }}
											onChangeText={text => this.setState({ height: text })}
											value={"33"}
											render={props =>
												<View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}>
													<DatePicker
														//style={{ flex: 1 }}
														style={{ marginTop: 10, marginLeft: 15 }}
														date={this.state.date}
														mode="date"
														locale={"fi"}
														showIcon={false}
														placeholder={I18n.t("pef_measurement_date_choose_text")}
														format="DD.MM.YYYY"
														getDateStr={date => (moment(date).format("DD.MM.YYYY"))}
														//getDateStr={this.getDateStr}
														//minDate="2000-01-01"
														//maxDate="2022-12-31"
														confirmBtnText={I18n.t("pef_measurement_date_confirm_text")}
														cancelBtnText={I18n.t("pef_measurement_date_cancel_text")}
														customStyles={{
															dateText: {
																textAlign: 'left', marginLeft: 0
															},
															dateInput: {
																//borderRadius: 4, 
																borderWidth: 0, marginTop: 10, alignItems: 'flex-start'
															}
														}}
														//onDateChange={(date) => {this.setState({date: date})}}
														onDateChange={this.setDate}
													/>
												</View>
											}
										/>
										<TextInput
											mode="outlined"
											editable={false}
											label={I18n.t('pef_measurement_time_choose_text')}
											//style={{ height: 76 }}
											style={{ marginLeft: 12, height: 56, flex: 1, color: "rgba(0,0,0,0.87)", fontSize: 16, fontFamily: theme.fonts.regular, letterSpacing: 0.15, lineHeight: 24 }}
											onChangeText={text => this.setState({ height: text })}
											value={"33"}
											render={props =>
												<View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}>
													<DatePicker
														//style={{ width: 0.8 * width }}
														style={{ marginTop: 10, marginLeft: 15 }}
														date={this.state.time}
														mode="time"
														showIcon={false}
														placeholder={I18n.t("pef_measurement_date_choose_text")}
														format="HH:mm"
														//getDateStr={date => (moment(date).format("HH:mm"))}
														getDateStr={this.getTimeStr}
														//minDate="2019-01-01"
														//maxDate="2022-12-31"
														confirmBtnText={I18n.t("pef_measurement_date_confirm_text")}
														cancelBtnText={I18n.t("pef_measurement_date_cancel_text")}
														customStyles={{
															dateText: {
																textAlign: 'left', marginLeft: 0
															},
															dateInput: {
																//borderRadius: 4, 
																borderWidth: 0, marginTop: 10, alignItems: 'flex-start'
															}
														}}
														onDateChange={(date) => { this.setState({ time: date, isChanged: true }) }}
													//onDateChange={(date) => {this.setState({date: date})}}
													/>
												</View>
											}
										/>
									</View>
									<View style={{ marginTop: 24, borderBottomColor: 'black', borderBottomWidth: 0.5, }} />
								</View>
							}

							<Text style={styles.titleText}>{I18n.t("pef_measurement_blowtype")}</Text>
							<View style={{ marginTop: 12, borderColor: "red", borderWidth: 0, justifyContent: "space-around", flexDirection: "row", }}>
								<Button mode="outlined"
									style={[styles.centerButton, { padding: 0, backgroundColor: m_color, borderColor: m_border_color, borderWidth: 1.0 }]} onPress={this.morgningBlowPressed}>
									<Text style={{ color: m_text_color, fontSize: 14, lineHeight: 20, letterSpacing: 0.02, }}>
										{I18n.t("pef_measurement_morning_blow")}
									</Text>
								</Button>
								<Button mode="outlined"
									style={[styles.centerButton, { marginLeft: 12, backgroundColor: s_color, borderColor: s_border_color, borderWidth: 1.0 }]} onPress={this.symptomsBlowPresses}>
									<Text style={{ color: s_text_color, fontSize: 14, lineHeight: 20, letterSpacing: 0.02 }}>
										{I18n.t("pef_measurement_symptom_blow")}
									</Text>
								</Button>
							</View>

							<View>
								<Text style={m_disabled ? styles.titleTextDisabled : styles.titleText}>{I18n.t("pef_measurement_measurementtype")}</Text>
								<View style={{ marginTop: 12, justifyContent: "space-around", flexDirection: "row", }}>
									<Button
										mode="outlined"
										disabled={m_disabled}
										onPress={this.beforeMedicePressed}
										style={[styles.centerButton, { backgroundColor: b_color, borderColor: b_border_color, borderWidth: 1.0 }]}>
										<Text style={{ color: b_text_color, fontSize: 14, lineHeight: 20, letterSpacing: 0.02 }}>
											{I18n.t("pef_measurement_before_medicine")}
										</Text>
									</Button>
									<Button mode="outlined"
										disabled={m_disabled}
										onPress={this.afterMedicinePressed}
										style={[styles.centerButton, { marginLeft: 12, backgroundColor: a_color, borderColor: a_border_color, borderWidth: 1.0 }]}>
										<Text style={{ color: a_text_color, fontSize: 14, lineHeight: 20, letterSpacing: 0.02 }}>
											{I18n.t("pef_measurement_after_medicine")}</Text>
									</Button>
								</View>
							</View>

							<View style={{ marginTop: 24, borderBottomColor: 'black', borderBottomWidth: 0.5, }} />

							<View>
								<Text style={wheel_picker_disabled ? styles.titleTextDisabled : styles.titleText}>{I18n.t("pef_measurement_pef_measures_title")}</Text>
						<Text style={wheel_picker_disabled ? styles.helpTextDisabled : styles.helpText}>{I18n.t("pef_measurement_pef_measures_help_text")}</Text>
							</View>

							<View pointerEvents={wheel_picker_disabled ? 'none' : 'auto'} style={[styles.valueRow, { marginTop: 24, borderColor: "blue", borderWidth: 0 }]}>
									<TextInput
											disabled={note_disabled}
											mode="outlined"
											label="1. arvo"
											value={"39"}
											style={{ width:96, height:56, fontSize: 16, fontFamily: 'sans-serif', letterSpacing: 0.15, lineHeight: 24 }}
											//onChangeText={(text) => this.setState({ isChanged: true })}
											render={props =>
												<TouchableOpacity onPress={() => this.showPefValueDialog(1)}>
												{
													<Text style={{borderColor:"red", borderWidth:0, marginTop: 20, marginLeft: 28 }}>{this.state.selectedItemFirst}</Text>													
												}												
												</TouchableOpacity>	
											}
											/>
									<TextInput
											disabled={note_disabled}
											mode="outlined"
											label="2. arvo"
											//editable={this.state.pefValueDialogVisible}
											value={" "}
											style={{ width:96, height:56, fontSize: 16, fontFamily: 'sans-serif', letterSpacing: 0.15, lineHeight: 24 }}
											onChangeText={(text) => this.setState({selectedItemSecond: text, isChanged: true })}
											render={props =>
												<TouchableOpacity onPress={() => this.showPefValueDialog(2)}>
												{
													<Text style={{borderColor:"red", borderWidth:0, marginTop: 20, marginLeft: 28 }}>{this.state.selectedItemSecond}</Text>													
												}												
												</TouchableOpacity>	
											}
											/>

								<TextInput
										disabled={note_disabled}
										mode="outlined"
										//editable="false"
										label="3. arvo"
										value={this.state.selectedItemThird}
										style={{color: "rgba(0,0,0,0.87)", width:96, height:56, fontSize: 16, fontFamily: 'sans-serif', letterSpacing: 0.15, lineHeight: 24 }}
										onChangeText={text => this.setState({ height: text })}
										//onChangeText={(text) => this.setState({selectedItemThird : text,  isChanged: true })}
										render={props =>
											<TouchableOpacity onPress={() => this.showPefValueDialog(3)}>
											{
												<Text style={{borderColor:"red", borderWidth:0, marginTop: 20, marginLeft: 28 }}>{this.state.selectedItemThird}</Text>													
											}												
											</TouchableOpacity>	
										}
									 />

							</View>

							{this.state.values_not_valid ?
								<View style={{ marginTop: 24, flexDirection: 'row', justifyContent: 'center' }}>
									<Text
										style={{ fontSize: 12, fontFamily: theme.fonts.regular, lineHeight: 16, letterSpacing: 0.4, }}>
										{I18n.t('pef_measurement_values_invalid')}
									</Text>
								</View>
								: null
							}

							<View style={{ marginTop: 32 }}>
								<TextInput
									disabled={note_disabled}
									mode="outlined"
									label={I18n.t("pef_measurement_note_label")}
									style={{ fontSize: 16, fontFamily: 'sans-serif', letterSpacing: 0.15, lineHeight: 24 }}
									onChangeText={(text) => this.setState({ notes: text, isChanged: true })}
									value={this.state.notes} />
							</View>

							<View style={{ marginTop: 32 }}>
								<Button
									mode="outlined"
									disabled={save_button_disabled}
									onPress={this.saveValues}
									style={{ backgroundColor: save_button_color, width: "100%", height: 36 }}
								>
									<Text style={{ color: save_button_text_color, fontSize: 14, lineHeight: 16, letterSpacing: 1.25, fontFamily: "sans-serif-medium" }}>
										{I18n.t("pef_measurement_save")}
									</Text>
								</Button>
							</View>

							{ this.state.pefValueDialogVisible ? 
								<PefValueDialog pefValueDialogVisible={true} value={this.state.currentDialogValue} hideDialog={this.onPickerItemSelected} dialogTitle={this.state.dialogTitle} /> :
								null
							}
						</View>
					</KeyboardAvoidingView>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	helpText: {
		fontSize: 14,
		lineHeight: 20,
		letterSpacing: 0.25,
		marginTop: 12,
		color: '#00000099',
		fontFamily: "sans-serif",
	},
	helpTextDisabled: {
		fontSize: 14,
		lineHeight: 20,
		letterSpacing: 0.25,
		marginTop: 12,
		color: '#00000051',
		fontFamily: "sans-serif",
	},

	titleText: {
		fontSize: 14,
		lineHeight: 20,
		letterSpacing: 0.1,
		marginTop: 24,
		color: "#00838f",
		fontFamily: "sans-serif-medium",
	},
	titleTextDisabled: {
		fontSize: 14,
		lineHeight: 20,
		letterSpacing: 0.1,
		marginTop: 24,
		//color: "grey",
		color: 'rgba(0,0,0, 0.38)',
		fontFamily: "sans-serif-medium",
	},

	valueRow: {

		justifyContent: "space-between",
		flexDirection: "row",
		marginTop: 0,
		//borderColor:'red', borderWidth:2,
		//height:170
	},
	centerItems: {
		flexDirection: "column",
		alignItems: "center"
	},

	centerButton: {
		//alignSelf: "center",
		flex: 1,
		//height: 32,
		borderRadius: 4,
		//backgroundColor: '#29cc96'
		//		marginTop: 30
	},
	valueCaption: {
		fontSize: 20,
		height: 30,
		//fontWeight: 'bold',
		marginBottom: 0,
		textAlign: "center",
	},
	selectedValue: {
		borderColor: "green",
		borderWidth: 1,
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
		//borderRadius : 10,
	},

	airQuality: {
		alignSelf: "center",
		marginTop: 50,
	},
});

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

export function PefMeasureDialogContent(props) {
	return (
		<PaperProvider theme={theme}>
			<PefMeasureDialogContent_raw {...props} />
		</PaperProvider>
	);
}