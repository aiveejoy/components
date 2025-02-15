import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import { Routes, Color, BasicStyles, Helper } from 'common';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faChevronRight, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import Style from 'modules/messenger/Style.js';
import Modal from 'components/Modal/Sketch';
import ImagePicker from 'react-native-image-picker';
import Button from 'components/Form/Button';
import ImageModal from 'components/Modal/ImageModal';
import ImageResizer from 'react-native-image-resizer';
import moment from 'moment';
import Config from 'src/config';
import Skeleton from 'components/Loading/Skeleton';
import { fcmService } from 'services/broadcasting/FCMService';
import { localNotificationService } from 'services/broadcasting/LocalNotificationService';
import NotificationsHandler from 'services/NotificationHandler';
import BottomSheetOptions from 'src/components/BottomSheet/index';

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

class Options extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef()
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
      imageModal: false,
      url: null,
      supportEnabled: [],
      imageLoading: false,
      deleteID: null,
      menu: Helper.MessengerMenu,
      requirements: Helper.requirementsMenu,
      images: false,
      userOwner: false
    }
  }

  componentDidMount() {
    const { data } = this.props;
    this.checkIfSupportEnabled();
    this.retrieveValidation(false);
    console.log('cash in', data?.type, data?.shipping)
    if (data?.type == 3 || data?.type == 2) {
      let menu = this.state.menu
      menu.length > 0 && menu.map((item, index) => {
        if (item.title?.toLowerCase() === 'requirements') {
          menu.splice(index, 1);
        }
      })
      this.setState({
        current: {
          title: 'Settings',
          menu: menu
        }
      })
    } else if (data?.type == 1 && (data?.shipping == 'bank' || data?.shipping == 'e-wallet')) {
      let menu = this.state.menu
      menu.length > 0 && menu.map((item, index) => {
        if (item.title?.toLowerCase() === 'requirements') {
          menu.splice(index, 1);
        }
      })
      this.setState({
        current: {
          title: 'Settings',
          menu: menu
        }
      })
    } else {
      console.log('not cash in')
      let menu = Helper.MessengerMenu;
      if (Helper.MessengerMenu[0].title?.toLowerCase() !== 'requirements') {
        menu = [
          {
            title: 'Requirements',
            payload: 'same_page',
            payload_value: 'requirements',
            color: Color.black,
            type: 'callback',
            icon: faFileAlt
          },
          ...Helper.MessengerMenu
        ]
      }
      this.setState({
        current: {
          title: 'Settings',
          menu: menu
        }
      })
    }
    this.showNavigationMap()
  }

  showNavigationMap = () => {
    const { data } = this.props;
    let index = Helper.MessengerMenu.length - 1;
    let menu = Helper.MessengerMenu;
    console.log(data?.peer?.account?.code, this.props.state.user.code);
    if(data?.peer?.account?.code == this.props.state.user.code){
      if(menu[index - 1].payload_value !== 'navigationStack') {
        menu.splice(index, 0, {
          title: 'Navigation',
          payload: 'redirect',
          payload_value: 'navigationStack',
          color: Color.black,
          type: 'callback',
          icon: faFileAlt
        });
        this.setState({
          current: {
            title: 'Settings',
            menu: menu
          }
        })
      }
    } else {
      menu = menu.filter(function( obj ) {
        return obj.payload_value !== 'navigationStack';
      });
      this.setState({
        current: {
          title: 'Settings',
          menu: menu
        }
      })
    }
  }

  onRegister = () => {
    this.notificationHandler.onRegister();
  };

  onOpenNotification = (notify) => {
    this.notificationHandler.onOpenNotification(notify);
  };

  onNotification = (notify) => {
    this.notificationHandler.onNotification(notify);
  };

  firebaseNotification() {
    const { user } = this.props.state;
    if (user == null) {
      return
    }
    fcmService.registerAppWithFCM()
    fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
    localNotificationService.configure(this.onOpenNotification, Helper.APP_NAME)
    this.notificationHandler.setTopics()
    return () => {
      console.log("[App] unRegister")
      fcmService.unRegister()
      localNotificationService.unRegister()
    }
  }

  sendSketch = (result) => {
    const { myDevice } = this.props.state;
    let date = (moment(new Date()).format('hh:mm:ss')).split(':')
    const { user, currentValidation } = this.props.state;
    let formData = new FormData();
    formData.append('file_url', currentValidation?.id + '_' + date.join('_') + '_' + myDevice?.unique_code);
    formData.append('account_id', user.id);
    formData.append('file_base64', result);
    this.setState({ imageLoading: true })
    Api.upload(Routes.imageUploadBase64, formData, resp => {
      this.setState({ imageLoading: false })
      let parameter = {
        account_id: user.id,
        payload: 'signature',
        payload_value: resp.data.data,
        category: currentValidation?.id
      }
      this.setState({ imageLoading: true })
      Api.request(Routes.uploadImage, parameter, response => {
        this.setState({ imageLoading: false })
        this.retrieveReceiverPhoto(currentValidation?.id);
      }, error => {
        console.log(error, 'upload photo to payloads')
      })
    }, error => {
      console.log(error, 'base 64 upload')
    })
  }

  componentDidUpdate() {
    const { data } = this.props.navigation.state?.params
    if (data.menuFlag) {
      this.myRef.current.openBottomSheet()
      return;
    }
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
    console.log(parameter, Routes.retrieveImage)
    this.setState({ imageLoading: true })
    Api.request(Routes.retrieveImage, parameter, response => {
      this.setState({ imageLoading: false })
      if (response.data.length > 0) {
        this.setState({ pictures: response.data })
      } else {
        this.setState({ pictures: [] })
      }
    })
  }

  componentWillUnmount() {
  }

  close = () => {
    this.props.navigation.setParams({
      data: {
        ...this.props.navigation.state?.params?.data,
        title: this.props.navigation.state?.params?.data?.title,
        menuFlag: false
      }
    })
  }

  sendNewMessage = (payload) => {
    const { messengerGroup, user, messagesOnGroup } = this.props.state;
    const { updateMessagesOnGroup, updateMessageByCode } = this.props;
    const { data } = this.props;
    if (messengerGroup == null || user == null) {
      return
    }
    let parameter = {
      messenger_group_id: messengerGroup.id,
      message: `Your ${payload} request has been declined. Please send more photos.`,
      account_id: user.id,
      status: 0,
      payload: 'text',
      payload_value: null,
      code: 1,
      to: data?.location?.account_id
    }
    let newMessageTemp = {
      ...parameter,
      account: {
        profile: user.profile,
        information: {
          first_name: user.information?.first_name,
          last_name: user.information?.last_name,
        },
        username: user.username
      },
      created_at_human: moment(new Date()).format('MMMM DD, YYYY'),
      sending_flag: true,
      error: null
    }
    console.log('parameter', parameter, Routes.messengerMessagesCreate)
    updateMessagesOnGroup(newMessageTemp);
    this.setState({ newMessage: null })
    Api.request(Routes.messengerMessagesCreate, parameter, response => {
      if (response.data != null) {
        const { messagesOnGroup } = this.props.state;
        const { setMessagesOnGroup } = this.props;
        if (messagesOnGroup && messagesOnGroup.messages.length > 0) {
          let temp = messagesOnGroup.messages;
          temp[messagesOnGroup.messages.length - 1].sending_flag = false
          setMessagesOnGroup({
            groupId: data?.id,
            messages: temp
          })
        }
      }
    });
  }

  retrieveRequest(route) {
    const { user, request } = this.props.state;
    const { data, members } = this.props;
    if (user == null || data == null) {
      return
    }
    let parameter = {
      condition: [{
        value: data.id,
        clause: '=',
        column: 'id'
      }],
      account_id: user.id
    };
    if (request != null && request.code == data.code) {
      this.close();
      this.props.navigation.navigate(route, {
        data: request,
        members: members,
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
        this.close();
        this.props.navigation.navigate(route, {
          data: response.data[0],
          members: members,
          from: 'messenger',
        })
      }
    }, error => {
      console.log('response', error)
      this.setState({ isLoading: false });
    });
  }

  addToValidation = (payload) => {
    const { messengerGroup } = this.props.state;
    const { data } = this.props;
    let parameter = {
      status: 'pending',
      payload: payload,
      account_id: this.props.state.user.id,
      request_id: data?.id,
      messages: {
        messenger_group_id: messengerGroup.id,
        account_id: this.props.state.user.id
      }
    }
    this.setState({ isLoading: true });
    console.log(parameter, Routes.requestValidationCreate, '---');
    Api.request(Routes.requestValidationCreate, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data !== null) {
        this.retrieveValidation(true);
      }
    }, error => {
      this.setState({ isLoading: false });
      console.log({ retrieveMessagesError: error })
    });
  }

  checkValidation = (payload) => {
    const { validations } = this.state;
    let result = {
      result: null,
      item: null
    }
    let item = validations.find(item => item.payload === payload);
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

  retrieveValidation = (retrieve) => {
    const { user } = this.props.state;
    const { data } = this.props;
    let parameter = {
      condition: [{
        value: data?.id,
        clause: '=',
        column: 'request_id'
      }],
      sort: {
        created_at: 'asc'
      },
      offset: 0,
      limit: 3
    }
    this.setState({ isLoading: true });
    console.log(Routes.requestValidationRetreive, parameter);
    Api.request(Routes.requestValidationRetreive, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data !== null) {
        this.setState({ validations: response.data });
        if (retrieve) {
          this.onClick({
            title: 'Requirements',
            payload: 'same_page',
            payload_value: 'requirements',
            type: 'callback'
          })
        }
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
    const { currentValidation } = this.props.state;
    const options = {
      noData: false,
      error: null
    }
    const { user } = this.props.state;
    ImagePicker.launchCamera(options, response => {
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
        // ImageResizer.createResizedImage(response.uri, response.width * 0.5, response.height * 0.5, 'JPEG', 72, 0)
        //   .then(res => {
        let formData = new FormData();
        formData.append('file_url', currentValidation?.id + '_' + response.fileName);
        formData.append('account_id', user.id);
        formData.append('file_base64', response.data);
        this.setState({ imageLoading: true })
        Api.upload(Routes.imageUploadBase64, formData, resp => {
          this.setState({ imageLoading: false })
          let parameter = {
            account_id: user.id,
            payload: payload,
            payload_value: resp.data.data,
            category: currentValidation?.id
          }
          this.setState({ imageLoading: true })
          Api.request(Routes.uploadImage, parameter, response => {
            this.setState({ imageLoading: false })
            this.retrieveReceiverPhoto(currentValidation?.id);
          }, error => {
            this.setState({ imageLoading: false })
            console.log(error, 'upload image url to payload')
          })
        }, error => {
          this.setState({ imageLoading: false })
          console.log(error, 'upload image')
        })
        // })
        // .catch(err => {
        //   console.log(err)
        // });
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
      this.retrieveValidation(true);
    })
  }

  updateValidation = (status) => {
    const { messengerGroup, user, currentValidation } = this.props.state;
    const { data, setCurrentValidation } = this.props;
    if (messengerGroup == null) {
      return
    }
    let parameter = {
      status: status,
      id: currentValidation?.id,
      payload: currentValidation?.payload,
      account_id: user.id,
      request_id: data?.id,
      to: user.id,
      messages: {
        messenger_group_id: messengerGroup.id,
        account_id: user.id
      }
    }
    this.setState({ isLoading: true })
    console.log(Routes.requestValidationUpdate, parameter)
    Api.request(Routes.requestValidationUpdate, parameter, response => {
      this.setState({ isLoading: false })
      let temp = currentValidation
      temp.status = status;
      setCurrentValidation(temp);
    }, error => {
      console.log(error)
    })
  }

  checkIfSupportEnabled = () => {
    const { user } = this.props.state;
    const { data } = this.props
    let parameter = {
      condition: [
        {
          clause: '=',
          value: data?.id,
          column: 'payload_value'
        },
        {
          clause: '=',
          value: user.id,
          column: 'account_id'
        }
      ],
      sort: {
        created_at: 'asc'
      },
      offset: 0,
      limit: 3
    }
    console.log(Routes.enableSupportRetrieve, parameter);
    this.setState({ isLoading: true })
    Api.request(Routes.enableSupportRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({ supportEnabled: response.data })
      }
    })
  }

  enableSupport = () => {
    const { user } = this.props.state;
    const { data } = this.props
    let parameter = {
      account_id: user.id,
      payload: 'request_id',
      payload_value: data?.id,
      status: 0,
      assigned_to: ''
    }
    this.setState({ isLoading: true })
    Api.request(Routes.enableSupportCreate, parameter, response => {
      if (response.error = 'Request already exist') {
        Alert.alert('Notice', 'Enable Support is already activated.')
        this.setState({ isLoading: false })
        return
      }
      this.checkIfSupportEnabled();
      this.setState({ isLoading: false })
    })
  }

  onClick(item) {
    const { data, setCurrentValidation } = this.props
    const { validations, requirements } = this.state;
    const { user, requestMessage } = this.props.state;
    switch (item.payload_value) {
      case 'close':
        this.close()
        this.setState({ images: false })
        break
      case 'requirements':
        requirements.map((menu, index) => {
          console.log(this.checkValidation(menu.payload_value).result)
          try {
            if (data?.account?.code == user.code && requestMessage?.status < 2) {
              menu.btn.title = this.checkValidation(menu.payload_value).result === true ? 'Disable' : 'Enable'
              menu.btn['onClick'] = () => {
                this.checkValidation(menu.payload_value).result ? this.removeValidation(this.checkValidation(menu.payload_value)) : this.addToValidation(menu.payload_value)
              }
              menu.btn.style.backgroundColor = this.checkValidation(menu.payload_value).result === true ? Color.danger : Color.secondary
              this.setState({ userOwner: true })
              delete menu.hide
            } else {
              this.setState({ userOwner: false })
              let result = this.checkValidation(menu.payload_value);
              if (!result.result && menu.payload_value !== 'back') {
                menu['hide'] = 'hide'
              } else {
                delete menu.hide
              }
            }
          } catch (e) {
            console.log(e)
          }
        })
        this.setState({
          previous: {
            title: 'Settings',
            menu: Helper.MessengerMenu
          },
          current: {
            title: 'Settings > Requirements',
            menu: Helper.requirementsMenu
          },
          images: false
        })
        break
      case 'requestItemStack': {
        this.setState({ images: false })
        this.retrieveRequest('requestItemStack')
      }
        break
      case 'transferFundStack': {
        this.setState({ images: false })
        if (requestMessage?.status < 2) {
          Alert.alert(
            '',
            'Are you sure you want to proceed?',
            [
              { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
              {
                text: 'Yes', onPress: () => {
                  this.retrieveRequest('transferFundStack')
                }
              },
            ],
            { cancelable: false }
          )
        } else {
          this.retrieveRequest('transferFundStack')
        }
      }
        break
      case 'reviewsStack': {
        this.setState({ images: false })
        // review stack
        if (data?.status < 2) {
          Alert.alert('Notice', 'Please complete the transaction before giving reviews.')
          return
        } else {
          this.retrieveRequest('reviewsStack')
        }
      }
      case 'enableSupport': {
        this.setState({ images: false })
        this.enableSupport();
      }
        break
      case 'navigationStack': {
        this.close()
        this.props.navigation.navigate(item.payload_value, {location: data.location})
      }
        break
      case 'back':
        this.setState({ images: false })
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
        if (result.result === true) {
          // this.firebaseNotification(result.item.id)
          setCurrentValidation(result.item)
          this.retrieveReceiverPhoto(result.item.id);
          this.setState({
            showPhotos: true,
            current: {
              title: item.payload_value,
            },
            images: true
          });
        } else {
          Alert.alert('Opps', 'This requirement is disabled.')
        }
        break
      case 'receiver_picture':
        let result1 = this.checkValidation('receiver_picture');
        if (result1.result === true) {
          // this.firebaseNotification(result1.item.id)
          setCurrentValidation(result1.item)
          this.retrieveReceiverPhoto(result1.item.id);
          this.setState({
            showPhotos: true,
            current: {
              title: item.payload_value
            },
            images: true
          });
        } else {
          Alert.alert('Opps', 'This requirement is disabled.')
        }
        break
      case 'valid_id':
        let result2 = this.checkValidation('valid_id');
        if (result2.result === true) {
          // this.firebaseNotification(result2.item.id)
          setCurrentValidation(result2.item)
          this.retrieveReceiverPhoto(result2.item.id);
          this.setState({
            showPhotos: true,
            current: {
              title: item.payload_value
            },
            images: true
          });
        } else {
          Alert.alert('Opps', 'This requirement is disabled.')
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
              onPress={() => this.onClick(item)}
              key={index}>
              <Text style={{
                color: item.color,
                fontSize: BasicStyles.standardFontSize,
                paddingLeft: 20,
                width: '90%'
              }}>{item.title === 'Enable Support' ? (this.state.supportEnabled?.length > 0 ? 'Enabled Support' : 'Enable Support') : item.title}</Text>
              {
                (item.title != 'Close') && (
                  <View style={{
                    width: '10%',
                    justifyContent: 'center'
                  }}>
                    <FontAwesomeIcon
                      onPress={() => {
                        if (item.title === 'Enable Support' && this.state.supportEnabled?.length > 0) {
                          console.log(this.state.supportEnabled.length > 0 && this.state.supportEnabled, 'support');
                          this.props.navigation.navigate('commentsStack', { payload: 'support_id', payload_value: this.state.supportEnabled.length > 0 && this.state.supportEnabled[0].id })
                        }
                      }}
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
        {
          options.map((item, index) => (
            <View
              key={index}>
              {(data?.account?.code == user.code) && (
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
                    width: (data?.account?.code == user.code) ? '70%' : '90%',
                  }}>{item.title}</Text>
                  {
                    (item.title != 'Back' && (data?.account?.code == user.code)) && (
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
                (this.checkValidation(item.payload_value).result === true && item.title != 'Back' && (data?.account?.code != user.code)) && (
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
                      width: '90%',
                    }}>{item.title}</Text>
                    <View style={{
                      width: '10%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row-reverse',
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
        {data?.account?.code != user.code && (
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
              this.setState({
                current: {
                  title: 'Settings',
                  menu: Helper.MessengerMenu
                }
              })
            }>
            <Text style={{
              color: Color.danger,
              fontSize: BasicStyles.standardFontSize,
            }}>Back</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  }

  renderImages(payload_value) {
    const { data } = this.props;
    const { user, currentValidation } = this.props.state;
    const { imageLoading } = this.state;
    return (
      <ScrollView>
        <View style={Style.signatureFrameContainer}>
          {
            this.state.pictures.length > 0 ? this.state.pictures.map((ndx, el) => {
              if (ndx.payload === payload_value) {
                return (
                  <TouchableOpacity style={{
                    height: 100,
                    width: '50%',
                    borderWidth: 1,
                    borderColor: Color.gray
                  }}
                    onPress={() => {
                      this.setState({
                        deleteID: ndx.id,
                        url: ndx.payload_value,
                        imageModal: true
                      })
                    }}
                    key={el}>
                    <Image
                      source={{ uri: Config.BACKEND_URL + ndx.payload_value }}
                      style={{
                        width: '100%',
                        height: 98
                      }}
                    />
                  </TouchableOpacity>
                )
              }
            }) :
              <View style={{
                padding: 10
              }}>
                {!this.state.imageLoading && <Text>No requirements submitted yet.</Text>}
              </View>
          }
          {this.state.imageLoading ? (<Skeleton size={2} template={'block'} height={75} />) : null}
        </View>
        <View style={{
          paddingTop: 50,
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>

          {!this.state.imageLoading && data?.account?.code == user.code && currentValidation?.status === 'pending' && data?.status < 2 && this.state.pictures.length > 0 && (
            <View style={Style.signatureFrameContainer}>
              <Button
                title={'Decline'}
                onClick={() => this.sendNewMessage(currentValidation.payload)}
                style={{
                  width: '45%',
                  marginRight: '1%',
                  backgroundColor: Color.danger
                }}
              />
              <Button
                title={'Accept'}
                onClick={() => this.updateValidation('accepted')}
                style={{
                  width: '45%',
                  backgroundColor: Color.success
                }}
              />
            </View>
          )}
          {data?.account?.code != user.code && data?.status < 2 && currentValidation?.status !== 'accepted' && imageLoading === false && (
            <Button
              title={payload_value === 'signature' ? 'Upload Signature' : 'Take A Picture'}
              onClick={() => {
                if (payload_value === 'signature') {
                  this.setState({ visible: true })
                } else {
                  this.uploadPhoto(payload_value);
                }
              }}
              style={{
                width: '50%',
                backgroundColor: Color.success,
                marginBottom: 20
              }}
            />
          )}
          {(currentValidation?.status === 'accepted') && imageLoading === false && (
            <View style={Style.signatureFrameContainer}>
              <View style={[
                Style.signatureAction,
                Style.signatureActionSuccess,
                { width: '99%' }]}>
                <Text style={{ color: Color.white }}> Accepted </Text>
              </View>
            </View>
          )}
          {currentValidation?.status === 'declined' && imageLoading === false && (
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
      </ScrollView>
    )
  }

  render() {
    const { current, deleteID, pictures, images, userOwner, isLoading } = this.state;
    const { data } = this.props;
    const { user, currentValidation, myDevice } = this.props.state;
    return (
      <View>
        <NotificationsHandler notificationHandler={ref => (this.notificationHandler = ref)} />
        <View>
          {/* <View style={{
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
          <ImageModal
            deleteID={data?.account?.code != user.code && currentValidation?.status !== 'accepted' ? deleteID : null}
            visible={this.state.imageModal}
            url={Config.BACKEND_URL + this.state.url}
            action={() => {
              this.setState({ imageModal: false })
            }}
            route={Routes.uploadImageDelete}
            successDel={() => { this.retrieveReceiverPhoto(currentValidation?.id) }}
          >
          </ImageModal>
          <Modal send={this.sendSketch} close={this.closeSketch} visible={this.state.visible} />
          {this.header(this.state.current)}
          {isLoading ? (<Skeleton size={2} template={'block'} height={75} />) : null}
          {!isLoading && current.title == 'Settings' && this.body(this.state.current.menu)}
          {!isLoading && current.title == 'Settings > Requirements' && this.requirements(this.state.current.menu)}
          {!isLoading && current.title == 'signature' && this.renderImages(this.state.current.title)}
          {!isLoading && current.title == 'receiver_picture' && this.renderImages(this.state.current.title)}
          {!isLoading && current.title == 'valid_id' && this.renderImages(this.state.current.title)} */}
          <BottomSheetOptions
            version={2}
            user={user}
            myDevice={myDevice}
            userOwner={userOwner}
            images={images}
            currentValidation={currentValidation}
            pictures={pictures}
            ref={this.myRef}
            goBack={() => {
              this.setState({
                previous: {
                  title: 'Settings',
                  menu: Helper.MessengerMenu
                },
                current: {
                  title: 'Settings > Requirements',
                  menu: Helper.requirementsMenu
                },
                images: false
              })
            }}
            data={this.state.current.menu}
            onClose={() => {
              this.props.navigation.setParams({
                data: {
                  ...this.props.navigation.state.params.data,
                  menuFlag: !this.props.navigation.state.params.data.menuFlag
                }
              })
            }}
            onClick={(item) => {
              this.onClick(item)
            }}
            btnClick={(item) => {
              this.onClick(item)
            }}
            isLoading={isLoading}
            retrieveReceiverPhoto={() => {
              this.retrieveReceiverPhoto(currentValidation?.id)
            }}
            sendNewMessage={(parameter) => {
              this.sendNewMessage(parameter)
            }}
            updateValidation={(parameter) => {
              this.updateValidation(parameter)
            }}
          />
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setRequest: (request) => dispatch(actions.setRequest(request)),
    setCurrentValidation: (currentValidation) => dispatch(actions.setCurrentValidation(currentValidation))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Options);
