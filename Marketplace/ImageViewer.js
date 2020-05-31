import React, { Component } from 'react';
import Style from './Style.js';
import { View, Text, ScrollView, FlatList, TouchableHighlight, Image} from 'react-native';
import {NavigationActions} from 'react-navigation';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { Dimensions } from 'react-native';
import Config from 'src/config.js';
import Currency from 'services/Currency.js';
const height = Math.round(Dimensions.get('window').height);
class ImageViewer extends Component{
  constructor(props){
    super(props);
    this.state = {
      selected: null,
      isLoading: false,
      data: null
    }
  }

  render() {
    const { image } = this.props;
    return (
      <View>
        {
          image != null && image.url != null && (
            <Image
              source={{uri: Config.BACKEND_URL  + image.url}}
              style={{
                width: 100,
                height: 100
              }}/>
          )
        }
        {
          (image == null || (image != null && image.url == null)) && (
            <View style={{
              width: '100%',
              height: 100,
              color: Color.gray,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FontAwesomeIcon
                icon={faImage}
                size={50}
              />
            </View>
          )
        }
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
)(ImageViewer);