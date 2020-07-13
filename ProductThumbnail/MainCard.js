import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Style from './MainCardStyle';

class MainCard extends Component {
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
          <View style={Style.distanceView}>
            <Text style={Style.distanceText}>{ details.distance }km</Text>
          </View>
        </View>
        <View style={Style.details}>
          <View style={Style.leftSide}>
            <Text style={Style.title}>
              { details.title }
            </Text>
            <Text style={Style.tags}>
              {
                details.tags.map((tag, i) => `${tag}${i + 1 === details.tags.length ? '' : ','}`) 
              }
            </Text>
          </View>
          <View style={Style.rightSide}>
            <View style={Style.ratings}>
              <FontAwesomeIcon icon={faStar} size={20} style={Style.starRatings} />
              <Text style={Style.textRatings}>{ details.ratings.avg }</Text>
            </View>
            <Text style={Style.totalRatings}>({ numberFormatter(details.ratings.total) || 0 })</Text>
          </View>
        </View>
      </View>
    );
  }
}


export default MainCard;