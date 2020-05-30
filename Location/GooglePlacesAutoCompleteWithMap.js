import React, { Component } from 'react';
import { View,StyleSheet,AppRegistry,Text, Modal, TouchableOpacity} from 'react-native';
import { Routes, Color, BasicStyles} from 'common';
import GooglePlacesAutoComplete from './GooglePlacesAutoComplete.js'
import Api from 'services/api/index.js';
import Style from './Style.js';
import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE, Marker,Callout } from 'react-native-maps';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import Geolocation from '@react-native-community/geolocation';
class GooglePlacesAutoCompleteWithMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errorMessage: null,
      region: null,
      visible: false,
      location: null
    };
  }

  componentDidMount(){
    Geolocation.setRNConfiguration({
      skipPermissionRequests: true,
      authorizationLevel: 'whenInUse'
    });
  }

  _mapView = () => {
    const { location } = this.state;
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
         <MapView
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50
          }}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location != null ? location.latitude : 10.3729029,
            longitude: location != null ? location.longitude : 123.9547173,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          >
          {(location != null && location.route != 'xx' && location.locality != 'xx') && 
            (
              <Marker
                coordinate={{
                  longitude: parseFloat(location.longitude),
                  latitude: parseFloat(location.latitude),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                title={location.route + ', ' + location.locality + ', ' + location.country}
              />
            )
        }

        {(location != null && location.route == 'xx' && location.locality == 'xx') && 
            (
              <Marker
                coordinate={{
                  longitude: parseFloat(location.longitude),
                  latitude: parseFloat(location.latitude),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                title={'Current Location'}
              />
            )
        }
        </MapView>
      </View>
    );
  }

  currentLocation = () => {
    Geolocation.getCurrentPosition(info => {
      this.setState({
        location: {
          longitude: info.coords.longitude,
          latitude: info.coords.latitude,
          route: 'xx',
          locality: 'xx',
          country: 'xx',
          region: 'xx'
        }
      })
    })
  }

  onFinish = () => {
    this.props.onFinish(this.state.location)
    this.setState({
      visible: false
    })
  }

  manageLocation = (location) => {
    this.setState({
      location: location
    })
  }

  _modal = () => {
    return (
      <View style={{
        backgroundColor: Color.secondary
      }}>
        <Modal isVisible={this.state.visible} style={{
          padding: 0,
          margin: 0,
          position: 'relative'
        }}>
          {this._mapView()}
          <View style={{
            position: 'absolute',
            backgroundColor: Color.white,
            zIndex: 100,
            width: '100%'
          }}>
            <GooglePlacesAutoComplete 
              onFinish={(location) => this.manageLocation(location)}
              placeholder={'Start typing location'}
              onChange={() => {}}
              zIndex={100}
            />
          </View>
          <TouchableOpacity
            onPress={() => this.currentLocation()} 
            style={{
              justifyContent: 'center',
              height: 50,
              width: '50%',
              backgroundColor: Color.white,
              position: 'absolute',
              zIndex: 50,
              top: 60,
              left: 5,
              borderRadius: 5
            }}
            >
            <View style={{
              flexDirection: 'row'
            }}>
            <FontAwesomeIcon icon={ faMapMarker } size={BasicStyles.iconSize}
            style={[BasicStyles.iconStyle, {
              color: Color.primary
            }]}/>
            <Text style={{
              color: Color.primary,
            }}>Current location</Text>
            </View>
          </TouchableOpacity>
          <View style={{
            width: '100%',
            position: 'absolute',
            bottom: 0,
            left: 0,
            zIndex: 100,
            flexDirection: 'row',
            height: 50,
            backgroundColor: Color.white
          }}>
            <TouchableOpacity
              onPress={() => this.setState({
                visible: false,
                location: null
              })} 
              style={{
                justifyContent: 'center',
                height: 50,
                width: '50%',
                backgroundColor: Color.white,
                borderRightWidth: 1,
                borderRightColor: Color.gray
              }}
              >
              <Text style={{
                color: Color.danger,
                textAlign: 'center'
              }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.onFinish()} 
              style={{
                justifyContent: 'center',
                height: 50,
                width: '50%',
                backgroundColor: Color.white
              }}
              >
              <Text style={{
                color: Color.primary,
                textAlign: 'center'
              }}>Use</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  render() {
    const { location } = this.state;
    return (
      <View style={[Style.MainContainer, {
        position: 'relative',
        zIndex: this.props.zIndex ? this.props.zIndex : 2,
        backgroundColor: Color.white
      }]}>
        <TouchableOpacity
          onPress={() => {
            this.setState({visible: true})
          }} 
          style={{
            justifyContent: 'center',
            height: 50,
            borderRadius: 5,
            width: '100%',
            backgroundColor: Color.white,
            borderWidth: 1,
            borderColor: Color.gray,
            marginBottom: 20
          }}
          >
          {
            (location != null && location.country != 'xx' && location.route != 'xx' && location.locality != 'xx') && (
              <Text style={{
                color: Color.primary,
                paddingLeft: 10
              }}>{location.route + ', ' + location.locality + ', ' + location.country}</Text>
            )
          }
          {
            (location != null && location.country == 'xx' && location.route == 'xx' && location.locality == 'xx') && (
              <Text style={{
                color: Color.primary,
                paddingLeft: 10
              }}>Curent Location</Text>
            )
          }
          {
            location == null && (
              <Text style={{
                color: Color.gray,
                paddingLeft: 10
              }}>{this.props.placeholder ? this.props.placeholder : 'Type Location'}</Text>
            )
          }
        </TouchableOpacity>
        {
          this.state.visible === true && this._modal()
        }
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setPreviousRoute: (previousRoute) => dispatch(actions.setPreviousRoute(previousRoute))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  
)(GooglePlacesAutoCompleteWithMap);

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    paddingTop: 40,
  },
  TextInputStyle: {
    width: '100%',
    height: 40,
    marginTop: 20,
    borderWidth: 1,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingTop: 8,
    marginTop: 10,
    paddingBottom: 8,
    backgroundColor: '#F44336',
    marginBottom: 20,
  },
  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  destinationInput: {
    borderWidth: 0.5,
    borderColor: "grey",
    height: 40,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    padding: 5,
    backgroundColor: "white"
  },
  button: {
    width: 300,
    backgroundColor: '#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
},
container: {

  flex: 1,
  // justifyContent: 'center',
  // alignItems: 'center',
},
 map: {
  //     width: screen.width,
  // height: Dimensions.get('window').height,
  ...StyleSheet.absoluteFillObject,

},
});
