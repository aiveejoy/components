import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import {WebView} from 'react-native-webview';
const height = Math.round(Dimensions.get('window').height);
import { encode as btoa } from 'base-64';
import Config from 'src/config';
class Stack extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: false,
        paypalUrl: null
    };
  }

  componentDidMount(){
    this.authenticate()
  }


  authenticate () {
    let username = null
    let password = null
    let paypalCrendentials = Config.paypal.sandbox.clientId + ":" + Config.paypal.sandbox.secret
    // global.Buffer = global.Buffer || require('buffer').Buffer
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(paypalCrendentials),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    }
    fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', fetchOptions).then(response => response.json()).then(json => {
      //
      this.paypalCreateOrderRequest(json.access_token)
    }).catch(error => {
    })
  }

  paypalCreateOrderRequest (token) {
    const { params } = this.props.navigation.state;
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
              currency_code: params?.data?.currency,
              value: params?.data?.amount
            }
        }]
      })
    }
    fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', fetchOptions).then(response => response.json()).then(json => {
      json.links.map((item) => {
        if(item.method == 'GET'){
          this.setState({
            paypalUrl: item.href
          })
        }
      })
    }).catch(error => {
    })
  }

  render() {
    const { isLoading, paypalUrl } = this.state
    console.log({
      paypalUrl
    })
    return (
      <SafeAreaView style={{
        flex: 1
      }}>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          {isLoading ? <Spinner mode="overlay" /> : null}
          <View style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: this.props.paddingTop ? this.props.paddingTop : 0,
            width: '100%',
            minHeight: height * 1.5
          }}>
            {
              paypalUrl && (
                <View style={{
                  height: height
                }}>
                  <WebView
                    source={{
                      uri: paypalUrl
                    }}
                    style={{
                      height: '100%',
                    }}
                    startInLoadingState={true}
                    javaScriptEnabled={true}
                    thirdPartyCookiesEnabled={true}
                  />
                </View>
              )
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stack);

