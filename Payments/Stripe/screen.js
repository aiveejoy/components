import React, { useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { View, Text } from 'react-native'
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { initStripe } from '@stripe/stripe-react-native';
import Config from 'src/config.js';
import Helper from 'common/Helper'
import Color from 'common/Color';
import Button from 'components/Form/Button';

export default function App(props) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { theme, params } = props;

  const verify = (cardDetails) => {
    if(cardDetails && cardDetails.complete){
      props.onComplete(cardDetails)
    }
  }

  const inititiate = async () => {
    const { error } = await initPaymentSheet({
      customerId: props.paymentIntent.customer,
      customerEphemeralKeySecret: props.paymentIntent.ephemeralKey,
      paymentIntentClientSecret: props.paymentIntent.client_secret,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
    });
    if (!error) {
      setLoading(true);
    }
  }

  const openPaymentSheet = async () => {
    const response = await presentPaymentSheet();
    console.log({
      response
    })
    // if (error) {
    //   Alert.alert(`Error code: ${error.code}`, error.message);
    // } else {
    //   Alert.alert('Success', 'Your order is confirmed!');
    // }
  };


  useEffect(() => {
    inititiate()
  }, []);

  const renderAmount = (data) => {
    return(
      <View>
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
      </View>
    )
  }

  const renderFooter = () => {
    return (
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
            openPaymentSheet()
          }} />
      </View>
    )
  }

  return (
    <StripeProvider
      publishableKey={Config.stripe.pk}
      merchantIdentifier="merchant.com.PAYHIRAM"
    >
      <View style={{
        width: '100%',
        flex: 1
      }}>
      {/*
      <CardField
        placeholder={{
            number: '4242 4242 4242 4242',
        }}
        postalCodeEnabled={false}
        autofocus 
        cardStyle={{
          borderWidth: 1,
          backgroundColor: Color.white,
          borderColor: Color.lightGray,
          borderRadius: 30,
          fontSize: 14,
          placeholderColor: Color.darkGray,
        }}
        style={{
          width: '100%',
          height: 60,
          marginVertical: 30,
        }}
        onCardChange={(cardDetails) => {
          verify(cardDetails)
        }}
        onFocus={(focusedField) => {
            console.log('focusField', focusedField);
        }}
    />
      */}
      {
        (params && params.data) && renderAmount(params.data)
      }

      {
        renderFooter()
      }
      </View>
    </StripeProvider>
  );
}
