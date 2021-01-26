import React, {Component} from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { BasicStyles, Color } from 'common';
class Button extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          ...BasicStyles.standardButton,
          ...this.props.style
        }}
        onPress={() => {
          this.props.onClick();
        }}>
        <Text style={{
          color: Color.white,
          textAlign: 'center',
          ...this.props.textStyle
        }}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}

export default Button;
