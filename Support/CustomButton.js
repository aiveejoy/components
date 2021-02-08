import React, {Component} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import Style from 'components/Support/Style';

class CustomButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={[
          Style.ButtonContainer
        ]}
        onPress={() => {
          console.log('Submitt');
          this.props.onPress();
        }}>
        <Text style={[Style.ButtonTextStyle]}>Create Ticket</Text>
      </TouchableOpacity>
    );
  }
}

export default CustomButton;
