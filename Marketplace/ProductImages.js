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
class ProductImages extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      data: null,
      selected: null,
      selectedIndex: 0
    }
  }

  componentDidMount(){
    const { item } = this.props;
    if(item.featured != null){
      this.setState({
        selected: item.featured[0],
        selectedIndex: 0
      })
    }
  }

  setActiveImage = (item, index) => {
    this.setState({
      selected: item,
      selectedIndex: index
    })
  }

  _displayImages = (images) => {
    const{ item } = this.props;
    const { selected, selectedIndex } = this.state;
    return (
      <View style={{
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          flexDirection: 'row',
        }}>
        {
          (item.featured != null && item.featured[0].url != null) && (
            <TouchableHighlight style={{
              height: 50,
              width: '20%',
              marginBottom: 10,
              backgroundColor: selectedIndex == 0 ? Color.primary : Color.white
            }}
            onPress={() => {this.setActiveImage(item.featured[0], 0)}}
            underlayColor={Color.gray}
              >
              <Image
              source={{uri: Config.BACKEND_URL  + item.featured[0].url}}
              style={{
                width: '100%',
                height: '100%'
              }}/>
            </TouchableHighlight>
          )
        }
        {
          images.map((image, index) => {
            return (
              <TouchableHighlight style={{
                height: 50,
                width: '20%',
                marginBottom: 10,
                backgroundColor: (index + 1) == selectedIndex ? Color.primary : Color.white
              }}
              onPress={() => {this.setActiveImage(image, index + 1)}}
              underlayColor={Color.gray}
                >
                <Image
                  source={{uri: Config.BACKEND_URL  + image.url}}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}/>
              </TouchableHighlight>
            )
          })
        }
      </View>
    );
  }

  render() {
    const { item } = this.props;
    const { selected } = this.state;
    return (
      <View style={[Style.MainContainer]}>
        {
          selected != null && selected.url != null && (
            <View style={Style.imageHolder}>
              <Image
                source={{uri: Config.BACKEND_URL  + selected.url}}
                style={Style.imageThumbnail}/>
            </View>
          )
        }
        {
          (selected == null || (selected != null && selected.url == null)) && (
            <View style={Style.iconThumbnailStyle}>
              <FontAwesomeIcon
                icon={faImage}
                size={Style.iconThumbnail}
              />
            </View>
          )
        }
        {
          item.images != null && (
            this._displayImages(item.images)
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
)(ProductImages);