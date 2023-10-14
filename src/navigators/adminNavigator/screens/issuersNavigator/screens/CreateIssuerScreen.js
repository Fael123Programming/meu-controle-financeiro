import React, { useState } from 'react';
import {
    View,
    ScrollView,
    TextInput,
    StyleSheet
} from 'react-native';
import CustomDropdown from '../../../../../components/CustomDropdown';
import AdminButton from '../../../components/AdminButton';
import OkAlert from '../../../../../components/OkAlert';
import { Snackbar } from 'react-native-paper';
import { issuerExistsAsync, createNewIssuerAsync } from '../../../../../../service';
import { useAppDispatch } from '../../../../../app/hooks';
import { setIssuersAsync } from '../../../../../features/issuers/issuersSlice';

const CreateIssuerScreen = ({route, navigation}) => {
    const { paymentMethods } = route.params;

    const {
        container,
        textInput,
        dropdownStyle
    } = styles;

    const [issuer, setIssuer] = useState('');
    const [dpm, setDpm] = useState(1);
    const [errorDescription, setErrorDescription] = useState('');
    const [okAlertVisible, setOkAlertVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [textInputRef, setTextInputRef] = useState();

    const dispatch = useAppDispatch();

    const createIssuer = async () => {
        let trimmedIssuer = issuer.trim();
        if (trimmedIssuer.length == 0) {
            setErrorDescription('Nome do emissor não pode ser vazio');
            setOkAlertVisible(true);
        } else if (await issuerExistsAsync(issuer)) {
            setErrorDescription('Emissor já existe');
            setOkAlertVisible(true);
        } else {
            await createNewIssuerAsync(issuer, dpm);
            setSnackbarVisible(true);
            dispatch(setIssuersAsync());
        }
    };

    return (
        <View style={container}>
            <ScrollView
                keyboardDismissMode='on-drag'
            >
                <TextInput
                    autoFocus={true}
                    ref={ref => setTextInputRef(ref)}
                    style={textInput}
                    defaultValue={issuer}
                    onChangeText={text => setIssuer(text)}
                    placeholder='Emissor'
                />
                <View style={dropdownStyle}>
                    <CustomDropdown
                        state={dpm}
                        setState={setDpm}
                        options={paymentMethods}
                        width={43}
                        marginBottom={3}
                    />
                </View>
                <AdminButton
                    text={'Criar'}
                    onPress={createIssuer}
                />
            </ScrollView>
            <OkAlert
                visible={okAlertVisible}
                setVisible={setOkAlertVisible}
                title={'Criar Novo Emissor'}
                description={errorDescription}
                onPressOk={_ => {
                        setIssuer('');
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
                Emissor criado com sucesso!
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
    dropdownStyle: {
        alignItems: 'flex-start'
    }
});

export default CreateIssuerScreen;
