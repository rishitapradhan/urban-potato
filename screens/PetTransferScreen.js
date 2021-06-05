import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js';

var C1 = '#004643'; //background
var C2 = "#44BBA4"; //labels and loginbox
var C3 = "#E7BB41"; //button
var C4 = '#393E41'; //second bg
var C5 = '#E7E5DF'; //text

export default class PetTransferScreen extends Component {
   constructor(){
     super()
     this.state = {
       donorId : firebase.auth().currentUser.email,
       donorName : "",
       allPetTranfers : []
     }
     this.requestRef= null
   }

   static navigationOptions = { header: null };

   getDonorDetails=(donorId)=>{
     db.collection("users").where("email_id","==", donorId).get().then((snapshot)=>{
       snapshot.forEach((doc) => {
         this.setState({
           "donorName" : doc.data().first_name + " " + doc.data().last_name
         })
       });
     })
   }

   getAllDonations =()=>{
     this.requestRef = db.collection("all_donations").where("donor_id" ,'==', this.state.donorId).onSnapshot((snapshot)=>{
       var allPetTranfers = []
       snapshot.docs.map((doc) =>{
         var donation = doc.data()
         donation["doc_id"] = doc.id
         allPetTranfers.push(donation)
       });
       this.setState({
         allPetTranfers : allPetTranfers
       });
     })
   }

   sendPet=(PetDetails)=>{
     if(PetDetails.request_status === "Pet Sent"){
       var requestStatus = "Donor Interested"
       db.collection("all_donations").doc(PetDetails.doc_id).update({
         "request_status" : "Donor Interested"
       })
       this.sendNotification(PetDetails,requestStatus)
     }
     else{
       var requestStatus = "Pet Sent"
       db.collection("all_donations").doc(PetDetails.doc_id).update({
         "request_status" : "Pet Sent"
       })
       this.sendNotification(PetDetails,requestStatus)
     }
   }

   sendNotification=(PetDetails,requestStatus)=>{
     var requestId = PetDetails.request_id
     var donorId = PetDetails.donor_id
     db.collection("all_notifications").where("request_id","==", requestId).where("donor_id","==",donorId).get().then((snapshot)=>{
       snapshot.forEach((doc) => {
         var message = ""
         if(requestStatus === "Pet Sent"){
           message = this.state.donorName + " sent you Pet"
         }else{
            message =  this.state.donorName  + " has shown interest in donating the Pet"
         }
         db.collection("all_notifications").doc(doc.id).update({
           "message": message,
           "notification_status" : "unread",
           "date"                : firebase.firestore.FieldValue.serverTimestamp()
         })
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.Pet_name}
       subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
       leftElement={<Icon name="Pet" type="font-awesome" color = {C2} />}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor : item.request_status === "Pet Sent" ? "green" : "#ff5722"
              }
            ]}
            onPress = {()=>{
              this.sendPet(item)
            }}
           >
             <Text style={{color:'#ffff'}}>{
               item.request_status === "Pet Sent" ? "Pet Sent" : "Send Pet"
             }</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )


   componentDidMount(){
     this.getDonorDetails(this.state.donorId)
     this.getAllDonations()
   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={{flex:1,backgroundColor:C1}}>
         <MyHeader navigation={this.props.navigation} title="Pet Transfers"/>
         <View style={{flex:1}}>
           {
             this.state.allPetTranfers.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 30, color:C3, fontWeight:'bold'}}>List of all Pet Donations</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allPetTranfers}
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
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
})