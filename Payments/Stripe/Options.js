
import Input from './Input';
import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Color, BasicStyles, Routes } from 'common';
import { connect } from 'react-redux';
import styles from './Style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAddressCard, faCreditCard, faWallet } from '@fortawesome/free-solid-svg-icons';
import Api from 'services/api/index.js';
const height = Math.round(Dimensions.get('window').height)

class Options extends Component {
  constructor(props) {
    super(props);
  }

  fromPaypal = () => {
    const { user } = this.props.state;
    if(this.props.amount === null || this.props.amount === '' || this.props.amount <= 0) {
      Alert.alert(
        `Error`,
        `Invalid amount.`,
        [
          { text: "OK", onPress: () => {
            return
          }}
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
      if(response.data?.length > 0) {
        this.paypalDirect();
      } else {
        Alert.alert(
          `Error`,
          `Cannot be processed. Invalid account.`,
          [
            { text: "OK", onPress: () => {
              return
            }}
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
    Api.paypalPostRequest(response => {
      if (response && response.access_token != null) {
        Api.paypalCreateOrderRequest({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: this.props.amount
            }
          }],
          application_context: {
            brand_name: 'Header for payment page',
            locale: 'en-US',
            landing_page: 'LOGIN', // can be NO_PREFERENCE, LOGIN, BILLING
            shipping_preference: 'NO_SHIPPING', // because I didn't want shipping info on the page,
            user_action: 'PAY_NOW',  // Button name, can be PAY_NOW or CONTINUE
            return_url: 'https://www.github.com',
            cancel_url: 'https://example.com/paypalpay/order/cancelled'
          }
        }, response.access_token, orderResponse => {
          console.log(orderResponse);
          if (orderResponse && (orderResponse.links || (orderResponse.links && orderResponse.links.length > 0))) {
            orderResponse.links.map((item) => {
              if (item.rel == 'approve') {
                setPaypalUrl(item.href)
              }
            })
          }
        }, errorOrderResponse => {
          console.log('error', errorOrderResponse.message)
        })
      }
    }, error => {
      console.log(error)
    })
  }

  render() {
    const { theme, user } = this.props.state;
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
                icon={faWallet}
                style={{
                  marginRight: 5,
                  color: 'white'
                }}
              />
              <Text style={{ color: 'white', fontFamily: 'Poppins-SemiBold' }}>From Wallet</Text>
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