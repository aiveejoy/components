import React, { Component } from 'react';
import { View, Text, TextInput, TouchableHighlight} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Color, BasicStyles } from 'common';
class PasswordWithIcon extends Component{
  
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
          position: 'relative',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <TextInput
          style={BasicStyles.formControl}
          onChangeText={(input) => this.setInput(input)}
          value={this.state.input}
          placeholder={this.props.placeholder ? this.props.placeholder : '*******'}
          secureTextEntry={this.state.flag == false ? true : false}
        />
        <TouchableHighlight onPress={() => this.setState({
          flag: !this.state.flag
        })}
        style={{
          position: 'absolute',
          right: 10,
          top: 15
        }}
        underlayColor={Color.white}
        >
          <FontAwesomeIcon icon={this.state.flag == false ? faEyeSlash : faEye} size={20}/>
        </TouchableHighlight>
      </View>
    );
  }
}

export default PasswordWithIcon;