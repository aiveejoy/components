import React, { Component } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { Color } from 'common';
import { Dimensions } from 'react-native';
import {connect} from 'react-redux';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class Message extends Component{
  
  constructor(props){
    super(props);
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  render () {
    const { theme } = this.props.state;
    return (
      <View style={{
        alignItems: 'center',
        height: height + 50
        }}>
          <FontAwesomeIcon
            icon={faSmile}
            size={100}
            style={{
              color: theme ? theme.primary : Color.primary,
              marginTop: 50,
            }}
          />
          <Text style={{
            color: Color.danger,
            paddingBottom: 50,
            paddingTop: 10,
            fontWeight: 'bold'
          }}>{this.props.message}</Text>
          
            <TouchableOpacity
            onPress={() => this.redirect('createRequestStack')} 
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                borderRadius: 5,
                color: Color.primary,
                backgroundColor: Color.white,
                borderColor: theme ? theme.primary : Color.primary,
                borderWidth: 1,
                width: '50%'
            }}
            >
            <Text style={{
                color:theme ? theme.primary : Color.primary,
                fontSize: 11,
                textAlign: 'center'
            }}>Create Request</Text>
            </TouchableOpacity>
            
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);