import React from 'react';
import { Modal, Text, StyleSheet, View, AsyncStorage, FlatList, SectionList, TouchableHighlight, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Form, Toast, Root } from 'native-base';
import I18n from './i18n';
import { List, ListItem, Header, Avatar } from "react-native-elements";
import Dialog, { DialogTitle, DialogContent, DialogButton, SlideAnimation } from 'react-native-popup-dialog';
import { PefMeasureDialog } from './PefMeasureDialog';
import moment from 'moment';
// 8.2.2019
// 23.8.2019 AA-99 Package not needed anymore
//import { LineChart, Path, Grid, BarChart, YAxis, XAxis } from 'react-native-svg-charts'
const { width, height } = Dimensions.get('window');
import ActionButton from 'react-native-action-button';
// 23.8.2019 AA-99 Package not needed anymore
//import * as scale from 'd3-scale'
//import BackgroundTimer  from "react-native-background-timer";
// 29.5.2019
//import Icon from 'react-native-vector-icons/Ionicons';
import { Icon } from 'native-base';
import DialogInput from 'react-native-dialog-input';
// 26.6.2019
// 23.8.2019 AA-99 Package not needed anymore
//import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
// AA-99 19.8.2019
import StorageHelper from './StorageHelpers';
import { DefaultTheme, Provider as PaperProvider, Snackbar } from 'react-native-paper';
//import Snackbar from 'react-native-snackbar';

class PefMeasureScreen_raw extends React.Component {
    static navigationOptions = () => {
        return {
            title: I18n.t('tab_title_pef_measure'),
            // 23.8.2019 AA-99 tab bar icon logic is moved to here from createBottomTabNavigator
            tabBarIcon: ({ tintColor }) =>
                <Image
                    source={require('./assets/teppo_icons/drawable-hdpi/ic_pef.png')}
                    resizeMode={'contain'}
                    style={{ height: 25, width: 25, tintColor: tintColor }}
                />
        }
    };

    constructor(props) {
        super(props);

        this.newPefMeasurement = this.newPefMeasurement.bind(this);
        this.hideDialog = this.hideDialog.bind(this);
        this.saveValues = this.saveValues.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.deleteMeasurement = this.deleteMeasurement.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.sendMeasurement = this.sendMeasurement.bind(this);
        this.showInputDialog = this.showInputDialog.bind(this);

        this.state = {
            pefData: [],
            showPefMeasurementDialog: false,
            selectedItem: null,
            // 29.5.2019
            showInputDialog: false,
            snackbarVisible : false,
            snackbarText : ''
        }
    }

    componentDidMount() {

        AsyncStorage.getItem("pef_measurements").then((value) => {
            if (value != null) {
                var list = JSON.parse(value);
                console.log("pef_measurements read! " + list.length);

                // Generate unique id for each item
                for (var i = 0; i < list.length; i++) {
                    //list[i].Orderno = i + '';
                    //list[i].image = require("./assets/pef_list_avatar.png");
                    //list[i].Pvm_title = moment(list[i].Date).format("MMM") + "\n" + moment(list[i].Date).format("DD");
                }
                this.sortList(list);
                console.log("componentDidMount=" + JSON.stringify(list));
                this.setState({ pefData: list });
            }
        }).done();
    }

    async saveValues(data) {
        console.log("Start saveValues ...");
        var list = this.state.pefData;
        if (data != null) {
            var index = list.findIndex(t => t.Orderno == data.Orderno);
            if (index >= 0) {
                console.log("Update pef measure at index: " + index);
                list[index] = data;
            }
            else {
                console.log("Add new measure!");
                list.push(data);
            }
        }

        for (var i = 0; i < list.length; i++) {
            //list[i].Orderno = i.toString();
        }

        this.sortList(list);
        this.setState((prevState) => ({ pefData: list }));

        var d = JSON.stringify(list);
        console.log("Save to AsyncStorage: " + d);
        await AsyncStorage.setItem('pef_measurements', d);
    }

    newPefMeasurement() {
        console.log("newPefMeasurement pressed ....");
        this.setState({ showPefMeasurementDialog: true, selectedItem: null });
    }

    // Clears user credentials FOR TESTING PURPOSE!!!
    async clearUserCredentials() {
        //await AsyncStorage.setItem('pinCodeUsed', '');
        let keys = ['chat_data', 'messages', 'current_state', 'pinCodeUsed'];
        await AsyncStorage.multiRemove(keys);
        console.log("Keys " + keys.join(',') + ' removed');
    }

    onPress(item) {
        console.log("onPress: " + JSON.stringify(item));
        this.setState({ selectedItem: item, showPefMeasurementDialog: true });
    }

    sortList(list) {
        list.sort(function (a, b) {
            let first = moment(a.Date);
            let second = moment(b.Date);
            //console.log("sort: a=" + first + " ja b=" + second + ". a.Date=" + a.Date + ", b.Date=" + b.Date);
            if (first > second) return -1;
            else return 1;
        });
    }

    removeItem(item) {
        console.log("removeItem : ", item);

        var list = this.state.pefData;

        list = list.filter(t => t !== item);

        this.sortList(list);
        this.setState({ pefData: list });
        this.saveValues(null);
    }

    async sendMeasurement(email_address) {
        this.showInputDialog(false);

        let pefdata = this.state.pefData;
        let user_profile = await AsyncStorage.getItem("user_profile");
        user_profile = JSON.parse(user_profile);
        let user = user_profile == null ? "" : user_profile.Firstname;

        // AA-99 19.8.2019
        let pindata = await StorageHelper.getCurrentConfiguration();

        let data =
        {
            "type": "PEF1",
            "email": email_address == null ? pindata.email_address : email_address,
            "pin" : pindata.full_pincode.toUpperCase(),
            "pindata": {
                "year_of_birth": pindata.year_of_birth,
                "gender": pindata.gender,
                "version": pindata.version,
                "appointment": pindata.appointment,
                "organization": pindata.organization,
                "language": pindata.language
            },
            "pefdata": this.state.pefData
        }

        let url = 'https://s4h.io/pef/pef2email.php';

        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        this.setState({snackbarVisible : true, snackbarText : I18n.t('pef_measurement_report_sent')})
        /*
        Toast.show({
            text: 'Sähköposti lähetetty!',
            type: "success",
            position: 'top',
            duration: 2000,
            textStyle: { fontWeight: 'bold', flexDirection: 'column', alignItems: 'center' },
            style: { width: '100%', marginTop: 30, backgroundColor: '#29cc96' }
        });*/
    }

    showInputDialog(showDialog) {
        this.setState({ showInputDialog: showDialog })
    }

    onLongPress(item) {
        console.log("onLongPress: " + JSON.stringify(item));
        var list = this.state.pefData;

        Alert.alert(
            I18n.t('pef_measeurement_confirm_delete_title'),
            I18n.t('pef_measeurement_confirm_delete_text'),
            [
                { text: I18n.t('pef_measeurement_confirm_delete_ok_text'), onPress: () => this.removeItem(item) },
                { text: I18n.t('pef_measeurement_confirm_delete_cancel_text'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
        )

    }

    deleteMeasurement(item) {
        this.setState({ showPefMeasurementDialog: false });
        this.removeItem(item);
    }

    hideDialog(isSaved) {
        this.setState({ showPefMeasurementDialog: false });
        //this.forceUpdate();
        var d = JSON.stringify(this.state.pefData);
        console.log("in hideDialog: " + d);

        if (isSaved) {
            this.setState({snackbarVisible : true, snackbarText : I18n.t('pef_measurement_data_saved')})
            /*
            Snackbar.show({
                title: I18n.t('pef_measurement_data_saved'),
                duration: Snackbar.LENGTH_SHORT,
            });
            
          Toast.show({
              text: I18n.t('pef_measurement_data_saved'),
              type: "success",
              position: 'top',
              duration: 2000,
              textStyle: { fontWeight: 'bold', flexDirection: 'column', alignItems: 'center' },
              style: { width: '100%', marginTop: 30, backgroundColor: '#29cc96' }
          });*/
        }
    }

    renderItem({ item }) {
        let maxValue = item.Value1;
        if (item.Value2 > maxValue) maxValue = item.Value2;
        if (item.Value3 > maxValue) maxValue = item.Value3;

        let leftItem = <Text
            style={{ paddingLeft: 0, marginLeft: 0, fontSize: 24, color: "#00838f", fontFamily: theme.fonts.regular }}>
            {maxValue}
        </Text>

        let blowtype = I18n.t('pef_measeurement_symptoms_blow_list_text'); //'Oirepuhallus';
        if (item.BlowType == 1) {
            if (moment(item.Date).hour() < 12)
                blowtype = I18n.t('pef_measeurement_morning_blow_list_text');
            else
                blowtype = I18n.t('pef_measeurement_evening_blow_list_text'); // 'Iltapuhallus';
        }

        let icon = null;

        if (item.MeasureType == 2)
            icon = <Image
                source={require('./assets/teppo_icons/drawable-hdpi/pill.png')}
                resizeMode={'contain'}
                style={{ height: 19, width: 19, tintColor: '#008591' }}
            />

        return (
            <TouchableHighlight
                onPress={() => this.onPress(item)}
                //onLongPress={() => this.onLongPress(item)}
                underlayColor={'transparent'}
            >
                <ListItem containerStyle={{ backgroundColor: 'transparent', paddingLeft: 0, marginLeft: 0, paddingRight: 0, marginRight: 0 }}
                    //topDivider
                    leftElement={leftItem}
                    rightIcon={icon}
                    title={
                        <View style={styles.titleView}>
                            <Text style={{ fontSize: 16, lineHeight: 24, letterSpacing: 0.15, fontFamily: theme.fonts.regular }}>{blowtype}</Text>
                        </View>
                    }
                    subtitle={
                        <View style={styles.subtitleView}>
                            <Text style={{ fontSize: 14, lineHeight: 20, letterSpacing: 0.25, color: 'grey', fontFamily: theme.fonts.regular, width: 0.5 * width }}>{item.Notes == '' ? '--' : item.Notes}</Text>
                        </View>
                    }
                />
            </TouchableHighlight>
        );
    }

    groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    render() {
        //console.log("render() ...");

        //const fill = '#29cc96'
        const fill = 'orange'
        const pefData = this.state.pefData;
        const contentInset = { top: 20, bottom: 20, left: 10, right: 10 }
        var data = [10, 20];
        if (pefData != null)
            data = Object.keys(pefData).map(function (index) {
                var maxValue = pefData[index].Value1;
                if (pefData[index].Value2 > maxValue) maxValue = pefData[index].Value2;
                if (pefData[index].Value3 > maxValue) maxValue = pefData[index].Value3;
                return maxValue;
            })

        var chart = <View style={{ height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text>No data</Text>
        </View>;

        var list = "";

        const CUT_OFF = 20
        const Labels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <Text
                    key={index}
                    x={x(index) + (bandwidth / 2)}
                    y={value < CUT_OFF ? y(value) - 10 : y(value) + 15}
                    fontSize={8}
                    fill={value >= CUT_OFF ? 'white' : 'black'}
                    alignmentBaseline={'middle'}
                    textAnchor={'middle'}
                >
                    {value}
                </Text>
            ))
        );

        // Group data based on date
        let measurements = this.state.pefData;
        console.log("data:", measurements);
        // Find first date when measurement started
        let sections = [];
        if (measurements.length > 0) {
            let first_date = measurements.reduce((min, p) => p.Date < min ? p.Date : min, measurements[0].Date);
            console.log("first_date : ", first_date);

            // Assign days from first date to measurements
            measurements.forEach(function (item, index, theArray) {
                let a = moment(item.Date);
                let b = moment(first_date);
                let diff = a.diff(b, 'days');
                console.log("diff:", diff);
                theArray[index].DayNoText = I18n.t('day') + ' ' + (diff + 1);
                let daytext = moment(item.Date).format('DD.MM.YYYY');
                if (moment().isSame(moment(item.Date), 'day'))
                    daytext = I18n.t("today");
                else if (moment().subtract(1, 'days').isSame(moment(item.Date), 'day'))
                    daytext = I18n.t("yesterday");

                theArray[index].DayText = daytext;
            });

            //let groupedByDate = this.groupBy(measurements, t => moment(t.Date).format('DD.MM.YYYY'));
            let groupedByDate = this.groupBy(measurements, t => t.DayText);
            console.log("sections done!");
            console.log("sections:", groupedByDate);
            sections = Array.from(groupedByDate).map(t => { return { data: t[1], title: t[0], secondTitle: t[1][0].DayNoText } })
            console.log("sections:", sections);
        }

        let mail_icon = null;
        
        if ( measurements.length > 5 )
            //mail_icon = <Icon name='mail' style={{color : '#00838f', }} height={200} width={200} onPress={() => { this.showInputDialog() }}/> ;
            mail_icon = <Icon name='mail' style={{color : '#00838f', }} height={200} width={200} onPress={() => { this.sendMeasurement(null) }}/> ;
        
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Root>
                    {
                        data.length == 0 ?
                            <View style={{ flex: 1, marginLeft: 24, marginTop: 72 }}>
                                <View>
                                    <Text style={{fontSize: 24, color: '#00838f', fontFamily: theme.fonts.regular }}>{I18n.t('pef_measurement_pef_results_label')}</Text>                                    
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 14, textAlign: 'center', lineHeight: 20, letterSpacing: 0.25 }}>PEF-seurantasi kirjautuu tänne. </Text>
                                    <Text style={{ fontSize: 14, textAlign: 'center', lineHeight: 20, letterSpacing: 0.25 }}>Aloita kahden viikon seurantasi tekemällä ensimmäinen PEF-mittauksesi.</Text>
                                </View>
                            </View>
                            :
                            <View style={{ flex: 1, marginLeft: 24, marginRight: 24, marginTop: 72 }}>
                                <View style={{ flex: 4 }}>
                                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                        <Text style={{ marginBottom: 24, fontSize: 24, color: '#00838f', fontFamily: theme.fonts.regular }}>{I18n.t('pef_measurement_pef_results_label')}</Text>
                                        {mail_icon}                                
                                    </View>
                                    <SectionList
                                        stickySectionHeadersEnabled={true}
                                        sections={sections}
                                        renderSectionHeader={
                                            ({ section }) => <View style={{
                                                backgroundColor: 'white',
                                                flex: 1, flexDirection: 'row', justifyContent: 'flex-start',
                                                paddingTop: 12, paddingBottom: 12, borderBottomColor: 'rgba(0,0,0,0.12)', borderBottomWidth: 1
                                            }}>
                                                <Text style={{ fontSize: 12, lineHeight: 16, letterSpacing: 0.4, color: "grey", fontFamily: theme.fonts.regular }}>{section.title}</Text>
                                                <Text style={{ paddingLeft: 60, fontSize: 12, lineHeight: 16, letterSpacing: 0.4, color: "grey", fontFamily: theme.fonts.regular }}>{section.secondTitle}</Text>
                                            </View>}
                                        data={this.state.pefData}
                                        extraData={this.state}
                                        //removeClippedSubviews={false}
                                        renderItem={(item) => this.renderItem(item)}
                                        keyExtractor={item => item.Orderno}
                                    />
                                </View>
                            </View>
                    }
                    {/*
                <PefMeasureDialog
                    showDialog={this.state.showPefMeasurementDialog}
                    closeDialog={this.hideDialog}
                    saveValues={this.saveValues}
                    selectedItem={this.state.selectedItem} />
*/}
                    <DialogInput isDialogVisible={this.state.showInputDialog}
                        title={"Syötä lääkärisi sähköpostiosoite"}
                        message={"Sähköpostiosoite johon pef mittaukset lähetetään"}
                        cancelText={"Peruuta"}
                        submitText={"Lähetä"}
                        hintInput={"Sähköposti"}
                        submitInput={(inputText) => { this.sendMeasurement(inputText) }}
                        closeDialog={() => { this.showInputDialog(false) }}>
                    </DialogInput>

                    <Snackbar
                        visible={this.state.snackbarVisible}
                        duration={Snackbar.DURATION_MEDIUM}
                        onDismiss={() => this.setState({ snackbarVisible: false })}>
                        {this.state.snackbarText}
                    </Snackbar>
                    <ActionButton
                        buttonColor="#00838f" onPress={() => { this.newPefMeasurement() }}>
                    </ActionButton>
                </Root>
                <PefMeasureDialog
                    showDialog={this.state.showPefMeasurementDialog}
                    closeDialog={this.hideDialog}
                    saveValues={this.saveValues}
                    selectedItem={this.state.selectedItem}
                    deleteMeasurement={this.deleteMeasurement} />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    valueRow: {
        //justifyContent: 'space-evenly', 
        //alignItems: 'center', 
        //flexDirection: 'row' 
    },
    textStyle: {
        color: '#29cc96',
        fontWeight: 'bold',
    },
    titleView: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 0,
    },
    subtitleView: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5,
        marginRight: 3
    },
    subtitleText: {
        paddingLeft: 10,
        color: 'grey',
        //paddingRight: 25
    },
    subtitleTextValues: {
        paddingLeft: 10,
        //fontWeight: 'bold',
        color: 'grey',
        //paddingRight: 55
    },
    centerItems: {
        flexDirection: 'column',
        alignItems: 'center'
    },

    centerButton: {
        alignSelf: 'center',
        marginTop: 30,
        backgroundColor: '#29cc96'
    },
    container: {
        flex: 1,
        //backgroundColor: '#D6E3E0',
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    textInput: {
        // Setting up Hint Align center.
        textAlign: 'center',
        height: 50,
        width: 70,
        borderWidth: 1,
        //borderColor: '#FF5722',
        //borderRadius: 20 ,
        backgroundColor: "#FFFFFF"
    },
    pefReport: {
        marginTop: 10,
    }
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

export class PefMeasureScreen extends React.Component {
    static navigationOptions = () => {
        return {
            title: I18n.t('tab_title_pef_measure'),
            // 23.8.2019 AA-99 tab bar icon logic is moved to here from createBottomTabNavigator
            tabBarIcon: ({ tintColor }) =>
                <Image
                    source={require('./assets/teppo_icons/drawable-hdpi/ic_pef.png')}
                    resizeMode={'contain'}
                    style={{ height: 25, width: 25, tintColor: tintColor }}
                />
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <PaperProvider theme={theme}>
                <PefMeasureScreen_raw {...this.props} />
            </PaperProvider>
        );
    }
}
