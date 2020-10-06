import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faCircle, faStopwatch, faImage } from '@fortawesome/free-solid-svg-icons';
import Config from 'src/config.js'
import Style from './Style'

export default class ShopThumbnail extends Component {
  numberFormatter = (num) => (
    Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k+' : Math.sign(num)*Math.abs(num)
  )

  render() {
    const { details } = this.props
    const { logo, name, rating, preparation_time, distance, prefix } = details

    const ImageDisplay = (
      logo == null 
      ? <FontAwesomeIcon icon={faImage} size={100} style={[Style.image, {color: '#ccc'}]} />
      : <Image source={{ uri: Config.BACKEND_URL + logo }} style={Style.image} />
    )

    const TagsDisplay = (
      prefix == null
      ? ''
      : prefix
    )

    const PreparationTime = preparation_time || null

    const DistanceDisplay = (
      distance == null
      ? null
      : distance.toFixed(2)
    )

    return (
      <View>
        <View style={Style.container}>
          <View style={Style.imageContainer}>
            { ImageDisplay }
          </View>
          <View style={Style.detailsContainer}>
            <View style={Style.upper}>
              <Text style={Style.title} numberOfLines={2}>
                { name }
              </Text>
              <Text style={Style.tags} numberOfLines={1}>
                { TagsDisplay }
              </Text>
            </View>
            <View style={Style.lower}>
              <View style={Style.ratings}>
                <FontAwesomeIcon icon={faStar} size={15} style={Style.starRatings} />
                <Text style={Style.avgRating}>
                  { rating == null ? null : rating.avg }
                </Text>
                <Text style={Style.totalReviews}>
                  { 
                    rating == null
                    ? null
                    : `(${this.numberFormatter(rating.total)} ${rating.total > 1 ? 'reviews' : 'review'})`
                  }
                </Text>
              </View>
              <View style={Style.timeAndDistance}>
                {
                  PreparationTime && (
                    <>
                      <FontAwesomeIcon icon={faStopwatch} size={15} />
                      <Text style={Style.deliveryTime}>
                        { `${PreparationTime} min` }
                      </Text>
                      <FontAwesomeIcon icon={faCircle} size={5} style={Style.circleDivider} />
                    </>
                  )
                }
                <Text style={Style.distance}>
                  { DistanceDisplay && `${DistanceDisplay} km` }
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
