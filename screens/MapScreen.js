import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import MapView, {MapMarker, Polygon} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const MapScreen = () => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [coordinates, setCoordinates] = useState([
    {latitude: 37.78825, longitude: -122.4324},
    {latitude: 37.78825, longitude: -122.4324},
    {latitude: 37.78825, longitude: -122.4324},
    {latitude: 37.78825, longitude: -122.4324},
  ]);

  async function requestPermissions() {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  }
  useEffect(() => {
    requestPermissions();
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setCoordinates([
          {latitude: latitude + 0.001, longitude: longitude - 0.001},
          {latitude: latitude + 0.001, longitude: longitude + 0.001},
          {latitude: latitude - 0.001, longitude: longitude + 0.001},
          {latitude: latitude - 0.001, longitude: longitude - 0.001},
        ]);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);

  return (
    <View style={styles.container}>
      {region && (
        <MapView style={styles.map} region={region}>
          <MapMarker coordinate={region} />
          <Polygon coordinates={coordinates} />
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 5,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default MapScreen;
