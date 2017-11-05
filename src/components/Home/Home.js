//import liraries
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import { List, ListItem, Button} from 'react-native-elements'

// create a component
class Home extends React.Component {

  constructor(){
    super();

    this.state = {
      availableDrivers: [
        {
          name: 'Amy Farha',
          subtitle: 'Vice President'
        },
        {
          name: 'Chris Jackson',
          subtitle: 'Vice Chairman'
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
      			"latitude": 1,
      			"longitude": 1
      		}
      	},
      	"addressTo": {
      		"coordinate": {
      			"latitude": 5,
      			"longitude": 5
      		}
      	}
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({availableDrivers: responseJson.entity});
    })
    .catch((error) => {
      ToastAndroid.show('Network Failed', ToastAndroid.SHORT);
    });
  }

  chooseDriver(){
    ToastAndroid.show('driverChoosen', ToastAndroid.SHORT);
  }

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <View>
        <Text>Hello {params.user.email}</Text>
        <Button title='getAvailableDrivers' onPress={() => this.getAvailableDrivers()} />
        <List containerStyle={{marginBottom: 20}}>
          {
            this.state.availableDrivers.map((l, i) => (
              <ListItem
                key={i}
                title={l.name}
                subtitle={l.subtitle}
                onPress={() => this.chooseDriver()}
              />
            ))
          }
        </List>

        <Button
          onPress={() => navigate('Login')}
          title="logoff"
        />
      </View>
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
