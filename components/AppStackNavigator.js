import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import PetDonateScreen from '../screens/PetDonateScreen';
import RecieverDetailsScreen  from '../screens/RecieverDetailsScreen';

export const AppStackNavigator = createStackNavigator({
  PetDonateList : {
    screen : PetDonateScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  RecieverDetails : {
    screen : RecieverDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  }
},
  {
    initialRouteName: 'PetDonateList'
  }
);