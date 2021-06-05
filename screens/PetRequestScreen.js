import React, { Component } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Alert,
  Image,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { SearchBar, ListItem, Input } from "react-native-elements";

import MyHeader from "../components/MyHeader";
//import { BookSearch } from "react-native-google-books";

export default class PetRequestScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      PetType: "",
      reasonToRequest: "",
      IsPetRequestActive: "",
      requestedPetType: "",
      PetStatus: "",
      requestId: "",
      userDocId: "",
      docId: "",
      Imagelink: "#",
      dataSource: "",
      requestedImageLink: "",
      showFlatlist: false,
      age:'',
      gender:''
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (PetType, reasonToRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    /*
    var Pets = await BookSearch.searchPet(
      PetType,
      'AIzaSyC3qADo1attODj_if-STd6ZXfKxiOFdJEs'
    );
    */


    db.collection("requested_Pets").add({
      user_id: userId,
      Pet_name: PetType,
      reason_to_request: reasonToRequest,
      request_id: randomRequestId,
      Pet_status: "requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
      //image_link: Pets.data[0].volumeInfo.imageLinks.thumbnail,
      age:this.state.age,
      gender:this.state.gender
    });

    await this.getPetRequest();
    db.collection("users").where("email_id", "==", userId).get().then().then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            IsPetRequestActive: true,
          });
        });
      });

    this.setState({
      PetType: "",
      reasonToRequest: "",
      gender:'',
      age:'',
      requestId: randomRequestId,
    });

    return Alert.alert("Pet Requested Successfully");
  };

  receivedPets = (PetType) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("received_Pets").add({
      user_id: userId,
      Pet_name: PetType,
      request_id: requestId,
      PetStatus: "received",
    });
  };

  getIsPetRequestActive() {
    db.collection("users").where("email_id", "==", this.state.userId).onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            IsPetRequestActive: doc.data().IsPetRequestActive,
            userDocId: doc.id,
          });
        });
      });
  }

  getPetRequest = () => {
    // getting the requested Pet
    db.collection("requested_Pets").where("user_id", "==", this.state.userId).get().then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().Pet_status !== "received") {
            this.setState({
              requestId: doc.data().request_id,
              requestedPetType: doc.data().Pet_name,
              PetStatus: doc.data().Pet_status,
              //requestedImageLink: doc.data().image_link,
              docId: doc.id,
              age:doc.data().age
            });
          }
        });
      });
  };

  sendNotification = () => {
    //to get the first name and last name
    db.collection("users").where("email_id", "==", this.state.userId).get().then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;

          // to get the donor id and Pet nam
          db.collection("all_notifications").where("request_id", "==", this.state.requestId).get().then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var PetType = doc.data().Pet_name;

                //targert user id is the donor id to send notification to the user
                db.collection("all_notifications").add({
                  targeted_user_id: donorId,
                  message:
                    name + " " + lastName + " received the Pet " + PetType,
                  notification_status: "unread",
                  Pet_name: PetType,
                });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getPetRequest();
    this.getIsPetRequestActive();
  }

  updatePetRequestStatus = () => {
    //updating the Pet status after receiving the Pet
    db.collection("requested_Pets").doc(this.state.docId).update({
      Pet_status: "received",
    });

    //getting the  doc id to update the users doc
    db.collection("users").where("email_id", "==", this.state.userId).get().then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection("users").doc(doc.id).update({
            IsPetRequestActive: false,
          });
        });
      });
  };

  /*
  async getPetsFromApi(PetType) {
    this.setState({ PetType: PetType });
    if (PetType.length > 2) {
      var Pets = await BookSearch.searchPet(
        PetType,
        'AIzaSyC3qADo1attODj_if-STd6ZXfKxiOFdJEs'
      );
      this.setState({
        dataSource: Pets.data,
        showFlatlist: true,
      });
    }
  }
  */

  //render Items  functionto render the Pets from api
  renderItem = ({ item, i }) => {

    /*
    let obj = {
      title: item.volumeInfo.title,
      selfLink: item.selfLink,
      buyLink: item.saleInfo.buyLink,
      imageLink: item.volumeInfo.imageLinks,
    };
    */

    return (
      <TouchableHighlight
        style={styles.touchableopacity}
        activeOpacity={0.6}
        underlayColor={C1}
        onPress={() => {
          this.setState({
            showFlatlist: false,
            PetType: item.volumeInfo.title,
          });
        }}
        bottomDivider
      >
        <Text style = {{fontSize:15, color:C3}}> {item.volumeInfo.title} </Text>
      </TouchableHighlight>
    );
  };

  render() {
    if (this.state.IsPetRequestActive === true) {
      return (
        <ScrollView style={{ flex: 1, backgroundColor:C1}}>
          <View
            style={{
              flex: 0.1,
            }}
          >
            <MyHeader title="Pet Status" navigation={this.props.navigation} />
          </View>
          {<View
            //style={styles.ImageView}
          >
            {/*<Image
              source={{ uri: this.state.requestedImageLink }}
              style={styles.imageStyle}
            />*/}
          </View>}
          <View style={styles.Petstatus}>
            <Text style={styles.title}> Type of Pet</Text>
            <Text style={styles.description}>{this.state.requestedPetType}</Text>
            <Text style={styles.title}>Status: </Text>
            <Text style={styles.description}>{this.state.PetStatus}</Text>
            <Text style={styles.title}>Age: </Text>
            <Text style={styles.description}>{this.state.age}</Text>
          </View>
          <View
            style={styles.buttonView}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.sendNotification();
                this.updatePetRequestStatus();
                this.receivedPets(this.state.requestedPetType);
              }}
            >
              <Text style={styles.buttontxt}>Pet Recived</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }
    return (
      <ScrollView style={{ flex: 1, backgroundColor:C1 }}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="Request Pet" navigation={this.props.navigation} />
        </View>
        <View style={{ flex: 0.9 }}>
          {this.state.showFlatlist ? (
            <FlatList
              data={this.state.dataSource}
              renderItem={this.renderItem}
              enableEmptySections={true}
              style={{ marginTop: RFValue(10) }}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <KeyboardAvoidingView style={{ alignItems: "center" }}>
              <Input
                style={styles.formTextInput}
                label={"Pet Type"}
                labelStyle = {{color:C2}}
                placeholder={"Pet Type"}
                containerStyle={{ marginTop: RFValue(60) }}
                //onChangeText={(text) => this.getPetsFromApi(text)}
                //onClear={(text) => this.getPetsFromApi("")}
                onChangeText={(text) => {
                  this.setState({
                    PetType: text,
                  });
                }}
                value={this.state.PetType}
              />
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(30) }}
                multiline
                numberOfLines={8}
                label={"Reason"}
                labelStyle = {{color:C2}}
                placeholder={"Why do you need the Pet"}
                onChangeText={(text) => {
                  this.setState({
                    reasonToRequest: text,
                  });
                }}
                value={this.state.reasonToRequest}
              />
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(30) }}
                multiline = {false}
                label={"Age"}
                labelStyle = {{color:C2}}
                placeholder={"Age of the Pet you Want"}
                onChangeText={(text) => {
                  this.setState({
                    age: text,
                  });
                }}
                value={this.state.age}
              />
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(30) }}
                multiline
                numberOfLines={8}
                labelStyle = {{color:C2}}
                label={"Gender"}
                placeholder={"Gender of the Pet you want"}
                onChangeText={(text) => {
                  this.setState({
                    gender: text,
                  });
                }}
                value={this.state.gender}
              />
              <TouchableOpacity
                style={[styles.button, { marginTop: RFValue(30) }]}
                onPress={() => {
                  this.addRequest(
                    this.state.PetType,
                    this.state.reasonToRequest
                  );
                }}
              >
                <Text
                  style={styles.requestbuttontxt}
                >
                  Request
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          )}
        </View>
      </ScrollView>
    );
  }
}

var C1 = '#004643'; //background
var C2 = "#44BBA4"; //labels and loginbox
var C3 = "#E7BB41"; //button
var C4 = '#393E41'; //second bg
var C5 = '#E7E5DF'; //text

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "80%",
    height: RFValue(10),
    borderWidth: 1.5,
    borderColor: C2,
    borderRadius:20,
    fontSize: RFValue(12),
    paddingLeft: RFValue(10),
    color:C5
  },
  ImageView:{
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop:20
  },
  imageStyle:{
    height: RFValue(150),
    width: RFValue(150),
    alignSelf: "center",
    borderWidth: 5,
    borderRadius: RFValue(10),
  },
  Petstatus:{
    flex: 0.5,
    alignItems: "center",
  },
  title:{
    fontSize: RFValue(25),
    fontWeight: "500",
    fontWeight: "bold",
    marginLeft:20,
    color:C2,
    marginTop:20
  },
  description:{
    fontSize: RFValue(20),
    fontWeight: "bold",
    marginTop: 10,
    color:C5
  },
  buttonView:{
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttontxt:{
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: C1,
  },
  touchableopacity:{
    alignItems: "center",
    backgroundColor: C3,
    padding: 10,
    width: "90%",
  },
  requestbuttontxt:{
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: C1,
  },
  button: {
    width: "75%",
    height: RFValue(60),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
    backgroundColor: C3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:10
  },
});