import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyProfileScreen from './screens/MyProfileScreen';
import ChangePasswordScreenAdmin from '../ChangePasswordScreenAdmin';

const Stack = createStackNavigator();

const MyProfileNavigator = () => {
    return (
        <Stack.Navigator initialRouteName='MyProfile'>
            <Stack.Screen 
                name='MyProfile' 
                component={MyProfileScreen} 
                options={
                    { 
                        headerShown: false
                    }
                }
            />
            <Stack.Screen 
                name='ChangePasswordAdmin' 
                component={ChangePasswordScreenAdmin} 
                options={
                    { 
                        headerTitle: 'Mudar Palavra-Passe',
                        headerTitleAlign: 'center'
                    }
                }
            />
        </Stack.Navigator>
    );
};

export default MyProfileNavigator;
