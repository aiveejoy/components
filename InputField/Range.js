import React, { Component } from 'react';
import { View, TouchableHighlight, TextInput, Text } from 'react-native'
import { Color, BasicStyles} from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

class Range extends Component{
  constructor(props){
    super(props);
    this.state = {
      input: null
    }
  }

  setInput(input){
    this.setState({
      input: input
    })
    this.props.onTyping(input)
  }

  render() {
    return (
      <View style={{
        position: 'absolute',
        marginLeft: 20}}>
        <Text style={{color: 'black', marginLeft: 20, marginBottom: -10 }}>{this.props.title}</Text>
        <TextInput
          style={[BasicStyles.formControls, {marginLeft: 20, width: 315 }]}
          onChangeText={(input) => this.setInput(input)}
          value={this.state.input}
          placeholder={this.props.placeholder ? this.props.placeholder : 'Range'}
        />
      </View>
    )
  }

}

export default Range;
