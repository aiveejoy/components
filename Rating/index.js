import React, {Component} from 'react';
import styles from './Style';
import {Text, View, TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import {BasicStyles, Color} from 'common';

class Rating extends Component {
  render(){
    const { ratings } = this.props;
    let stars = []
    for(let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesomeIcon
        icon={(ratings.stars > i) ? faStar : faStarRegular}
        size={20}
        style={{
          color: Color.warning,
          marginTop: 5
        }}
        key={i}
        />
      )
    }
    return (
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <Text style={{
          color: Color.normalGray,
          lineHeight: 30,
          fontSize: 12
        }}>Ratings ({ratings.size})</Text>
        {
          stars
        }
      </View>
    );
  }
}

export default Rating;