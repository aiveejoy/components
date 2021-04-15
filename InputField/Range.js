import React, { Component } from 'react';
import { View, TouchableOpacity, TextInput, Text } from 'react-native'
import { Color, BasicStyles} from 'common';
import Filter from 'modules/filter/Filter.js'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

class Range extends Component{
  constructor(props){
    super(props);
    this.state={
      filter: false,
      value: 100
    }
  }

  showFilter(){
    this.setState({
      filter: !this.state.filter
    })
  }

  redirect(route){
    this.props.navigation.navigate(route)
  }
  
  render() {
    const { filter } = this.state;
    console.log('[amounddt]', this.state.value);
    return (
      <View style={{
        position: 'absolute',
        marginLeft: 20,
        width: '90%'}}>
          {filter && (
            <Filter
              navigate={this.props.navigation}
              visible={filter}
              title={'price'}
              from={'restaurant'}
              close={() => {
                this.setState({
                  filter: false
                })
              }}
              onFinish={(amount) => {this.setState({value})}}
            />
          )}
        <TouchableOpacity
         onPress={() => this.showFilter()}>
        <Text style={{color: 'black', marginBottom: -10 }}>{this.props.title}</Text>
          <TextInput
            style={[BasicStyles.formControls, {width: '100%'}]}
            editable={false}
            placeholder={'$' + this.state.value?.amount + '-' + '$9000'}
          />
        </TouchableOpacity>
      </View>
    )
  }

}

export default Range;
