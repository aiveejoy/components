import React, { Component } from 'react';
import { View, TouchableHighlight, TextInput, Text } from 'react-native'
import { Color, BasicStyles} from 'common';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

class NumberInput extends Component{
  constructor(props){
    super(props);
    this.state = {
      input: 0,
      count: 1,
    }
  }

  increment = () => {
    const { setSize } = this.props
    if(this.state.count >= 1){
      this.setState({
        count: this.state.count + 1
      });
    setSize(this.state.count);
    }
  }
  
  decrement = () => {
    const { setSize } = this.props
    if(this.state.count > 1 ){
      this.setState({
        count: this.state.count - 1
      });
    setSize(this.state.count);
    }
  }

  render() {
    const { setSize } = this.props
    const { size } = this.props.state
    console.log('[sizeinNumberInput]', size )
    return (
      <View style={{
        position: 'absolute',
        marginLeft: 20,
        width: '90%'}}>
         <Text style={{color: 'black', marginBottom: -10}}>{this.props.title}</Text>
        <TextInput
          style={[BasicStyles.formControls, {width: '100%'}]}
          onChangeText={(count) => this.setState({ count })}
          value={ this.state.count }
          keyboardType={'numeric'}
          placeholder={this.state.count.toString()}
        />
        <TouchableHighlight
        style={{
          position: 'absolute',
          top: 15,
          marginLeft: '90%',
        }}
        underlayColor={Color.white}
        onPress={() => this.increment()}
        >
         <FontAwesomeIcon style={{color: 'grey'}} icon={faCaretUp} size={25}/>
        </TouchableHighlight>
        <TouchableHighlight
        style={{
          position: 'absolute',
          // right: 15,
          top: 30,
          marginLeft: '90%',
        }}
        underlayColor={Color.white}
        onPress={() => this.decrement()}
        >
        <FontAwesomeIcon style={{color: 'grey'}} icon={faCaretDown} size={25}/>
        </TouchableHighlight>
      </View>
    )
  }

}
const mapStateToProps = state => ({ state: state });


const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setSize: (size) => dispatch(actions.setSize(size))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NumberInput);
