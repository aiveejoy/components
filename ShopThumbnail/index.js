import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faCircle, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { Color } from 'common';
import Style from './Style'

export default class ShopThumbnail extends Component {
  numberFormatter = (num) => (
    Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k+' : Math.sign(num)*Math.abs(num)
  )

  render() {
    const { details } = this.props
    let tags = ""
    tags = (
      details ? 
      details.tags.length > 0 ?
      details.tags.map((tag, i) => (
        tags = `${tag}${i + 1 === details.tags.length ? '' : ', '}`
      ))
      : null
      : null
    )
    return (
      <View>
        <View style={Style.container}>
          <View style={Style.imageContainer}>
            <Image source={{ uri: details.logo }} style={Style.image} />
          </View>
          <View style={Style.detailsContainer}>
            <View style={Style.upper}>
              <Text style={Style.title} numberOfLines={2}>
                { details ? details.name : 'No title'}
              </Text>
              <Text style={Style.tags} numberOfLines={1}>
                {tags}
              </Text>
            </View>
            <View style={Style.lower}>
              <View style={Style.ratings}>
                <FontAwesomeIcon icon={faStar} size={15} style={Style.starRatings} />
                <Text style={Style.avgRating}>
                  { details ? details.ratings.avg : null }
                </Text>
                <Text style={Style.totalReviews}>
                  { details ? `(${this.numberFormatter(details.ratings.totalReviews)} reviews)` : null }
                </Text>
              </View>
              <View style={Style.timeAndDistance}>
                <FontAwesomeIcon icon={faStopwatch} size={15} />
                <Text style={Style.deliveryTime}>
                  { details ? `${details.delivery_time} min` : null }
                </Text>
                <FontAwesomeIcon icon={faCircle} size={5} style={Style.circleDivider} />
                <Text style={Style.distance}>
                  { details ? `${details.distance}km` : null }
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View 
          style={{ 
            borderBottomColor: 'rgba(0,0,0,0.1)',
            borderBottomWidth: 1,
            marginVertical: 20
          }}
        />
      </View>
    )
  }
}
