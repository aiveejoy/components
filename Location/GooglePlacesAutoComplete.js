import React, { Component } from 'react';
import { View, Text, ToastAndroid, TextInput, FlatList, TouchableHighlight } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Config from 'src/config.js';
import { Color, Routes, BasicStyles } from 'common';
import Style from './Style.js';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
class LocationAutoComplete extends Component{
  constructor(props){
    super(props);
    this.state = {
      searchValue: null,
      results: null,
      selectedFlag: null,
      selected: null
    }
  }

  componentDidMount(){
  }

  getPlaces = (searchValue) => {

    if(searchValue === null || searchValue === ''){
      return
    }
    if(searchValue.length < 3){
      return
    }
    if(this.state.selectedFlag === true){
      return
    }
    let value = ''
    for (var i = 0; i < searchValue.length; i++) {
      if(searchValue[i] !== ' '){
        value += searchValue[i]
      }else{
        value += '%20'
      }
    }
    let url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + value + '&key=' + Config.GOOGLE.API_KEY
    let parameter = {
      route: url
    }
    Api.request(Config.BACKEND_URL + '/google_places/search', parameter, response => {
      if(response.data.results != null){
        this.setState({results: response.data.results})
      }
    });
  }

  clear = () => {
    this.setState({
      searchValue: null,
      results: null
    })
  }

  onCancel = () => {
    this.clear()
    this.setState({selectedFlag: false})
    this.props.onFinish(null)
  }

  setSelectedItem = (item) => {
    let locationArray = item.formatted_address.split(', ')
    let country = locationArray[locationArray.length - 1]
    let region = locationArray[locationArray.length - 2]
    let locality = locationArray[locationArray.length - 3]
    let location = {
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng,
      route: item.name + ((locationArray.length > 3) ? ', ' + locationArray[0] : ''),
      locality: locality,
      country: country,
      region: region
    }
    this.setState({
      searchValue: location.route,
      results: null,
      selectedFlag: true
    })
    this.props.onFinish(location)
  }

  _showResults = () => {
    const { results, selected } = this.state;
    return (
      <View style={{
        backgroundColor: Color.white,
        width: '100%'
      }}>
        <FlatList
          style={{
            backgroundColor: Color.white
          }}
          data={results}
          extraData={selected}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item, index }) => (
            <View style={{
              borderBottomWidth: 1,
              borderBottomColor: Color.gray,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: Color.white,
              width: '100%'
            }}>
              <TouchableHighlight
                onPress={() => {this.setSelectedItem(item)}}
                underlayColor={Color.gray}
                >
                <View style={Style.TextContainer}>
                  <Text
                    style={[BasicStyles.titleText, {
                      paddingTop: 10,
                      color: Color.darkGray
                    }]}>
                    {item.name + ',' + item.formatted_address}
                  </Text>                  
                </View>
              </TouchableHighlight>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }

  render() {
    const { results, searchValue, selectedFlag } = this.state;
    const { placeholder } = this.props;
    return (
      <View style={[Style.MainContainer, {
        position: 'relative',
        zIndex: this.props.zIndex ? this.props.zIndex : 2,
        backgroundColor: Color.white
      }]}>
        <View>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(searchValue) => {
              this.setState({searchValue})
              this.getPlaces(searchValue)
              this.props.onChange()
            }}
            value={this.state.searchValue}
            placeholder={placeholder ? placeholder : 'Type location'}
          />
          {
            (results != null || selectedFlag == true) && (
              <TouchableHighlight
                style={{
                  height: 30,
                  width: 30,
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: Color.gray,
                  borderRadius: 15,
                  marginTop: 10,
                  marginRight: 10,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => this.onCancel()}
                underlayColor={Color.primary}
                >
                <FontAwesomeIcon 
                  icon={faTimes}
                  size={20}
                  style={{
                    color: Color.white
                  }}
                />
              </TouchableHighlight>
            )
          }
        </View>
        {
          results != null && (
            <View style={{
              position: 'absolute',
              zIndex: this.props.zIndex ? this.props.zIndex : 2,
              top: 50,
              left: 0
            }}>
              {this._showResults()}
            </View>
          )
        }
      </View>
    );
  }
}


export default LocationAutoComplete;
