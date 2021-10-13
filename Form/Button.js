import React, {Component} from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { BasicStyles, Color } from 'common';
const Button = (props) => {
  return (
    <TouchableOpacity
      style={{
        ...BasicStyles.standardButton,
        ...props.style
      }}
      onPress={() => {
        props.onClick();
      }}>
      <Text style={{
        color: Color.white,
        textAlign: 'center',
        ...props.textStyle
      }}>{props.title}</Text>
    </TouchableOpacity>
  );
}

export default Button;
