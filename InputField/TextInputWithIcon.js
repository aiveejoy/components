import React, { Component } from 'react';
import { View, Text, TextInput, TouchableHighlight} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-brands-svg-icons'
import { Color, BasicStyles } from 'common';
class TextInputWithIcon extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      flag: false,
      input: null
    }
  }

  setInput(input){
    this.setState({
      input: input
    })
    this.props.onTyping(input)
  }

  render () {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: 50,
        marginBottom: 20
        }}>
        <FontAwesomeIcon icon={this.props.icon} size={20} color={Color.primary}/>
        <TextInput
          style={{
            ...BasicStyles.standardFormControl,
            ...this.props.style
          }}
          onChangeText={(input) => this.setInput(input)}
          value={this.state.input}
          placeholder={this.props.placeholder}
        />
      </View>
    );
  }
}

export default TextInputWithIcon;