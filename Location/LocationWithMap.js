  
import React, {Component} from 'react';
import Style from './LocationWithMapStyles';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Keyboard
} from 'react-native';
import {Color} from 'common';
import {connect} from 'react-redux';
import {faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTimes, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Config from 'src/config.js';
import BasicStyles from '../../common/BasicStyles';
import CustomGooglePlacesAutocomplete  from './GooglePlacesAutoComplete'


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
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
        formatted_address: null,
      },
      isDraggingMap: false,
      locationPicked: false,
      pinnedLocation: false,
      type: null,
      address_region: null,
      watchID: null,
      province: null,
      route: null,
      locality: null,
      country: null,
      postal: null
    };
  }

  async componentDidMount() {
    await this.requestPermission();
    Geolocation.clearWatch(this.state.watchID);
  }

  requestPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
      // this.returnToOriginal();
      this.getCurrentLocationIOS();
    } else {
      let granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'App Geolocation Permission',
          message: "App needs access to your phone's location.",
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.returnToOriginal()
        this.getCurrentLocationAndroid();
      } else {
        console.log('Location permission not granted!!!!');
      }
    }
  };

  getCurrentLocationIOS = async () => {
    const {user} = this.props.state;
    Geocoder.init('AIzaSyAxT8ShiwiI7AUlmRdmDp5Wg_QtaGMpTjg');
    Geolocation.getCurrentPosition(
      (info) => {
        this.setState({
          region: {
            ...this.state.region,
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
          },
        });
        this.getLocationDetails(info.coords.latitude, info.coords.longitude)
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 2000,
      },
    ); //Transfer this to if(user!=null) when api available

    if (user != null) {
    }
  };

  getCurrentLocationAndroid = () => {
    Geocoder.init('AIzaSyAxT8ShiwiI7AUlmRdmDp5Wg_QtaGMpTjg');
    // let watchID = Geolocation.watchPosition(position => {
    //   console.log('-------------------------------------------TESTING----------------------------------------------', position)
    //   this.setState({
    //     region: {
    //       ...this.state.region,
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //     },
    //     pinnedLocation: false,
    //     address: null,
    //   });
    // },
    // (error) => {
    //   console.log(error.message);
    // },
    // { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 }
    // )

    // this.setState({
    //   watchID: watchID
    // })
    let watchID = Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        const currentLocation = {
          longitude: currentLongitude,
          latitude: currentLatitude,
        };
        this.setState({
          region: {
            ...this.state.region,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          pinnedLocation: true,
        });
        this.getLocationDetails(position.coords.latitude, position.coords.longitude)
        // this.onRegionChange(this.state.region);
        console.log('-------------------------------------------TESTING----------------------------------------------', position)
      },
      error => alert(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
    this.setState({
      watchID: watchID
    })
  }

  UNSAFE_componentWillMount() {}

  setMapDragging = () => {
    if (!this.state.isDraggingMap) {
      this.setState({
        isDraggingMap: true,
      });
    }

  };

  getLocationDetails = (latitude, longitude) => {
    Geocoder.from(latitude, longitude).then((json) => {
      var details = json.results[0].formatted_address.split(', ');
        // latitude: latitude,
        // longitude: longitude,
        // route: details[0],
        // locality: details[2],
        // region: details[3],
        // country: details[4],
        // postal: null

        // route: this.state.route,
        //   address: this.state.address,
        //   province: this.state.province,
        //   locality: this.state.locality,
        //   region: this.state.address_region,
        //   country: this.state.country,
        //   postal: this.state.postal ? this.state.postal : null,
        //   latitude: this.state.region.latitude,
        //   longitude: this.state.region.longitude,
      this.setState({
        address: json.results[0].formatted_address,
        route: details[0],
        locality: details[2],
        province: details[3],
        country: details[4],
        latitude: latitude,
        longitude: longitude,
        postal: null,
        region: {
          ...this.state.region,
          longitude: longitude,
          latitude: latitude,
          formatted_address: json.results[0].formatted_address
        }
      })
      console.log({
        details
      })
    }).catch((error) => console.warn(error));
  }

  returnToOriginal = () => {
    Geolocation.getCurrentPosition((info) => {
      console.log(info)
      this.setState({
        region: {
          ...this.state.region,
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        },
        pinnedLocation: false
      });
      this.getLocationDetails(info.coords.latitude, info.coords.longitude)
    },
    (error) => {
      console.log(error.message);
    },
    { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 }
    );
  };

  onRegionChange = (regionUpdate) => {
    if (this.state.isDraggingMap) {
      this.setState({
        isDraggingMap: false,
      });
    }
    
    if (!this.state.isDraggingMap) {
      return;
    }

    this.setState({region: regionUpdate, pinnedLocation: true});
    Geocoder.from(regionUpdate.latitude, regionUpdate.longitude)
    .then((json) => {
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
      .catch((error) => console.warn(error));
  };

  manageLocation = (location) => {
    let address = null;
    let route = null;
    let locality = null;
    let province = null;
    let region = null;
    let country = null;
    let latitude = null;
    let longitude = null;
    let postal = null;

    if(Platform.OS == 'ios'){
      console.log('selection location', JSON.stringify(location))
      this.setState(
        {
          region: {
            ...this.state.region,
            latitude: location.latitude,
            longitude: location.longitude,
            formatted_address: location.route,
          },
          address: location.route,
          area: location.region,
          locality: location.locality,
          address_region: location.region,
          country: location.country,
          postal: postal,
          province: location.region,
          route: location.route
        }
      );
    }else{
      address = location.formatted_address;
      location.address_components.forEach(el => {
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
      longitude = location.geometry.location.lng;
      latitude = location.geometry.location.lat;
      this.setState(
        {
          region: {
            ...this.state.region,
            latitude: latitude,
            longitude: longitude,
            formatted_address: address,
          },
          address: address,
          area: location.region,
          locality: locality,
          address_region: region,
          country: country,
          postal: postal,
          province: province,
          route: route
        },
        () => {
          console.log('ADDRESS', this.state.region.formatted_address);
        },
      );
    }
  };

  onFinish = () => {
    const setLocation = this.props.setLocation;
    if (this.state.address == null) {
      alert('Please Input an Address or Use the Pin');
    } else
      this.setState({locationPicked: true}, () => {
      const location = {
        route: this.state.route,
        address: this.state.address,
        province: this.state.province,
        locality: this.state.locality,
        region: this.state.address_region,
        country: this.state.country,
        postal: this.state.postal ? this.state.postal : null,
        latitude: this.state.region.latitude,
        longitude: this.state.region.longitude,
      };
      console.log({
        newLocation: location
      })
      // console.log('LOCATION IN COMPONENT', location);
      setLocation(location);
      this.props.navigation.pop();
    });
  };

  clearLocation = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss()
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

  renderSearchBarIOS = () => {
    return (
      <View style={{
        position: 'absolute',
        top: 20,
        left: 0,
        right: 10,
        width: '100%',
        flexDirection: 'row'
      }}>
        <View style={{
          height: 60,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {this.renderBackButton()}
        </View>
        <CustomGooglePlacesAutocomplete
          onChange={() => {
            //
          }}
          onFinish={(location) => {
            this.setState({
              region: location
            })
            this.manageLocation(location)
          }}
          />
      </View>
    )
  }

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
          flexDirection: 'row'
        }}>
        <TouchableOpacity
          onPress={() => {
            // const{setLocation} = this.props;
            // setLocation(null);
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
          ref={(instance) => {
            this.GooglePlacesRef = instance;
          }}
          renderRightButton={() => this.clearLocation()}
          placeholder="Find location"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
          listViewDisplayed={false} // true/false/undefined
          fetchDetails={true}
          renderDescription={(row) => row.description} // custom description render
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
              width: '100%'
            },
            textInputContainer: {
              width: '100%',
              backgroundColor: Color.white,
              borderColor: Color.gray,
              borderWidth: 1,
              height: 50,
              borderRadius: BasicStyles.formControl.borderRadius ? BasicStyles.formControl.borderRadius : 10,
            },
            textInput: {
              height: 48,
              marginTop: 1,
              borderRadius: 25
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
    const { theme } = this.props.state
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
          ref={(ref) => (this.mapView = ref)}
          provider={PROVIDER_GOOGLE}
          region={this.state.region}
          // onPanDrag={this.setMapDragging}
          // onRegionChangeComplete={(e) => this.onRegionChange(e)}
          // onDragEnd={(e) => {
          //   console.log('onDragEnd', e)
          // }}
          //onPress={()=>this.animate()}
        >
          <Marker.Animated
              draggable
              coordinate={this.state.region}
              onDragEnd={(e) => {
                const coords = e.nativeEvent.coordinate;
                console.log('test', coords)
                this.getLocationDetails(coords.latitude, coords.longitude)
              }}
            >
              <Image
                source={require('src/assets/userPosition.png')}
                style={{
                  width: 80,
                  height: 80
                }}
                />
            </Marker.Animated>

          </MapView>

        <TouchableOpacity
          onPress={() => this.returnToOriginal()}
          style={{
            justifyContent: 'center',
            alignSelf: 'flex-end',
            marginRight: 30,
            height: 40,
            width: 40,
            backgroundColor: Color.primary,
            borderRadius: 20,
            bottom: 20,
            position: 'absolute',
          }}>
          <FontAwesomeIcon
            style={{alignSelf: 'center'}}
            icon={faMapMarkerAlt}
            color={'white'}
          />
        </TouchableOpacity>
        
      </View>
    );
  };
  render() {
    const {theme} = this.props.state;
    return (
      <View style={{flex: 1}}>
        {this.renderMap()}
        {Platform.OS  == 'android' && this.renderSearchBar()}
        {Platform.OS  == 'ios' && this.renderSearchBarIOS()}
        {
          this.state.address && (
            <TouchableOpacity
              onPress={() => this.onFinish()}
              disabled={!this.state.address}
              style={{
                justifyContent: 'center',
                height: 50,
                width: '90%',
                marginLeft: '5%',
                marginRight: '5%',
                backgroundColor: (theme ? theme.secondary : Color.secondary),
                borderRadius: BasicStyles.formControl.borderRadius ? BasicStyles.formControl.borderRadius : 15,
                bottom: 20,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                Use Location
              </Text>
            </TouchableOpacity>
          )
        }
      </View>
    );
  }
}
const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    // updateUser: (user) => dispatch(actions.updateUser(user)),
    setLocation: (location) => dispatch(actions.setLocation(location))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationWithMap);
