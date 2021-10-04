import Config from 'src/config.js'
import { encode as btoa } from 'base-64';
const Paypal = {
  paypalPostRequest: (callback, errorCallback = null) => {
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
    console.log(fetchOptions)
    fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', fetchOptions).then(response => response.json()).then(json => {
      callback(json)
    }).catch(error => {
      if (errorCallback) {
        errorCallback(error.message)
      }
    })
  },
  paypalCreateOrderRequest: (data, token, callback, errorCallback = null) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    console.log(fetchOptions)
    fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', fetchOptions).then(response => response.json()).then(json => {
      callback(json)
    }).catch(error => {
      if (errorCallback) {
        errorCallback(error.message)
      }
    })
  }
};

export default Paypal;