import React, { Component } from 'react';
import { View, TouchableHighlight, TextInput, Text } from 'react-native'
import { Color, BasicStyles} from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

class InputSelect extends Component{
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
      <TouchableHighlight>
        <View style={{
          marginLeft: 20,
          width: '90%'}}>
          <Text style={{color: 'black', marginBottom: -10 }}>{this.props.title}</Text>
          <TextInput
            style={[BasicStyles.formControls, {width: '100%' }]}
            onFocus={() => this.props.routeTo()
            }
            value={this.state.input}
            placeholder={this.props.placeholder ? this.props.placeholder : 'Categories'}
          />
        <TouchableHighlight
          style={{
            position: 'absolute',
            right: 10,
            top: 30
          }}
          underlayColor={Color.white}
          >
          <Text>All</Text>
        </TouchableHighlight>
      </View>
    </TouchableHighlight>
    )
  }

}

export default InputSelect;
