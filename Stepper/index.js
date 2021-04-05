import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {BasicStyles, Color} from 'common';
import StepIndicator from 'react-native-step-indicator';
import {connect} from 'react-redux';

class Stepper extends Component {
  render(){
    const { theme } = this.props.state;
    return (
      <View>
        <StepIndicator
         customStyles={{
          stepIndicatorSize: 35,
          currentStepIndicatorSize: 40,
          separatorStrokeWidth: 1,
          currentStepStrokeWidth: 1,
          stepStrokeCurrentColor: theme ? theme.secondary : Color.secondary,
          stepStrokeWidth: 1,
          stepStrokeFinishedColor: theme ? theme.secondary : Color.secondary,
          stepStrokeUnFinishedColor: Color.gray,
          separatorFinishedColor: theme ? theme.secondary : Color.secondary,
          separatorUnFinishedColor: Color.gray,
          stepIndicatorFinishedColor: theme ? theme.secondary : Color.secondary,
          stepIndicatorUnFinishedColor: Color.white,
          stepIndicatorCurrentColor: theme ? theme.secondary : Color.secondary,
          stepIndicatorLabelFontSize: BasicStyles.standardFontSize,
          currentStepIndicatorLabelFontSize: BasicStyles.standardFontSize,
          stepIndicatorLabelCurrentColor: Color.white,
          stepIndicatorLabelFinishedColor: Color.white,
          stepIndicatorLabelUnFinishedColor: Color.gray,
          labelColor: Color.gray,
          labelSize: BasicStyles.standardFontSize,
          currentStepLabelColor: theme ? theme.secondary : Color.secondary
         }}
         currentPosition={this.props.currentPosition}
         labels={this.props.labels}
         stepCount={this.props.stepCount}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stepper);