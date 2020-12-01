import React, {Component} from 'react';
import Style from './LocationWithMapStyles';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import {Color} from 'common';
import {GooglePlacesAutoComplete} from 'components';
import {connect} from 'react-redux';
import {faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTimes, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Config from 'src/config.js';

class LocationWithMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selected: null,
      data: null,
      address: null,
      locationChoice: null,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        formatted_address: null,
      },
      isDraggingMap: false,
      locationPicked: false,
      pinnedLocation: false,
      type: null,
    };
  }

  componentDidMount() {
    const {user} = this.props.state;
    Geocoder.init('AIzaSyAxT8ShiwiI7AUlmRdmDp5Wg_QtaGMpTjg');
    Geolocation.getCurrentPosition(
      info => {
        console.log('HELLOOO', info);
        this.setState({
          region: {
            ...this.state.region,
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
          },
        });
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 2000,
      },
    ); //Transfer this to if(user!=null) when api available

    if (user != null) {
    }
  }

  UNSAFE_componentWillMount() {}

  setMapDragging = () => {
    if (!this.state.isDraggingMap) {
      this.setState({
        isDraggingMap: true,
      });
    }
  };

  returnToOriginal = () => {
    Geolocation.getCurrentPosition(info => {
      console.log(info);
      this.setState({
        region: {
          ...this.state.region,
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        },
        pinnedLocation: false,
        address: null,
      });
    });
  };

  onRegionChange = regionUpdate => {
    if (this.state.isDraggingMap) {
      this.setState({
        isDraggingMap: false,
      });
    }

    if (!this.state.isDraggingMap) {
      return;
    }
    console.log('test', regionUpdate);
    this.setState({region: regionUpdate, pinnedLocation: true});
    Geocoder.from(regionUpdate.latitude, regionUpdate.longitude)
      .then(json => {
        var addressComponent = json.results[0].formatted_address.split(', ');
        this.setState({
          address:
            addressComponent[0] != 'Unnamed Road'
              ? addressComponent[0]
              : 'Pinned Location',
          locality: addressComponent[1],
          area: addressComponent[2],
          country: addressComponent[3],
        });
      })
      .catch(error => console.warn(error));
  };

  manageLocation = location => {
    console.log('ADDRESS', location);
    this.setState(
      {
        region: {
          ...this.state.region,
          latitude: location.geometry.location.lat,
          longitude: location.geometry.location.lng,
          formatted_address: location.formatted_address,
        },
        address: location.formatted_address,
        area: location.region,
        locality: location.locality,
        country: location.country,
      },
      () => {
        console.log('ADDRESS', this.state.region.formatted_address);
      },
    );
  };

  onFinish = () => {
    const setLocation = this.props.setLocation;
    if (this.state.address == null) {
      alert('Please Input an Address or Use the Pin');
    } else
      this.setState({locationPicked: true}, () => {
        setLocation(this.state.region);
        this.props.navigation.pop();
      });
  };

  clearLocation = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.GooglePlacesRef.setAddressText('');
          this.setState({errorMessage: null});
        }}>
        <FontAwesomeIcon
          icon={faTimes}
          size={20}
          style={{
            color: Color.gray,
            marginTop: 15,
            marginRight: 10,
          }}
        />
      </TouchableOpacity>
    );
  };

  renderSearchBar = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 20,
          left: 0,
          right: 10,
          width: '100%',
          paddingLeft: '12%',
          paddingRight: '8%',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.pop();
          }}
          style={{
            paddingTop: '3%',
            paddingLeft: '10%',
            position: 'absolute',
            left: 10,
            top: 10,
          }}>
          <FontAwesomeIcon icon={faChevronLeft} size={30} color="#000000" />
        </TouchableOpacity>
        <GooglePlacesAutocomplete
          ref={instance => {
            this.GooglePlacesRef = instance;
          }}
          renderRightButton={() => this.clearLocation()}
          placeholder="Find location"
          minLength={2} // minimum length of text to search
          autoFocus={true}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
          listViewDisplayed={false} // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            this.manageLocation(details);
          }}
          getDefaultValue={() => ''}
          selectTextOnFocus={true}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: Config.GOOGLE.API_KEY,
            language: 'en', // language of the results
          }}
          focusable={true}
          styles={{
            container: {
              width: '100%',
            },
            textInputContainer: {
              width: '100%',
              backgroundColor: Color.white,
              borderColor: Color.gray,
              borderWidth: 1,
              height: 50,
              borderRadius: 10,
            },
            textInput: {
              height: 48,
              marginTop: 1,
            },
            description: {
              fontWeight: 'bold',
            },
            predefinedPlacesDescription: {
              color: Color.primary,
            },
            poweredContainer: {
              display: 'none',
            },
            listView: {
              backgroundColor: Color.white,
            },
          }}
          currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={
            {
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }
          }
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
          }}
          GooglePlacesDetailsQuery={{
            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
            fields: ['geometry', 'adr_address'],
          }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          debounce={0} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />
      </View>
    );
  };

  renderBackButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.pop();
        }}>
        <FontAwesomeIcon icon={faChevronLeft} size={30} />
      </TouchableOpacity>
    );
  };

  renderMap = () => {
    return (
      <View style={Style.container}>
        <View
          style={{
            position: 'absolute',
            backgroundColor: Color.white,
            zIndex: 100,
            width: '100%',
          }}
        />

        <MapView
          style={Style.map}
          ref={ref => (this.mapView = ref)}
          provider={PROVIDER_GOOGLE}
          region={this.state.region}
          onPanDrag={this.setMapDragging}
          onRegionChangeComplete={e => this.onRegionChange(e)}
          //onPress={()=>this.animate()}
        />

        <View style={Style.imageContainer}>
          <Image
            source={require('../../assets/userPosition.png')}
            style={Style.image}
          />
        </View>

        <TouchableOpacity
          onPress={() => this.returnToOriginal()}
          style={{
            justifyContent: 'center',
            alignSelf: 'flex-end',
            marginRight: 30,
            height: 35,
            width: 35,
            backgroundColor: '#FF5B04',
            borderRadius: 35 / 2,
            bottom: 20,
            marginBottom: 5,
          }}>
          <FontAwesomeIcon
            style={{alignSelf: 'center'}}
            icon={faMapMarkerAlt}
            color={'white'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onFinish()}
          disabled={!this.state.address}
          style={{
            justifyContent: 'center',
            height: 50,
            width: '90%',
            backgroundColor: this.state.address ? '#22B173' : '#CCCCCC',
            borderRadius: 15,
            bottom: 20,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 15,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Use Location
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    const {isLoading, data} = this.state;
    const {user} = this.props.state;
    return (
      <View style={{flex: 1}}>
        {this.renderMap()}
        {this.renderSearchBar()}
      </View>
    );
  }
}
const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
    // updateUser: (user) => dispatch(actions.updateUser(user)),
    setLocation: location => dispatch(actions.setLocation(location)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationWithMap);
