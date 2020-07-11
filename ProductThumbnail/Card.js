import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Style from './CardStyle';

class Card extends Component {
  render() {
    const { details } = this.props;
    const numberFormatter = (num) => (
      Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k+' : Math.sign(num)*Math.abs(num)
    )
    return (
      <View style={Style.container}>
        <View style={Style.promoContainer}>
          {
            details.promo.map((data, id) => (
              <View key={id} style={Style.promoView}>
                <Text style={Style.promoText}>{data}</Text>
              </View>
            ))
          }
        </View>
        <View style={Style.imageContainer}>
          <Image source={{ uri: 'https://' + details.img_url }} style={Style.image} />
        </View>
        <View style={Style.details}>
          <View>
            <Text
              style={Style.title}
              numberOfLines={1}
            >
              { details.title }
            </Text>
          </View>
          <View style={Style.info}>
            <View style={Style.ratings}>
              <FontAwesomeIcon icon={faStar} size={15} style={Style.starRatings} />
              <Text style={Style.textRatings}>{ details.ratings.avg  }</Text>
              <Text style={Style.totalRatings}>({ numberFormatter(details.ratings.total) || 0 })</Text>
            </View>
            <View>
              <Text style={Style.distance}>{ details.distance }km</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Card;