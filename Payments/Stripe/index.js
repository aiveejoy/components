import { StripeProvider } from '@stripe/stripe-react-native';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import Config from 'src/config.js'

function App() {
  return (
    <StripeProvider
      publishableKey={Config.stripe.dev_sk}
      merchantIdentifier="merchant.identifier"
    >
      <PaymentScreen />
    </StripeProvider>
  );
}

// PaymentScreen.ts
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { View } from 'react-native';
function PaymentScreen(props) {
  return (
    <View style={{
      padding: 20
    }}>
    <CardField
      postalCodeEnabled={false}
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
        props.setCardDetails(cardDetails.complete, cardDetails);
      }}
    />
    </View>
  );
}

const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(PaymentScreen)
