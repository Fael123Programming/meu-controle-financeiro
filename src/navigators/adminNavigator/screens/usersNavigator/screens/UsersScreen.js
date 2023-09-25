import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Dimensions
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { selectUsers, setUsersAsync } from '../../../../../features/users/usersSlice';
import LoadingIndicator from '../../../../../components/LoadingIndicator';
import UserCard from '../../../components/UserCard';
import AddButton from '../../../components/AddButton';

const UsersScreen = ({navigation}) => {
    const [usersState, setUsersState] = useState([]);
    const users = useAppSelector(selectUsers);
    const usersStatus = useAppSelector(state => state.users.status);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setUsersAsync());
    }, []);

    useEffect(() => {
        if (users.value)
            setUsersState(users.value);
    }, [users]);

    const onPress = user => {
        navigation.navigate('UserDetails', {
            user: user
        });
    };

    const {
        container,
        flatListStyle,
        separator
    } = styles;

    if (usersStatus === 'loading')
        return <LoadingIndicator/>

    return (
        <View style={container}>
            <FlatList
                contentContainerStyle={flatListStyle}
                data={usersState}
                renderItem={({item}) => <UserCard data={{...item}} onPress={onPress}/>}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={_ => <View style={separator}/>}
            />
            <AddButton
                onPress={_ => navigation.navigate('CreateUser')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    flatListStyle: {
        paddingVertical: 15,
        width: Dimensions.get('screen').width
    },
    separator: {
        marginVertical: 10
    }
});

export default UsersScreen;
