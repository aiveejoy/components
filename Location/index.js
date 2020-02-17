import React, { Component } from 'react';
import { View, Text, ToastAndroid, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Config from 'src/config.js';
import { Color, Routes } from 'common';
import Style from './Style.js';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
class LocationAutoComplete extends Component{
  constructor(props){
    super(props);
    this.state = {
      errorMessage: null,
      isLoading: false
    }
  }

  componentDidMount(){
    const { setLocation } = this.props;
    setLocation(null);
  }

  checkLocation(location){
    let parameter = {
      condition: [{
        column: 'locality',
        clause: '=',
        value: location.locality
      }]
    }
    this.setState({errorMessage: null, isLoading: true})
    Api.request(Routes.investorLocationsRetrieve, parameter, response => {
      this.setState({isLoading: false})
      if(response.data.length > 0){
        const { setLocation } = this.props;
        setLocation(location)
        this.props.navigation.navigate('createRequestStack')
      }else{
        this.setState({ errorMessage: 'Location is not allowed!'})
      }
    })
  }

  manageLocation = (data) => {
    let address = data.address_components;
    if(address.length < 5){
      ToastAndroid.show('Please be specific with the address', ToastAndroid.LONG);
    }else{
      let geometry = data.geometry;
      let location = {
        route: address[0].long_name,
        locality: address[1].long_name,
        region: address[2].long_name,
        country: address[4].long_name,
        latitude: geometry.location.lat,
        longitude: geometry.location.lng
      }
      this.checkLocation(location)
    }
  }

  clearLocation = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.GooglePlacesRef.setAddressText('');
          this.setState({errorMessage: null})
      }}>
        <FontAwesomeIcon 
          icon={faTimes}
          size={20}
          style={{
            color: Color.gray,
            marginTop: 15,
            marginRight: 10
          }}
        />
      </TouchableOpacity>
    );
  }
  render() {
    const { isLoading } = this.state;
    return (
      <View style={Style.MainContainer}>
        {
          this.state.errorMessage != null && (
            <View style={{
              paddingLeft: 20,
              paddingRight: 20
            }}>
              <Text style={{
                color: Color.danger,
                lineHeight: 50
              }}>Opps! {this.state.errorMessage}</Text>
            </View> 
          ) 
        }
        <GooglePlacesAutocomplete
          ref={(instance) => { this.GooglePlacesRef = instance }}
          renderRightButton={() => this.clearLocation()}
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

        {isLoading ? <Spinner mode="overlay"/> : null }
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
