import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UsersScreen from './screens/UsersScreen';
import UserDetailsScreen from './screens/UserDetailsScreen';
import CreateUserScreen from './screens/CreateUserScreen';
import ChangePasswordScreenAdmin from '../ChangePasswordScreenAdmin';

const Stack = createStackNavigator();

const UsersNavigator = ({navigation}) => {

    return (
        <Stack.Navigator initialRouteName='Users'>
            <Stack.Screen 
                name='Users' 
                component={UsersScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen 
                name='UserDetails' 
                options={
                    {
                        headerShown: true, 
                        headerTitle: 'Detalhes de Utilizador', 
                        headerTitleAlign: 'center'
                    }
                }
                component={UserDetailsScreen}
            />
            <Stack.Screen 
                name='ChangePasswordAdmin' 
                options={
                    { 
                        headerTitle: 'Mudar Palavra-Passe',
                        headerTitleAlign: 'center'
                    }
                }
            >
                {() => <ChangePasswordScreenAdmin navigation={navigation} authenticateFirst={false}/>}
            </Stack.Screen>
            <Stack.Screen 
                name='CreateUser' 
                component={CreateUserScreen}
                options={
                    {
                        headerShown: true, 
                        headerTitle: 'Criar Utilizador', 
                        headerTitleAlign: 'center'
                    }
                }
            />
        </Stack.Navigator>
    );
};

export default UsersNavigator;
