import React, { useState, useEffect } from 'react';
import {
    Pressable,
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import YesNoAlert from '../../../components/YesNoAlert';
import CustomDropdown from '../../../components/CustomDropdown';
import OkAlert from '../../../components/OkAlert';
import { issuerExistsAsync, updateIssuerAsync, updateIssuerDefaultPaymentMethodAsync } from '../../../../service';

const IssuerInput = ({issuerData, onDelete, onUpdate, options}) => {
    const [nameState, setNameState] = useState(issuerData?.name);
    const [dpmState, setDpmState] = useState(issuerData?.defaultPaymentMethod);
    const [errorMsg, setErrorMsg] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [okAlertVisible, setOkAlertVisible] = useState(false);
    const [iconColor, setIconColor] = useState('black');
    
    const {
        container,
        listItem,
        errorStyle,
        dropdownStyle
    } = styles;

    const deleteIssuer = _ => onDelete && onDelete(issuerData);

    return (
        <>
            <View style={container}>
                <Text style={errorStyle}>{errorMsg}</Text>
                <View style={listItem}>
                    <TextInput
                        style={{flex: 1}}
                        defaultValue={nameState}
                        onChangeText={text => {
                                if (!text.length) {
                                    setErrorMsg('Não pode ser vazio')
                                } else {
                                    setErrorMsg('');
                                    setNameState(text);
                                }
                            }
                        }
                        onBlur={async _ => {
                                if (errorMsg) {
                                    setNameState(issuerData?.name);
                                    setErrorMsg('');
                                } else if (nameState.toLowerCase() !== issuerData?.name.toLowerCase()) { 
                                    if (await issuerExistsAsync(nameState)) {
                                        setOkAlertVisible(true);
                                        setNameState(issuerData?.name);
                                    } else {
                                        await updateIssuerAsync(issuerData?.name, nameState);
                                        onUpdate && onUpdate();
                                    }
                                }
                            }
                        }
                    />
                    <Pressable 
                        onPress={_ => setShowDeleteModal(true)}
                        onPressIn={_ => setIconColor('red')}
                        onPressOut={_ => setIconColor('black')}
                    >
                        <AntDesign name="delete" size={24} color={iconColor} />
                    </Pressable>
                </View>
                <View style={dropdownStyle}>
                    <CustomDropdown
                        state={dpmState}
                        setState={setDpmState}
                        options={options}
                        width={43}
                        marginBottom={0}
                        onUpdate={async newState => {
                                await updateIssuerDefaultPaymentMethodAsync(nameState, newState);
                                onUpdate && onUpdate();
                            }
                        }
                    />
                </View>
            </View>
            <YesNoAlert
                visible={showDeleteModal}
                setVisible={setShowDeleteModal}
                title={'Excluir emissor'}
                description={`Tem certeza que desejas excluir o emissor '${issuerData?.name}'?`}
                onPressYes={deleteIssuer}
            />
            <OkAlert
                visible={okAlertVisible}
                setVisible={setOkAlertVisible}
                title={'Atualizar Nome de Emissor'}
                description={'Emissor já existe'}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
    },
    listItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: 350,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        padding: 15,
        borderRadius: 5
    },
    errorStyle: {
        color: 'red',
        fontStyle: 'italic',
        fontSize: 10,
    },
    dropdownStyle: {
        marginLeft: 0,
        justifyContent: 'center',
        margin: 15
    }
});

export default IssuerInput;
