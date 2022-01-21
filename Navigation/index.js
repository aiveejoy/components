import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Color, BasicStyles } from 'common';
import { connect } from 'react-redux';
import _ from 'lodash';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import StreetView from 'react-native-streetview';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      churches: [],
      isLoading: false,
      isMapReady: false,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
        formatted_address: null,
      },
      location: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
        formatted_address: null,
      },
      mapType: 'standard',
      streetView: false
    }
  }

  onRegionChange = (region) => {
    this.setState({
      region: region
    })
  };

  onMapLayout = () => {
    this.setState({ isMapReady: true });
  };

  componentDidMount() {
    const config = {
      enableHighAccuracy: false
    };
    Geolocation.getCurrentPosition(
      info =>
        this.setState({
          region: {
            ...this.state.region,
            latitude: info.coords.latitude,
            longitude: info.coords.longitude
          }
        }),
      error => console.log("ERROR", error),
      config,
    );
    this.setState({
      location: {
        latitude: parseFloat(this.props.navigation.state?.params?.location?.latitude),
        latitudeDelta: 0.12,
        longitude: parseFloat(this.props.navigation.state?.params?.location?.longitude),
        longitudeDelta: 0.12
      }
    })
  }

  renderMap = () => {
    const { region, mapType, streetView, location } = this.state;
    const { theme } = this.props.state;
    return (
      <View>
        <MapView
          style={{
            minWidth: width - 50,
            minHeight: height - 67,
            flex: 1,
            borderRadius: BasicStyles.standardBorderRadius
          }}
          mapType={mapType}
          ref={(ref) => (this.mapView = ref)}
          onMapReady={this.onMapLayout}
          provider={PROVIDER_GOOGLE}
          region={region} // without this the map won't move. but layo kaayo ang map
          // onRegionChangeComplete={(e) => this.onRegionChange(e)} // without this dili momove ang map but dili machange ang current loc as you move the map
        >
          {
            this.state.isMapReady &&
            <Marker
              key={0}
              coordinate={region}
              title={'My Location'}
            >
              <Image
                source={require('src/assets/userPosition.png')}
                style={{
                  width: 50,
                  height: 50
                }}
              />
            </Marker>
          }
          {
            this.state.isMapReady && location &&
            <Marker
              key={0}
              coordinate={location}
              title={"User's Location"}
            >
              <Image
                source={require('src/assets/userPosition.png')}
                style={{
                  width: 50,
                  height: 50
                }}
              />
            </Marker>
          }
        </MapView>
      </View>
    );
  };

  render() {
    const { language, theme } = this.props.state;
    const { isLoading, region, streetView, mapType } = this.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground,
        height: '100%'
      }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View>
            <View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 60,
                  right: 10,
                  zIndex: 100,
                  padding: 10,
                  borderRadius: 20,
                  backgroundColor: theme ? theme.primary : Color.primary
                }}
                onPress={() => {
                  this.setState({ mapType: mapType === 'standard' ? 'satellite' : 'standard' })
                }}
              >
                <Text style={{ color: 'white' }}>{mapType === 'standard' ? 'Satellite View' : 'Standard View'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  zIndex: 100,
                  padding: 10,
                  borderRadius: 20,
                  backgroundColor: !streetView ? (theme ? theme.primary : Color.primary) : Color.danger
                }}
                onPress={() => {
                  this.setState({ streetView: !streetView })
                }}
              >
                <Text style={{ color: 'white' }}>{!streetView ? 'Enable Street View' : 'Disable Street View'}</Text>
              </TouchableOpacity>
              {streetView &&
                <View style={{
                  flex: 1
                }}>
                  <StreetView
                    style={{
                      minWidth: width - 50,
                      minHeight: height - 67,
                      margin: 0
                    }}
                    allGesturesEnabled={true}
                    coordinate={region}
                    pov={{
                      tilt: parseFloat(0),
                      bearing: parseFloat(0),
                      zoom: parseInt(1)
                    }}
                    onSuccess={() => console.log('map loaded')}
                    onError={(event) => console.log('failed to load map', event.nativeEvent)}
                  />
                </View>}
              {!streetView && this.renderMap()}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Navigation);
