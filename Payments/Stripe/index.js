import { StripeProvider } from '@stripe/stripe-react-native';
import React, {Component} from 'react';

function App() {
  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier"
    >
      <PaymentScreen />
    </StripeProvider>
  );
}

// PaymentScreen.ts
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { View } from 'react-native';
export default function PaymentScreen() {
  const { confirmPayment } = useStripe();

  return (
    <View style={{
      padding: 20
    }}>
    <CardField
      // postalCodeEnabled={true}
      placeholder={{
        number: '4242 4242 4242 4242',
      }}
      cardStyle={{
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        borderRadius: 50
      }}
      style={{
        width: '100%',
        height: 50,
        marginVertical: 30,
      }}
      onCardChange={(cardDetails) => {
        console.log('cardDetails', cardDetails);
      }}
      onFocus={(focusedField) => {
        console.log('focusField', focusedField);
      }}
    />
    </View>
  );
}