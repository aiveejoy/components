import React, { Component } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class Empty extends Component{
  
  constructor(props){
    super(props);
  }

  render () {
    return (
      <View style={{
        alignItems: 'center',
        height: height + 50
        }}>
          <FontAwesomeIcon
            icon={faSmile}
            size={100}
            style={{
              color: Color.primary,
              marginTop: 50,
            }}
          />
          <Text style={{
            color: Color.danger,
            paddingBottom: 50,
            paddingTop: 10,
            fontWeight: 'bold'
          }}>No activity for a moment!</Text>

          {
            this.props.refresh == true && (
              <TouchableOpacity
                onPress={() => this.props.onRefresh()} 
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  borderRadius: 5,
                  color: Color.primary,
                  backgroundColor: Color.white,
                  borderColor: Color.primary,
                  borderWidth: 1,
                  width: '50%'
                }}
                >
                <Text style={{
                  color: Color.primary,
                  fontSize: 11,
                  textAlign: 'center'
                }}>Reload</Text>
              </TouchableOpacity>
            )
          }
      </View>
    );
  }
}

export default Empty;