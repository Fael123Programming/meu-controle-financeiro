import React from 'react';
import {
    Text,
    StyleSheet,
    Dimensions
} from 'react-native';
import { 
    createDrawerNavigator, 
    DrawerContentScrollView, 
    DrawerItemList, 
    DrawerItem
} from '@react-navigation/drawer';
import { 
    Feather,
    FontAwesome5,
    MaterialIcons, 
    MaterialCommunityIcons,
    AntDesign
} from '@expo/vector-icons';
import UsersNavigator from './screens/usersNavigator/UsersNavigator';
import CitiesNavigator from './screens/citiesNavigator/CitiesNavigator';
import IssuersNavigator from './screens/issuersNavigator/IssuersNavigator';
import PaymentMethodsNavigator from './screens/paymentMethodsNavigator/PaymentMethodsNavigator';
import MyProfileNavigator from './screens/myProfileNavigator/MyProfileNavigator';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = props => {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props}/>
            <DrawerItem
                style={
                    {
                        width: '100%',
                        marginTop: Dimensions.get('screen').height * .50,
                        marginBottom: -20
                    }
                }
                label={'Version 1.1.114'}  // commits number: git rev-list --all --count
                labelStyle={
                    {
                        textAlign: 'center',
                        color: 'grey',
                        fontStyle: 'italic',
                    }
                }
                pressColor='white'
            />
            <DrawerItem
                icon={
                    ({focused, size, color}) => (
                        <MaterialCommunityIcons 
                            name="mustache" 
                            size={20} 
                            color="grey"
                            style={{marginLeft: '34%'}}
                        />
                    )
                }
                label={'YoungMrs'}
                labelStyle={[{width: 80, marginLeft: -30, fontSize: 10}]}
                pressColor='white'
            />
        </DrawerContentScrollView>
    );
};

const AdminNavigator = ({navigation}) => {
    const {
        drawerLabelStyle
    } = styles;

    const drawLabel = text => ({focused, color}) => <Text style={drawerLabelStyle}>{text}</Text>;

    return (
        <Drawer.Navigator 
            initialRouteName='Users'
            drawerContent={props => <CustomDrawerContent {...props}/>}
        >
            <Drawer.Screen 
                name='MyProfileNavigator'
                options={
                    {
                        drawerActiveTintColor: '#4287f5',
                        drawerInactiveTintColor: 'black',
                        drawerLabel: drawLabel('Meu Perfil'), 
                        headerShown: true,
                        headerTitle: 'Meu Perfil',
                        headerTitleAlign: 'center',
                        drawerIcon: ({color, focused, size}) => {
                            let theColor = focused ? '#4287f5' : 'black';
                            return (
                                <AntDesign name="user" size={24} color={theColor} />
                            );
                        }
                    }
                }
                component={MyProfileNavigator}
            />
            <Drawer.Screen 
                name='UsersNavigator' 
                options={
                    {
                        drawerActiveTintColor: '#4287f5',
                        drawerInactiveTintColor: 'black',
                        drawerLabel: drawLabel('Usuários'),
                        headerShown: true,
                        headerTitle: 'Usuários',
                        headerTitleAlign: 'center',
                        drawerIcon: ({color, focused, size}) => {
                            let theColor = focused ? '#4287f5' : 'black';
                            return (
                                <Feather name='users' color={theColor} size={25}/>
                            );
                        }
                    }
                }
            >
                {() => <UsersNavigator navigation={navigation}/>}
            </Drawer.Screen>
            <Drawer.Screen 
                component={CitiesNavigator} 
                name='CitiesNavigator' 
                options={
                    {
                        drawerActiveTintColor: '#4287f5',
                        drawerInactiveTintColor: 'black',
                        drawerLabel: drawLabel('Cidades'), 
                        headerTitle: 'Cidades',
                        headerTitleAlign: 'center',
                        drawerIcon: ({color, focused, size}) => {
                            let theColor = focused ? '#4287f5' : 'black';
                            return (
                                <FontAwesome5 name='city' size={25} color={theColor} />
                            );
                        }
                    }
                }
            />
            <Drawer.Screen 
                component={IssuersNavigator} 
                name='IssuersNavigator' 
                options={
                    {
                        drawerActiveTintColor: '#4287f5',
                        drawerInactiveTintColor: 'black',
                        drawerLabel: drawLabel('Emissores'), 
                        headerTitle: 'Emissores',
                        headerTitleAlign: 'center',
                        drawerIcon: ({color, focused, size}) => {
                            let theColor = focused ? '#4287f5' : 'black';
                            return (
                                <FontAwesome5 name='receipt' size={25} color={theColor} />
                            );
                        }
                    }
                }
            />
            <Drawer.Screen 
                component={PaymentMethodsNavigator} 
                name='PaymentMethodsNavigator' 
                options={
                    {
                        drawerActiveTintColor: '#4287f5',
                        drawerInactiveTintColor: 'black',
                        drawerLabel: drawLabel('Pagamentos'),
                        headerTitle: 'Métodos de Pagamento',
                        headerTitleAlign: 'center',
                        drawerIcon: ({color, focused, size}) => {
                            let theColor = focused ? '#4287f5' : 'black';
                            return (
                                <MaterialIcons name='payment' size={25} color={theColor} />
                            );
                        }
                    }
                }
            />
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    drawerLabelStyle: {
        textAlign: 'center', 
        fontWeight: 'bold'
    },
});

export default AdminNavigator;