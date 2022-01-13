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
import Routes from 'common/Routes'
import {WebView} from 'react-native-webview';
const height = Math.round(Dimensions.get('window').height);
import {NavigationActions, StackActions} from 'react-navigation';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';

class Stack extends Component {
  

  constructor(props) {
    super(props);
    this.webview = null;
    this.state = {
        isLoading: false,
        paypalUrl: null
    };
  }

  componentDidMount(){
    this.authorized()
  }

  authorized(){
    const { user } = this.props.state;
    const { params } = this.props.navigation.state;
    if(user == null) return false
    Api.request(Routes.paypalAuthorized, {
      account_id: user.id,
      amount: params?.data?.amount,
      currency: params?.data?.currency
    }, response => {
      response.data.links.map((item) => {
        if(item.rel == 'approve' && item.method == 'GET'){
          this.setState({
            paypalUrl: item.href
          })
        }
      })
    }, error => {

    })
  }

  navigate = (flag) => {
    console.log({
      flag
    })
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

  navigateError(e){

  }

  handleChange = (e) => {
    console.log({
      change: e
    })
    if(e.url.includes('payhiram.ph')){
      Api.getRequest(e.url, response => {
        this.setState({
          paypalUrl: null,
          success: true,
          error: null
        })
        this.navigate(true)
      }, e => {
        this.setState({
          paypalUrl: null,
          success: null,
          error: true
        })
      })
      return false
    }
    return true
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
                    onShouldStartLoadWithRequest={this.handleChange}
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

