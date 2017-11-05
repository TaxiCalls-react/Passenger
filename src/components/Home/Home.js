//import liraries
import React, { Component } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TextInput, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import { List, ListItem, Button} from 'react-native-elements'

// create a component
class Home extends React.Component {

  constructor(){
    super();

    this.state = {
      latitudeFrom: null,
      longitudeFrom: null,
      latitudeTo: null,
      longitudeTo: null,
      availableDrivers: [
        {
          id: 'Amy Farha',
          atualCoordinate: {
            latitude: 1,
            longitude: 1
          }
        },
        {
          id: 'Chris Jackson',
          atualCoordinate: {
            latitude: 1,
            longitude: 1
          }
        },
      ],
      notifications: [
          {
            fromId: 'Amy Farha',
            createdTime: '21/10/2000:23h00min',
            content: 'Vice President'
          },
          {
            fromId: 'Chris Jackson',
            createdTime: '22/10/2000:00h00min',
            content: 'Vice Chairman'
          },
        ]
    };
  }

  static navigationOptions = {
    title: 'Home'
  };

  getAvailableDrivers() {
    return fetch('http://192.168.25.6:8080/passengers/trips/drivers/available', {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "addressFrom": {
      		"coordinate": {
      			"latitude": this.state.latitudeFrom,
      			"longitude": this.state.longitudeFrom
      		}
      	},
      	"addressTo": {
      		"coordinate": {
      			"latitude": this.state.latitudeTo,
      			"longitude": this.state.longitudeTo
      		}
      	}
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.status == "SUCCESSFUL") {
        ToastAndroid.show('OK', ToastAndroid.SHORT);
        this.setState({availableDrivers: responseJson.entity});
      } else {
        alert(JSON.stringify(responseJson));
      }
    })
    .catch((error) => {
      ToastAndroid.show('Network Failed', ToastAndroid.SHORT);
    });
  }

  chooseDriver(id){
    const { params } = this.props.navigation.state;
    return fetch('http://192.168.25.6:8080/passengers/trips/drivers/choose', {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "driver": {
      		"id": id
      	},
      	"passenger": {
      		"id": params.user.id
      	}
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.status == "SUCCESSFUL") {
        ToastAndroid.show('Driver Choosen', ToastAndroid.SHORT);
      } else {
        alert(JSON.stringify(responseJson));
      }
    })
    .catch((error) => {
      ToastAndroid.show('Network Failed', ToastAndroid.SHORT);
    });
  }

  checkNotifications() {
    const { params } = this.props.navigation.state;
    return fetch('http://192.168.25.6:8080/passengers/notifications/check', {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
      	"id": params.user.id
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.status == "SUCCESSFUL") {
        ToastAndroid.show('OK', ToastAndroid.SHORT);
        this.setState({notifications: responseJson.entity});
      } else {
        alert(JSON.stringify(responseJson));
      }
    })
    .catch((error) => {
      ToastAndroid.show('Network Failed', ToastAndroid.SHORT);
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <ScrollView>
        <Text>Hello {params.user.email}</Text>
        <TextInput autoCapitalize="none"
                   onChangeText={(latitudeFrom) => this.setState({latitudeFrom})}
                   autoCorrect={false}
                   returnKeyType="next"
                   placeholder='latitudeFrom'
                   placeholderTextColor='rgba(10,10,10,0.7)' />

        <TextInput placeholder='longitudeFrom'
                   onChangeText={(longitudeFrom) => this.setState({longitudeFrom})}
                   placeholderTextColor='rgba(10,10,10,0.7)' />

        <TextInput autoCapitalize="none"
                   onChangeText={(latitudeTo) => this.setState({latitudeTo})}
                   autoCorrect={false}
                   returnKeyType="next"
                   placeholder='latitudeTo'
                   placeholderTextColor='rgba(10,10,10,0.7)' />

        <TextInput placeholder='longitudeTo'
                   onChangeText={(longitudeTo) => this.setState({longitudeTo})}
                   placeholderTextColor='rgba(10,10,10,0.7)' />
        <Button title='getAvailableDrivers' onPress={() => this.getAvailableDrivers()} />
        <List containerStyle={{marginBottom: 20}}>
          {
            this.state.availableDrivers.map((l, i) => (
              <ListItem
                key={i}
                title={l.id}
                subtitle={"(" + l.atualCoordinate.latitude + ", " + l.atualCoordinate.longitude + ")"}
                onPress={() => this.chooseDriver(l.id)}
              />
            ))
          }
        </List>
        <Button title='checkNotifications' onPress={() => this.checkNotifications()} />
        <List containerStyle={{marginBottom: 20}}>
          {
            this.state.notifications.map((l, i) => (
              <ListItem
                key={i}
                title={l.fromId}
                subtitle={"[" + l.createdTime + "] " + l.content}
              />
            ))
          }
        </List>
        <Button title="logoff" onPress={() => navigate('Login')} />
      </ScrollView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },
    loginContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        width: 300,
        height: 100
    },
    title:{
        color: "#FFF",
        marginTop: 120,
        width: 180,
        textAlign: 'center',
        opacity: 0.9
    }
});

//make this component available to the app
export default Home;
