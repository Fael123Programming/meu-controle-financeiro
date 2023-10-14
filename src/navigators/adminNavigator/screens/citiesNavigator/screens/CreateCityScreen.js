import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TextInput,
} from 'react-native';
import AdminButton from '../../../components/AdminButton';
import OkAlert from '../../../../../components/OkAlert';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { selectCities, setCitiesAsync } from '../../../../../features/cities/citiesSlice';
import { cityExistsAsync, createNewCityAsync } from '../../../../../../service';
import { Snackbar } from 'react-native-paper';

const CreateCityScreen = ({navigation}) => {
    const cities = useAppSelector(selectCities);
    const citiesStatus = useAppSelector(status => status.cities.status);
    const dispatch = useAppDispatch();

    const [city, setCity] = useState('');
    const [okAlertVisible, setOkAlertVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [errorDescription, setErrorDescription] = useState('');

    const [textInputRef, setTextInputRef] = useState();

    const {
        container,
        textInput,
    } = styles;

    const createCity = async _ => {
        let trimmedCity = city.trim();
        if (trimmedCity.length == 0) {
            setErrorDescription('Nome da cidade não pode ser vazio');
            setOkAlertVisible(true);
        } else if (await cityExistsAsync(city)) {
            setErrorDescription('Cidade já existe');
            setOkAlertVisible(true);
        } else {
            await createNewCityAsync(city);
            setSnackbarVisible(true);
            dispatch(setCitiesAsync());
        }
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
                    ref={ref => setTextInputRef(ref)}
                />
                <AdminButton
                    text={'Criar'}
                    onPress={createCity}
                />
            </ScrollView>
            <OkAlert
                title={'Criar Nova Cidade'}
                description={errorDescription}
                visible={okAlertVisible}
                setVisible={setOkAlertVisible}
                onPressOk={_ => {
                        setCity('');
                        textInputRef.focus(); 
                    }
                }
            />
            <Snackbar
                visible={snackbarVisible}
                onDismiss={_ => {
                        setSnackbarVisible(false);
                        navigation.goBack();
                    }
                }
                duration={1000}
            >
                Cidade criada com sucesso!
            </Snackbar>
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
