import React, { Component } from 'react';
import Style from './Style.js';
import { View, Text, ScrollView, FlatList, TouchableHighlight} from 'react-native';
import {NavigationActions} from 'react-navigation';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner } from 'components';
import { connect } from 'react-redux';
import { Empty } from 'components';
import Api from 'services/api/index.js';
import { Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const height = Math.round(Dimensions.get('window').height);
class PaymentMethod extends Component{
  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentDidMount(){
  }

  setPaymentMethod(method){

  }

  render() {
    return(
      <View style={{
        borderTopWidth: 1,
        borderTopColor: Color.gray,
        marginTop: 10
      }}>
        <View style={{
          height: 30,
          flex: 1,
          justifyContent: 'center'
        }}>
          <Text>PAYMENT METHOD</Text>
        </View>

        <View style={{
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          flexDirection: 'row',
        }}>
          {
            Helper.paymentMethods.map((item, index) => {
              return (
                <TouchableHighlight style={{
                  minHeight: 50,
                  width: '32%',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: Color.primary,
                  marginRight: '1%'
                }}
                onPress={() => {this.setPaymentMethod(item)}}
                underlayColor={Color.gray}
                  >
                    <View style={{
                      width: '100%',
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: 5,
                      paddingRight: 5
                    }}>
                      <Text style={{
                        color: Color.primary,
                        fontWeight: 'bold'
                      }}>{item.title}</Text>
                    </View>
                </TouchableHighlight>
              )
            })
          }
        </View>
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
)(PaymentMethod);