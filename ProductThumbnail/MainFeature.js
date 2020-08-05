import React, { Component } from 'react';
import { View, Image } from 'react-native';
import Style from './MainFeatureStyle';
import Config from 'src/config.js'

class MainFeature extends Component {
  render() {
    const { details } = this.props

    return (
      <View style={Style.container}>
        <View style={Style.imageContainer}>
          <Image
            source={{ uri: Config.BACKEND_URL + details.img_url }}
            style={Style.image}
          />
        </View>
      </View>
    );
  }
}

export default MainFeature;