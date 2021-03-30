import React, { Component } from 'react';
// import Style from './Style.js';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
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

class Options extends Component {
  constructor(props) {
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
      visible: false,
      validations: [],
      currentValidation: null,
      requestId: null
    }
  }

  componentDidMount() {
    this.retrieveRequestId();
  }

  sendSketch = (result) => {
    const { user } = this.props.state;
    const { currentValidation } = this.state;
    let parameter = {
      account_id: user.id,
      payload: 'signature',
      payload_value: result,
      category: currentValidation?.id
    }
    this.setState({ isLoading: true })
    Api.request(Routes.uploadImage, parameter, response => {
      this.setState({ isLoading: false })
      this.retrieveReceiverPhoto(this.state.currentValidation?.id);
    })
  }

  closeSketch = () => {
    this.setState({ visible: false })
  }

  retrieveReceiverPhoto = (id) => {
    let parameter = {
      condition: [{
        clause: "=",
        column: "category",
        value: id
      }]
    }
    this.setState({ isLoading: true })
    Api.request(Routes.retrieveImage, parameter, response => {
      this.setState({ isLoading: false })
      if(response.data.length > 0) {
        this.setState({ pictures: response.data })
      }
    })
  }

  componentWillUnmount() {
  }

  close() {
    const { viewMenu } = this.props;
    viewMenu(false)
  }

  sendNewMessage = (payload) => {
    const { messengerGroup, user, messagesOnGroup} = this.props.state;
    const { updateMessagesOnGroup,  updateMessageByCode} = this.props;

    if(messengerGroup == null || user == null){
      return
    }

    let parameter = {
      messenger_group_id: messengerGroup.id,
      message: `Your ${payload} request has been declined. Please send more photos.`,
      account_id: user.id,
      status: 0,
      payload: 'text',
      payload_value: null,
      code: messagesOnGroup.messages.length + 1
    }
    let newMessageTemp = {
      ...parameter,
      account: user,
      created_at_human: null,
      sending_flag: true,
      error: null
    }
    updateMessagesOnGroup(newMessageTemp);
    this.setState({newMessage: null})
    this.setState({isLoading: true})
    Api.request(Routes.messengerMessagesCreate, parameter, response => {
      this.setState({isLoading: false})
      if(response.data != null){
        updateMessageByCode(response.data);
      }
    });
  }

  retrieveRequestId() {
    const { user, request } = this.props.state;
    const { data } = this.props;
    if (user == null || data == null) {
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
    this.setState({ isLoading: true });
    Api.request(Routes.requestRetrieveItem, parameter, (response) => {
      this.setState({ isLoading: false });
      if (response.data.length > 0) {
        this.setState({ requestId: response.data[0].id });
        this.retrieveValidation();
      }
    })
  }

  retrieveRequest(route) {
    const { user, request } = this.props.state;
    const { data } = this.props;
    if (user == null || data == null) {
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
    if (request != null && request.code == data.title) {
      this.props.navigation.navigate(route, {
        data: request,
        from: 'messenger'
      })
      return
    }
    this.setState({ isLoading: true });
    Api.request(Routes.requestRetrieveItem, parameter, (response) => {
      this.setState({ isLoading: false });
      if (response.data.length > 0) {
        const { setRequest } = this.props;
        setRequest(response.data[0])
        this.setState({ sender_id: response.data[0].account_id });
        this.props.navigation.navigate(route, {
          data: response.data[0],
          from: 'messenger'
        })
      }
    }, error => {
      console.log('response', error)
      this.setState({ isLoading: false });
    });
  }

  addToValidation = (payload) => {
    const { requestId } = this.state;
    let parameter = {
      status: 'pending',
      payload: payload,
      account_id: this.props.state.user.id,
      request_id: requestId,
      messages: {
        messenger_group_id: this.props.messengerId,
        account_id: this.props.state.user.id
      }
    }
    this.setState({ isLoading: true });
    Api.request(Routes.requestValidationCreate, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data !== null) {
        this.retrieveValidation();
      }
    }, error => {
      this.setState({ isLoading: false });
      console.log({ retrieveMessagesError: error })
    });
  }

  checkValidation = (payload) => {
    let result = {
      result: null,
      item: null
    }
    let item = this.state.validations.find(item => item.payload === payload);
    if (item) {
      result = {
        result: true,
        item: item
      }
    } else {
      result = {
        result: false,
        item: item
      }
    }
    return result;
  }

  retrieveValidation = () => {
    const { user } = this.props.state;
    const { requestId } = this.state;
    let parameter = {
      condition: [{
        value: requestId,
        clause: '=',
        column: 'request_id'
      }]
    }
    this.setState({ isLoading: true });
    Api.request(Routes.requestValidationRetreive, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data !== null) {
        this.setState({ validations: response.data });
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
    const { currentValidation } = this.state;
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
      } else {
        if (response.fileSize >= 1000000) {
          Alert.alert('Notice', 'File size exceeded to 1MB')
          return
        }
        let parameter = {
          account_id: user.id,
          payload: payload,
          payload_value: response.uri,
          category: currentValidation?.id
        }
        this.setState({ isLoading: true })
        Api.request(Routes.uploadImage, parameter, response => {
          this.setState({ isLoading: false })
          this.retrieveReceiverPhoto(currentValidation?.id);
        })
      }
    })
  }

  removeValidation = (item) => {
    let result = item;
    let parameter = {
      id: result.item.id
    }
    this.setState({ isLoading: true })
    Api.request(Routes.requestValidationDelete, parameter, response => {
      this.setState({ isLoading: false })
      this.retrieveValidation();
    })
  }

  updateValidation = (status) => {
    const { messengerGroup, user } = this.props.state;
    const { currentValidation, requestId } = this.state;
    if(messengerGroup == null){
      return
    }
    let parameter = {
      status: status,
      id: currentValidation?.id,
      payload: currentValidation?.payload,
      account_id: this.props.state.user.id,
      request_id: requestId,
      messages: {
        messenger_group_id: this.props.messengerId,
        account_id: this.props.state.user.id
      }
    }
    this.setState({isLoading: true})
    Api.request(Routes.requestValidationUpdate, parameter, response => {
      this.setState({isLoading: false})
    })
  }

  enableSupport = () => {
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id,
      payload: 'request_id',
      payload_value: this.props.requestId,
      status: 1,
      assigned_to: ''
    }
    this.setState({ isLoading: true })
    Api.request(Routes.enableSupportCreate, parameter, response => {
      console.log(response.error, "======support enabled");
      this.setState({ isLoading: false })
    })
  }

  onClick(item) {
    switch (item.payload_value) {
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
      case 'enableSupport': {
        this.enableSupport();
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
        let result = this.checkValidation('signature');
        if(result.result === true ) {
          this.setState({currentValidation: result.item})
          this.retrieveReceiverPhoto(result.item.id);
          this.setState({
            showPhotos: true,
            current: {
              title: item.payload_value
            }
          });
        }
        break
      case 'receiver_picture':
        let result1 = this.checkValidation('receiver_picture');
        if(result1.result === true ) {
          console.log(result1.item.id, "=========================result");
          this.setState({currentValidation: result1.item})
          this.retrieveReceiverPhoto(result1.item.id);
          this.setState({
            showPhotos: true,
            current: {
              title: item.payload_value
            }
          });
        }
        break
      case 'valid_id':
        let result2 = this.checkValidation('valid_id');
        if(result2.result === true ) {
          this.setState({currentValidation: result2.item})
          this.retrieveReceiverPhoto(result2.item.id);
          this.setState({
            showPhotos: true,
            current: {
              title: item.payload_value
            }
          });
        }
        break
    }
  }

  header(setting) {
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
    return (
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
            icon={faTimes}
            size={20}
            style={{ color: Color.danger }} />
        </TouchableOpacity> :
          <TouchableOpacity
            style={{
              width: '10%',
              justifyContent: 'center'
            }}
            onPress={() => this.closePhotos()}>
            <FontAwesomeIcon
              icon={faTimes}
              size={20}
              style={{ color: Color.danger }} />
          </TouchableOpacity>}
      </View>
    );
  }

  body(options) {
    return (
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
                      icon={faChevronRight}
                      size={20}
                      style={{ color: Color.primary }} />
                  </View>
                )
              }
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    );
  }

  requirements(options) {
    const { data } = this.props;
    const { user } = this.props.state;
    return (
      <ScrollView
      >
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        {
          options.map((item, index) => (
            <View>  
              {data && user && data.account_id == user.id && (
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
                  onPress={() => 
                    this.onClick(item)
                  }>
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
                        backgroundColor: this.checkValidation(item.payload_value).result === false ? Color.secondary : Color.danger
                      }}>
                        {this.checkValidation(item.payload_value).result === false ?
                          <TouchableOpacity
                            onPress={() => {
                              this.addToValidation(item.payload_value)
                            }}>
                            <Text style={{
                              color: Color.white,
                              fontSize: BasicStyles.standardFontSize
                            }}>Enable</Text>
                          </TouchableOpacity> :
                          <TouchableOpacity
                            onPress={() => {
                              this.removeValidation(this.checkValidation(item.payload_value))
                            }}>
                            <Text style={{
                              color: Color.white,
                              fontSize: BasicStyles.standardFontSize
                            }}>Disable</Text>
                          </TouchableOpacity>}
                      </View>
                    )
                  }
                </TouchableOpacity>)}
                {
                    (this.checkValidation(item.payload_value).result === true && item.title != 'Back' && data && data.account_id != user.id) && (
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
                        <View style={{
                          width: '10%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 30
                        }}>
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            size={20}
                            style={{ color: Color.primary }} />
                        </View>
                      </TouchableOpacity>
                    )
                  }
            </View>
          ))
        }
      </ScrollView>
    );
  }

  renderImages(payload_value) {
    const { data } = this.props;
    const { user } = this.props.state;
    const { currentValidation } = this.state;
    console.log(currentValidation, "======current validation");
    return (
      <ScrollView>
        {this.state.isLoading ? <Spinner mode="full" /> : null}
        <View style={Style.signatureFrameContainer}>
          {
            this.state.pictures.length > 0 && this.state.pictures.map((ndx, el) => {
              if (ndx.payload === payload_value) {
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
                      source={{ uri: ndx.payload_value.includes('content') ? ndx.payload_value : `data:image/png;base64,${ndx.payload_value}` }}
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
          <View style={{
            paddingTop: 50,
            width: '100%',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center' 
          }}>

            {data && data.account_id === user.id && currentValidation?.status === 'pending' && (
              <View style={Style.signatureFrameContainer}>
                <TouchableOpacity style={[
                  Style.signatureAction,
                  Style.signatureActionDanger,
                  { width: '45%' }]}
                  onPress={() => { this.sendNewMessage(currentValidation.payload) }}>
                  <Text style={{ color: Color.white }}> Decline </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                  Style.signatureAction,
                  Style.signatureActionSuccess,  { width: '45%' }]}
                  onPress={() => { this.updateValidation('accepted') }}>
                  <Text style={{ color: Color.white }}> Accept </Text>
                </TouchableOpacity>
              </View>
            )}
            {data && data.account_id !== user.id && (
              <View style={Style.signatureFrameContainer}>
                <TouchableOpacity style={[
                  Style.signatureFullSuccess,
                  Style.signatureActionSuccess]}
                  onPress={() => {
                    if (payload_value === 'signature') {
                      this.setState({ visible: true })
                    } else {
                      this.uploadPhoto(payload_value);
                    }
                  }}>
                  <Text style={{ color: Color.white }}> Upload </Text>
                </TouchableOpacity>
              </View>
            )}
            {data && data.account_id === user.id && (currentValidation?.status === 'accepted') && (
              <View style={Style.signatureFrameContainer}>
                <View style={[
                  Style.signatureAction,
                  Style.signatureActionSuccess,
                  { width: '99%' }]}>
                  <Text style={{ color: Color.white }}> Accepted </Text>
                </View>
              </View>
            )}
            {data && data.account_id === user.id && currentValidation?.status === 'declined' && (
              <View style={Style.signatureFrameContainer}>
                <View style={[
                  Style.signatureAction,
                  Style.signatureActionDanger,
                  { width: '99%' }]}>
                  <Text style={{ color: Color.white }}> Declined </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    )
  }

  render() {
    const { current } = this.state;
    return (
      <View>
        {this.state.isLoading ? <Spinner mode="full" /> : null}
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

          <Modal send={this.sendSketch} close={this.closeSketch} visible={this.state.visible} />
          {this.header(this.state.current)}
          {current.title == 'Settings' && this.body(this.state.current.menu)}
          {current.title == 'Settings > Requirements' && this.requirements(this.state.current.menu)}
          {current.title == 'signature' && this.renderImages(this.state.current.title)}
          {current.title == 'receiver_picture' && this.renderImages(this.state.current.title)}
          {current.title == 'valid_id' && this.renderImages(this.state.current.title)}
        </View>
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
