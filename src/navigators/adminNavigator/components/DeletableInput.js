import React, { useState } from 'react';
import {
    Pressable,
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import YesNoAlert from '../../../components/YesNoAlert';
import { cityExistsAsync, updateCityAsync } from '../../../../service';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectCities, setCitiesAsync } from '../../../features/cities/citiesSlice';

const DeletableInput = ({label, onDelete}) => {
    const cities = useAppSelector(selectCities);
    const dispatch = useAppDispatch();

    const [labelState, setLabelState] = useState(label);
    const [errorMsg, setErrorMsg] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [iconColor, setIconColor] = useState('black');
    
    const {
        listItem,
        errorStyle,
    } = styles;

    const deleteItem = _ => {
        onDelete && onDelete(label);
        console.log('DELETE ' + label);
    };

    const saveToDatabase = async _ => {
        if (labelState !== label) {
            if (await cityExistsAsync(labelState)) {
                setErrorMsg('Cidade já existe');
                setLabelState(label);
            } else {
                await updateCityAsync(label, labelState);
                label = labelState;
                dispatch(setCitiesAsync());
            }
        }
    };

    return (
        <>
            <View>
                <Text style={errorStyle}>{errorMsg}</Text>
                <View style={listItem}>
                    <TextInput
                        style={{flex: 1}}
                        defaultValue={labelState}
                        onChangeText={text => {
                                if (!text.length)
                                    setErrorMsg('Não pode ser vazio');
                                else {
                                    setErrorMsg('');
                                    setLabelState(text)
                                }
                            }
                        }
                        onBlur={async _ => {
                                if (errorMsg) {
                                    setLabelState(label);
                                    setErrorMsg('');
                                } else
                                    await saveToDatabase();
                            }
                        }
                    />
                    <Pressable 
                        onPress={_ => {
                                setShowDeleteModal(true);
                            }
                        }
                        onPressIn={_ => setIconColor('red')}
                        onPressOut={_ => setIconColor('black')}
                    >
                        <AntDesign name="delete" size={24} color={iconColor} />
                    </Pressable>
                </View>
            </View>
            <YesNoAlert
                visible={showDeleteModal}
                setVisible={setShowDeleteModal}
                title={'Excluir'}
                description={`Tem certeza que desejas excluir '${label}'?`}
                onPressYes={deleteItem}
            />
        </>
    );
};

const styles = StyleSheet.create({
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
});

export default DeletableInput;
