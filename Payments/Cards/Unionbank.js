import React, { Component } from 'react';
import { View, Text, TextInput, TouchableHighlight} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Color, BasicStyles } from 'common';
class Stack extends Component{
  
  constructor(props){
    super(props);
  }

  render () {
    const { value } = this.props;
    return (
      <TouchableHighlight
        onPress={() => {
        }}
        style={{
          width: '100%',
          borderRadius: 15,
          height: 250,
          backgroundColor: '#FFA300'
        }}
        underlayColor={Color.white}
        >
        <FontAwesomeIcon icon={faChevronRight} size={20} color={Color.primary}/>
      </TouchableHighlight>
    );
  }
}

export default Stack;