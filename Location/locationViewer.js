import React, { Component } from 'react';
import {
  Platform,
  PermissionsAndroid,
  View,
  Image
} from 'react-native';
import {Color} from 'common';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { connect } from 'react-redux';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Style from './LocationWithMapStyles';
import Config from 'src/config.js'
import { Marker } from 'react-native-maps';

class CurrentLocation extends Component {

  #location = {}

  constructor(props) {
    super(props)
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
        formatted_address: null,
      }
    }
  }

  componentDidMount() {
  }

  renderMap = () => {
    return (
      <View style={Style.container}
      >
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
          region={{
            ...this.state.region,
            latitude: parseFloat(this.props.navigation.state.params.data.latitude),
            longitude: parseFloat(this.props.navigation.state.params.data.longitude)
          }}
          // onPanDrag={this.setMapDragging}
          onRegionChangeComplete={(e) => {
            this.setState({
              region: this.state.region
            })
          }}
        >
          <Marker
            key={0}
            coordinate={{
              ...this.state.region,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
              latitude: parseFloat(this.props.navigation.state.params.data.latitude),
              longitude: parseFloat(this.props.navigation.state.params.data.longitude)
            }}
            title={this.props.navigation.state.params.data.route}
          />
        </MapView>
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderMap()}
      </View>
    )
  }
}
const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setLocation: (location) => dispatch(actions.setLocation(location))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrentLocation);
