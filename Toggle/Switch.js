import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, Text, TouchableHighlight} from 'react-native';
import { Routes, Color, Helper } from 'common';
class Switch extends Component{
  constructor(props){
    super(props);
    this.state = {
      height: 30
    }
  }
  render() {
     const { height } = this.state;
    return (
      <View style={{
        borderRadius: parseInt(height / 2) + 1,
        height: height + 2,
        width: (height * 2) + 10,
        borderColor: this.props.value ? Color.primary : Color.danger,
        borderWidth: 1,
        alignItems: this.props.value ? 'flex-end' : 'flex-start'
      }}>
        <TouchableHighlight style={{
          height: height,
          width: height,
          borderRadius: parseInt(height / 2),
          backgroundColor: this.props.value ? Color.primary : Color.danger,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onPress={() => {
          this.props.onChange(!this.props.value)
        }}
        >
          <Text style={{
            fontSize: 8,
            color: Color.white
          }}>
            {
              this.props.value ? 'ON' : 'OFF'
            }
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
export default Switch;