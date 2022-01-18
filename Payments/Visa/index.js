import { StripeProvider } from '@stripe/stripe-react-native';
import React, { Component } from 'react';
import { View, Dimensions, Text, Alert, ScrollView } from 'react-native';
import { CardField } from '@stripe/stripe-react-native';
import { connect } from 'react-redux';
import Button from 'components/Form/Button';
import Api from 'services/api/index.js';
import { Color, Routes } from 'common';
import { Spinner } from 'components';
const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').height);

class Visa extends Component {

  constructor(props) {
    super(props);
    this.webview = null;
    this.state = {
      isLoading: false,
      paypalUrl: null,
      cardDetails: null
    };
  }

  checkOut = () => {
    const { cardDetails } = this.state;
    if (cardDetails?.complete) {
      let params = {
        fromDate: '02082017',
        clientId: 'B2BWS_1_1_9999',
        toDate: '02082017',
        messageId: '2017-04-06T03:47:20.000Z',
        resultSetNo: 1,
        buyerId: 9999,
        trackingNumber: 9999999958,
        status: 'A'
      };
      this.setState({ isLoading: true })
      Api.request(Routes.visaProcessPayments, params, response => {
        this.setState({ isLoading: false })
        console.log(response)
      });
    } else {
      Alert.alert('Cannot proceed', 'Please complete your card details!')
    }
  }

  render() {
    const { theme } = this.props.state;
    const { isLoading } = this.state;
    return (
      <View style={{
        height: '100%'
      }}>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <ScrollView style={{
          padding: 20,
          width: '100%'
        }}>
          <Text style={{
             marginTop: '30%',
             marginBottom: 20,
             fontStyle: 'italic',
             textAlign: 'center'
          }}>
            Please input your complete card details to proceed.
          </Text>
          <View style={{
            borderWidth: 1,
            borderColor: Color.lightGray,
            padding: 15,
            borderRadius: 10
          }}>
            <CardField
              postalCodeEnabled={false}
              placeholder={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={{
                backgroundColor: '#ededed',
                borderRadius: 50
              }}
              style={{
                height: 50,
                marginVertical: 20,
              }}
              onCardChange={(cardDetails) => {
                this.setState({ cardDetails: cardDetails })
              }}
            />
          </View>
        </ScrollView>
        <View style={{
          width: '100%',
          padding: 20,
          alignItems: 'center',
          position: 'absolute',
          bottom: 0
        }}>
          <Button
            style={{
              backgroundColor: theme ? theme.secondary : Color.secondary,
              position: 'absolute',
              width: '100%',
              bottom: 10
            }}
            title={'Proceed'}
            onClick={() => {
              this.checkOut()
            }} />
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Visa)
