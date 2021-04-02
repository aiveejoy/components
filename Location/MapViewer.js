import React, { Component } from 'react';
import {
  Platform,
  PermissionsAndroid,
  View,
  Image
} from 'react-native';
import {Color, BasicStyles} from 'common';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { connect } from 'react-redux';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Config from 'src/config.js'
import { Marker } from 'react-native-maps';

class MapViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        formatted_address: null,
      }
    }
  }

  onRegionChange = (region) => {
    this.setState({
      region: region
    })
  };

  renderMap = () => {
    return (
      <View>
        <MapView
          style={{
            width: '100%',
            height: '100%',
            borderRadius: BasicStyles.standardBorderRadius
          }}
          ref={(ref) => (this.mapView = ref)}
          provider={PROVIDER_GOOGLE}
          region={{
            ...this.props.data,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
          onRegionChangeComplete={(e) => this.onRegionChange(e)}
        >
          <Marker
            key={0}
            coordinate={this.props.data}
            title={this.props.data.route}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapViewer);
