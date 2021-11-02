
import Input from './Input';
import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Color, BasicStyles, Routes } from 'common';
import { connect } from 'react-redux';
import styles from './Style';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAddressCard, faCreditCard, faWallet } from '@fortawesome/free-solid-svg-icons';
import Api from 'services/api/index.js';
import Paypal from './ApiRequest.js'
const height = Math.round(Dimensions.get('window').height)
library.add(fab)

class Options extends Component {
  constructor(props) {
    super(props);
  }

  fromPaypal = () => {
    const { user } = this.props.state;
    if (this.props.amount === null || this.props.amount === '' || this.props.amount <= 0) {
      Alert.alert(
        `Error`,
        `Invalid amount.`,
        [
          {
            text: "OK", onPress: () => {
              return
            }
          }
        ]
      );
      return
    }
    let parameter = {
      condition: [
        {
          value: user.id,
          column: 'id',
          clause: '='
        }
      ]
    }
    this.setState({ isLoading: true });
    Api.request(Routes.accountRetrieve, parameter, response => {
      if (response.data?.length > 0) {
        this.paypalDirect();
      } else {
        Alert.alert(
          `Error`,
          `Cannot be processed. Invalid account.`,
          [
            {
              text: "OK", onPress: () => {
                return
              }
            }
          ]
        );
      }
    },
      (error) => {
        console.log('API ERROR', error);
        this.setState({ isLoading: false });
      },
    );
  }

  paypalDirect = () => {
    const { setPaypalUrl } = this.props;
    let parameter = {
      amount: this.props.amount,
      currency: 'USD',
      reference_id: 1
    }
    this.setState({ isLoading: true });
    console.log(Routes.paypalCreateOrder, parameter)
    Api.request(Routes.paypalCreateOrder, parameter, orderResponse => {
      if (orderResponse && (orderResponse.links || (orderResponse.links && orderResponse.links.length > 0))) {
        orderResponse.links.map((item) => {
          if (item.rel == 'approve') {
            setPaypalUrl(item.href)
          }
        })
      }
    },
      (error) => {
        console.log('API ERROR', error);
        this.setState({ isLoading: false });
      },
    );
  }

  render() {
    const { theme } = this.props.state;
    return (
      <View>
        <ScrollView>
          <View style={{
            flexDirection: 'row',
            width: '100%'
          }}>
            <View style={[styles.Button, {
              width: '47%',
              backgroundColor: 'white',
              flexDirection: 'row',
              backgroundColor: theme ? theme.primary : Color.primary,
              marginRight: '6%'
            }]}>
              <FontAwesomeIcon
                icon={['fab', 'cc-visa']}
                style={{
                  marginRight: 5,
                  color: 'white'
                }}
              />
              <Text style={{ color: 'white', fontFamily: 'Poppins-SemiBold' }}>DC/CC</Text>
            </View>
            <TouchableOpacity style={[styles.Button, {
              width: '47%',
              flexDirection: 'row',
              marginRight: '6%'
            }]}
              onPress={() => {
                this.fromPaypal()
              }}
            >
              <FontAwesomeIcon
                icon={faCreditCard}
                style={{
                  marginRight: 5
                }}
              />
              <Text style={{ fontFamily: 'Poppins-SemiBold' }}>Paypal</Text>
            </TouchableOpacity>
            <View style={[styles.Button, {
              width: '47%',
              backgroundColor: 'white',
              flexDirection: 'row'
            }]}>
              <FontAwesomeIcon
                icon={faAddressCard}
                style={{
                  marginRight: 5
                }}
              />
              <FontAwesomeIcon
                icon={faCreditCard}
                style={{
                  marginRight: 5
                }}
              />
              <Text style={{ fontFamily: 'Poppins-SemiBold' }}>CC/DC</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setPaypalUrl: (paypalUrl) => dispatch(actions.setPaypalUrl(paypalUrl))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Options);