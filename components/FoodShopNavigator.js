import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { FoodStackNavigator } from './FoodStackNavigator'
import FoodRequestScreen from '../screens/FoodRequestScreen';
import { Icon } from "react-native-elements";

var C1 = '#004643'; //background
var C2 = "#44BBA4"; //labels and loginbox
var C3 = "#E7BB41"; //button
var C4 = '#393E41'; //second bg
var C5 = '#E7E5DF'; //text

export const FoodShopNavigator = createBottomTabNavigator({
  PetFood : {
    screen: FoodStackNavigator,
    navigationOptions :{
      tabBarIcon : <Icon name="shop" color = {C2} type ="entypo" />,
      tabBarLabel : "Pet Food Shops",
    }
  },
  FoodRequest: {
    screen: FoodRequestScreen,
    navigationOptions :{
      tabBarIcon : <Icon name="addfile" color = {C2} type ="ant-design" />,
      tabBarLabel : "Request Food",
    }
  }
});