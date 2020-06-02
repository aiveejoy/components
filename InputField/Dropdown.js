import React, { Component } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class Dropdown extends Component{
  
  constructor(props){
    super(props);
  }

  render () {
    return (
      <View style={{
          marginTop: 10
        }}>
      </View>
    );
  }
}

export default Dropdown;