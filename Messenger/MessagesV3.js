import React, { Component } from 'react';
import { Modal, TextInput, View, Image, Text, ScrollView, FlatList, TouchableOpacity, Platform, KeyboardAvoidingView, SafeAreaView, Dimensions, Alert, RefreshControl } from 'react-native';
import { Routes, Color, BasicStyles, Helper } from 'common';
import { UserImage } from 'components';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImage, faPaperPlane, faLock, faChevronDown, faTruckMoving, faEdit, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import ImageModal from 'components/Modal/ImageModal.js';
import ImagePicker from 'react-native-image-picker';
import Style from 'modules/messenger/Style.js'
import Modals from 'components/Modal/Sketch';
import MessageOptions from './Options.js'
import moment from 'moment';
import Button from 'components/Form/Button';
import { NavigationActions, StackActions } from 'react-navigation';
import Skeleton from 'components/Loading/Skeleton';
import ScreenshotHandler from 'services/ScreenshotHandler';
import _ from 'lodash';
import Ratings from 'components/Messenger/Ratings';
import styles from 'components/Messenger/Style';

const DeviceHeight = Math.round(Dimensions.get('window').height);
const DeviceWidth = Math.round(Dimensions.get('window').width);

class MessagesV3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selected: null,
      newMessage: null,
      imageModalUrl: null,
      isImageModal: false,
      photo: null,
      keyRefresh: 0,
      isPullingMessages: false,
      offset: 0,
      limit: 5,
      isLock: false,
      settingsMenu: [],
      settingsBreadCrumbs: ['Settings'],
      group: null,
      request_id: null,
      isViewing: false,
      members: [],
      data: null,
      updatingMessage: null,
      isUpdate: false,
      updatingText: null,
      nowUpdatingMessage: false,
      imageToDelete: null
    }
  }

  componentDidMount() {
    ScreenshotHandler.disableScreenshot()
    const { setMessageTitle } = this.props;
    setMessageTitle(null)
    const { user } = this.props.state
    if (user == null) return
    this.retrieveRequest()
  }

  retrieveRequest() {
    const { user } = this.props.state;
    const { data } = this.props.navigation.state.params;
    const { members } = this.state;
    const { setMessageTitle, setRequestMessage, setUpdateActivity } = this.props;
    let parameter = {
      condition: [{
        value: data.title,
        clause: '=',
        column: 'code'
      }],
      account_id: user.id
    };
    this.setState({ isLoading: true });
    console.log(parameter, Routes.requestRetrieveItem)
    Api.request(Routes.requestRetrieveItem, parameter, (response) => {
      this.setState({ isLoading: false });
      this.retrieveGroup()
      if (response.data.length > 0) {
        this.setState({
          data: response.data[0],
        });
        setUpdateActivity(response.data[0].activity)
        setRequestMessage(response.data[0])
        console.log(response.data[0].status)
        setMessageTitle({
          amount: response.data[0].amount,
          currency: response.data[0].currency
        })
      }
    }, error => {
      console.log('error', error)
      this.setState({ isLoading: false });
    });
  }

  redirectToRate = (route) => {
    const { data, members } = this.state;
    if (data) {
      this.props.navigation.navigate(route, {
        data: data,
        members: members,
        from: 'messenger'
      })
    }
  }

  componentWillUnmount() {
    const { data } = this.props.navigation.state.params;
    const { setMessengerGroup, setMessagesOnGroup } = this.props
    setMessengerGroup(null)
    setMessagesOnGroup({
      groupId: null,
      messages: null
    })
    if (data == null) {
      return
    }
  }

  navigateToScreen = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'drawerStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({
            routeName: 'Dashboard', params: {
              initialRouteName: 'Dashboard',
              index: 0
            }
          }),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  retrieve = (data) => {
    const { offset, limit } = this.state
    this.setState({ isLoading: true });
    const parameter = {
      condition: [{
        value: data.id,
        column: 'messenger_group_id',
        clause: '='
      }],
      sort: {
        'created_at': 'DESC'
      },
      limit,
      offset: offset * limit,
    }
    console.log(parameter, '--')
    Api.request(Routes.messengerMessagesRetrieve, parameter, response => {
      this.setState({ isLoading: false, offset: offset + limit });
      if (response.data.length > 0) {
        this.setState({ sender_id: response.data[0].account_id });
        this.setState({ request_id: response.data[0].id });
      }
      const { setMessagesOnGroup } = this.props;
      setMessagesOnGroup({
        messages: response.data.reverse(),
        groupId: this.props.navigation.state.params.data.id
      })
    }, error => {
      this.setState({ isLoading: false });
      console.log({ retrieveMessagesError: error })
    });
  }

  retrieveMembers = (data) => {
    this.setState({ isLoading: true });
    const parameter = {
      condition: [{
        value: data.id,
        column: 'messenger_group_id',
        clause: '='
      }],
      sort: {
        'created_at': 'DESC'
      },
      limit: 2,
      offset: 0,
    }
    Api.request(Routes.messengerMembersRetrieve, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data.length > 0) {
        this.setState({
          members: response.data
        });
      }
    }, error => {
      this.setState({ isLoading: false });
      console.log({ retrieveMessagesError: error })
    });
  }

  retrieveMoreMessages = () => {
    const { offset, limit } = this.state
    const { messengerGroup, messagesOnGroup } = this.props.state;
    const { setMessagesOnGroup } = this.props;

    if (messengerGroup == null) {
      return
    }

    this.setState({ isLoading: true });

    const parameter = {
      condition: [{
        value: messengerGroup.id,
        column: 'messenger_group_id',
        clause: '='
      }],
      sort: {
        'created_at': 'DESC'
      },
      offset,
      limit,
    }
    console.log(Routes.messengerMessagesRetrieve, parameter)
    Api.request(Routes.messengerMessagesRetrieve, parameter, response => {
      const newMessages = _.uniqBy([...response.data.reverse(), ...messagesOnGroup.messages], 'id')
      this.setState({ isLoading: false, offset: offset + limit });
      setMessagesOnGroup({
        messages: newMessages,
        groupId: messengerGroup.id
      })
    }, error => {
      this.setState({ isLoading: false });
      console.log({ retrieveMoreMessagesError: error })
    });
  }

  retrieveGroup = (flag = null) => {
    const { user } = this.props.state;
    const { setMessengerGroup } = this.props;
    const { data } = this.props.navigation.state.params;
    if (user == null) {
      return
    }
    let parameter = {
      condition: [{
        value: data.title,
        column: 'title',
        clause: '='
      }],
      account_id: user.id
    }
    this.setState({ isLoading: true });
    Api.request(Routes.messengerGroupRetrieve, parameter, response => {
      if (response.data.length > 0) {
        setMessengerGroup({
          ...data,
          id: response.data[0].id
        });
        setTimeout(() => {
          this.retrieve(response.data[0])
          this.retrieveMembers(response.data[0])
        }, 500)
      } else {
        this.setState({ isLoading: false });
      }
    }, error => {
      this.setState({ isLoading: false });
    });
  }

  sendNewMessage = () => {
    const { messengerGroup, user } = this.props.state;
    const { updateMessagesOnGroup } = this.props;
    const { members } = this.state;
    if (messengerGroup == null || user == null || this.state.newMessage == null) {
      return
    }
    let parameter = {
      messenger_group_id: messengerGroup.id,
      message: this.state.newMessage,
      account_id: user.id,
      status: 0,
      payload: 'text',
      payload_value: null,
      code: 1,
      to: members[0]?.account_id === user.id ? members[1]?.account_id : members[0]?.account_id
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
      created_at_human: moment(new Date()).fromNow(),
      sending_flag: true,
      error: null
    }
    updateMessagesOnGroup(newMessageTemp);
    this.setState({ newMessage: null })
    console.log(Routes.messengerMessagesCreate, parameter)
    Api.request(Routes.messengerMessagesCreate, parameter, response => {
      if (response.data != null) {
        const { messagesOnGroup } = this.props.state;
        const { setMessagesOnGroup } = this.props;
        if (messagesOnGroup && messagesOnGroup.messages.length > 0) {
          let temp = messagesOnGroup.messages;
          temp[messagesOnGroup.messages.length - 1].sending_flag = false
          setMessagesOnGroup({
            groupId: messengerGroup.id,
            messages: temp
          })
        }
      }
    });
  }

  sendImageWithoutPayload = (parameter) => {
    const { updateMessageByCode } = this.props;
    Api.request(Routes.mmCreateWithImageWithoutPayload, parameter, response => {
      if (response.data != null) {
        // updateMessageByCode(response.data);
      }
    }, error => {
      console.log({ sendImageWithoutPayloadError: error })
    })
  }

  handleChoosePhoto = () => {
    const { user, messengerGroup, messagesOnGroup } = this.props.state;
    const { members } = this.state;
    const options = {
      noData: true,
      error: null
    }
    if (messengerGroup == null) {
      return
    }
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

        this.setState({ photo: response })
        const { updateMessagesOnGroup } = this.props;
        let formData = new FormData();
        let uri = Platform.OS == "android" ? response.uri : response.uri.replace("file://", "/private");
        formData.append("file", {
          name: response.fileName,
          type: response.type,
          uri: uri
        });
        formData.append('file_url', response.fileName);
        formData.append('account_id', user.id);

        let parameter = {
          messenger_group_id: messengerGroup.id,
          message: null,
          account_id: user.id,
          status: 0,
          payload: 'image',
          payload_value: null,
          url: uri,
          code: messagesOnGroup.messages.length + 1,
          to: members[0]?.account_id === user.id ? members[1]?.account_id : members[0]?.account_id,
          title: 'New message',
          topic: 'message'
        }
        let newMessageTemp = {
          ...parameter,
          account: user,
          created_at_human: null,
          sending_flag: true,
          files: [{
            url: uri
          }],
          error: null
        }
        updateMessagesOnGroup(newMessageTemp);

        Api.uploadByFetch(Routes.imageUploadUnLink, formData, imageResponse => {
          // add message
          if (imageResponse.data != null) {
            parameter = {
              ...parameter,
              url: imageResponse.data
            }
            const { messagesOnGroup, messengerGroup } = this.props.state;
            let temp = messagesOnGroup.messages;
            const { setMessagesOnGroup } = this.props;
            if (messagesOnGroup && messagesOnGroup.messages.length > 0) {
              temp[messagesOnGroup.messages.length - 1].files[0].url = imageResponse.data
              temp[messagesOnGroup.messages.length - 1].sending_flag = false
              setMessagesOnGroup({
                groupId: messengerGroup.id,
                messages: temp
              })
            }
            console.log(temp[messagesOnGroup.messages.length - 1])
            this.sendImageWithoutPayload(parameter)
          }
        }, error => {
          console.log({ imageError: error })
        })
      }
    })
  }

  updateMessage = () => {
    const { updatingMessage, updatingText } = this.state;
    const { messagesOnGroup } = this.props.state;
    const { setMessagesOnGroup } = this.props;
    let parameter = {
      id: updatingMessage?.id,
      message: updatingText
    }
    this.setState({ nowUpdatingMessage: true })
    Api.request(Routes.messengerMessagesUpdateMessage, parameter, response => {
      this.setState({ nowUpdatingMessage: false })
      if (response.data != null) {
        let temp = messagesOnGroup;
        temp.messages?.length > 0 && temp.messages.map((item, index) => {
          if (item.id == updatingMessage.id) {
            item.message = updatingText
          }
        })
        setMessagesOnGroup(temp);
        this.setState({
          updatingMessage: null,
          updatingText: null
        })
      }
    }, error => {
      console.log(error, '--')
      this.setState({ nowUpdatingMessage: false })
    })
  }

  setImage = (url, item) => {
    this.setState({
      imageModalUrl: url,
      imageToDelete: item
    })
    setTimeout(() => {
      this.setState({ isImageModal: true })
    }, 500)
  }

  delete = () => {
    Alert.alert(
      '',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', onPress: () => { return }, style: 'cancel' },
        {
          text: 'Yes', onPress: () => {
            const { updatingMessage } = this.state;
            const { messagesOnGroup } = this.props.state;
            const { setMessagesOnGroup } = this.props;
            let parameter = {
              id: updatingMessage?.id
            }
            this.setState({ nowUpdatingMessage: true })
            Api.request(Routes.messengerMessagesDeleteMessage, parameter, response => {
              this.setState({ nowUpdatingMessage: false })
              if (response.data != null) {
                let temp = messagesOnGroup;
                temp.messages?.length > 0 && temp.messages.map((item, index) => {
                  if (item.id == updatingMessage.id) {
                    temp.messages.splice(index, 1)
                  }
                })
                setMessagesOnGroup(temp);
                this.setState({
                  updatingMessage: null,
                  isUpdate: false
                })
              }
            }, error => {
              console.log(error, '--')
              this.setState({ nowUpdatingMessage: false })
            })
          }
        },
      ],
      { cancelable: false }
    )
  }

  _image = (item) => {
    const { messengerGroup, user, theme } = this.props.state;
    return (
      <View>
        {
          item.payload_value != null && Platform.OS == 'android' && (
            <Text style={[Style.messageTextRight, {
              backgroundColor: item.validations.status == 'approved' ? Color.primary : Color.danger
            }]}>{item.validations.payload} - {item.validations.status}</Text>
          )
        }
        {
          item.payload_value != null && Platform.OS == 'ios' && (
            <View style={[Style.messageTextRight, {
              backgroundColor: item.validations.status == 'approved' ? Color.primary : Color.danger
            }]}>
              <Text style={Style.messageTextRightIOS}>
                {item.validations.payload} - {item.validations.status}
              </Text>
            </View>
          )
        }
        <View style={{
          flexDirection: 'row',
          marginTop: 10
        }}>
          {
            item.files.map((imageItem, imageIndex) => {
              return (
                <TouchableOpacity
                  onPress={() => this.setImage(Config.BACKEND_URL + imageItem.url, item)}
                  style={Style.messageImage}
                  key={imageIndex}
                >
                  {
                    item.sending_flag == true && (
                      <Image source={{ uri: imageItem.url }} style={Style.messageImage} key={imageIndex} />
                    )
                  }
                  {
                    item.sending_flag != true && (
                      <Image source={{ uri: Config.BACKEND_URL + imageItem.url }} style={Style.messageImage} key={imageIndex} />
                    )
                  }

                </TouchableOpacity>
              );
            })
          }
        </View>
        {
          messengerGroup?.account_id == user.id &&
          item != null && item.validations != null &&
          item.validations.status != 'approved' &&
          (
            <View style={{
              flexDirection: 'row',
              marginTop: 10
            }}>
              <View style={{
                width: '45%',
                height: 50,
                marginRight: '5%'
              }}>
                <TouchableOpacity
                  onPress={() => {
                    this.updateValidation(item.validations, 'declined')
                  }}
                  style={[Style.templateBtn, {
                    width: '100%',
                    height: 40,
                    borderColor: Color.danger
                  }]}
                >
                  <Text style={[Style.templateText, {
                    color: Color.danger
                  }]}>Decline</Text>
                </TouchableOpacity>
              </View>
              <View style={{
                width: '45%',
                height: 50,
                marginRight: '5%'
              }}>
                <TouchableOpacity
                  onPress={() => {
                    this.updateValidation(item.validations, 'approved')
                  }}
                  style={[Style.templateBtn, {
                    width: '100%',
                    height: 40,
                    borderColor: theme ? theme.primary : Color.primary
                  }]}
                >
                  <Text style={[Style.templateText, {
                    color: theme ? theme.primary : Color.primary
                  }]}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
      </View>
    );
  }

  _imageTest = (item) => {
    return (
      <View style={{
        flexDirection: 'row'
      }}>
        <TouchableOpacity
          onPress={() => this.setImage(item.uri, item)}
          style={Style.messageImage}
        >
          <Image source={{ uri: item.uri }} style={Style.messageImage} />
        </TouchableOpacity>
      </View>
    );
  }

  _headerRight = (item) => {
    return (
      <View style={{
        flexDirection: 'row',
        height: 30,
        alignItems: 'center'
      }}>
        <UserImage user={item.account} style={{
          width: 25,
          height: 25
        }} />
        <Text style={{
          paddingLeft: 10
        }}>{item.account?.information?.first_name ? item.account?.information?.first_name + ' ' + item.account?.information?.last_name : item?.account?.username}</Text>
      </View>
    );
  }

  _headerLeft = (item) => {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 30,
        alignItems: 'center'
      }}>
        <Text style={{
          paddingRight: 10
        }}>{item.account?.information?.first_name ? item.account?.information?.first_name + ' ' + item.account?.information?.last_name : item?.account?.username}</Text>
        <UserImage user={item.account} style={{
          width: 25,
          height: 25
        }} />
      </View>
    );
  }

  _rightTemplate = (item, index) => {
    const { theme, messagesOnGroup } = this.props.state;
    return (
      <View>
        {(index > 0 && messagesOnGroup && messagesOnGroup.messages != null) && item.account_id != (messagesOnGroup.messages[index - 1].account_id) && (this._headerRight(item, index))}
        {
          index == 0 && (this._headerRight(item, index))
        }
        <Text style={[Style.dateText, {
          textAlign: 'left'
        }]}>{item.created_at_human}</Text>
        {
          item.message != null && Platform.OS == 'android' && (
            <Text style={[Style.messageTextRight, {
              backgroundColor: theme ? theme.primary : Color.primary
            }]}>{item.message}</Text>
          )
        }
        {
          item.message != null && Platform.OS == 'ios' && (
            <View style={[Style.messageTextRight, {
              backgroundColor: theme ? theme.primary : Color.primary
            }]}>
              <Text style={Style.messageTextRightIOS}>{item.message}</Text>
            </View>
          )
        }
        {
          item.payload == 'image' && (this._image(item))
        }
      </View>
    );
  }

  _leftTemplate = (item, index) => {
    const { theme, messagesOnGroup, requestMessage } = this.props.state;
    const { updatingMessage, nowUpdatingMessage } = this.state;
    return (
      <TouchableOpacity onLongPress={() => {
        if (item.payload == 'text' && requestMessage?.status == 1) {
          this.setState({
            isUpdate: true,
            updatingMessage: item
          })
        }
      }}>
        {(index > 0 && messagesOnGroup && messagesOnGroup.messages != null) && item.account_id != (messagesOnGroup.messages[index - 1].account_id) && (this._headerLeft(item, index))}
        {
          index == 0 && (this._headerLeft(item, index))
        }
        {
          item.message != null && Platform.OS == 'android' && item.id != updatingMessage?.id && (<Text style={[Style.dateText, {
            textAlign: 'right'
          }]}>{item.created_at_human}</Text>)}
        {
          item.message != null && Platform.OS == 'android' && item.id != updatingMessage?.id && (
            <View style={{
              flexDirection: 'row',
              marginLeft: '30%'
            }}>
              {item.updated_at != item.created_at && <FontAwesomeIcon
                icon={faPencilAlt}
                size={15}
                style={{
                  color: Color.lightGray,
                  marginTop: 5
                }}
              />}
              <Text style={[Style.messageTextLeft, {
                backgroundColor: theme ? theme.primary : Color.primary,
                marginLeft: 0,
              }]}>{item.message}</Text>
            </View>
          )
        }
        {item.id == updatingMessage?.id && nowUpdatingMessage && (
          <View style={{
            width: DeviceWidth / 2
          }}>
            <Skeleton size={1} template={'block'} height={45} />
          </View>
        )}
        {
          item.message != null && Platform.OS == 'ios' && item.id != updatingMessage?.id && (
            <View style={[Style.messageTextLeft, {
              backgroundColor: theme ? theme.primary : Color.primary
            }]}>
              <Text style={Style.messageTextLeftIOS}>{item.message}</Text>
            </View>
          )
        }
        {
          item.payload == 'image' && (this._image(item))
        }
        {
          item.sending_flag == true && (
            <Text style={{
              fontSize: 10,
              color: Color.gray,
              textAlign: 'right'
            }}>Sending...</Text>
          )
        }
      </TouchableOpacity>
    );
  }

  _conversations = (item, index) => {
    const { user, messagesOnGroup } = this.props.state;
    return (
      <View style={{
        width: '100%',
        marginBottom: index == (messagesOnGroup.messages.length - 1) ? 50 : 0
      }}>
        <View style={{
          alignItems: 'flex-end'
        }}>
          {item.account_id == user.id && (this._leftTemplate(item, index))}
        </View>
        <View style={{
          alignItems: 'flex-start'
        }}>
          {item.account_id != user.id && (this._rightTemplate(item, index))}
        </View>
      </View>
    );
  }

  _footer = () => {
    const { theme } = this.props.state;
    return (
      <View style={{
        flexDirection: 'row'
      }}>
        <TouchableOpacity
          onPress={() => this.handleChoosePhoto()}
          style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            width: '10%'
          }}
        >
          <FontAwesomeIcon
            icon={faImage}
            size={BasicStyles.iconSize}
            style={{
              color: theme ? theme.primary : Color.primary
            }}
          />
        </TouchableOpacity>
        <TextInput
          style={Style.formControl}
          onChangeText={(newMessage) => { this.state.updatingText != null ? this.setState({ updatingText: newMessage }) : this.setState({ newMessage }) }}
          value={this.state.updatingText != null ? this.state.updatingText : this.state.newMessage}
          placeholder={'Type your message here ...'}
          multiline={true}
          placeholderTextColor={Color.darkGray}
        />
        <TouchableOpacity
          onPress={() => this.state.updatingMessage != null ? this.updateMessage() : this.sendNewMessage()}
          style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            width: '10%'
          }}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            size={BasicStyles.iconSize}
            style={{
              color: theme ? theme.primary : Color.primary
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  _flatList = () => {
    const { user, messagesOnGroup } = this.props.state;
    return (
      <View style={{
        width: '100%',
        height: '100%'
      }}>
        {
          messagesOnGroup != null && messagesOnGroup.messages != null && user != null && (
            <FlatList
              data={messagesOnGroup.messages}
              extraData={this.props}
              ItemSeparatorComponent={this.FlatListItemSeparator}
              style={{
                marginBottom: 50,
                flex: 1,

              }}
              renderItem={({ item, index }) => (
                <View>
                  {this._conversations(item, index)}
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={Platform.OS === 'android' &&
                <RefreshControl
                  refreshing={false}
                  onRefresh={() => {
                    this.retrieveMoreMessages()
                  }}
                />
              }
            />
          )
        }
      </View>
    );
  }

  cloneMenu() {
    const { viewMenu } = this.props // new
    viewMenu(false) // new
  }

  updatingOptions = () => {
    const { isUpdate, updatingMessage } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isUpdate}
        onRequestClose={() => {
          this.setState({ isUpdate: false })
        }}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 22
        }}>
          <View style={{
            margin: 20,
            padding: 10,
            backgroundColor: 'white',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <TouchableOpacity style={[styles.modalButtons, {
              borderBottomWidth: 1
            }]}
              onPress={() => {
                this.setState({
                  isUpdate: false,
                  updatingText: updatingMessage?.message
                })
              }}>
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButtons, {
              borderBottomWidth: 1
            }]}
              onPress={() => {
                this.delete()
              }}>
              <Text style={{
                color: Color.danger
              }}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtons}
              onPress={() => {
                this.setState({
                  isUpdate: false,
                  updatingMessage: null
                })
              }}>
              <Text style={{
                color: Color.danger
              }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  render() {
    const { isLoading, isImageModal, imageModalUrl, keyRefresh, isPullingMessages, isLock, members, data, updatingText, imageToDelete } = this.state;
    const { requestMessage, theme, updateActivity, user } = this.props.state;
    console.log('[MESSEGER GROUP]', data);
    return (
      <SafeAreaView>
        {
          // ON DEPOSITS (IF CONVERSATION IS NOT YET AVAILABLE)
          isLock && (
            <View style={{
              height: DeviceHeight - 150,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <FontAwesomeIcon
                icon={faLock}
                size={DeviceWidth * 0.20}
                style={{ color: Color.black, marginBottom: 10 }}
              />
              <Text style={{ color: Color.darkGray, fontSize: 13 }}>
                Conversation is not yet available, try again later
              </Text>
            </View>
          )
        }
        <KeyboardAvoidingView
          behavior={'padding'}
          keyboardVerticalOffset={
            Platform.select({
              ios: () => 65,
              android: () => -200
            })()}
        >
          <View key={keyRefresh}>
            <View style={{
              padding: 10,
              width: '95%',
              position: 'absolute',
              zIndex: 10
            }}>
              {requestMessage?.status == 1 && updateActivity != null && !isLoading && <TouchableOpacity
                onPress={() => {
                  if (data?.account_id !== user.id) {
                    this.props.navigation.navigate('activityStack', { from: 'messenger', data: updateActivity, members: members })
                  }
                }}
                style={{
                  margin: 10,
                  borderColor: updateActivity?.date_time === 'Arrived' ? (theme ? theme.primary : Color.primary) : (theme ? theme.secondary : Color.secondary),
                  borderWidth: 1,
                  flexDirection: 'row',
                  marginBottom: 20,
                  height: 50,
                  borderRadius: 10,
                  alignItems: 'center',
                  width: '100%'
                }}>
                <View style={{
                  width: '80%',
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <FontAwesomeIcon
                    icon={faTruckMoving}
                    size={40}
                    style={{
                      color: updateActivity?.date_time === 'Arrived' ? (theme ? theme.primary : Color.primary) : (theme ? theme.secondary : Color.secondary),
                      width: '10%',
                      marginRight: '2%'
                    }}
                  />
                  <View style={{
                    width: '38%',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontSize: 11,
                      fontWeight: 'bold'
                    }}>{updateActivity?.orig_time}</Text>
                    <Text style={{
                      fontSize: 11,
                    }}>Processing Time</Text>
                  </View>
                  <View style={{
                    width: '45%',
                    marginRight: '1%',
                    height: 10,
                    backgroundColor: Color.lightGray,
                    borderRadius: 5
                  }}>
                    <View style={{
                      width: Helper.getProcessingTimePercent(updateActivity) + '%',
                      backgroundColor: Helper.getProcessingTimePercent(updateActivity) > 0 ? (updateActivity?.date_time === 'Arrived' ? theme ? theme.primary : Color.primary : theme ? theme.secondary : Color.secondary) : Color.lightGray,
                      borderRadius: 5,
                      height: 10,
                    }}>
                    </View>
                  </View>
                </View>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '20%',
                  height: '100%',
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                  backgroundColor: updateActivity?.date_time === 'Arrived' ? (theme ? theme.primary : Color.primary) : (theme ? theme.secondary : Color.secondary)
                }}>
                  <Text style={{
                    color: Color.white,
                    textAlign: 'center',
                    fontSize: 11
                  }}>{updateActivity?.date_time}</Text>
                </View>
              </TouchableOpacity>}
            </View>
            {isLoading ? <Skeleton size={1} template={'messages'} /> : null}
            <ScrollView
              ref={ref => this.scrollView = ref}
              onContentSizeChange={(contentWidth, contentHeight) => {
                if (!isPullingMessages) {
                  this.scrollView.scrollToEnd({ animated: true });
                }
              }}
              showsVerticalScrollIndicator={false}
              style={[Style.ScrollView, {
                height: '100%'
              }]}
              onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
                const isOnBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height
                const isOnTop = contentOffset.y <= 0

                if (isOnTop) {
                  if (this.state.isLoading == false) {
                    if (!isPullingMessages) {
                      this.setState({ isPullingMessages: true })
                    }
                    this.retrieveMoreMessages()
                  }
                }
                if (isOnBottom) {
                  if (this.state.isLoading == false && isPullingMessages) {
                    this.setState({ isPullingMessages: false })
                  }
                }
              }}
            >
              <View style={{
                flexDirection: 'row',
                width: '100%',
                marginTop: 70,
                marginBottom: 100
              }}>
                {this._flatList()}
              </View>
            </ScrollView>
            {updatingText != null ? <TouchableOpacity onPress={() => {
              this.setState({
                updatingMessage: null,
                updatingText: null
              })
            }}
              style={{
                position: 'absolute',
                bottom: 55,
                right: 5
              }}>
              <Text style={{
                color: Color.danger
              }}>
                Cancel Edit
              </Text>
            </TouchableOpacity> : null}
            {!isLoading && <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              borderTopColor: Color.lightGray,
              borderTopWidth: requestMessage?.status < 2 ? 1 : 0,
              backgroundColor: Color.white,
              width: DeviceWidth,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {
                requestMessage?.status < 2 ? (
                  this._footer()
                ) : (
                  <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: DeviceWidth / 1.5,
                    marginBottom: 20
                  }}>
                    {data && members.length > 0 && <Ratings
                      members={members}
                      data={data} />}
                    <TouchableOpacity
                      onPress={() => {
                        this.redirectToRate('reviewsStack')
                      }}
                      style={{
                        width: '20%',
                        alignItems: 'center',
                        marginTop: 10
                      }}>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        size={BasicStyles.iconSize}
                        style={{
                          color: theme ? theme.primary : Color.primary
                        }}
                      />
                    </TouchableOpacity>
                    <Text style={{
                      marginBottom: 10,
                      marginTop: 10
                    }}>This transaction is already completed.</Text>
                    <Button
                      title={'Go to Dashboard'}
                      onClick={() => this.navigateToScreen()}
                      style={{
                        width: '100%',
                        paddingLeft: 20,
                        paddingRight: 20,
                        backgroundColor: theme ? theme.secondary : Color.secondary
                      }}
                    />
                  </View>
                )
              }
            </View>}
            {this.updatingOptions()}
            <ImageModal
              deleteID={imageToDelete?.account_id == user.id ? imageToDelete?.id : null}
              visible={isImageModal}
              url={imageModalUrl}
              action={() => this.setState({ isImageModal: false })}
              successDel={() => {
                const { messagesOnGroup } = this.props.state;
                const { setMessagesOnGroup } = this.props;
                let temp = messagesOnGroup;
                temp.messages?.length > 0 && temp.messages.map((item, index) => {
                  if(item.id == imageToDelete?.id) {
                    console.log(item.id == imageToDelete?.id, item.id, imageToDelete?.id)
                    temp.messages.splice(index, 1)
                  }
                })
                setMessagesOnGroup(temp);
              }}
              route={Routes.messengerMessagesDeleteMessage}
            ></ImageModal>
            <Modals send={this.sendSketch} close={this.closeSketch} visible={this.state.visible} />
          </View>
        </KeyboardAvoidingView>
        {
          (data && this.props.navigation.state?.params?.data?.menuFlag) && (
            <MessageOptions
              requestId={this.state.request_id}
              messengerId={this.props.navigation.state.params.data?.id}
              data={data}
              members={members}
              navigation={this.props.navigation}
              updateMessagesOnGroup={this.props.updateMessagesOnGroup}
              updateMessageByCode={this.props.updateMessageByCode}
            />
          )
        }
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setMessagesOnGroup: (messagesOnGroup) => dispatch(actions.setMessagesOnGroup(messagesOnGroup)),
    setMessengerGroup: (messengerGroup) => dispatch(actions.setMessengerGroup(messengerGroup)),
    updateMessagesOnGroup: (message) => dispatch(actions.updateMessagesOnGroup(message)),
    updateMessageByCode: (message) => dispatch(actions.updateMessageByCode(message)),
    setUnReadMessages: (messages) => dispatch(actions.setUnReadMessages(messages)),
    updateMessagesOnGroup: (message) => dispatch(actions.updateMessagesOnGroup(message)),
    setMessageTitle: (messageTitle) => dispatch(actions.setMessageTitle(messageTitle)),
    setRequestMessage: (requestMessage) => dispatch(actions.setRequestMessage(requestMessage)),
    setUpdateActivity: (updateActivity) => dispatch(actions.setUpdateActivity(updateActivity))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagesV3);
