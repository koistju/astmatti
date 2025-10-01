import React from 'react';
import { StyleSheet, View, AsyncStorage, Keyboard, Text  } from 'react-native';
import { Icon } from 'native-base';
import I18n from './i18n';
import moment from 'moment';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import NotificationService from './NotificationService';
import { PinCodec, PinCodecError } from './PinCodec';
import StorageHelper from './StorageHelpers'; 
import { TextInput, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { ThemeConsumer } from 'react-native-elements';

// AA-93 20.5.2019 Component which can be used to enter PIN code.
export default class ReceptionTimeComponent extends React.Component {    

    constructor(props)
    {
      super(props);

      this.onFulfill = this.onFulfill.bind(this);
      this.validateCode = this.validateCode.bind(this);
      this.generateTestCode = this.generateTestCode.bind(this);

      this.state={
         code_A : '',
         code_B : '',
         code_C : '',
         code_correct : null,
         configuration : '',
         languages : '',
         organisations : '',
         test_pin : '',                // Only for testing
         shift_time : 0,    // Only for testing
         code : null
      }
    }
  
    pinInput_A = React.createRef();
    pinInput_B = React.createRef();
    pinInput_C = React.createRef();

    
    checkCode = (code) => {
        this.onFulfill(code);
    }

    async componentDidMount() 
    {
        // AA-109 changed new paths
        let config = await fetch('https://s4h.fi/materials/config.json');
        let languages = await fetch('https://s4h.fi/materials/languages.json');
        let c = await config.json();
        let l = await languages.json();
        this.setState({configuration : c, languages : l});

        // ONLY for testing
        let shift_minutes = 11;
        let pin = this.generateTestCode(shift_minutes);
        this.setState({test_pin : pin, shift_time : shift_minutes});
        // ONLY for testing 

        //this.pinInput_A.current.inputRef.current.autoCapitalize = 'characters';
        //this.pinInput_A.current.inputRef.current.setNativeProps({text: ''});
    }

    async validateCode(codec, fullPinCode)
    {
        // Check that information entered matches the data found from configuration. 
        let config = this.state.configuration;
        let languages = this.state.languages;   

        // Find organisation first
        let organisation = config.find(t => t.organisation == codec.organization.toString());
        if ( organisation == null ) return null;//return false;
 
        // Check that Astmatti version exists
        let c = organisation.configuration.find(t => t.version == codec.version.toString());
        if ( c == null ) return null;//return false;
        
        // Check supported languages
        let supported_languages = c.languages.split(",");
        let lang_code = supported_languages.find(t => t == codec.language.toString());
        if ( lang_code == null ) return null;//return false;
        
        // Find correct language abbreviation
        let lang = languages.find(t => t.code == codec.language.toString());
        if ( lang == null ) return null;//return false;

        // AA-109
        // Get organisation short name from config, needed later when fetching material from organisation folder
        let organisations = await fetch('https://s4h.fi/materials/organisations.json');
        let orgs = await organisations.json();
        let org_info = orgs.find(t => t.id == codec.organization.toString());

        // Values found from configuration -> store them
        let current_config = { 
            "year_of_birth" : codec.year_of_birth.toString(),
            "gender" : codec.gender.toString(),
            "version" : codec.version.toString(),
            "appointment" : codec.appointment.toString(),
            "organisation" : codec.organization.toString(),
            "organisation_name" : organisation.organisation_description,
            "language" : codec.language.toString(),
            "language_name" : lang.language,
            "chat_file_name" : c.chat_file_name,
            "options" : c.options,
            "full_pincode" : fullPinCode,
            "email_address" : c.email_address,
            "org_short_name" : org_info.short_name
        }

        // Do not create notification, user must accept new code first!
        //await StorageHelper.storeCurrentConfiguration(current_config);

        return current_config; // return true;
    }

    // Used to generate test code to be used to test app.
    // Test code is generated so that appointment time is in 10min from current time
    generateTestCode(shift_time)
    {
        let codec = new PinCodec();

        codec.year_of_birth = 1980;     // Some random value
        codec.gender = 1;               // Male
        codec.version = 1;              // Youngs
        codec.appointment = moment.utc().add(shift_time, 'm').toDate(); // In 10mins from now
        codec.organization = 11;        // OYS
        codec.language = 1;             // FI
    
        console.log(codec);
        let pin = codec.encode();
        if (pin == null) {
            console.log('Encoding failed : ' + codec.error);
        }
        else {
            console.log('PIN = ' + pin);
        }

        return pin;
    }

    async onFulfill(code_c)
    {
        this.setState({code : code_c});

        // If code length is not correct do not check it at all
        if ( code_c.length < 12 )
        {
            this.setState({code_correct : null});
            if ( this.props.onCodeInCorrect )
                this.props.onCodeInCorrect()
            return;
        }

        // Read the configuration. This is needed to check that pincode entered matches the pincode found from configuration. 
        var config = this.state.configuration;

        //let val = this.state.code_A + this.state.code_B + code_c;
        let val = code_c;
        let codec = new PinCodec();
        
        // Decode entered value
        if ( !codec.decode(val) )
        {
            // Value incorrect
            console.log("INCORRECT pin entered: ", codec.error);
            this.setState({code_correct : false});
            if ( this.props.onCodeInCorrect )
                this.props.onCodeInCorrect()
        }
        else
        {
            // Entered value is in correct format -> check that configuration contain values entered.
            console.log("Correct pin entered: ", codec);
            let result = await this.validateCode(codec, val); 
            //if ( !result ) 
            if ( result == null)
            {
                console.log("CORRECT pin, but values not found from configuration: ", codec.error);
                this.setState({code_correct : false});    
                return;
            }

            //this.setState({code_correct : true});
            let reception_time = moment.utc(codec.appointment);
        
            this.setState({code_correct : true, reception_date : reception_time.toDate()});
              
            // Do not create notification, user must accept new code first!
            //this.notificationService = new NotificationService(null, null, this.props.navigation);
            //this.notificationService.createSchedule(true);      

            if ( this.props.onCodeCorrect ){
                this.props.onCodeCorrect(result)
            }

            Keyboard.dismiss();        
        }
    }

    clearText()
    {
        this.setState({code: ''})
    }

    render() {
        const { code_A, code_B, code_C, reception_date } = this.state;

        let icon = null;
        let status_text = null;
        let status_color = 'black';
        let code_incorrect = false;
        if ( this.state.code_correct != null )
        {
            if ( this.state.code_correct )
            {
                icon = <Icon name='checkmark-circle' style={{color : '#00838f'}} />;
                status_text = I18n.t('pincode_correct');
                status_color = '#00838f'
                code_incorrect = false;
            }
            else 
            { 
                icon = <Icon name='close-circle' style={{color : '#c10015'}}/>;
                status_text = I18n.t('pincode_incorrect');
                status_color = '#c10015';
                code_incorrect = true;
            }
        }

        // NOTE! There is change in source code of SmoothPinCodeInput:
        // autoCapitalize={'characters'}

        return (      
            <View style={{flexDirection : 'column', justifyContent :'center'}}>
{/*
                <View style={{flexDirection : 'row', justifyContent :'center', height : 40, borderColor:'red', borderWidth:0}}>
                    <Text style={{marginRight : 20, paddingTop:4}}>Syötä aikakoodi</Text>
                    <Text style={{marginRight : 20, paddingTop:4, color : status_color}}>{status_text}</Text>
                    {icon}
                </View>
*/}
{
/* Hide from end user
                <View style={{flexDirection : 'row', justifyContent :'center'}}>
                    <Text style={{marginRight : 20, paddingTop:4}}>{this.state.test_pin} ({this.state.shift_time}min)</Text>
                </View>
*/                
}
                <View style={{flexDirection : 'row'}}>
                    <TextInput
                        ref={input => this.textInput = input}
                        error={code_incorrect}
                        mode="outlined"
                        autoCapitalize="characters"
                        maxLength={12}
                        label={I18n.t("pincode_label")}
                        style={{ height: 56, flex:1, fontSize: 16, fontFamily: 'sans-serif', letterSpacing: 0.15, lineHeight:24 }}
                        onChangeText={this.checkCode}
                        value={this.state.code} 
                        />
                    
                </View>
                <Text style={{color:status_color, textAlign:"center"}}>
                    {status_text}
                </Text>
            </View>
        )
  }
}


const styles = StyleSheet.create({
    centerItems: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop : 20, 
    }, 
    inner: {
        padding: 24,
//        flex: 1,
        justifyContent: "flex-end",
    },
    title : {
        color : '#00838f',
        marginBottom : 15,
    },

    text : {
        fontSize : 18,
    },

    subText : {
        color : 'gray'
    },

    centerButton: {
      alignSelf:'center',
      marginTop: 30
    },

    textInput: {
        textAlign: 'center',
        height: 50,
        width: 70,
        borderWidth: 1,
        backgroundColor : "#FFFFFF"
    },
  });
