import React, { Component } from 'react';
import { View, Text, Dimensions, TextInput, FlatList, TouchableHighlight, Keyboard } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Config from 'src/config.js';
import { Color, Routes, BasicStyles } from 'common';
import Style from './Style.js';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Spinner } from 'components';

const width = Math.round(Dimensions.get('window').width);
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
    this.setState({
      selectedFlag: false
    })
    // const {initialRegion}=this.props;
    // let location ={
    //   latitude:initialRegion.latitude,
    //   longitude:initialRegion.longitude,
    // }
    // this.clear()
    // this.setState({selectedFlag: false})
    // this.props.onFinish(location)
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
    Keyboard.dismiss()
    this.props.onFinish(location)
  }

  _showResults = () => {
    const { results, selected } = this.state;
    return (
      <View style={{
        backgroundColor: Color.white,
        width: width - 40,
        marginBottom: 50,
        position: 'relative',
        borderRadius: 12,
        zIndex: this.props.zIndex ? this.props.zIndex + 9 : 5
      }}>
        <FlatList
          style={{
            position: 'relative',
            zIndex: this.props.zIndex ? this.props.zIndex + 10 : 5
          }}
          data={results}
          extraData={selected}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item, index }) => (
            <TouchableHighlight
              onPress={() => {this.setSelectedItem(item)}}
              underlayColor={Color.gray}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Color.gray,
                paddingTop: 5,
                paddingBottom: 5,
                width: '100%',
                marginBottom: ((results.length - 1) == index) ? 100 : 0,
                position: 'relative',
                zIndex: this.props.zIndex ? this.props.zIndex + 15 : 5
              }}
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
        zIndex: this.props.zIndex ? this.props.zIndex + 3 : 2,
        minHeight: 50
      }]}>
        <View style={{
          position: 'relative'
        }}>
          <TextInput
            style={[BasicStyles.formControlCreate, {
              backgroundColor: Color.white,
              marginBottom: 0
            }]}
            onChangeText={(searchValue) => {
              this.setState({searchValue})
              this.getPlaces(searchValue)
              this.props.onChange()
            }}
            ref={'searchValueField'}
            value={this.state.searchValue}
            placeholder={placeholder ? placeholder : 'Type location'}
            placeholderTextColor={Color.darkGray}
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
              position: 'relative',
              zIndex: this.props.zIndex ? this.props.zIndex + 6 : 2,
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
