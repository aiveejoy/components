import React, { Component } from 'react';
import { View, TouchableHighlight, TextInput, Text, TouchableOpacity } from 'react-native'
import { Color, BasicStyles} from 'common';
import Filter from 'modules/filter/Filter.js'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

class InputSelect extends Component{
  constructor(props){
    super(props);
    this.state = {
      input: null,
      filter: false,
      cuisine: null
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

  getDetails = (category) => {
    this.state.cuisine = category
  }

  closeFilter(){
    this.setState({
      filter: false
    })    
    this.props.onFinish({
      categories : this.state.cuisine?.categories != null ? this.state.cuisine.categories : this.state.cuisine
    })
  }

  render() {
    const { filter } = this.state;
    return (
        <View style={{
          marginLeft: 20,
          width: '90%'}}>
            {filter && (
            <Filter
              navigate={this.props.navigation}
              visible={filter}
              title={this.props.titles}
              from={'categories'}
              close={() => this.closeFilter()}
              onFinish={(categories) => this.getDetails(categories)}
            />
          )}
        <TouchableOpacity
         onPress={() => this.showFilter()}>
          <Text style={{color: 'black', marginBottom: -10 }}>{this.props.title}</Text>
          <TextInput
            style={[BasicStyles.formControls, {width: '100%'}]}
            editable={false}
            placeholder={this.props.placeholder}
          />
        </TouchableOpacity>
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
    )
  }

}

export default InputSelect;
