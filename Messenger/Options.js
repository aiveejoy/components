import React, { Component } from 'react';
// import Style from './Style.js';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Routes, Color, BasicStyles, Helper } from 'common';
import { Spinner, UserImage } from 'components';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Style from 'modules/messenger/Style.js';
import Modal from 'components/Modal/Sketch';
import ImagePicker from 'react-native-image-picker';

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
      previous: null,
      pictures: [],
      showPhotos: false,
      isLoading: false,
      sender_id: null,
      visible: false
    }
  }

  componentDidMount(){
    this.retrieveReceiverPhoto();
  }

  sendSketch = (result) => {
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id,
      payload: 'signature',
      payload_value: result
    }
    this.setState({isLoading: true})
    Api.request(Routes.uploadImage, parameter, response => {
      this.setState({isLoading: false})
      this.retrieveReceiverPhoto();
    })
  }

  closeSketch = () => {
    this.setState({visible: false})
  }

  retrieveReceiverPhoto = () => {
    const { user } = this.props.state;
    let parameter = {
      condition: [{
        clause: "=",
        column: "account_id",
        value: user.id
      }]
    }
    this.setState({isLoading: true})
    Api.request(Routes.retrieveImage, parameter, response => {
      this.setState({pictures: response.data})
      this.setState({isLoading: false})
    })
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
        this.setState({sender_id: response.data[0].account_id});
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

  addToValidation = (payload) => {
    let parameter = {
      status: 'pending',
      payload: payload,
      account_id: this.props.state.user.id,
      request_id: this.state.request_id
    }
    console.log(parameter, Routes.requestValidationCreate);
    this.setState({ isLoading: true });
    Api.request(Routes.requestValidationCreate, parameter, response => {
      this.setState({ isLoading: false });
      if(response.data !== null) {
        console.log(response.data, "==================");
      }
    }, error => {
      this.setState({ isLoading: false });
      console.log({ retrieveMessagesError: error })
    });
  }

  closePhotos = () => {
    this.setState({
      showPhotos: false,
      previous: {
        title: 'Settings',
        menu: Helper.MessengerMenu
      },
      current: {
        title: 'Settings > Requirements',
        menu: Helper.requirementsMenu
      }
    })
  }

  uploadPhoto = (payload) => {
    const options = {
      noData: true,
      error: null
    }
    const { user } = this.props.state;
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ photo: null })
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ photo: null })
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        this.setState({ photo: null })
      }else {
        if(response.fileSize >= 1000000){
          Alert.alert('Notice', 'File size exceeded to 1MB')
          return
        }
        let parameter = {
          account_id: user.id,
          payload: payload,
          payload_value: response.uri
        }
        this.setState({isLoading: true})
        Api.request(Routes.uploadImage, parameter, response => {
          this.setState({isLoading: false})
          console.log(response, "==================================response");
          this.retrieveReceiverPhoto();
        })
      }
    })
  }

  updateValidation = (status) => {
    // const { messengerGroup, user } = this.props.state;
    // if(messengerGroup == null){
    //   return
    // }
    // let parameter = {
    //   id: item.id,
    //   status: status,
    //   messages: {
    //     messenger_group_id: messengerGroup.id,
    //     account_id: user.id
    //   }
    // }
    // this.setState({isLoading: true})
    // Api.request(Routes.requestValidationUpdate, parameter, response => {
    //   this.setState({isLoading: false})
    // })
    console.log(status, "========current status");
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
      case 'transferFundStack': {
          this.retrieveRequest('transferFundStack')
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
      case 'signature':
        this.setState({
          showPhotos: true,
          current: {
            title: item.payload_value
          }});
        break
      case 'receiver_picture':
        this.setState({
          showPhotos: true,
          current: {
            title: item.payload_value
          }});
        break
      case 'valid_id':
        this.setState({
          showPhotos: true,
          current: {
            title: item.payload_value
          }});
        break
    }
  }

  header(setting){
    let title = null;
    if (setting.title === 'signature') {
      title = 'Signature'
    } else if (setting.title === 'receiver_picture') {
      title = 'Receiver Picture'
    } else if (setting.title === 'valid_id') {
      title = 'Valid ID'
    } else {
      title = setting.title
    }
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
        }}> {title} </Text>
        {this.state.showPhotos === false ? <TouchableOpacity
          style={{
            width: '10%',
            justifyContent: 'center'
          }}
          onPress={() => this.close()}>
          <FontAwesomeIcon
            icon={ faTimes }
            size={20}
            style={{color: Color.danger}}/>
        </TouchableOpacity> :
        <TouchableOpacity
          style={{
            width: '10%',
            justifyContent: 'center'
          }}
          onPress={() => this.closePhotos()}>
          <FontAwesomeIcon
            icon={ faTimes }
            size={20}
            style={{color: Color.danger}}/>
        </TouchableOpacity>}
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
                    <TouchableOpacity
                      onPress={() => {
                        this.addToValidation(item.payload_value)
                      }}>
                      <Text style={{
                        color: Color.white,
                        fontSize: BasicStyles.standardFontSize
                      }}>Enable</Text>
                    </TouchableOpacity>
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

  renderImages(payload_value) {
    const { data } = this.props;
    const { user } = this.props.state;
    return (
      <ScrollView>
        <View style={Style.signatureFrameContainer}>
        {
          this.state.pictures.length > 0 && this.state.pictures.map((ndx, el)=>{
            if(ndx.payload === payload_value) {
              return (
                <View style={{
                  height: 100,
                  width: '49%',
                  borderWidth: 1,
                  borderColor: Color.gray,
                  margin: 2
                }}
                key={el}>
                  <Image
                    source={{ uri: ndx.payload_value.includes('content') ? ndx.payload_value : `data:image/png;base64,${ndx.payload_value}`}}
                    style={{
                      width: 205,
                      height: 98
                    }}
                  />
                </View>
              )
            }
          })
        }
        {this.state.isLoading ? <Spinner mode="full"/> : null }
        <View style={{paddingTop: 50}}>
        
          {data && data.account_id == user.id ?
            <View style={Style.signatureFrameContainer}>
            <TouchableOpacity style={[
              Style.signatureAction,
              Style.signatureActionDanger,
              {width: '49%'}]}
              onPress={() => {this.updateValidation('declined')}}>
              <Text style={{color: Color.white}}> Decline </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[
              Style.signatureAction,
              Style.signatureActionSuccess]}
              onPress={() => {this.updateValidation('accept')}}>
              <Text style={{color: Color.white}}> Accept </Text>
            </TouchableOpacity>
          </View> :
          <View style={Style.signatureFrameContainer}>
            <TouchableOpacity style={[
              Style.signatureFullSuccess,
              Style.signatureActionSuccess]}
              onPress={() => {
                if(payload_value === 'signature') {
                  this.setState({visible: true})
                } else {
                  this.uploadPhoto(payload_value);
                }
              }}>
              <Text style={{color: Color.white}}> Upload </Text>
            </TouchableOpacity>
          </View>}
        </View>
        </View>
      </ScrollView>
    )
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
        <Modal send={this.sendSketch} close={this.closeSketch} visible={this.state.visible}/>
        {this.header(this.state.current)}
        {current.title == 'Settings' && this.body(this.state.current.menu)}
        {current.title == 'Settings > Requirements' && this.requirements(this.state.current.menu)}
        {current.title == 'signature' && this.renderImages(this.state.current.title)}
        {current.title == 'receiver_picture' && this.renderImages(this.state.current.title)}
        {current.title == 'valid_id' && this.renderImages(this.state.current.title)}
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
