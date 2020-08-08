import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faStopwatch, faCircle, faPlay, faImage } from '@fortawesome/free-solid-svg-icons';
import { Color } from 'common'
import Config from 'src/config.js'
import Style from './MainCardStyle';

class MainCard extends Component {
  render() {
    const { details, theme } = this.props;
    const {
      title,
      description,
      rating,
      image,
      distance,
      delivery_time
    } = details

    const ProductImage = (
      image == null 
      ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faImage} size={150} style={{ color: '#ccc' }} />
          </View>
        )
      : <Image source={ image ? { uri: Config.BACKEND_URL + image[0].url } : {} } style={Style.image} />
    )

    const DistanceDisplay = (
      distance == null
      ? null
      : distance.toFixed(2)
    )

    const DeliveryTime = (
      delivery_time == null
      ? '20min'
      : `${details.delivery_time}min`
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
          { details.video_url != null && 
            <View style={Style.videoIndicator}>
              <FontAwesomeIcon icon={faPlay} size={15} style={Style.playIcon} />
              <Text style={Style.videoIndicatorText}>Hold to preview</Text>
            </View>
          }
        </View>
        <View style={Style.details}>
          <View style={Style.leftSide}>
            <Text style={[Style.title, { color: theme ? theme.primary : Color.primary }]} numberOfLines={1}>
              { title || 'Product' }
            </Text>
            <Text style={Style.tags}>
              {
                description || ''
              }
            </Text>
          </View>
          <View style={Style.rightSide}>
            <View style={Style.ratings}>
              <FontAwesomeIcon icon={faStar} size={20} style={Style.starRatings} />
              <Text style={Style.textRatings}>
                { rating ? rating.avg : ''}
              </Text>
            </View>
            <View style={Style.deliveryTime}>
              <FontAwesomeIcon icon={faStopwatch} size={14} />
              <Text style={Style.timeText}>
                { DeliveryTime }
              </Text>
              {
                DistanceDisplay &&
                <FontAwesomeIcon icon={faCircle} size={5} style={Style.circleDivider} />
              }
              <Text style={Style.distanceText}>
                { DistanceDisplay && `${DistanceDisplay}km` }
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}


export default MainCard;