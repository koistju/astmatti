import React from 'react';
import { Modal, StyleSheet, View, AsyncStorage, SectionList, TouchableHighlight, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Root } from 'native-base';
import I18n from './i18n';
import { List, ListItem, Header } from "react-native-elements";
//import moment from 'moment';
import moment from 'moment/min/moment-with-locales';
import StorageHelper from './StorageHelpers';
import { Button, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';


// AA-92 20.5.2019
class ProfileList_raw extends React.Component {

    constructor(props) {
        super(props);

        this.handleUserFormChange = this.handleUserFormChange.bind(this);
        this.prepareList = this.prepareList.bind(this);
        this.renderItem = this.renderItem.bind(this);

        this.state = {
            profileData: null,
            firstname: null,
            showChildName: false,
            child_firstname: null,
            reception_date: null,
            reception_time: null,
        }
    }



    async prepareList() {
        let name = "", parent_name = "", reception_date = "", reception_time = "";

        //let r_time = await AsyncStorage.getItem("reception_time");
        let c = await StorageHelper.getCurrentConfiguration();
        r_time = new Date(c.appointment);

        console.log("current locale: " + moment.locale());
        moment.locale('fi');
        console.log("current locale after change: " + moment.locale());
        let weekday = moment.weekdays(true, moment(r_time).weekday());

        reception_date = weekday + " " + moment(r_time).format("DD.MM.YYYY");
        reception_time = "klo " + moment(r_time).format("HH:mm");

        /*
        var config = await AsyncStorage.getItem('configuration');
        var pincode = await AsyncStorage.getItem('pinCodeUsed');
        var config_json = JSON.parse(config);
        var c = config_json.find(t => t.pincode == pincode);
        */

        var showChildName = c.options != null ? c.options.showChildName : false;
        console.log("showChildName = " + showChildName);

        let user_profile = await AsyncStorage.getItem("user_profile");

        var list = [];

        if (user_profile != null) {
            let user_profile_data = JSON.parse(user_profile);
            console.log("User Profile read! ", user_profile);
/*
            if (showChildName) {
                parent_name = user_profile_data.Firstname;
                name = user_profile_data.ChildFirstname;
            }
            else {
                parent_name = "";
                name = user_profile_data.Firstname;
            }
*/
            parent_name = user_profile_data.Firstname;
            name = user_profile_data.ChildFirstname;
        }
/*
        list.push({ "Title": "Omat tiedot", "Value": name, "Subvalue": parent_name, "Id": "1" });
        list.push({ "Title": "Vastaanottoaika", "Value": reception_date, "Subvalue": reception_time, "Id": "2" });
        list.push({ "Title": "Valtuudet", "Value": null, "Subvalue": null, "Id": "3" });
*/
        this.setState({ profileData: list, firstname: parent_name, showChildName : showChildName,
                        child_firstname : name, reception_time : reception_time,
                        reception_date : reception_date});
    }

    async componentDidMount() {

        this.props.navigation.addListener('willFocus', (playload) => {
            this.prepareList();
        });
    }

    handleUserFormChange(name, value) {
        console.log("handleUserFormChange, name:" + name + ", value:" + value);
        this.setState(() => ({ [name]: value }));
    }

    onPress(item) {
        console.log("onPress: " + JSON.stringify(item));
        if (item.Id == "1")
            this.props.navigation.navigate('UserProfile');
        else if (item.Id == "2")
            this.props.navigation.navigate('ReceptionTime');
    }

    renderItem({ item }) {
        let icon_name = <Image
            source={require('./assets/teppo_icons/drawable-hdpi/ic_face.png')}
            resizeMode={'contain'}
            style={{height: 20, width: 20, tintColor: '#008591' }}
        />
        if (item.Id == 2)
            icon_name = <Image
                source={require('./assets/teppo_icons/drawable-hdpi/ic_calendar.png')}
                resizeMode={'contain'}
                style={{ height: 20, width: 20, tintColor: '#008591' }}
            />
        else if (item.Id == 3)
            icon_name = <Image
                source={require('./assets/teppo_icons/drawable-hdpi/ic_privacy.png')}
                resizeMode={'contain'}
                style={{ height: 20, width: 20, tintColor: '#008591' }}
            />
        else if (item.Id == 4)
            icon_name = <Image
                source={require('./assets/teppo_icons/drawable-hdpi/ic_doc.png')}
                resizeMode={'contain'}
                style={{ height: 20, width: 20, tintColor: '#008591' }}
            />
        else if (item.Id == 5)
            icon_name = null;


        let subvalue = null;
        if (item.SubValue != null)
            subvalue = <Text style={{ fontSize: 14, lineHeight: 20, letterSpacing: 0.25, color: "rgba(0,0,0,0.6)", fontFamily: theme.fonts.regular }}>{item.SubValue}</Text>;

        return (
            <TouchableHighlight
                onPress={() => this.onPress(item)}
                underlayColor={"white"}>
                <ListItem
                    containerStyle={{ backgroundColor: 'transparent', paddingBottom: 0, paddingTop: 0, paddingLeft: 0, marginLeft: 0, paddingRight: 0, marginRight: 0 }}
                    //leftIcon={icon_name}                    
                    title={
                        <View style={{flexDirection: 'row', marginTop:24, }}>
                            {icon_name}
                            <Text style={{marginLeft:icon_name==null ? 44: 24, fontSize: 16, lineHeight: 24, letterSpacing: 0.15, color: "rgba(0,0,0,0.87)", fontFamily: theme.fonts.regular }}>{item.Value}</Text>
                        </View>
                    }
                    subtitle={
                        <View style={{marginLeft:48}}>
                        {subvalue}
                        </View>
                    }
                />
            </TouchableHighlight>
        )
    }

    render() {
        let sections = [];
        sections.push({ data: [{ Id: 1, Value: this.state.firstname }], title: I18n.t('profile_list_personal_info') });
        sections.push({ data: [{ Id: 2, Value: this.state.reception_date + " " + this.state.reception_time }], title: I18n.t('profile_list_reception_time_title') });
        sections.push({
            data: [{ Id: 3, Value: I18n.t('profile_list_terms_of_use_title') },
            { Id: 4, Value:  I18n.t('profile_list_lisence_title')},
            { Id: 5, Value: I18n.t('profile_list_app_version_title'), SubValue: '0.9' }], title: I18n.t('profile_list_authorization_title')
        });

        return (
            <View style={{ backgroundColor: 'white', flex: 1, marginTop: 0, marginLeft: 24, marginRight: 24 }}>
                <View style={{ marginTop: 48 }}>
                    <Text style={{ color: "#00838f", fontSize: 24, fontFamily: theme.fonts.regular }}>{I18n.t('profile_view_title')}</Text>
                </View>
                <View style={{ marginTop: 24, }}>
                    <SectionList
                        data={this.state.profileData}
                        extraData={this.state}
                        sections={sections}
                        renderSectionHeader={
                            ({ section }) =>
                                <Text style={{ marginTop: 24, fontSize: 14, lineHeight: 24, letterSpacing: 0.1, color: "#00838f", fontFamily: theme.fonts.medium }}>{section.title}</Text>
                        }
                        renderItem={(item) => this.renderItem(item)}
                        keyExtractor={item => item.Id}
                    />
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    itemRow: {
        flexDirection: 'column',
        marginTop: 24,
        //marginLeft: 24,
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


export class ProfileList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <PaperProvider theme={theme}>
                <ProfileList_raw {...this.props} />
            </PaperProvider>
        );
    }
}
