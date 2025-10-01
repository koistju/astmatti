import { AsyncStorage } from 'react-native';

// AA-90 20.5.2019

const StorageItem = {
    //RECEPTION_TIME : 'reception_time',
    CURRENT_CONFIGURATION : 'current_configuration',
    SCHEDULED : 'scheduled',
    NOTIFICATIONS : 'notifications',
    CHAT_DATA : 'chat_data',
    CHAT_MESSAGES : 'messages',
    CHAT_CURRENT_STATE : 'currentState',
    USER_PROFILE : 'user_profile'
}

async function getItem(key)
{
    let value = null;
    try
    {
        value = await AsyncStorage.getItem(key);
    }
    catch(ex)
    {
        console.log("Error reading key " + key + " from AsyncStorage, reason: ", ex);
    }

    return value;
} 

async function setItem(key, value)
{
    try
    {
        value = await AsyncStorage.setItem(key, value);
    }
    catch(ex)
    {
        console.log("Error setting key " + key + " to AsyncStorage, reason: ", ex);
    }
} 


export default class StorageHelper
{
    /*
    static storeReceptionTime(reception_time)
    {
        setItem(StorageItem.RECEPTION_TIME, reception_time);
    }
    
    static getReceptionTime()
    {
        return getItem(StorageItem.RECEPTION_TIME);
    } */   

    static async storeCurrentConfiguration(configuration)
    {
        await setItem(StorageItem.CURRENT_CONFIGURATION, JSON.stringify(configuration));
    }
    
    static async getCurrentConfiguration()
    {
        let c = await getItem(StorageItem.CURRENT_CONFIGURATION);
        if ( c == null ) return null;
        return JSON.parse(c);
    }    

    static async storeScheduled(value)
    {
        await setItem(StorageItem.SCHEDULED, value.toString());
    }
    
    static async getScheduled()
    {
        let c = await getItem(StorageItem.SCHEDULED);
        if ( c == null ) return null;
        return c;
    }    

    static async storeNotifications(notifications)
    {
        await setItem(StorageItem.NOTIFICATIONS, JSON.stringify(notifications));
    }
    
    static async getNotifications()
    {
        let c = await getItem(StorageItem.NOTIFICATIONS);
        if ( c == null ) return null;
        return JSON.parse(c);
    }    

    static async storeChatData(chatdata)
    {
        await setItem(StorageItem.CHAT_DATA, JSON.stringify(chatdata));
    }
    
    static async getChatData()
    {
        let c = await getItem(StorageItem.CHAT_DATA);
        if ( c == null ) return null;
        return JSON.parse(c);
    }    

    static async storeChatMessages(messages)
    {
        await setItem(StorageItem.CHAT_MESSAGES, JSON.stringify(messages));
    }
    
    static async getChatMessages()
    {
        let c = await getItem(StorageItem.CHAT_MESSAGES);
        if ( c == null ) return null;
        return JSON.parse(c);
    }    

    static async storeChatCurrentState(currentState)
    {
        await setItem(StorageItem.CHAT_CURRENT_STATE, JSON.stringify(currentState));
    }
    
    static async getChatCurrentState()
    {
        let c = await getItem(StorageItem.CHAT_CURRENT_STATE);
        if ( c == null ) return null;
        return JSON.parse(c);
    }    

    static async storeUserProfile(userprofile)
    {
        await setItem(StorageItem.USER_PROFILE, JSON.stringify(userprofile));
    }
    
    static async getUserProfile()
    {
        let c = await getItem(StorageItem.USER_PROFILE);
        if ( c == null ) return null;
        return JSON.parse(c);
    }    

}
