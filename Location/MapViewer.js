import React, { Component } from 'react';
import {
  Platform,
  Dimensions,
  View
} from 'react-native';
import {Color, BasicStyles} from 'common';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { connect } from 'react-redux';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Config from 'src/config.js'
import { Marker } from 'react-native-maps';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

class MapViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMapReady: false,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
        formatted_address: null,
      }
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

  renderMap = () => {
    return (
      <View style={{
        borderRadius: BasicStyles.standardBorderRadius
      }}>
        <MapView
          style={{
            minWidth: Dimensions.get("window").width - 50,
            minHeight: Dimensions.get("window").height - 300,
            flex: 1,
            borderRadius: BasicStyles.standardBorderRadius
          }}
          ref={(ref) => (this.mapView = ref)}
          onMapReady={this.onMapLayout}
          provider={PROVIDER_GOOGLE}
          region={{
            ...this.props.data,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
            longitude: parseFloat(this.props.data.longitude),
            latitude: parseFloat(this.props.data.latitude)
          }}
          onRegionChangeComplete={(e) => this.onRegionChange(e)}
        >
          {
            this.state.isMapReady && (
              <Marker
                key={0}
                coordinate={{
                  ...this.props.data,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                  longitude: parseFloat(this.props.data.longitude),
                  latitude: parseFloat(this.props.data.latitude)
                }}
                title={this.props.data.route}
              />
            )
          }
        </MapView>
      </View>
    );
  };

  render() {
    return (
      <View style={{borderRadius: BasicStyles.standardBorderRadius}}>
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
