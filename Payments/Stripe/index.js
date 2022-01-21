import { StripeProvider } from '@stripe/stripe-react-native';
import React, { Component } from 'react';
import { View, Dimensions, Text, Alert, ScrollView, Image } from 'react-native';
import { CardField } from '@stripe/stripe-react-native';
import { connect } from 'react-redux';
import Button from 'components/Form/Button';
import Api from 'services/api/index.js';
import { Color, Routes } from 'common';
import { Spinner } from 'components';
import Config from 'src/config.js';
import {
  confirmPayment,
  createToken,
  initStripe
} from '@stripe/stripe-react-native';
const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').height);

class Stripe extends Component {

  constructor(props) {
    super(props);
    this.webview = null;
    this.state = {
      isLoading: false,
      paypalUrl: null,
      cardDetails: null,
      logos: [
        require('assets/VisaColored.png'),
        require('assets/MastercardColored.jpg'),
        require('assets/AmericanExpressColored.png'),
        require('assets/dinersClub.png'),
        require('assets/discoverColored.png'),
        require('assets/jcb.png'),
        require('assets/unionpay.png')
      ]
    };
  }

  componentDidMount() {
    initStripe({
      publishableKey: Config.stripe.dev_pk,
      merchantIdentifier: 'merchant.identifier',
    })
  }

  checkOut = async () => {
    const { cardDetails } = this.state;
    const { data } = this.props.navigation.state.params;
    if (cardDetails?.complete) {
      await createToken({ type: 'Card' }).then(res => {
        let parameter = {
          amount: data.amount,
          currency: data.currency
        };
        this.setState({ isLoading: true })
        console.log(Routes.createPaymentIntent, parameter);
        Api.request(Routes.createPaymentIntent, parameter, response => {
          this.setState({ isLoading: false })
          this.handlePayment(response.data, res.token);
        });
      });
    } else {
      Alert.alert('Cannot proceed', 'Please complete your card details!')
    }
  }

  handlePayment = async (data, source) => {
    console.log(data);
    const { user } = this.props.state;
    const { error, paymentIntent } = await confirmPayment(data.client_secret, {
      type: 'Card',
      billingDetails: { name: user.username, email: user.email, phone: ' ' },
    });
    if (error) {
      Alert.alert('Payment Failed', error.message, [
        {
          text: 'Cancel',
          onPress: () => this.setState({ isLoading: false }),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.setState({ isLoading: false }) },
      ]);
      console.log('[ERROR]', error);
    }
    if (paymentIntent) {
      this.createLedger();
    }
  };

  createLedger = () => {
    const { data } = this.props.navigation.state.params;
    tempDetails = 'deposit'
    tempDesc = 'Deposit'
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id,
      account_code: user.code,
      amount: data.amount,
      currency: data.currency,
      details: tempDetails,
      description: tempDesc,
    };
    this.setState({ isLoading: true })
    console.log(Routes.ledgerCreate, parameter);
    Api.request(Routes.ledgerCreate, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data) {
        this.props.navigation.navigate('dashboardStack');
      } else {
        this.props.navigation.navigate('dashboardStack');
      }
    });
  };

  render() {
    const { theme } = this.props.state;
    const { isLoading } = this.state;
    const { data } = this.props.navigation?.state?.params;
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
            marginTop: 20,
            textAlign: 'center',
            fontSize: 55,
            color: Color.darkGray
          }}>
            {data?.amount}
          </Text>
          <Text style={{
            marginBottom: 20,
            textAlign: 'center',
            color: Color.darkGray
          }}>
            {data?.currency}
          </Text>
          <Text style={{
            marginTop: 20,
            marginBottom: 20,
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            Input complete card details:
          </Text>
          <View style={{
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
            {this.state.logos.map(item => {
              return (
                <Image
                  source={item}
                  style={{
                    height: 30,
                    width: 30,
                    resizeMode: 'contain'
                  }}
                />
              )
            })}
          </View>
          <View style={{
            borderWidth: 1,
            borderColor: Color.lightGray,
            padding: 15,
            borderRadius: 10
          }}>
            <StripeProvider
              publishableKey={Config.stripe.dev_pk}
              merchantIdentifier={'merchant.identifier'}
            >
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
                  console.log(cardDetails);
                  this.setState({ cardDetails: cardDetails })
                }}
              />
            </StripeProvider>
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
)(Stripe)
