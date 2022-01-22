import React, { Component } from 'react';
import { View, Dimensions, Text, Alert, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import Button from 'components/Form/Button';
import Api from 'services/api/index.js';
import { Color, Routes } from 'common';
import { Spinner } from 'components';
import StripeScreen from './screen'
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

  handlePayPress = async () => {
    const { cardDetails } = this.state;
    if (!cardDetails) {
      return;
    }

    const {params} = this.props.navigation.state;
    const { user } = this.props.state;
    if(params && params.data == null) return null
    if(user == null) return null
    Api.request(Routes.createPaymentIntent, {
      account_id: user.id,
      amount: params.data.amount,
      currency: params.data.currency,
      card: this.state.cardDetails
    }, response => {
      this.setState({
        isLoading: false
      })
      console.log({
        response,
        cardDetails
      })
    }, error => {
      this.setState({
        isLoading: false
      })
    })
  };


  renderAmount(data){
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
      </View>
    )
  }
  
  renderFooter(){
    const { theme } = this.props.state;
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
            this.handlePayPress()
          }} />
      </View>
    )
  }
  render() {
    const { isLoading } = this.state;
    const { params } = this.props.navigation.state;
    return (
      <View style={{
        height: '100%'
      }}>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <ScrollView style={{
          padding: 20,
          width: '100%'
        }}>
          {
            (params && params.data) && this.renderAmount(params.data)
          }
          <View style={{
            padding: 15
          }}>
            {(params && params.data) && (
              <StripeScreen
                onComplete ={(cardDetails) => {
                  this.setState({
                    cardDetails
                  })
                }}
              />
            )}
          </View>
        </ScrollView>
        
        {
          this.renderFooter()
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Stripe)
