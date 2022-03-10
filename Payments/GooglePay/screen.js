import React, { useEffect } from 'react';
import { StripeProvider, useGooglePay } from '@stripe/stripe-react-native';
import { View, Text, Alert, Dimensions } from 'react-native'
import Config from 'src/config.js';
import Helper from 'common/Helper'
import Color from 'common/Color';
import Button from 'components/Form/Button';
const height = Math.round(Dimensions.get('window').height);
export default function App(props) {
  const { theme, params } = props;
  const { isGooglePaySupported, initGooglePay } = useGooglePay();
  const { createGooglePayPaymentMethod, presentGooglePay } = useGooglePay();

  const initializeGoogle = async () => {
    const { error } = await initGooglePay({
      testEnv: true,
      merchantName: 'Widget Store',
      countryCode: 'US',
      billingAddressConfig: {
        format: 'FULL',
        isPhoneNumberRequired: true,
        isRequired: false,
      },
      existingPaymentMethodRequired: false,
      isEmailRequired: true,
    });
    if (error) {
      Alert.alert(error.code, error.message);
      props.navigation.pop();
    } else {
      pay();
    }
    setInitialized(true);
  }

  const pay = async () => {
    const clientSecret = await fetchPaymentIntentClientSecret();
  
    const { error } = await presentGooglePay({
      clientSecret,
      forSetupIntent: true,
      currencyCode: 'USD',
    });
  
    if (error) {
      Alert.alert(error.code, error.message);
      return;
    }
    Alert.alert('Success', 'The SetupIntent was confirmed successfully.');
  };

  useEffect(() => {
    initializeGoogle()
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
        bottom: 100
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
        flex: 1,
        height: height
      }}>
      {
        (params && params.data) && renderAmount(params.data)
      }
      </View>
    </StripeProvider>
  );
}
