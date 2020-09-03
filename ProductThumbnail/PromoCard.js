import React, { Component } from 'react';
import { Text, View, Animated, Easing } from 'react-native';
import { Color } from 'common';
import Style from './PromoCardStyle';
import Currency from 'services/Currency';

class PromoCard extends Component {
  constructor(props) {
    super(props);
    this.colorValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.colorValue.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.colorValue, {
          toValue: 100,
          duration: 1000,
          ease: Easing.linear,
          useNativeDriver: false
        }),
        Animated.timing(this.colorValue, {
          toValue: 0,
          duration: 1000,
          ease: Easing.linear,
          useNativeDriver: false
        })
      ])
    ).start();
  }

  render() {
    const { details, theme, skeleton } = this.props;

    let content = null
    let discount = null
    if (skeleton == null) {
      if (details.type === 'fixed') {
        discount = Currency.display(+details.value, 'PHP')
      } else if (details.type === 'percentage') {
        discount = `${details.value}%`
      }

      content = (
        <View style={[Style.container, { backgroundColor: theme ? theme.primary : Color.primary }]}>
          <Text style={Style.heading}>{ details.description }</Text>
          <Text style={Style.heading}>{ details.code ? `Code: ${details.code}` : '' }</Text>
          <Text style={Style.caption}>{ details.type ? `Get up to ${discount}` : '' }</Text>
        </View>
      )

      this.colorValue.stopAnimation()
    } else {
      const colorAnimation = this.colorValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['#ccc', '#eee']
      });
      content = (
        <Animated.View style={[Style.container, { backgroundColor: colorAnimation, width: 100 }]}>
        </Animated.View>
      )
    }

    return content;
  }
}

export default PromoCard;