import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { selectCities, setCitiesAsync } from '../../../../../features/cities/citiesSlice';
import LoadingIndicator from '../../../../../components/LoadingIndicator';
import DeletableInput from '../../../components/DeletableInput';
import Fonts from '../../../../../utils/Fonts';
import AddButton from '../../../components/AddButton';

const CitiesScreen = ({route, navigation}) => {
    const [citiesState, setCitiesState] = useState([]);
    const cities = useAppSelector(selectCities);
    const citiesStatus = useAppSelector(status => status.cities.status);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(setCitiesAsync());
    }, []);

    useEffect(() => {
        if (cities?.value)
            setCitiesState(cities.value);
    }, [cities]);
    
    if (citiesStatus === 'loading')
        return <LoadingIndicator/>
    
    const onDelete = item => setCitiesState(citiesState.filter(city => city.label != item));

    const renderItem = item => <DeletableInput label={item.label} onDelete={onDelete} key={item.value}/>;

    const {
        container,
        noCityStyle
    } = styles;
    
    return (
        <View style={container}>
            {
                citiesState.length > 0 ? (
                    <ScrollView
                        keyboardDismissMode='on-drag'
                        showsVerticalScrollIndicator={false}
                    >
                        { citiesState.map(ele => renderItem(ele)) }
                    </ScrollView>
                ) : (
                    <Text style={noCityStyle}>Sem Cidades</Text>
                )
            }
            <AddButton    
                onPress={_ => {
                        navigation.navigate('CreateCity');
                    }
                }
            />
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
