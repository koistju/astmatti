import React from 'react';
import { Platform, StyleSheet, View, AsyncStorage, Alert, WebView, ActivityIndicator, FlatList, 
  TouchableOpacity, TouchableHighlight, Image, ImageBackground, Modal, TextInput, Keyboard, Dimensions } 
from 'react-native';
import { Container, Content, Text, Button, InputGroup, Input, Icon, Form, Item, Label, Grid, Col  } from 'native-base';
import I18n from './i18n';
//import Picker from 'react-native-wheel-picker'
// 23.8.2019 AA-99 Package not needed anymore
//import { systemWeights } from 'react-native-typography';
//var PickerItem = Picker.Item;
// AA-99 26.8.2019 Changed to a new library
//import { WheelPicker } from 'react-native-wheel-picker-android'
import { WheelPicker } from '@delightfulstudio/react-native-wheel-picker-android'
import ViewOverflow from 'react-native-view-overflow';
const { width, height } = Dimensions.get('window');

const mid_part_height = 0.3
;

export class UserForm extends React.Component {

  
  constructor(props)
  {
    super(props);

    this.onToggleAgePicker = this.onToggleAgePicker.bind(this);
    this.onToggleWeightPicker = this.onToggleWeightPicker.bind(this);
    this.onToggleHeightPicker = this.onToggleHeightPicker.bind(this);
    // 15.1.2019 Not in use anymore, instead use validateInputFields
    //this.validate = this.validate.bind(this);
    this.firstNameChanged = this.firstNameChanged.bind(this);
    // 15.1.2019
    this.validateInputFields = this.validateInputFields.bind(this);

    // 18.2.2019
    this.childFirstNameChanged = this.childFirstNameChanged.bind(this);

    this.state = {
      ageItems : [],
      weightItems : [],
      heighItems : [],
      selectedAgeItem : 25,
      selectedWeightItem : 45,
      selectedHeightItem : 115,
      agePickerVisible : false,
      weightPickerVisible : false,
      heightPickerVisible : false,
      firstName: null,
      age : I18n.t('user_form_choose'),
      weight : I18n.t('user_form_choose'),
      height : I18n.t('user_form_choose'),
      ageValid : true,
      heightValid : true,
      weightValid : true,
      nameValid : true,
      // 18.2.2019
      child_firstname: null,
      childNameValid : true
    }
  }

  componentWillMount() {
    let items = [];
    // Generate ages
    for(let i=5; i <= 120; i++) 
    {
      items[i-5] = i + "v"; 
    }    
    this.setState({ageItems: items});

    // and then weights
    items = [];
    for(let i=5; i <= 150; i++) 
    {
      items[i-5] = i + "kg"; 
    }    
    this.setState({weightItems: items});

    // and finally heights
    items = [];
    for(let i=50; i <= 220; i++) 
    {
      items[i-50] = i + "cm"; 
    }    
    this.setState({heightItems: items});
    
  }

  async componentDidMount() {
        
      let value = await AsyncStorage.getItem("user_profile");

      if ( value != null )
      {
          let user_profile_data = JSON.parse(value);
          console.log("User Profile read in UserForm! " + value);

          let heightIndex = this.state.heightItems.findIndex(t => t == user_profile_data.Height); 
          let weightIndex = this.state.weightItems.findIndex(t => t == user_profile_data.Weight); 
          let ageIndex = this.state.ageItems.findIndex(t => t == user_profile_data.Age); 

          // If user does not change values, caller will ever receive values
          // Caller saves the values, that's why (non)edited values must be sent to caller
          this.props.handleUserFormChange("firstname", user_profile_data.Firstname);
          this.props.handleUserFormChange("height", user_profile_data.Height);
          this.props.handleUserFormChange("weight", user_profile_data.Weight);
          this.props.handleUserFormChange("age", user_profile_data.Age);
          // 18.2.2019
          this.props.handleUserFormChange("child_firstname", user_profile_data.ChildFirstname);

          this.setState({
            firstName: user_profile_data.Firstname, 
            height: user_profile_data.Height, 
            weight: user_profile_data.Weight,
            age: user_profile_data.Age,
            selectedHeightItem : heightIndex,
            selectedWeightItem : weightIndex,
            selectedAgeItem : ageIndex,
            ageValid : true,
            heightValid : true,
            weightValid : true,
            nameValid : true,
            // 18.2.2019
            child_firstname : user_profile_data.ChildFirstname,
            child_firstnameValid : true
          });

          this.props.setIsValid(true);
      }
  }


	onPickerAgeSelect (event) {
		// AA-54 Close automatically the picker if value is selected.
		// But do not close picker when it was just opened
    let index = event.position;

    let value = this.state.ageItems[index];
    let currentValue = this.state.age;	
		var pickerVisible = true;
		if ( currentValue != value && currentValue != I18n.t('user_form_choose')) pickerVisible = false;
    pickerVisible = true;

    this.setState({
      selectedAgeItem: index,
      age: this.state.ageItems[index],
      agePickerVisible : pickerVisible
    })
    this.props.handleUserFormChange("age", this.state.ageItems[index])

    this.showErrors();
	}

  onPickerHeightSelect (event) {
		// AA-54 Close automatically the picker if value is selected.
		// But do not close picker when it was just opened
    let index = event.position;
    
    let value = this.state.heightItems[index];
    let currentValue = this.state.height;	
		var pickerVisible = true;
		if ( currentValue != value && currentValue != I18n.t('user_form_choose')) pickerVisible = false;
    pickerVisible = true;

		this.setState({
      selectedHeightItem: index,
      height: this.state.heightItems[index],
      heightPickerVisible : pickerVisible
    })
    this.props.handleUserFormChange("height", this.state.heightItems[index])

    this.showErrors();
	}

  onPickerWeightSelect (event) {
		// AA-54 Close automatically the picker if value is selected.
		// But do not close picker when it was just opened
    let index = event.position;

    let value = this.state.weightItems[index];
    let currentValue = this.state.weight;	
		var pickerVisible = true;
		if ( currentValue != value && currentValue != I18n.t('user_form_choose')) pickerVisible = false;
    pickerVisible = true;

    this.setState({
      selectedWeightItem: index,
      weight: this.state.weightItems[index],
      weightPickerVisible : pickerVisible
    })

    this.props.handleUserFormChange("weight", this.state.weightItems[index])

    this.showErrors();
	}

  onToggleAgePicker()
  {
   	// 10.1.2019 User can't select the default value, he must change value first and reselect it again
		var currentValue = this.state.age;
		if ( this.state.agePickerVisible )
		{
			var index = this.state.selectedAgeItem;
			currentValue =  this.state.ageItems[index];
		} 

    this.showErrors();   
    this.setState((state) => 
      ({agePickerVisible : !state.agePickerVisible, weightPickerVisible : false, heightPickerVisible : false,
      // 10.1.2019 
      age : currentValue,
      ageValid : true
      })
    )
    // 14.1.2019 
    this.props.handleUserFormChange("age", currentValue);

    // 15.1.2019
    // setState has NOT changed the value to state, that's why validate need to be changed to work this way.
    //const isValid = !this.validate();
    const isValid = !this.validateInputFields(this.state.firstName, this.state.height, this.state.weight, currentValue, this.state.child_firstname);
    this.props.setIsValid(isValid);
    Keyboard.dismiss();
  }

  onToggleWeightPicker()
  {
   	// 10.1.2019 User can't select the default value, he must change value first and reselect it again
     var currentValue = this.state.weight;
     if ( this.state.weightPickerVisible )
     {
       var index = this.state.selectedWeightItem;
       currentValue =  this.state.weightItems[index];
     } 
 
    this.showErrors();
    this.setState((state) => 
      ({weightPickerVisible : !state.weightPickerVisible, heightPickerVisible : false, agePickerVisible : false,
        // 10.1.2019 
        weight : currentValue,
        weightValid : true
      })
    )

    // 14.1.2019 
    this.props.handleUserFormChange("weight", currentValue);
    
    // 15.1.2019
    // setState has NOT changed the value to state, that's why validate need to be changed to work this way.
    //const isValid = !this.validate();
    const isValid = !this.validateInputFields(this.state.firstName, this.state.height, currentValue, this.state.age, this.state.child_firstname);
    this.props.setIsValid(isValid);
    Keyboard.dismiss();
  }

  onToggleHeightPicker()
  {
   	// 10.1.2019 User can't select the default value, he must change value first and reselect it again
     var currentValue = this.state.height;
     if ( this.state.heightPickerVisible )
     {
       var index = this.state.selectedHeightItem;
       currentValue =  this.state.heightItems[index];
     } 

    this.showErrors();
    this.setState((state) => 
      ({heightPickerVisible : !state.heightPickerVisible, weightPickerVisible : false, agePickerVisible : false,
        // 10.1.2019 
        height : currentValue,
        heightValid : true
        })
    )

    // 14.1.2019 
    this.props.handleUserFormChange("height", currentValue);

    // 15.1.2019
    // setState has NOT changed the value to state, that's why validate need to be changed to work this way.
    //const isValid = !this.validate();
    const isValid = !this.validateInputFields(this.state.firstName, currentValue, this.state.weight, this.state.age, this.state.child_firstname);
    this.props.setIsValid(isValid);
    Keyboard.dismiss();
  }

  firstNameChanged(txt)
  {
    this.setState({firstName : txt });
    this.props.handleUserFormChange("firstname", txt);
    // 15.1.2019
    // setState has NOT changed the value to state, that's why validate need to be changed to work this way.
    //const isValid = !this.validate();
    const isValid = !this.validateInputFields(txt, this.state.height, this.state.weight, this.state.age, this.state.child_firstname);

    this.props.setIsValid(isValid);
  }

  // 18.2.2019
  childFirstNameChanged(txt)
  {
    this.setState({child_firstname : txt });
    this.props.handleUserFormChange("child_firstname", txt);
    const isValid = !this.validateInputFields(this.state.firstName, this.state.height, this.state.weight, this.state.age, txt);
    this.props.setIsValid(isValid);
  }

  // 15.1.2019
  validateInputFields(firstName, height, weight, age, childFirstName = null)
  {
    let childNameValid = false;
    if ( this.props.showChildName )
      childNameValid = childFirstName == null;

    return age == I18n.t('user_form_choose') || weight == I18n.t('user_form_choose') || height == I18n.t('user_form_choose') || firstName == null || childNameValid;
  }

  /* Not used anymore 15.1.2019
  validate()
  {
      return this.state.age == I18n.t('user_form_choose') || this.state.weight == I18n.t('user_form_choose') || this.state.height == I18n.t('user_form_choose') || this.state.firstName == null;
  }*/

  showErrors()
  {
      if ( this.state.age == I18n.t('user_form_choose') )
        this.setState({ageValid : false});
      else
        this.setState({ageValid : true});

      if ( this.state.weight == I18n.t('user_form_choose') )
        this.setState({weightValid : false});
      else
        this.setState({weightValid : true});

      if ( this.state.height == I18n.t('user_form_choose') )
        this.setState({heightValid : false});
      else
        this.setState({heightValid : true});

      if ( this.state.firstName == null )
        this.setState({nameValid : false});
      else
        this.setState({nameValid : true});

      // 18.2.2019
      if ( this.props.showChildName )
      {
        if ( this.state.childFirstName == null )
          this.setState({childNameValid : false});
        else
          this.setState({childNameValid : true});
      }
  }

  render()
  {
    return(
    // AA-54 Changed layout so that mid number is centered and picker should open/close by tapping.'
    // Added also green checkmarks when values are valid.
    <Form>
        <View style={{marginBottom:10}}>
          <InputGroup>
            <Input  placeholder={this.props.showChildName ? I18n.t('basic_info_dialog_parentfirstname') : I18n.t('basic_info_dialog_firstname')} name="firstname" type="text" 
            onChangeText={(txt) => this.firstNameChanged(txt)} value={this.state.firstName}/>
            {!this.state.nameValid ? <Icon size={40} name='close' style={{color:'red', marginRight:10}}/> : this.state.firstName == null ? null : <Icon size={40} name='checkmark' style={{color:'green', marginRight:10}}/>}
          </InputGroup>
          { 
              this.props.showChildName ? 
              <InputGroup>
                <Input  placeholder={I18n.t('basic_info_dialog_childfirstname')} name="child_firstname" type="text" 
                onChangeText={(txt) => this.childFirstNameChanged(txt)} value={this.state.child_firstname}/>
                {!this.state.childNameValid ? <Icon size={40} name='close' style={{color:'red', marginRight:10}}/> : this.state.child_firstname == null ? null : <Icon size={40} name='checkmark' style={{color:'green', marginRight:10}}/>}
              </InputGroup>
            : null
            }
        </View>

				<View style={[styles.valueRow, {borderColor:"blue", borderWidth:0, height: mid_part_height*height}]}>

          <View style={{flexDirection: "column", flex:1, marginRight:10}}>                        
              { this.state.heightPickerVisible ? 
                <View style={{flex : 1}}>
                  <WheelPicker style={{height: "100%"}}
                    data={this.state.heightItems}
                    isCurved={false}
                    visibleItemCount={5}
                    isCurtain
                    itemSpace={20.0}
                    selectedItemPosition={this.state.selectedHeightItem}            									
                    indicatorColor={"black"}            
                    itemStyle={{color:"green", fontSize:20}}
                    onItemSelected={(event) => this.onPickerHeightSelect(event)}
                  />
                </View> : null	
              }                

              <ViewOverflow style={{position:'absolute', marginTop:0, marginBottom:0, width:'100%', top: this.state.heightPickerVisible ? (mid_part_height*height)/2 - 15 : (mid_part_height*height)/2 - 45}}>    
                <TouchableOpacity onPress={ this.onToggleHeightPicker}>
                  <View pointerEvents='none'>
                    <View style={{flexDirection: 'row', justifyContent:'center', alignItems : 'center'}}>
                      {this.state.heightPickerVisible ? null : <Text style={styles.valueCaption}>{I18n.t("basic_info_dialog_height")}</Text>}
                      {!this.state.heightValid && !this.state.heightPickerVisible ? 
                        <Icon size={20} name='close' style={{color:'red',  fontSize:20, marginLeft:5, marginBottom:2}}/> : 
                        this.state.height != I18n.t('user_form_choose') && !this.state.heightPickerVisible ? <Icon size={20} name='checkmark' style={{color:'green',  fontSize:20, marginLeft:5, marginBottom:2}}/> : null }
                    </View>
                    <Text style={[styles.selectedValue, {height:30}]}>{this.state.heightPickerVisible ? '': this.state.height}</Text>
                  </View>
                </TouchableOpacity>
              </ViewOverflow>						
            </View>        

            <View style={{flexDirection: "column", flex:1, marginRight:10}}>                        
              { this.state.weightPickerVisible ? 
                  <View style={{flex : 1}}>
                  <WheelPicker style={{height: "100%"}}
                    data={this.state.weightItems}
                    isCurved={false}
                    visibleItemCount={5}
                    isCurtain
                    itemSpace={20.0}
                    selectedItemPosition={this.state.selectedWeightItem}            									
                    indicatorColor={"black"}            
                    itemStyle={{color:"green", fontSize:20}}
                    onItemSelected={(event) => this.onPickerWeightSelect(event)}
                  />
                </View> : null	
              }
              <ViewOverflow style={{position:'absolute', marginTop:0, marginBottom:0, width:'100%', top: this.state.weightPickerVisible ? (mid_part_height*height)/2 - 15 : (mid_part_height*height)/2 - 45}}>    
                <TouchableOpacity onPress={ this.onToggleWeightPicker}>
                  <View pointerEvents='none'>
                    <View style={{flexDirection: 'row', justifyContent:'center', alignItems : 'center'}}>
                      {this.state.weightPickerVisible ? null : <Text style={styles.valueCaption}>{I18n.t("basic_info_dialog_weight")}</Text>}
                      {!this.state.weightValid && !this.state.weightPickerVisible ? 
                        <Icon size={20} name='close' style={{color:'red',  fontSize:20, marginLeft:5, marginBottom:2}}/> : 
                        this.state.weight != I18n.t('user_form_choose') && !this.state.weightPickerVisible ? <Icon size={20} name='checkmark' style={{color:'green',  fontSize:20, marginLeft:5, marginBottom:2}}/> : null }
                    </View>
                    <Text style={[styles.selectedValue, {height:30}]}>{this.state.weightPickerVisible ? '': this.state.weight}</Text>
                  </View>
                </TouchableOpacity>
              </ViewOverflow>						
            </View>

            <View style={{flexDirection: "column", flex:1, marginRight:10}}>                        
              { this.state.agePickerVisible ? 
                  <View style={{flex : 1}}>
                  <WheelPicker style={{height: "100%"}}
                    data={this.state.ageItems}
                    isCurved={false}
                    visibleItemCount={5}
                    isCurtain
                    itemSpace={20.0}
                    selectedItemPosition={this.state.selectedAgeItem}            									
                    indicatorColor={"black"}            
                    itemStyle={{color:"green", fontSize:20}}
                    onItemSelected={(event) => this.onPickerAgeSelect(event)}
                  />
                </View> : null	
              }
              <ViewOverflow style={{position:'absolute', marginTop:0, marginBottom:0, width:'100%', top: this.state.agePickerVisible ? (mid_part_height*height)/2 - 15 : (mid_part_height*height)/2 - 45}}>    
                <TouchableOpacity onPress={ this.onToggleAgePicker}>
                  <View pointerEvents='none'>
                    <View style={{flexDirection: 'row', justifyContent:'center', alignItems : 'center'}}>
                      {this.state.agePickerVisible ? null : <Text style={styles.valueCaption}>{I18n.t("basic_info_dialog_age")}</Text>}
                      {!this.state.ageValid && !this.state.agePickerVisible ? 
                        <Icon size={20} name='close' style={{color:'red',  fontSize:20, marginLeft:5, marginBottom:2}}/> : 
                        this.state.age != I18n.t('user_form_choose') && !this.state.agePickerVisible ? <Icon size={20} name='checkmark' style={{color:'green',  fontSize:20, marginLeft:5, marginBottom:2}}/> : null }
                    </View>
                    <Text style={[styles.selectedValue, {height:30}]}>{this.state.agePickerVisible ? '': this.state.age}</Text>
                  </View>
                </TouchableOpacity>
              </ViewOverflow>						
            </View>      
        </View>

      </Form>

    );
  }
}
/*
                <TouchableOpacity onPress={ this.onToggleWeightPicker}>
                  <View pointerEvents='none'>
                    <View style={{flexDirection: 'row', justifyContent:'center', alignItems : 'center'}}>
                      <Text style={styles.valueCaption}>{I18n.t('basic_info_dialog_weight')}</Text>
                      {!this.state.weightValid ? <Icon size={20} name='close-circle' style={{color:'red',  fontSize:20, marginLeft:5, marginBottom:7}}/> : null}
                    </View>
                    <Text style={styles.selectedValue}>{this.state.weight}</Text>
                  </View>
                </TouchableOpacity>        

*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomColor : '#D3D3D3', 
    borderBottomWidth : 1,
    marginTop : 25,
    paddingBottom: 15,
    //borderColor: '#555',
    //borderRadius: 3,
    //borderWidth: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    //backgroundColor: '#fff'
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft : 10,

  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight : 10
  },

  leftCaption: {
    //color : '#808080'
  },

	selectedValue : {
		borderColor : "green",
		borderWidth : 1,
		fontSize : 20,
		fontWeight: "bold",
		textAlign : "center",
		//borderRadius : 10,
	},

  textInput: {
    width: 200,
    backgroundColor: '#f99',
    height: 40,
    marginRight: 10
  },
  button: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9f9',
    height: 40
  },
  valueRow: {
		justifyContent: "space-around", 
		flexDirection: "row", 
		marginTop : 0,
		//borderColor:'red', borderWidth:2, 
		//height:130
	},  
	centerItems: {
		flexDirection: "column",
		alignItems: "center" 
	}, 

	centerButton: {
		alignSelf:"center",
//		marginTop: 30
	},
	valueCaption : {
		fontSize : 20,
    height:30,
    //fontWeight: 'bold',
		marginBottom : 0,
		textAlign : "center",
	},

});