import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity, ImageBackground, Platform} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase';
import db from '../config';
import axios from 'axios';
import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";

var C1 = '#004643'; //background
var C2 = "#44BBA4"; //labels and loginbox
var C3 = "#E7BB41"; //button
var C4 = '#393E41'; //second bg
var C5 = '#E7E5DF'; //text

export default class CustomSideBarMenu extends Component{
  
  state = {
    userId:firebase.auth().currentUser.email,
    image:"#",
    name:'',
    docId:''
  }

  selectPicture = async () => {
    const {cancelled,uri}  = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.All,
      allowsEditing:true,
      aspect:[4,3],
      quality:1
    });

    if(!cancelled){
      this.uploadImage(uri,this.state.userId);
    }
  };
  
  uploadImage = async (uri,imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase.storage().ref().child('user_profiles/'+imageName);

    return ref.put(blob).then((response)=>{
      this.fetchImage(imageName);
    })
  }

  fetchImage = (imageName) => {
    var storageRef = firebase.storage().ref().child('user_profiles/'+imageName);
    storageRef.getDownloadURL().then((url)=>{
      this.setState({
        image:url
      });
    }).catch((error)=>{
      this.setState({
        image:'#'
      });
    })
  }

  getUserProfile() {
    db.collection("users").where("email_id", "==", this.state.userId).onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.setState({
          name: doc.data().first_name + " " + doc.data().last_name,
          docId: doc.id,
          image: doc.data().image,
        });
      });
    });
  }

  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor:C1 }}>
        <View
          style={{
            flex: 0.5,
            alignItems: "center",
            backgroundColor: C4,
          }}
        >
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size="xlarge"
            containerStyle = {{marginTop:55, backgroundColor:C2}}
            onPress={() => this.selectPicture()}
            showEditButton
          />

          <Text style={{ fontWeight: "bold", fontSize: 25, paddingTop: 10, color:C3 }}>
            {this.state.name}
          </Text>
        </View>

        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => {
              this.props.navigation.navigate("WelcomeScreen");
              firebase.auth().signOut();
            }}
          >
            <Icon
              name="logout"
              type="antdesign"
              size={RFValue(20)}
              iconStyle={{ paddingLeft: RFValue(5), color:C2 }}
            />
            <Text
              style={{
                fontSize: RFValue(15),
                fontWeight: "bold",
                marginLeft: RFValue(80),
              }}
            >Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    justifyContent: "center",
    paddingBottom: 30,
  },
  logOutButton: {
    height: 30,
    width: "100%",
    justifyContent: "center",
    padding: 10,
  },
  imageContainer: {
    flex: 0.75,
    width: "40%",
    height: "20%",
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
  logOutText: {
    fontSize: 30,
    fontWeight: "bold",
  },
});