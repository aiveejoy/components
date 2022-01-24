import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity} from 'react-native';
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
      <TouchableOpacity
        onPress={() => {
            this.props.onPress()
        }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginBottom: 10,
                    ...BasicStyles.formControl,
                    alignItems: 'center'
                }}>
                    <Text style={{
                      paddingLeft: 20
                    }}>{value ? value : 'Select'}</Text>
                    <View
                    style={{
                        position: 'absolute',
                        right: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    underlayColor={Color.white}
                    >
                    <FontAwesomeIcon icon={faChevronRight} size={20} color={Color.primary}/>
                    </View>
            </View>
        
      </TouchableOpacity>
    );
  }
}

export default SelectWithArrow;