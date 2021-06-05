import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

var C1 = '#004643'; //background
var C2 = "#44BBA4"; //labels and loginbox
var C3 = "#E7BB41"; //button
var C4 = '#393E41'; //second bg
var C5 = '#E7E5DF'; //text

export default class MyPetsScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId  : firebase.auth().currentUser.email,
      receivedPetsList : []
    }
  this.requestRef= null
  }

  getReceivedPetsList =()=>{
    this.requestRef = db.collection("requested_Pets").where('user_id','==',this.state.userId).where("Pet_status", '==','received').onSnapshot((snapshot)=>{
      var receivedPetsList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        receivedPetsList : receivedPetsList
      });
    })
  }

  componentDidMount(){
    this.getReceivedPetsList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    console.log(item.Pet_name);
    return (
      <ListItem
        key={i}
        title={item.Pet_name}
        subtitle={item.PetStatus}
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
        <MyHeader title="My Pets" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.receivedPetsList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 30, fontWeight:'bold',color:C3}}>List Of All Received Pets</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.receivedPetsList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
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
})