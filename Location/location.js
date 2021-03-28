import React, { Component } from 'react';
import {
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {connect} from 'react-redux';

class CurrentLocation extends Component{
  #region = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    formatted_address: null,
  };

  #location = {}

  constructor(props) {
    super(props) 
    this.state = {}
  }
  
  componentDidMount() {
    this.#requestPermission()
  }

  #requestPermission = async () => {

    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      await this.#getCurrentLocation();
    } else {
      let granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'App Geolocation Permission',
          message: "App needs access to your phone's location.",
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await this.#getCurrentLocation();
      } else {
        console.log('Location permission not granted!!!!');
      }
    }
  };

  #getCurrentLocation = () => {
    Geocoder.init('AIzaSyAxT8ShiwiI7AUlmRdmDp5Wg_QtaGMpTjg');
    let watchID = Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);

        const currentLatitude = JSON.stringify(position.coords.latitude);
        const currentLocation = {
          longitude: currentLongitude,
          latitude: currentLatitude,
        };

        this.#region = {
          ...this.#region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },

        this.#onRegionChange(this.#region)
      },
      error => alert(error.message),
      {
        enableHighAccuracy: true,
        // timeout: 20000,
        // maximumAge: 1000,
      },
    );
  }

  #onRegionChange = (regionUpdate) => {

    Geocoder.from(regionUpdate.latitude, regionUpdate.longitude)

    .then((json) => {
      var addressComponent = json.results[0].formatted_address.split(', ');
      let address = null;
      let route = null;
      let locality = null;
      let province = null;
      let region = null;
      let country = null;
      let latitude = null;
      let longitude = null;
      let postal = null;
      
      address = json.results[0].formatted_address;
      json.results[0].address_components.forEach(el => {
        if(el.types.includes('route')) {
          route = el.long_name;
        }else if(el.types.includes('locality')){
          locality = el.long_name;
        }else if(el.types.includes('administrative_area_level_2')){
          province = el.long_name;
        }else if(el.types.includes('administrative_area_level_1')){
          region = el.long_name;
        }else if(el.types.includes('country')){
          country = el.long_name;
        }else if(el.types.includes('postal_code')){
          postal = el.long_name;
        }
      })
      
      longitude = json.results[0].geometry.location.lng;
      latitude = json.results[0].geometry.location.lat;
      
      this.#location = {
        route: route,
        address: address,
        province: province,
        locality: locality,
        region: region,
        country: country,
        postal: postal,
        latitude: latitude,
        longitude: longitude,
      };

      const{setLocation} = this.props
      setLocation(this.#location)
      
    }).catch((error) => 
      this.#location = error
    );

  };

  render() {
    return (
      <></>
    )
  }
}
const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    setLocation: (location) => dispatch(actions.setLocation(location))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrentLocation);
