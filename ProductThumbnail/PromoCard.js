import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Style from './PromoCardStyle';

class PromoCard extends Component {
  render() {
    const { details } = this.props;
    return (
      <View style={Style.container}>
        <Text style={Style.heading}>{ details.heading }</Text>
        <Text style={Style.caption}>{ details.caption }</Text>
      </View>
    );
  }
}

export default PromoCard;