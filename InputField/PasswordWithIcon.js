import React, { Component } from 'react';
import { View, Text, TextInput, TouchableHighlight} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEyeSlash, faEye, faLock } from '@fortawesome/free-solid-svg-icons';
import { fas } from '@fortawesome/free-brands-svg-icons'
import { Color, BasicStyles } from 'common';
class PasswordInputWithIconLeft extends Component{
  
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
        marginBottom: 10,
        }}>
        {/* <TouchableHighlight
          onPress={() => this.setState({
            flag: !this.state.flag
          })}
          style={{
            position: 'absolute',
            left: 5,
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 10
          }}
          underlayColor={Color.white}
          > */}
          <FontAwesomeIcon style={{marginLeft: -10}} icon={faLock} size={20} color={Color.primary}/>
        {/* </TouchableHighlight> */}
        <TextInput
          style={{
            ...BasicStyles.standardFormControl,
            ...this.props.style
          }}
          onChangeText={(input) => this.setInput(input)}
          value={this.state.input}
          placeholder={this.props.placeholder ? this.props.placeholder : '*******'}
          secureTextEntry={this.state.flag == false ? true : false}
          placeholderTextColor={'#d1d1d1'}
        />
        <TouchableHighlight
          onPress={() => this.setState({
            flag: !this.state.flag
          })}
          style={{
            position: 'absolute',
            right: 10,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          underlayColor={Color.white}
          >
          <FontAwesomeIcon icon={this.state.flag == false ? faEyeSlash : faEye} size={20} color={Color.primary}/>
        </TouchableHighlight>
      </View>
    );
  }
}

export default PasswordInputWithIconLeft;