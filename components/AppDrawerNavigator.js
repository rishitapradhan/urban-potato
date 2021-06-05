import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu  from './CustomSideBarMenu';
import PetTransferScreen from '../screens/PetTransferScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingScreen from '../screens/SettingScreen';
import MyPetsScreen from '../screens/MyPetsScreen';
import PetDoctorScreen from '../screens/PetDoctorScreen';
import {FoodShopNavigator} from './FoodShopNavigator';
import MyRecievedFoodScreen from '../screens/MyRecievedFoodScreen';
import {Icon} from 'react-native-elements';

var C1 = '#004643'; //background
var C2 = "#44BBA4"; //labels and loginbox
var C3 = "#E7BB41"; //button
var C4 = '#393E41'; //second bg
var C5 = '#E7E5DF'; //text

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator,
    navigationOptions:{
      drawerIcon : <Icon name="home" color = {C2} type ="fontawesome5" />
    }
  },
  PetTransfers : {
    screen : PetTransferScreen,
    navigationOptions:{
      drawerIcon : <Icon name="gift" color = {C2} type ="font-awesome" />,
      drawerLabel : "Pet Transfers"
    }
  },
  PetVets:{
    screen:PetDoctorScreen,
    navigationOptions:{
      drawerIcon : <Icon name="doctor" color = {C2} type ="fontisto" />,
      drawerLabel : "Pet Vets"
    }
  },
  PetFoodShops:{
    screen : FoodShopNavigator,
    navigationOptions:{
      drawerIcon : <Icon name="shop" color = {C2} type ="entypo" />,
      drawerLabel : "Pet Food Shops"
    }
  },
  MyReceivedPets :{
    screen: MyPetsScreen,
    navigationOptions:{
      drawerIcon : <Icon name="pets" color = {C2} type ="materialicons" />,
      drawerLabel : "My Pets"
    }
  },
  MyReceivedPetFood :{
    screen: MyRecievedFoodScreen,
    navigationOptions:{
      drawerIcon : <Icon name="gift" color = {C2} type ="feather" />,
      drawerLabel : "Recieved Pet Food"
    }
  },
  Notification : {
    screen : NotificationScreen,
    navigationOptions:{
      drawerIcon : <Icon name="bell" color = {C2} type ="font-awesome" />,
      drawerLabel : "My Notifications"
    }
  },
  Setting : {
    screen : SettingScreen,
    navigationOptions:{
      drawerIcon : <Icon name="settings" color = {C2} type ="fontawesome5" />,
      drawerLabel : "Settings"
    }
  }
},
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })