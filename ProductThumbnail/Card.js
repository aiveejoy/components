import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faStopwatch, faImage } from '@fortawesome/free-solid-svg-icons';
import Config from 'src/config.js'
import Style from './CardStyle';

class Card extends Component {
  render() {
    const { details } = this.props
    const {
      title,
      rating,
      image,
      distance,
      delivery_time
    } = details

    const ProductImage = (
      image == null 
      ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faImage} size={100} style={{ color: '#ccc' }} />
          </View>
        )
      : <Image source={ image ? { uri: Config.BACKEND_URL + image[0].url } : {} } style={Style.image} />
    )

    const DeliveryTime = (
      delivery_time == null
      ? '20min'
      : `${details.delivery_time}min`
    )

    const DistanceDisplay = (
      distance == null
      ? null
      : distance.toFixed(2)
    )

    return (
      <View style={Style.container}>
        <View style={Style.promoContainer}>
          {
            details.promo != null && details.promo.map((data, id) => (
              <View key={id} style={Style.promoView}>
                <Text style={Style.promoText}>{data}</Text>
              </View>
            ))
          }
        </View>
        <View style={Style.imageContainer}>
          { ProductImage }
        </View>
        <View style={Style.details}>
          <View>
            <Text
              style={Style.title}
              numberOfLines={1}
            >
              { title || 'Product' }
            </Text>
          </View>
          <View style={Style.info}>
            <View style={Style.ratings}>
              <FontAwesomeIcon icon={faStar} size={15} style={Style.starRatings} />
              <Text style={Style.textRatings}>
                { rating != null ? rating.avg : null  }
              </Text>
            </View>
            <View style={Style.deliveryTime}>
              <FontAwesomeIcon icon={faStopwatch} size={15} style={Style.expectedTime} />
              <Text style={Style.timeText}>
                { DeliveryTime }
              </Text>
            </View>
            <View>
              <Text style={Style.distance}>
                { DistanceDisplay && `${DistanceDisplay}km` }
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Card;