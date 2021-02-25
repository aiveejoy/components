import React, { Component } from 'react';
// import Style from './Style.js';
import { View, Text, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Routes, Color, BasicStyles, Helper } from 'common';
import { Spinner, UserImage } from 'components';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

class Options extends Component{
  constructor(props){
    super(props);
    this.state = {
      current: {
        title: 'Settings',
        menu: Helper.MessengerMenu
      },
      previous: null
    }
  }

  componentDidMount(){
  }

  componentWillUnmount() {
  }

  close(){
    const { viewMenu } = this.props;
    viewMenu(false)
  }

  retrieveRequest(route){
    const { user, request } = this.props.state;
    const { data } = this.props;
    if(user == null || data == null){
      return
    }
    let parameter = {
      condition: [{
        value: data.title,
        clause: '=',
        column: 'code'
      }],
      account_id: user.id
    };
    if(request != null && request.code == data.title){
      this.props.navigation.navigate(route, {
        data: request,
        from: 'messenger'
      })
      return
    }
    this.setState({isLoading: true});
    Api.request(Routes.requestRetrieveItem, parameter, (response) => {
      this.setState({isLoading: false});
      if(response.data.length > 0){
        const { setRequest } = this.props;
        setRequest(response.data[0])
        this.props.navigation.navigate(route, {
          data: response.data[0],
          from: 'messenger'
        })
      }
    }, error => {
      console.log('response', error)
      this.setState({isLoading: false});
    });
  }

  onClick(item){
    switch(item.payload_value){
      case 'close':
        this.close()
        break
      case 'requirements':
        this.setState({
          previous: {
            title: 'Settings',
            menu: Helper.MessengerMenu
          },
          current: {
            title: 'Settings > Requirements',
            menu: Helper.requirementsMenu
          }
        })
        break
      case 'requestItemStack': {
          this.retrieveRequest('requestItemStack')
        }
        break
      case 'reviewsStack': {
          // review stack
          this.retrieveRequest('reviewsStack')
        }
        break
      case 'back':
        this.setState({
          previous: null,
          current: {
            title: 'Settings',
            menu: Helper.MessengerMenu
          }
        })
        break
    }
  }

  header(setting){
    return(
    <View style={{
        width: '100%',
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Color.lightGray
      }}>
        <Text style={{
          fontSize: BasicStyles.standardFontSize,
          width: '90%',
          paddingLeft: 20,
          fontWeight: 'bold'
        }}> {setting.title} </Text>
        <TouchableOpacity
          style={{
            width: '10%',
            justifyContent: 'center'
          }}
          onPress={() => this.close()}>
          <FontAwesomeIcon
            icon={ faTimes }
            size={20}
            style={{color: Color.danger}}/>
        </TouchableOpacity>
      </View>
    );
  }

  body(options){
    return(
      <ScrollView
        >
        {
          options.map((item, index) => (
            <TouchableOpacity style={{
              width: '100%',
              height: 50,
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: Color.lightGray
            }}
            onPress={() => this.onClick(item)}>
              <Text style={{
                color: item.color,
                fontSize: BasicStyles.standardFontSize,
                paddingLeft: 20,
                width: '90%'
              }}>{item.title}</Text>
              {
                (item.title != 'Close') && (
                  <View style={{
                    width: '10%',
                    justifyContent: 'center'
                  }}>
                    <FontAwesomeIcon
                      icon={ faChevronRight }
                      size={20}
                      style={{color: Color.primary}}/>
                  </View>
                )
              }
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    );
  }

  requirements(options){
    const { data } = this.props;
    const { user } = this.props.state;
    console.log('[OnRequirements]', data)
    return(
      <ScrollView
        >
        {
          options.map((item, index) => (
            <TouchableOpacity style={{
              width: '100%',
              height: 50,
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomWidth: 1,
              paddingLeft: 20,
              paddingRight: 20,
              borderBottomColor: Color.lightGray
            }}
            onPress={() => this.onClick(item)}>
              <Text style={{
                color: item.color,
                fontSize: BasicStyles.standardFontSize,
                width: (data && data.account_id == user.id) ? '70%' : '90%',
              }}>{item.title}</Text>
              {
                (item.title != 'Back' && (data && data.account_id == user.id)) && (
                  <View style={{
                    width: '30%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: Color.secondary
                  }}>
                    <Text style={{
                      color: Color.white,
                      fontSize: BasicStyles.standardFontSize
                    }}>Enable</Text>
                  </View>
                )
              }
              {
                (item.title != 'Back' && (data && data.account_id != user.id)) && (
                  <View style={{
                    width: '10%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 30
                  }}>
                    <FontAwesomeIcon
                      icon={ faChevronRight }
                      size={20}
                      style={{color: Color.primary}}/>
                  </View>
                )
              }
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    );
  }

  render() {
    const { current } = this.state;
    return (
      <View style={{
        position: 'absolute',
        zIndex: 1000,
        bottom: 0,
        right: 0,
        height: height * 0.6,
        width: '100%',
        backgroundColor: Color.white,
        borderTopLeftRadius: BasicStyles.standardBorderRadius,
        borderTopRightRadius: BasicStyles.standardBorderRadius,
        borderTopWidth: 1,
        borderTopColor: Color.lightGray
      }}>
        {this.header(this.state.current)}
        {current.title == 'Settings' && this.body(this.state.current.menu)}
        {current.title == 'Settings > Requirements' && this.requirements(this.state.current.menu)}
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    viewMenu: (isViewing) => dispatch(actions.viewMenu(isViewing)),
    setRequest: (request) => dispatch(actions.setRequest(request))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Options);
