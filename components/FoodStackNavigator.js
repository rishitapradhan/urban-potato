import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import PetFoodScreen from '../screens/PetFoodScreen';
import ShopDetailsScreen from '../screens/ShopDetailsScreen';

export const FoodStackNavigator = createStackNavigator({
  ShopList : {
    screen : PetFoodScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  ShopDetails : {
    screen : ShopDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  }
},
  {
    initialRouteName: 'ShopList'
  }
);