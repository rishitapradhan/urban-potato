import React from 'react';
import LottieView from 'lottie-react-native';

export default class PetAnimation extends React.Component {
    render(){
        return(
            <LottieView 
                source = {require('../assets/3154-Pets-2.json')}
                style = {{width: "60%"}}
                autoPlay loop />
        )
    }
}