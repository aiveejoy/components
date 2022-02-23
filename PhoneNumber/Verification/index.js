import React, { Component } from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Routes } from 'common';
import { Spinner } from 'components';
import {NavigationActions, StackActions} from 'react-navigation';
const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);
import Button from 'components/Form/Button';

class Stack extends Component {

  constructor(props) {
    super(props);
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


  footer(){
      return(
        <View style={{
            width: '100%',
            padding: 20,
            alignItems: 'center'
          }}>
            <Button
              style={{
                backgroundColor: theme ? theme.secondary : Color.secondary,
                width: '100%',
                bottom: 10
              }}
              title={'Get Code'}
              onClick={() => {
              }} />
        </View>
      )
  }
  render() {
    const { isLoading } = this.state;
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
                this.footer()
            }
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Stack)
