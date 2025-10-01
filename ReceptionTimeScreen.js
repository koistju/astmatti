import React from 'react';
import {
    StyleSheet, View, AsyncStorage,
    KeyboardAvoidingView, Keyboard
} from 'react-native';
import { Text, Form, Toast, Root, Input, Icon } from 'native-base';
import I18n from './i18n';
import moment from 'moment/min/moment-with-locales';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import NotificationService from './NotificationService';
import ReceptionTimeComponent from './ReceptionTimeComponent';
import StorageHelper from './StorageHelpers';
import { Button, Snackbar, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';


// AA-93 20.5.2019
export class ReceptionTimeScreen_raw extends React.Component {

    constructor(props) {
        super(props);

        this.onCodeCorrect = this.onCodeCorrect.bind(this);
        this.onCodeInCorrect = this.onCodeInCorrect.bind(this);
        this.onComplete = this.onComplete.bind(this);

        this.state = {
            reception_date: null,
            organisation_name: '',
            organisation_phone: '',
            code_correct: false,
            current_config: null,
            snackbarVisible : false,
            code_confirmed : false,
        }
    }

    async componentDidMount() {
        /*
                let config = await StorageHelper.getCurrentConfiguration();
                let r_time = config.appointment;
        
                console.log("configuration read: ", config);
                this.setState({reception_date: r_time, configuration : config});
        */
        this.setInfo();
    }

    async setInfo() {
        let c = await StorageHelper.getCurrentConfiguration();

        // AA-109 Changed url
        let organisations = await fetch('https://s4h.fi/materials/organisations.json');
        let o = await organisations.json();
        let current_organisation = o.find(t => t.id == c.organisation);
        let org_name = '', org_phone = '';
        if (current_organisation != null) {
            org_name = current_organisation.long_name;
            org_phone = current_organisation.tel;
        }

        let r_time = c.appointment;

        console.log("configuration read: ", c);

        this.setState({ organisation_phone: org_phone, organisation_name: org_name, reception_date: r_time, configuration: c });

        console.log("current locale: " + moment.locale());
        moment.locale('fi');
        console.log("current locale after change: " + moment.locale('fi'));

    }

    async onCodeCorrect(current_config) {
        console.log("Correct code entered!");

        this.setState({ code_correct: true, current_config: current_config, code : current_config.full_pincode });
        this.setInfo();
    }

    onCodeInCorrect() {
        this.setState({ code_correct: false });
    }

    async onComplete() {
        console.log('onComplete: ', this.state.current_config);
        this.setState({snackbarVisible: true, code_correct : false});
        await StorageHelper.storeCurrentConfiguration(this.state.current_config);
        this.notificationService = new NotificationService(null, null, this.props.navigation);
        this.notificationService.createSchedule(true);
        this.receptionTimeComponent.clearText();
    }

    render() {
        let save_button_color = 'rgba(0,0,0, 0.12)';
        let save_button_text_color = 'rgba(0,0,0,0.38)'
        let save_button_disabled = true;

        if (this.state.code_correct && !this.state.code_confirmed) {
            save_button_color = "#00838f";
            save_button_text_color = "#ffffff";
            save_button_disabled = false;
        }

        const { reception_date } = this.state;

        let weekday = moment.weekdays(true, moment(new Date(reception_date)).weekday());
        let r_date = weekday + " " + moment(new Date(reception_date)).format("DD.MM.YYYY");
        let r_time = "klo " + moment(new Date(reception_date)).format("HH:mm");
        let date_text = r_date + ", " + r_time;

        return (
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View style={styles.inner}>
                    <View style={{ marginTop: 24 }}>
                        <Text style={{ color: "rgba(0,0,0,0.87)", fontSize: 16, lineHeight: 24, letterSpacing: 0.15, fontFamily: theme.fonts.regular }}>{date_text}</Text>
                        <Text style={{ color: "rgba(0,0,0,0.603)", fontSize: 14, lineHeight: 20, letterSpacing: 0.25, fontFamily: theme.fonts.regular }}>
                            {this.state.organisation_name}
                        </Text>
                        <Text style={{ color: "rgba(0,0,0,0.603)", fontSize: 14, lineHeight: 20, letterSpacing: 0.25, fontFamily: theme.fonts.regular }}>
                            {this.state.organisation_phone}
                        </Text>
                    </View>
                    <View style={{ marginTop: 24 }}>
                        <Text style={{ color: "rgba(0,0,0,0.603)", fontSize: 14, lineHeight: 20, letterSpacing: 0.25, fontFamily: theme.fonts.regular }}>
                            Muuttaaksesi vastaanottoaikaa, ole yhteydessä lääkäriasemaasi. Saat uuden vastaanottoajan aikakoodina, jonka voit syöttää alle
                        </Text>
                    </View>

                    <View style={{ marginTop: 24 }}>
                        <ReceptionTimeComponent 
                            ref = {c =>  this.receptionTimeComponent = c }
                            onCodeCorrect={this.onCodeCorrect} 
                            onCodeInCorrect={this.onCodeInCorrect} navigation={this.props.navigation} />
                    </View>

                    <Button
                        mode="outlined"
                        disabled={save_button_disabled}
                        onPress={this.onComplete}
                        style={{ marginTop: 24, backgroundColor: save_button_color, width: "100%", height: 36 }}>
                        <Text style={{ color: save_button_text_color, fontSize: 14, lineHeight: 16, letterSpacing: 1.25, fontFamily: "sans-serif-medium" }}>
                            {I18n.t("confirm_button")}
                        </Text>
                    </Button>
                    <Snackbar
                        visible={this.state.snackbarVisible}
                        duration={Snackbar.DURATION_MEDIUM}
                        onDismiss={() => this.setState({ snackbarVisible: false })}>
                        {I18n.t('reception_time_changed')}
                    </Snackbar>

                    <View style={{ flex: 1 }} />

                </View>
            </KeyboardAvoidingView>
        )
    }
}


const styles = StyleSheet.create({
    centerItems: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    inner: {
        marginTop: 24,
        marginLeft: 24,
        marginRight: 24,
        //        padding: 24,
        flex: 1,
        justifyContent: "flex-end",
    },
    title: {
        color: '#00838f',
        marginBottom: 15,
    },

    text: {
        fontSize: 16,
    },

    subText: {
        color: 'gray'
    },

    centerButton: {
        alignSelf: 'center',
        marginTop: 30
    },

    textInput: {
        textAlign: 'center',
        height: 50,
        width: 70,
        borderWidth: 1,
        backgroundColor: "#FFFFFF"
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


export class ReceptionTimeScreen extends React.Component {
    static navigationOptions = (navigation) => {
        return {
            title: I18n.t('reception_time_title'),
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
                <ReceptionTimeScreen_raw {...this.props} />
            </PaperProvider>
        );
    }
}

