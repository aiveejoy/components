import React, { Component } from 'react';
import { View, TouchableOpacity, TextInput, Text, ColorPropType } from 'react-native'
import { BasicStyles, Color} from 'common';
import Filter from 'modules/filter/Filter.js'

class Range extends Component{
  constructor(props){
    super(props);
    this.state={
      filter: false,
      value: 1,
      valueHigh: 10000
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

  closeFilter(){
    this.setState({
      filter: false
    })
    // this.props.onFinish({
    //   amount : this.state.value.amount == undefined ? this.state.value : this.state.value.amount,
    // })
  }
  
  render() {
    const { filter } = this.state;
    return (
      <View style={{
        flexDirection: 'row',
        borderBottomColor: Color.gray,
        borderBottomWidth: 1,
        width: '100%'}}>
          {filter && (
            <Filter
              navigate={this.props.navigation}
              visible={filter}
              title={'price'}
              from={'restaurant'}
              close={() => this.closeFilter()}
              onFinish={(amount) => {this.setState({value: amount})}}
            />
          )}
        <TouchableOpacity
         onPress={() => this.showFilter()}>
        <Text style={{color: 'black'}}>{this.props.title}</Text>
          <TextInput
            style={[BasicStyles.formControls, {width: '100%', borderBottomWidth: 0, marginBottom: 0}]}
            editable={false}
            placeholder={'$' + ((this.state.value?.amount?.low === undefined) ? this.state.value : this.state.value?.amount?.low) + '-' + '$' + ((this.state.value?.amount?.high === undefined) ? this.state.valueHigh : this.state.value?.amount?.high)}
          />
        </TouchableOpacity>
      </View>
    )
  }

}

export default Range;
