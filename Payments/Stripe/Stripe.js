import Input from './Input';
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import Options from './Options';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Stripe extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { theme, user } = this.props.state;
    return (
      <View>
        <Text style={{
          fontFamily: 'Poppins-SemiBold',
          marginTop: 10
        }}>Payment Methods</Text>
        <Options/>
        <Input
          label={'Card Number'}
          placeholder={'4242-4242-4242-4242'}
          width={'100%'}
        />
        <View style={{
          width: '100%',
          marginTop: 20,
          flexDirection: 'row'
        }}>
          <View style={{
            width: '47%',
            marginRight: '6%'
          }}><Input
              label={'Expiry'}
              placeholder={'8/11'}
              width={'100%'}
            />
          </View>
          <View style={{
            width: '47%'
          }}><Input
              label={' CVC'}
              placeholder={'111'}
              width={'100%'}
            />
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Stripe);