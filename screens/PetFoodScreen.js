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

export default class PetFoodScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId  : firebase.auth().currentUser.email,
      receivedPetsList : []
    }
  this.requestRef= null
  }

  getFoodShopList =()=>{
    this.requestRef = db.collection("users").where('userCategory','==','Food_Shop').onSnapshot((snapshot)=>{
      var receivedPetsList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        receivedPetsList : receivedPetsList
      });
    })
  }

  componentDidMount(){
    this.getFoodShopList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    //console.log(item.Pet_name);
    return (
      <ListItem
        key={i}
        title={item.shopName}
        subtitle={item.first_name + '' + item.last_name}
        subtitleStyle = {{fontWeight:'bold', fontSize:15}}
        titleStyle={{ color: C2, fontWeight: 'bold', fontSize:20 }}
        containerStyle = {{backgroundColor:C4}}
        rightElement={
          <TouchableOpacity style={styles.button}
            onPress ={()=>{
              this.props.navigation.navigate("ShopDetails",{"details": item})
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
        <MyHeader title="Pet Food Shops" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.receivedPetsList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 30, fontWeight:'bold',color:C3}}>List Of All Food Shops</Text>
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