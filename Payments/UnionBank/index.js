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
import { WebView } from 'react-native-webview';
const height = Math.round(Dimensions.get('window').height);
import { NavigationActions, StackActions } from 'react-navigation';

class Stack extends Component {


  constructor(props) {
    super(props);
    this.webview = null;
    this.state = {
      isLoading: false,
      unionBankUrl: null
    };
  }

  componentDidMount() {
    this.authorized()
  }

  authorized() {
    const { user } = this.props.state;
    const { params } = this.props.navigation.state;
    if (user == null) return false
    this.setState({
      isLoading: true
    })
    console.log(Routes.unionBankAuthorize, {
      account_id: user.id,
      amount: params?.data?.amount,
      currency: params?.data?.currency,
      charge: params?.data?.charge,
      total: params?.data?.total
    })
    Api.request(Routes.unionBankAuthorize, {
      account_id: user.id,
      amount: params?.data?.amount,
      currency: params?.data?.currency,
      charge: params?.data?.charge,
      total: params?.data?.total
    }, response => {
      this.setState({
        isLoading: false
      })
      console.log(response);
      if(response.data) {
        this.setState({
          unionBankUrl: response.data
        })
      }
      
    }, error => {
      this.setState({
        isLoading: false
      })
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
          NavigationActions.navigate({
            routeName: 'Dashboard', params: {
              initialRouteName: 'Dashboard',
              index: 0
            }
          }),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  navigateError(e) {

  }

  handleChange = (e) => {
    const { token } = this.props.state;
    console.log({
      change: e
    })
    console.log(e.url.includes('callback?code='), 'this is authorized access')
    if(e.url.includes('callback?code=')){
      let newUrl = e.url + '&token=' + token
      console.log(newUrl, 'newUrl')
      Api.getRequest(newUrl, response => {
        console.log(response, 'RESPONSE')
        this.setState({
          unionBankUrl: null
        })
        this.navigate(true)
      }, e => {
        console.log(e)
        this.setState({
          unionBankUrl: null
        })
      })
      return false
    }
    return true
  }

  render() {
    const { isLoading, unionBankUrl } = this.state
    console.log({
      unionBankUrl
    })
    return (
      <SafeAreaView>
        {
          isLoading && (
            <Spinner mode={'overlay'}/>
          )
        }
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={{
            paddingTop: this.props.paddingTop ? this.props.paddingTop : 0,
            width: '100%',
            minHeight: height * 1.5
          }}>
            {
              (unionBankUrl && !isLoading) && (
                <View style={{
                  height: height
                }}>
                  <WebView
                    source={{
                      uri: unionBankUrl
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

