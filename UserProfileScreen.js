import React from 'react';
import { Modal, StyleSheet, View, AsyncStorage, FlatList, TouchableHighlight, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Form, Toast, Root, Input } from 'native-base';
import I18n from './i18n';
import { List, ListItem, Header } from "react-native-elements";
import Dialog, { DialogTitle, DialogContent, DialogButton, SlideAnimation } from 'react-native-popup-dialog';
import { UserDialog } from './UserDialog';
import moment from 'moment';
import StorageHelper from './StorageHelpers';
import { Button, TextInput, Snackbar, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { WheelDialog } from './WheelDialog';

export class UserProfileScreen_raw extends React.Component {

    constructor(props) {
        super(props);

        this.handleUserFormChange = this.handleUserFormChange.bind(this);
        this.dialogButtonPressed = this.dialogButtonPressed.bind(this);
        // 18.2.2019
        this.prepareList = this.prepareList.bind(this);
        this.save = this.save.bind(this);

        this.state = {
            profileData: null,
            showDialog: false,
            firstname: null,
            height: null,
            weight: null,
            age: null,
            // 18.2.2019
            showChildName: false,
            child_firstname: null,
            // 4.4.2019
            reception_date: null,
            gender: null,
            year_of_birth: null,

            isChanged : false,
            snackbarVisible : false,
            wheel_dialog_title : '',
            height_items : [],
            weight_items : [],
            wheel_dialog_items: [],
            wheel_dialog_selected_item : null,
            wheel_dialog_type : null
        }
    }

    async prepareList() {
        let c = await StorageHelper.getCurrentConfiguration();
        var showChildName = c.options != null ? c.options.showChildName : false;
        console.log("showChildName = " + showChildName);

        //var value = await AsyncStorage.getItem("user_profile");
        let value = await StorageHelper.getUserProfile();
        if (value != null) {
            // Add values from configuration (user can not change these)            
            value.Gender = c.gender;
            value.YearOfBirth = c.year_of_birth;            
        }

        this.setState({ firstname : value != null ? value.Firstname: null, 
            child_first_name: value != null ? value.ChildFirstname : null,
            height : value != null ? value.Height : null, 
            weight: value != null ? value.Weight: null,
            showChildName: showChildName, gender: c.gender, year_of_birth: c.year_of_birth });
    }
    async componentDidMount() {

        let items = [];
        for (let i = 70; i <= 210; i++) 
          items.push(i + "cm");

        let w_items = [];
        for (let i = 30; i <= 150; i++) 
            w_items.push(i + "kg");
  
        this.setState({ height_items: items, weight_items:w_items });

        this.props.navigation.addListener('willFocus', (playload) => {
            this.prepareList();
        });
    }

    handleUserFormChange(name, value) {
        console.log("handleUserFormChange, name:" + name + ", value:" + value);
        this.setState(() => ({ [name]: value }));
    }

    dialogButtonPressed(key, value, type) {
        if (key == "buttonSave") {
/*
            let user_profile_data = {
                "Firstname": this.state.firstname,
                "Height": this.state.height,
                "Weight": this.state.weight,
                "Age": this.state.age,
                "ChildFirstname": this.state.child_firstname,
                "YearOfBirth": this.state.year_of_birth,
                "Gender": this.state.gender
            };

            this.saveValues(user_profile_data);
*/            
            this.setState((state) => ({ showDialog: false, isChanged:true, 
                height: type == 'height' ? value : state.height, 
                weight : type == 'weight' ? value : state.weight}));
        }
        else
            // Always close the dialog
            this.setState({ showDialog: false });
    }

    save()
    {
        let user_profile_data = {
            "Firstname": this.state.firstname,
            "Height": this.state.height,
            "Weight": this.state.weight,
            "Age": this.state.age,
            "ChildFirstname": this.state.child_firstname,
            "YearOfBirth": this.state.year_of_birth,
            "Gender": this.state.gender
        };

        this.saveValues(user_profile_data);
        this.setState({isChanged : false, snackbarVisible: true});
    }

    async saveValues(data) {
        console.log("Start saveValues ...");
        var d = JSON.stringify(data);
        console.log("Save to AsyncStorage: " + d);
        //await AsyncStorage.setItem('user_profile', d);
        await StorageHelper.storeUserProfile(data);
    }

    onPress(item) {
        console.log("onPress: " + JSON.stringify(item));
        this.setState({ showDialog: true });
    }

    hideDialog(isSaved) {
        this.setState({ showDialog: false });
        var d = JSON.stringify(this.state.profileData);
        console.log("in hideDialog: " + d);

        if (isSaved) {
            Toast.show({
                text: I18n.t('pef_measurement_data_saved'),
                type: "success",
                position: 'top',
                duration: 2000,
                textStyle: { fontWeight: 'bold', flexDirection: 'column', alignItems: 'center' },
                style: { width: '100%', marginTop: 30, backgroundColor: 'lightgreen' }
            });
        }
    }

    isNullOrEmpty(value)
    {
        return value == null || value == "";
    }

    render() {
        let button_color = 'rgba(0,0,0, 0.12)';
        let button_text_color = 'rgba(0,0,0, 0.38)' //#61000000
        let button_disabled = true;
    
        if ( !this.isNullOrEmpty(this.state.firstname) && 
            !this.isNullOrEmpty(this.state.year_of_birth) && 
            !this.isNullOrEmpty(this.state.weight) && 
            !this.isNullOrEmpty(this.state.height) && this.state.isChanged) {
          button_color = "#00838f";
          button_text_color = "#ffffff";
          button_disabled = false;
        }    

        return (
            <Root>
                <View style={{ backgroundColor: 'white', flex: 1, marginTop: 32, marginLeft: 24, marginRight: 24 }}>
                    <View style={{ marginBottom: 24 }}>
                        <TextInput
                            mode="outlined"
                            label={I18n.t("basic_info_dialog_firstname")}
                            style={{ color: "rgba(0,0,0,0.87)", fontSize: 16, fontFamily: theme.fonts.regular, letterSpacing: 0.15, lineHeight: 24 }}
                            onChangeText={(text) => this.setState({ firstname:text, isChanged:true })}
                            value={this.state.firstname}
                        />
                    </View>
                    <View style={{ marginBottom: 24 }}>
                        <TextInput
                            mode="outlined"
                            label={I18n.t("basic_info_dialog_year_of_birth")}
                            style={{ color: "rgba(0,0,0,0.87)", fontSize: 16, fontFamily: theme.fonts.regular, letterSpacing: 0.15, lineHeight: 24 }}
                            onChangeText={text => this.setState({ year_of_birth:text, isChanged:true })}
                            value={this.state.year_of_birth}
                        />
                    </View>
                    <View style={{ marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextInput
                            mode="outlined"
                            editable={false}
                            label={I18n.t("basic_info_dialog_height")}
                            style={{height:56, marginRight:12, flex:1, color: "rgba(0,0,0,0.87)", fontSize: 16, fontFamily: theme.fonts.regular, letterSpacing: 0.15, lineHeight: 24 }}
                            onChangeText={text => this.setState({ height : text, isChanged:true })}
                            value={this.state.height}
                            render={props => 
                                <View style={{flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
                                <Button style={{marginLeft:0, marginTop:10}} 
                                    onPress={() => this.setState((state) => ({showDialog : true, wheel_dialog_title : I18n.t('basic_info_dialog_height'), 
                                    wheel_dialog_items : this.state.height_items, wheel_dialog_selected_item : state.height_items.indexOf(state.height),
                                    wheel_dialog_type : 'height' }))}>
                                    <Text style={{color: 'rgba(0,0,0,0.87)', fontSize:16, lineHeight:24, letterSpacing: 0.15, fontFamily : 'sans-serif'}}>
                                        {this.state.height}
                                    </Text>
                                </Button>
                                </View>
                            }
                        />
                        <TextInput
                            mode="outlined"
                            //editable={false}
                            label={I18n.t("basic_info_dialog_weight")}
                            style={{flex:1, height:56, color: "rgba(0,0,0,0.87)", fontSize: 16, fontFamily: theme.fonts.regular, letterSpacing: 0.15, lineHeight: 24 }}
                            onChangeText={text => this.setState({ weight : text, isChanged:true })}
                            value={this.state.weight}
                            render={props => 
                                <View style={{flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
                                <Button style={{marginLeft:0, marginTop:10}} 
                                    onPress={() => this.setState((state) => ({showDialog : true, wheel_dialog_title : I18n.t('basic_info_dialog_weight'), 
                                        wheel_dialog_items : state.weight_items, wheel_dialog_selected_item : state.weight_items.indexOf(state.weight),
                                        wheel_dialog_type : 'weight' }))}>
                                    <Text style={{color: 'rgba(0,0,0,0.87)', fontSize:16, lineHeight:24, letterSpacing: 0.15, fontFamily : 'sans-serif'}}>
                                        {this.state.weight}
                                    </Text>
                                </Button>
                                </View>
                            }
                        />

                    </View>

                    <Button mode="outlined" disabled={button_disabled} onPress={this.save}
                        style={{ marginTop: 24, backgroundColor: button_color, width: "100%", height: 36 }}>
                        <Text style={{ color: button_text_color, fontSize: 14, lineHeight: 16, letterSpacing: 1.25, fontFamily: theme.fonts.medium }}>
                            {I18n.t('basic_info_dialog_save')}
                        </Text>
                        </Button>
                    <Snackbar
                        visible={this.state.snackbarVisible}
                        duration={Snackbar.DURATION_MEDIUM}
                        onDismiss={() => this.setState({ snackbarVisible: false })}>
                        {I18n.t('pef_measurement_data_saved')}
                    </Snackbar>
                    
                    <WheelDialog 
                        showDialog={this.state.showDialog}
                        dialogButtonPressed={this.dialogButtonPressed}
                        handleUserFormChange={this.handleUserFormChange}
                        title={this.state.wheel_dialog_title}
                        type={this.state.wheel_dialog_type}
                        items={this.state.wheel_dialog_items}
                        selectedItemIndex={this.state.wheel_dialog_selected_item}
                    />
{/*
                    <UserDialog
                        showDialog={this.state.showDialog}
                        dialogButtonPressed={this.dialogButtonPressed}
                        handleUserFormChange={this.handleUserFormChange}
                        // 18.2.2019
                        showChildName={this.state.showChildName}
                    />
*/}                    
                </View>
            </Root>
        );
    }
}


const styles = StyleSheet.create({
    valueRow: {
        //justifyContent: 'space-evenly', 
        //alignItems: 'center', 
        //flexDirection: 'row' 
    },
    subtitleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingTop: 20,
        paddingBottom: 20
    },
    subtitleText: {
        paddingLeft: 5,
        fontWeight: 'bold',
        fontSize: 18,
        color: 'grey'
    },
    subtitleTextValues: {
        paddingRight: 20,
        //fontWeight: 'bold',
        color: 'grey'
    },
    centerItems: {
        flexDirection: 'column',
        alignItems: 'center'
    },

    centerButton: {
        alignSelf: 'center',
        marginTop: 30
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
    airQuality: {
        alignSelf: 'center',
        marginTop: 50,
    },
    itemRow: {
        flexDirection: 'column',
        //        justifyContent: 'space-between',
        //paddingLeft: 10,
        paddingTop: 2,
        paddingBottom: 2
    },
    titleText: {
        //color : '#00838f',
        fontSize: 18,
        //paddingBottom : 10,
    },
    valueText: {
        fontSize: 18,
        color: 'grey',
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


export class UserProfileScreen extends React.Component {
    static navigationOptions = (navigation) => {
        return {
            title: I18n.t('user_profile_title'),
            headerStyle: {
                backgroundColor: '#00838f',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontFamily: theme.fonts.medium,
                fontSize: 20,
                letterSpacing: 0,
            },
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <PaperProvider theme={theme}>
                <UserProfileScreen_raw {...this.props} />
            </PaperProvider>
        );
    }
}
