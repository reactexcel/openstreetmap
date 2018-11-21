import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  PermissionsAndroid,
  BackAndroid,
  Alert
} from "react-native";
import Mapbox from "@mapbox/react-native-mapbox-gl";

Mapbox.setAccessToken(
  "pk.eyJ1Ijoicm9oaXQtZXhjZWwiLCJhIjoiY2puazdzN204MTJ3djNwcG16ZWp5aTRqNCJ9.YdBNjhTJohN5QlYLSdzSFA"
);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null
    };
  }
  async componentDidMount() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "OpenStreetMap App Permission",
          message: "OpenStreetMap App needs access to your location "
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        navigator.geolocation.watchPosition(
          position => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null
            });
          },
          error => this.setState({ error: error.message }),
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
          // change enableHighAccuracy value to false if true doesn't work
        );
      } else {
        Alert.alert(
          "Permission Denied",
          "Permission Denied for location access",
          [{ text: "OK", onPress: () => BackAndroid.exitApp() }],
          { cancelable: false }
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }

  renderAnnotations() {
    return (
      <Mapbox.PointAnnotation
        key="pointAnnotation"
        id="pointAnnotation"
        coordinate={[77.3281, 28.5952]}
      >
        <View style={styles.annotationContainer}>
          <View style={styles.annotationFill} />
        </View>
      </Mapbox.PointAnnotation>
    );
  }
  onUserLocationUpdate = (location) => {
    console.log(location,'asd')
    this.setState({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }
  render() {
    console.log(this.state, "state");
    const { latitude, longitude } = this.state;
    return (
      <View style={styles.container}>
        {longitude && latitude ? (
          <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            animated
            zoomLevel={15}
            showUserLocation
            style={styles.container}
            centerCoordinate={[longitude, latitude]}
            onUserLocationUpdate={this.onUserLocationUpdate}
            showUserLocation
            userTrackingMode={Mapbox.UserTrackingModes.FollowWithCourse}
            logoEnabled={false}
          />
        ) : (
          <View style={styles.indicator}>
            <ActivityIndicator size="large" color="red" />
            <View style={styles.textView}>
              <Text style={styles.text}>Getting Your Location...</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textView: {
    marginTop: 20
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1b1b1b"
  }
});
