import React, { Component } from 'react';
import Style from './Style.js';
import { View, Text, ScrollView, FlatList, TouchableHighlight} from 'react-native';
import {NavigationActions} from 'react-navigation';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner } from 'components';
import { connect } from 'react-redux';
import { Empty } from 'components';
import Api from 'services/api/index.js';
import { Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const height = Math.round(Dimensions.get('window').height);
class Billing extends Component{
  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentDidMount(){
  }

  render() {
    return(
      <View style={{
        borderTopWidth: 1,
        borderTopColor: Color.gray
      }}>
        <View style={{
          height: 30,
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'row'
        }}>
          <Text style={{
            width: '80%'
          }}>BILLING</Text>
          <TouchableHighlight
            style={{
              width: '20%',
              alignItems: 'flex-end'
            }}

            onPress={() => {
              this.props.onEdit('Billing')
            }}

            underlayColor={Color.white}
            >
            <FontAwesomeIcon
                icon={faEdit}
                size={30}
                style={{
                  color: Color.primary
                }}
              />
          </TouchableHighlight>
        </View>
        <View style={{
          paddingLeft: 20,
          paddingRight: 20
        }}>
          <Text style={{
            fontWeight: 'bold'
          }}>
            Juan Dela Cruz
          </Text>

          <Text style={{
          }}>
            HOME | 123, Cebu City, Philippines
          </Text>

          <Text style={{
          }}>
            +631912345671
          </Text>

          <Text style={{
          }}>
            juandelacruz@gmail.com
          </Text>
        </View>
      </View>
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
)(Billing);