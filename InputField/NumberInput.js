import React, { Component } from 'react';
import { View, TouchableHighlight, TextInput, Text } from 'react-native'
import { Color, BasicStyles} from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

class NumberInput extends Component{
  constructor(props){
    super(props);
    this.state = {
      count: 1
    }
  }

  increment = () => {
    if(this.state.count >= 1){
      this.setState({
        count: this.state.count + 1
      });
      this.setSize(this.state.count + 1)
    }
  }
  
  decrement = () => {
    if(this.state.count > 1 ){
      this.setState({
        count: this.state.count - 1
      });
      this.setSize(this.state.count - 1)
    }
  }

  setSize(size) {
    this.setState({
      count: size
    })
    this.props.onFinish({count: size})
  }

  render() {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Color.gray,
        width: '100%'}}>
          <View style={{
          }}>
            <Text style={{color: Color.black}}>{this.props.title}</Text>
            <TextInput
              style={[BasicStyles.formControls, {width: '100%', borderBottomWidth: 0, marginBottom: 0}]}
              onChangeText={(count) => this.setState({count})}
              value={ this.state.count }
              keyboardType={'numeric'}
              placeholder={this.state.count.toString()}
            />
          </View>

          <View>
            <TouchableHighlight
              underlayColor={Color.white}
              onPress={() => this.increment()}
              >
            <FontAwesomeIcon style={{color: Color.gray}} icon={faCaretUp} size={30}/>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={Color.white}
              onPress={() => this.decrement()}
              >
            <FontAwesomeIcon style={{color: Color.gray}} icon={faCaretDown} size={30}/>
            </TouchableHighlight>
          </View>
      </View>
    )
  }

}

export default NumberInput;
