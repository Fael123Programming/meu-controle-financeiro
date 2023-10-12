import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { selectCities, setCitiesAsync } from '../../../../../features/cities/citiesSlice';
import { deleteCityAsync } from '../../../../../../service';
import LoadingIndicator from '../../../../../components/LoadingIndicator';
import Fonts from '../../../../../utils/Fonts';
import AddButton from '../../../components/AddButton';
import CityDeletableInput from '../../../components/CityDeletableInput';

const CitiesScreen = ({navigation}) => {
    const cities = useAppSelector(selectCities);
    const citiesStatus = useAppSelector(status => status.cities.status);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(setCitiesAsync());
    }, []);

    const onDelete = async item => {
        await deleteCityAsync(item);
        onUpdate();
    };
    
    const onUpdate = _ => {
        dispatch(setCitiesAsync());
    };

    const renderItem = item => <CityDeletableInput 
                                    cityData={item} 
                                    onDelete={onDelete}
                                    onUpdate={onUpdate} 
                                    key={item.value}
                                />;
    
    const {
        container,
        noCityStyle
    } = styles;
    
    if (citiesStatus === 'loading')
        return <LoadingIndicator/>

    return (
        <View style={container}>
            {
                cities.value.length > 0 ? (
                    <ScrollView
                        keyboardDismissMode='on-drag'
                        showsVerticalScrollIndicator={false}
                    >
                        { cities.value.map(ele => renderItem(ele)) }
                    </ScrollView>
                ) : (
                    <Text style={noCityStyle}>Sem Cidades</Text>
                )
            }
            <AddButton onPress={_ => navigation.navigate('CreateCity')}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noCityStyle: {
        ...Fonts.headlineLarge,
        textAlign: 'center'
    },
});

export default CitiesScreen;
