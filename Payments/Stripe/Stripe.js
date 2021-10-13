import Input from './Input';
import React, {Component} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import Options from './Options';
import {
  StripeProvider,
  CardField,
} from '@stripe/stripe-react-native';
import Config from 'src/config.js';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

class Stripe extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {theme, user} = this.props.state;
    return (
      <View>
        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            marginTop: 10,
          }}>
          Payment Methods
        </Text>
        <Options amount={this.props.amount} />
        <StripeProvider
          publishableKey={Config.stripe.dev_pk}
          merchantIdentifier="merchant.identifier">
          <CardField
            postalCodeEnabled={false}
            placeholder={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={{
              backgroundColor: '#FFFFFF',
              textColor: '#000000',
              borderRadius: 50,
            }}
            style={{
              width: '100%',
              height: 50,
              marginVertical: 30,
            }}
            onCardChange={cardDetails => {
              this.props.setCardDetails(cardDetails.complete, cardDetails);
            }}
          />
        </StripeProvider>
      </View>
    );
  }
}
const mapStateToProps = state => ({state: state});

export default connect(mapStateToProps)(Stripe);
