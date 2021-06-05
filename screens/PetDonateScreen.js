import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity, Image } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';

export default class PetDonateScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId  : firebase.auth().currentUser.email,
      requestedPetsList : []
    }
  this.requestRef= null
  }

  getRequestedPetsList =()=>{
    this.requestRef = db.collection("requested_Pets").where('Pet_status',"==",'requested').onSnapshot((snapshot)=>{
      var requestedPetsList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        requestedPetsList : requestedPetsList
      });
    })
  }

  componentDidMount(){
    this.getRequestedPetsList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.Pet_name}
        subtitle={item.reason_to_request}
        subtitleStyle = {{fontWeight:'bold', fontSize:15}}
        titleStyle={{ color: C2, fontWeight: 'bold', fontSize:20 }}
        containerStyle = {{backgroundColor:C4}}
        rightElement={
            <TouchableOpacity style={styles.button}
              onPress ={()=>{
                this.props.navigation.navigate("RecieverDetails",{"details": item})
              }}
              >
              <Text style={{color:C1}}>View</Text>
            </TouchableOpacity>
          }
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1, backgroundColor:C1}}>
        <MyHeader title="Donate Pets" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.requestedPetsList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 30, color:C3}}>List Of All Requested Pets</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.requestedPetsList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

var C1 = '#004643'; //background
var C2 = "#44BBA4"; //labels and loginbox
var C3 = "#E7BB41"; //button
var C4 = '#393E41'; //second bg
var C5 = '#E7E5DF'; //text

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:C1
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:C3,
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
});