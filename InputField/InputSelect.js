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
    if(this.state.cuisine != null){
      this.props.onFinish({
        categories : this.state.cuisine?.categories?.length >= 1 ? this.state.cuisine.categories : this.state.cuisine.categories
      })
    }else{
      this.props.onFinish({
        categories : null
      })
    }
  }

  render() {
    const { filter } = this.state;
    return (
        <View style={{
          marginLeft: 20,
          marginBottom: '5%',
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
            style={[BasicStyles.formControls]}
            editable={false}
            placeholder={this.props.placeholder}
          />
        </TouchableOpacity>
        {
          (this.state.cuisine?.categories?.length < 1 || this.state.cuisine == null || this.state.cuisine?.categories?.length == 10) && (
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
          )
        }
      </View>
    )
  }

}

export default InputSelect;
