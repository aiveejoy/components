import React, { Component } from 'react';
import { View, TouchableHighlight, TextInput, Text } from 'react-native'
import { Color, BasicStyles} from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

class NumberInput extends Component{
  constructor(props){
    super(props);
    this.state = {
      input: 0,
      clicks: 1,
    }
  }

setInput(clicks){
    this.setState({
        clicks: clicks
    })
    this.props.onTyping(clicks)
}

IncrementItem = () => {
    this.setState({ clicks: this.state.clicks + 1 })
}

DecreaseItem = () => {
    console.log('here')
    if(this.state.clicks - 1 >= 1){
    this.setState({ clicks: this.state.clicks - 1 })
    }
}

  render() {
    return (
      <View style={{
        position: 'absolute',
        marginLeft: 20}}>
        <Text style={{color: 'black', marginLeft: 20, marginBottom: -10, width: 100}}>{this.props.title}</Text>
        <TextInput
          style={[BasicStyles.formControls, {marginLeft: 20, width: 315}]}
          onChangeText={(clicks) => this.setInput(this.state.clicks)}  
          placeholder={this.props.placeholder ? this.props.placeholder : '0'}
        />
        <TouchableHighlight
        style={{
          position: 'absolute',
          // right: 15,
          top: 15,
          marginLeft: '305%',
        }}
        underlayColor={Color.white}
        // onPress={this.IncrementItem()}
        >
        <FontAwesomeIcon style={{color: 'grey'}} icon={faCaretUp} size={25}/>
        </TouchableHighlight>
        <TouchableHighlight
        style={{
          position: 'absolute',
          // right: 15,
          top: 30,
          marginLeft: '305%',
        }}
        underlayColor={Color.white}
        onPress={this.DecreaseItem()}
        >
        <FontAwesomeIcon style={{color: 'grey'}} icon={faCaretDown} size={25}/>
        </TouchableHighlight>
      </View>
    )
  }

}

export default NumberInput;
