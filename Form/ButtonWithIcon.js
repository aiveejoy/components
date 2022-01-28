import React, {Component} from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import { BasicStyles, Color } from 'common';
class ButtonWithIcon extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          ...BasicStyles.standardButton,
          height: 100,
          ...this.props.style,
          paddingTop: 5,
          paddingBottom: 30,
          paddingLeft: 5,
          paddingRight: 5,
        }}
        onPress={() => {
          this.props.onClick();
        }}>
          <Image
          style={{
            marginTop: 25,
            height: 45,
            width: 45}}
          resizeMode={'cover'}
          source={this.props.image}
        />
        {/* <FontAwesomeIcon icon={this.props.icon} size={30} color={Color.white}/> */}
        <Text style={{
          color: Color.white,
          textAlign: 'center',
          ...this.props.textStyle,
          paddingTop: 1,
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
