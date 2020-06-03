import React, { Component } from 'react';
import Style from './Style.js';
import { View, Text, ScrollView, FlatList, TouchableHighlight, Image} from 'react-native';
import {NavigationActions} from 'react-navigation';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { connect } from 'react-redux';
class Installment extends Component{
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    const { data } = this.props;
    return (
      <View key={data.id} style={{
        paddingTop: 2,
        paddingBottom: 2
      }}>
        <Text style={{
          fontStyle: 'italic',
          color: this.props.color ? this.props.color : Color.black
        }}>
          {
            data.installment.interest + '% interest rate for ' + data.installment.months + (data.installment.months > 1 ? ' months' : ' month') + ' of installment'
          }
        </Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Installment);