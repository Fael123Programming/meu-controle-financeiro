import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TextInput,
} from 'react-native';
import AdminButton from '../../../components/AdminButton';

const CreateCityScreen = ({navigation}) => {
    const [city, setCity] = useState('');

    const {
        container,
        textInput,
    } = styles;

    const createCity = _ => {
        console.log('CREATE CITY');
        navigation.goBack();
    };

    return (
        <View style={container}>
            <ScrollView
                keyboardDismissMode='on-drag'
            >
                <TextInput
                    autoFocus={true}
                    style={textInput}
                    defaultValue={city}
                    onChangeText={text => setCity(text)}
                    placeholder='Cidade'
                />
                <AdminButton
                    text={'Criar'}
                    onPress={createCity}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        backgroundColor: 'white',
        width: 350,
        height: 50,
        marginVertical: 15,
        padding: 15,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5
    },
});

export default CreateCityScreen;
