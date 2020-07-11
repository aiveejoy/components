import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import Style from './FeatureStyle';

class Feature extends Component {
  render() {
    const { details } = this.props;
    return (
      <View style={Style.container}>
        <View style={Style.imageContainer}>
          <Image
            source={{ uri: 'https://' + details.img_url }}
            style={Style.image}
          />
          <View style={Style.promoWrapper}>
            <View style={Style.promoView}>
              <Text style={Style.promoText}>{ details.text }</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Feature;