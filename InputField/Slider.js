import React, { Component } from 'react';
import { View, TouchableHighlight, Animated, Text } from 'react-native'
import { SliderPicker } from 'react-native-slider-picker';

class Sliders extends Component{
  constructor(props){
    super(props);
    this.state = {
      value: 1
    }
  }

  render() {
    return (
      <View style={{
        marginLeft: 20,
        justifyContent: 'center' }}>
        <Text style={{color: 'black', marginBottom: 0 }}>{this.props.title}</Text>
        <SliderPicker 
          callback={position => {
            this.setState({ value: position })
          }}
          defaultValue={this.props.value}
          labelFontColor={"#6c7682"}
          labelFontWeight={'600'}
          showFill={true}
          fillColor={'red'}
          labelFontWeight={'bold'}
          showNumberScale={true}
          showSeparatorScale={true}
          buttonBackgroundColor={'#fff'}
          buttonBorderColor={"#6c7682"}
          buttonBorderWidth={2}
          labelFontSize={15}
          scaleNumberFontWeight={'300'}
          buttonDimensionsPercentage={6}
          buttonBorderColor={'#5842D7'}
          heightPercentage={1}
          widthPercentage={90}
          sliderInnerBackgroundColor={'gray'}
          minLabel={'1km'}
          midLabel={'25km'}
          maxLabel={'50km'}
          maxValue={50}
        />
        {/* <Text>state.value: {this.state.value}</Text> */}
      </View>
    )
  }

}

export default Sliders;
