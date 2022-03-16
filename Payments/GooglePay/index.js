import React, { Component } from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
import StripeScreen from './screen'
import { Routes } from 'common';
import {NavigationActions, StackActions} from 'react-navigation';
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
      paymentIntent: null
    };
  }

  componentDidMount(){
    this.createPaymentIntent() 
  }

  createPaymentIntent(){
    const {params} = this.props.navigation.state;
    const { user } = this.props.state;
    if(params && params.data == null) return null
    if(user == null) return null
    this.setState({
      isLoading: true
    })
    Api.request(Routes.createPaymentIntent, {
      account_id: user.id,
      amount: params.data.amount,
      currency: params.data.currency,
      charge: params.data.charge,
      total: params.data.total,
      email: user.email
    }, response => {
      this.setState({
        isLoading: false
      })
      this.setState({
        paymentIntent: response.data
      })
    }, error => {
      this.setState({
        isLoading: false
      })
      console.log({
        error
      })
    })
  }

  
  onConfirmPayment(){
    const {params} = this.props.navigation.state;
    const { user } = this.props.state;
    const { paymentIntent } = this.state;
    if(params && params.data == null) return null
    if(user == null) return null
    if(paymentIntent == null) return null
    this.setState({
      isLoading: true
    })
    Api.request(Routes.confirmPaymentIntent, {
      payment_intent_id: paymentIntent.id,
      account_id: user.id,
      email: user.email,
      currency: params.data.currency,
      charge: params.data.charge,
      total: params.data.total,
      amount: params.data.amount,
      to: user.id
    }, response => {
      this.setState({
        isLoading: false
      })
      this.navigate()
    }, error => {
      this.setState({
        isLoading: false
      })
      console.log({
        error
      })
    })
  }

  navigate = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'drawerStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
            NavigationActions.navigate({routeName: 'Dashboard', params: {
              initialRouteName: 'Dashboard',
              index: 0
            }}),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    const { isLoading, paymentIntent } = this.state;
    const { params } = this.props.navigation.state;
    const { theme } = this.props.state;
    return (
      <View style={{
        height: '100%'
      }}>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <ScrollView style={{
          padding: 20,
          width: '100%'
        }}>
          
          <View style={{
            padding: 15
          }}>
            {(params && params.data && paymentIntent) && (
              <StripeScreen
                theme={theme}
                params={params}
                paymentIntent={paymentIntent}
                onConfirmPayment={() => this.onConfirmPayment()}
                onComplete ={(cardDetails) => {
                  this.setState({
                    cardDetails
                  })
                }}
                navigation={this.props.navigation}
              />
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Stripe)
