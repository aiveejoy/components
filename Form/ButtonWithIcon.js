import React, {Component} from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { BasicStyles, Color } from 'common';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
class ButtonWithIcon extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          ...BasicStyles.standardButton,
          ...this.props.style,
          height: 'auto',
          paddingTop: 20,
          paddingBottom: 20
        }}
        onPress={() => {
          this.props.onClick();
        }}>
        <FontAwesomeIcon icon={this.props.icon} size={30} color={Color.white}/>
        <Text style={{
          color: Color.white,
          textAlign: 'center',
          ...this.props.textStyle,
          paddingTop: 10
        }}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}

export default ButtonWithIcon;
