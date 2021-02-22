import React, { Component } from 'react';
import { View, TouchableHighlight, Animated, Text } from 'react-native'
import RangeSlider, { Slider } from 'react-native-range-slider-expo';
import { Color, BasicStyles} from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';

class Sliders extends Component{
  constructor(props){
    super(props);
    this.state = {
      input: null,
      value: null
    }
  }

  render() {
    return (
      <View style={{
        marginLeft: 20}}>
        <Text style={{color: 'black', marginLeft: 20, marginBottom: 10 }}>{this.props.title}</Text>
        <SliderPicker 
          minLabel={'0'}
          midLabel={'50'}
          maxLabel={'100'}
          maxValue={100}
          callback={position => {
            this.setState({ value: position });
          }}
          defaultValue={this.state.value}
          labelFontColor={"#6c7682"}
          labelFontWeight={'600'}
          showFill={true}
          fillColor={'red'}
          labelFontWeight={'bold'}
          showNumberScale={true}
          showSeparatorScale={true}
          buttonBackgroundColor={'#fff'}
          buttonBorderColor={"#6c7682"}
          buttonBorderWidth={1}
          scaleNumberFontWeight={'300'}
          buttonDimensionsPercentage={6}
          heightPercentage={1}
          widthPercentage={80}
        />
        
        <Text>state.value: {this.state.value}</Text>
      </View>
    )
  }

}

export default Sliders;
