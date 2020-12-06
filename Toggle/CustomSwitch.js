import React, {Component} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';

class CustomSwitch extends Component {
  constructor(props) {
    super(props);
    console.log('PROPS', this.props);
  }

  render() {
    return (
      <TouchableHighlight
        onPress={() => this.props.onToggle()}
        style={[
          styles.SwitchContainer,
          {backgroundColor: this.props.isEnabled ? '#5983EB' : '#C6C6C6'},
        ]}>
        {this.props.isEnabled ? (
          <View style={styles.TouchContainer}>
            <View style={styles.TextContainer}>
              <Text style={[styles.TextStyle, {color: '#FFFFFF'}]}>ON</Text>
            </View>
            <View
              style={[
                styles.ToggleContainer,
                ,
                {backgroundColor: '#FFFFFF'},
              ]}></View>
          </View>
        ) : (
          <View style={styles.TouchContainer}>
            <View
              style={[
                styles.ToggleContainer,
                {backgroundColor: '#F2F2F2'},
              ]}></View>

            <View style={styles.TextContainer}>
              <Text style={[styles.TextStyle, {color: '#676767'}]}>OFF</Text>
            </View>
          </View>
        )}
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  SwitchContainer: {
    height: 25,
    width: 60,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TouchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    flexDirection: 'row',
  },
  ToggleContainer: {
    width: '50%',
    height: '80%',
    borderRadius: 6,
  },
  TextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: '80%',
  },
  TextStyle: {
    fontSize: 12,
  },
});

export default CustomSwitch;
