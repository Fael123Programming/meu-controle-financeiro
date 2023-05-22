import React from 'react';
import {
    Image,
    Pressable,
} from 'react-native';
import { ResponsiveDimensions } from '../utils/ResponsiveDimensions';

const ProfilePicture = ({onPress, size='small', src=require('../assets/face1.jpg')}) => {
    if (!src) {
        src = require('../assets/unknown.png');
    }
    return (
        <Pressable
            onPress={onPress}
        >   
            <Image
                source={src}
                resizeMode={'contain'}
                style={ResponsiveDimensions.roundImageContainer[size]}
            />
        </Pressable>
    );
};

export { ProfilePicture };
