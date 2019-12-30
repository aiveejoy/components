import React, { Component } from 'react';
import { View, Text, ToastAndroid } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Config from 'src/config.js';
import { Color } from 'common';
import Style from './Style.js';
import { connect } from 'react-redux';
class LocationAutoComplete extends Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    const { setLocation } = this.props;
    setLocation(null);
  }

  manageLocation = (data) => {
    let address = data.address_components;
    if(address.length < 5){
      ToastAndroid.show('Please be specific with the address', ToastAndroid.LONG);
    }else{
      const { setLocation } = this.props;
      let geometry = data.geometry;
      let location = {
        route: address[0].long_name,
        locality: address[1].long_name,
        region: address[2].long_name,
        country: address[4].long_name,
        latitude: geometry.location.lat,
        longitude: geometry.location.lng
      }
      setLocation(location)
      this.props.navigation.navigate('createRequestStack')
    }
  }
  render() {
    return (
      <View style={Style.MainContainer}>
        <GooglePlacesAutocomplete
          placeholder='Find location'
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
          listViewDisplayed={false}    // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            this.manageLocation(details);
          }}

          getDefaultValue={() => ''}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: Config.GOOGLE.API_KEY,
            language: 'en', // language of the results
          }}

          styles={{
            container: {
              width: '100%'
            },
            textInputContainer: {
              width: '100%',
              backgroundColor: Color.white,
              borderColor: Color.gray,
              borderWidth: 1,
              height: 50
            },
            textInput: {
              height: 48,
              marginTop: 1
            },
            description: {
              fontWeight: 'bold'
            },
            predefinedPlacesDescription: {
              color: Color.primary
            },
            poweredContainer: {
              display: 'none'
            },
            listView: {
              backgroundColor: Color.white
            }
          }}

          // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          // currentLocationLabel="Current location"
          nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={{
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }}
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance'
          }}
          
          GooglePlacesDetailsQuery={{
            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
            fields: ['geometry', 'adr_address'],
          }}

          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setLocation: (location) => dispatch(actions.setLocation(location))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationAutoComplete);
