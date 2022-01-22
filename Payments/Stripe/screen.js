import React, { useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { initStripe } from '@stripe/stripe-react-native';
import Config from 'src/config.js';
import Helper from 'common/Helper'
import Color from 'common/Color';

export default function App(props) {

  const verify = (cardDetails) => {
    if(cardDetails && cardDetails.complete){
      props.onComplete(cardDetails)
    }
  }

  useEffect(() => {
    initStripe({
      publishableKey: Config.stripe.pk,
      merchantIdentifier: 'merchant.com.' + Helper.APP_NAME_BASIC,
    });
  }, []);

  return (
    <StripeProvider
      publishableKey={Config.stripe.pk}
      merchantIdentifier="merchant.com.PAYHIRAM"
    >
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
    </StripeProvider>
  );
}
