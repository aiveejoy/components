import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Color } from 'common';
import Style from './PromoCardStyle';

class PromoCard extends Component {
  render() {
    const { details, theme } = this.props;
    return (
      <View style={[Style.container, { backgroundColor: theme ? theme.primary : Color.primary }]}>
        <Text style={Style.heading}>{ details.heading }</Text>
        <Text style={Style.caption}>{ details.caption }</Text>
      </View>
    );
  }
}

export default PromoCard;