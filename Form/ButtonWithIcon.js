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
          height: 100,
          ...this.props.style,
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 5,
          paddingRight: 5,
        }}
        onPress={() => {
          this.props.onClick();
        }}>
        <FontAwesomeIcon icon={this.props.icon} size={30} color={Color.white}/>
        <Text style={{
          color: Color.white,
          textAlign: 'center',
          ...this.props.textStyle,
          paddingTop: 10,
        }}>{this.props.title}</Text>
        {
          this.props.description && (
            <Text style={{
              color: Color.white,
              textAlign: 'center',
              ...this.props.descriptionStyle,
              paddingTop: 10
            }}>{this.props.description}</Text>
          )
        }
        
      </TouchableOpacity>
    );
  }
}

export default ButtonWithIcon;
