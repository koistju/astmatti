import React from "react";
import { View, AsyncStorage, Text, FlatList, RefreshControl,TouchableOpacity, TouchableHighlight, StyleSheet, Dimensions, Image } from 'react-native';
import { List, ListItem, Header, Avatar } from "react-native-elements";
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
const { width, height } = Dimensions.get('window');
import StorageHelper from './StorageHelpers';
import { SwipeListView } from 'react-native-swipe-list-view';
import I18n from './i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconBadge from 'react-native-icon-badge';

// AA-87, AA-88 20.5.2019
// Screen responsible for showing notifications 
class NotificationsScreen extends React.Component
{
    constructor(props)
    {
        super(props);
        
        props.navigation.setParams({
            onTabFocus: this.handleTabFocus,
            unreadMessagesCount : 12
          });
        
        this.onCancel = this.onCancel.bind(this);
        this.onNotificationRead = this.onNotificationRead.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.markVisibleNotifications = this.markVisibleNotifications.bind(this);
        this.setDataToShow = this.setDataToShow.bind(this);
        this.renderSwipeButtons = this.renderSwipeButtons.bind(this);

        this.state = {
            notifications : [],
            allNotifications : [],
            refreshing : false,
            timer : null
        }
    }

    static navigationOptions = (screenProps) => {

        //const { params = {} } = screenProps.state;

        let unreadMessagesCount = screenProps.navigation.getParam('unreadMessagesCount');
        console.log("unreadMessagesCount : ", screenProps.navigation.getParam('unreadMessagesCount'));

        return {
          tabBarOnPress({ navigation, defaultHandler }) {
            console.log("Notifications tab activated");
    
            navigation.state.params.onTabFocus();

            // this is mandatory to perform the actual switch
            // don't call this if you want to prevent focus
            defaultHandler();

          },
          title: I18n.t('tab_title_notifcations'),
          tabBarIcon: ({tintColor}) =>
            <IconBadge
            MainElement={ <Image
                source={require('./assets/teppo_icons/drawable-hdpi/ic_notifications.png')}
                // 23.8.2019 AA-99
                //resizeMode = {Image.resizeMode.contain}
                resizeMode = {'contain'}
                style={{ height: 25, width: 25, tintColor : tintColor}} />}
            BadgeElement={<Text style={{ color: 'white', fontSize:10 }}>{unreadMessagesCount}</Text>}
            IconBadgeStyle={{width:20,height:20, borderRadius:15, backgroundColor: 'red', position:'absolute', top:1, right:-12,}}
            Hidden={unreadMessagesCount === 0}
            />
        };
    };

    handleTabFocus = () => {
        this.markVisibleNotifications();
    };

    async componentDidMount()
    {
        //var data = await AsyncStorage.getItem('notifications');
        let notifications = await StorageHelper.getNotifications();
        //var notifications = JSON.parse(data);
        this.setState({allNotifications : notifications});

        //console.log("notifications: ", notifications);    
        let now = moment();
        let data_to_show = notifications.filter(t => moment(now).isAfter(t.time));
        this.setDataToShow(data_to_show);

        const unreadMessagesCount = data_to_show.filter(t => t.status == 0).length;
        this.props.navigation.setParams({unreadMessagesCount: unreadMessagesCount});

        let timer = setInterval(this.tick, 60000);
        this.setState({timer});
    }

    componentWillUnmount() {
        this.clearInterval(this.state.timer);
    }

    tick =() => {
        this.markVisibleNotifications();
    }

    setDataToShow(data)
    {
        if ( data.length == 0)
        {
            data.push({"id":100, "title" : "", "text": I18n.t('no_notifications_text'), "time" : new Date(), "group" : "", status : 1})
        }
        this.setState({notifications : data});
    }

    handleRefresh()
    {
        this.setState({refreshing: true}, function(){
            this.markVisibleNotifications();
        });
    }

    async markVisibleNotifications()
    {
        let now = moment();
        //let notifications = this.state.allNotifications;
        let notifications = await StorageHelper.getNotifications();
        this.setState({refreshing : false, allNotifications : notifications});

        let data_to_show = notifications.filter(t => moment(now).isAfter(t.time));
        this.setDataToShow(data_to_show);

        const unreadMessagesCount = data_to_show.filter(t => t.status == 0).length;
        this.props.navigation.setParams({unreadMessagesCount: unreadMessagesCount});
    }

    async onCancel(item)
    {
        console.log("onCancel: ", item);
        //PushNotification.cancelAllLocalNotifications();
        //PushNotification.cancelLocalNotifications({id: '' + item.id});
        PushNotification.clearLocalNotification(item.id);
        
        // Delete the notification
        const newData = [...this.state.allNotifications];
		const prevIndex = this.state.allNotifications.findIndex(item => item.id === item.id);
		newData.splice(prevIndex, 1);
        this.setState({allNotifications: newData});   
        await StorageHelper.storeNotifications(newData);
        this.markVisibleNotifications();
    }

    async onNotificationRead(item)
    {
        console.log("onNotificationRead: ", item);
        item.status = 1;
        await StorageHelper.storeNotifications(this.state.allNotifications);
        this.markVisibleNotifications();
    }

    renderItem({item})
    {        

        return (
            <TouchableHighlight
                //onPress={() => this.onPress(item)}
                //onLongPress={() => this.onPress(item)}
                underlayColor={'gray'}>
            <ListItem
                topDivider
                title={
                    <View style={styles.titleView}>
                        <Text style={[styles.subtitleText, {fontWeight: item.status == 0 ? 'bold': 'normal'}]}>{item.title}</Text>
                    </View>
                }                                                               
                subtitle={
                    <View style={[styles.subtitleView]}>
                    <Text style={[styles.subtitleText, {fontWeight: item.status == 0 ? 'bold': 'normal'}]}>{moment(item.time).format("HH.mm")}</Text>
                    <Text style={[styles.subtitleTextValues, {fontWeight: item.status == 0 ? 'bold': 'normal', width:0.7*width}]}>{item.text}</Text>
                    </View>
                }
            />
            </TouchableHighlight>
        );
    }

    renderSwipeButtons(data, rowMap)
    {
        if ( data.item.id == 100 ) return null;

        return (
            <View style={styles.rowBack}>
                <TouchableOpacity style={[styles.backLeftBtn, styles.backLeftBtnRight]} 
                    onPress={ _ => 
                        {
                            rowMap[data.item.id].closeRow();
                            this.onNotificationRead(data.item);
                        }
                    }>
                    <Ionicons name={'ios-mail-open'} size={25} color='white' />
                    <Text style={styles.backTextWhite}>{I18n.t('message_read_text')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]}
                    onPress={ _ => 
                        {
                            rowMap[data.item.id].closeRow();
                            this.onCancel(data.item);
                        }
                    }>
                    <Ionicons name={'ios-trash'} size={25} color='white'/>
                    <Text style={styles.backTextWhite}>{I18n.t('message_delete_text')}</Text>
                </TouchableOpacity>
            </View>
        )        
    }

    render(){
        return (
            <View>
                <SwipeListView
                    useFlatList
                    keyExtractor={item => item.id.toString()}
                    data={this.state.notifications}
                    renderItem = {(item) => this.renderItem(item)}
                    renderHiddenItem={ (data, rowMap) => this.renderSwipeButtons(data, rowMap)}
                    leftOpenValue={75}
                    rightOpenValue={-75}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={2000}
                />                
            </View>

            /*            
            <View>
                <FlatList
                    data={this.state.notifications}
                    extraData={this.state}
                    keyExtractor={item => item.id.toString()}
                    renderItem = {(item) => this.renderItem(item)}
                    refreshControl={
                        <RefreshControl
                         refreshing={this.state.refreshing}
                         onRefresh={this.handleRefresh}
                        />
                      }
                    />
            </View>
*/            
        );
    }
}

const styles = StyleSheet.create({
    backLeftBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
      },
      backLeftBtnRight: {
        backgroundColor: 'blue',
        left: 0,
      },
    backTextWhite: {
		color: '#FFF'
    },
    backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75
	},
	backRightBtnLeft: {
		backgroundColor: 'blue',
		right: 75
	},
	backRightBtnRight: {
		backgroundColor: 'red',
		right: 0
    },
    rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
    },
    titleView : {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5,
    },
    subtitleView: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5,
        marginRight:3
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
  });


export default NotificationsScreen;