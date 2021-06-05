import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './AppStackNavigator'
import PetRequestScreen from '../screens/PetRequestScreen';
import { Icon } from "react-native-elements";

var C1 = '#004643'; //background
var C2 = "#44BBA4"; //labels and loginbox
var C3 = "#E7BB41"; //button
var C4 = '#393E41'; //second bg
var C5 = '#E7E5DF'; //text

export const AppTabNavigator = createBottomTabNavigator({
  DonatePets : {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarIcon : <Icon name="gift" color = {C2} type ="feather" />,
      tabBarLabel : "Donate Pets",
    }
  },
  PetRequest: {
    screen: PetRequestScreen,
    navigationOptions :{
      tabBarIcon : <Icon name="addfile" color = {C2} type ="ant-design" />,
      tabBarLabel : "Pet Request",
    }
  }
});