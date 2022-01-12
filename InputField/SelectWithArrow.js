import React, { Component } from 'react';
import { View, Text, TextInput, TouchableHighlight} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Color, BasicStyles } from 'common';
class SelectWithArrow extends Component{
  
  constructor(props){
    super(props);
  }

  render () {
    const { value } = this.props;
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: 50,
        marginBottom: 10,
        }}>
        <Text>{value ? value : 'Select'}</Text>
        <TouchableHighlight
          onPress={() => {

          }}
          style={{
            position: 'absolute',
            right: 10,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          underlayColor={Color.white}
          >
          <FontAwesomeIcon icon={faChevronRight} size={20} color={Color.primary}/>
        </TouchableHighlight>
      </View>
    );
  }
}

export default SelectWithArrow;