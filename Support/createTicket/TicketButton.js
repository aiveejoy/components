import React, {Component} from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';

import styles from 'components/Support/createTicket/Styles.js';

class TicketButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableOpacity
        style={[
          styles.CustomButtonContainer,
          {
            backgroundColor: this.props.buttonColor,
            width: this.props.buttonWidth,
            height: this.props.buttonHeight,
            borderRadius: 100
          },
        ]}
        onPress={() => {
          this.props.onPress();
        }}>
        <View style={styles.ButtonTextContainer}>
          <Text
            style={[
              styles.ButtonTextStyle,
              {fontSize: this.props.fontSize, color: this.props.textColor},
            ]}>
            {this.props.buttonText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default TicketButton;
