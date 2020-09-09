import React, { Component } from 'react';
import Style from './Style.js';
import { TextInput, View, Image, TouchableHighlight, Text, ScrollView, FlatList, TouchableOpacity, Platform} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, UserImage } from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ImageModal from 'components/Modal/ImageModal.js';
import ImagePicker from 'react-native-image-picker';
import CommonRequest from 'services/CommonRequest.js';
import { Dimensions } from 'react-native';
const height = Math.round(Dimensions.get('window').height);
class Messages extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      selected: null,
      newMessage: null,
      imageModalUrl: null,
      isImageModal: false,
      photo: null,
      keyRefresh: 0
    }
  }

  componentDidMount(){
    const { messengerGroup, user } = this.props.state;
    if(messengerGroup != null && user != null){
      this.retrieve();
    }
  }

  retrieve = () => {
    const { messengerGroup } = this.props.state;
    const { setMessagesOnGroup } = this.props;
    this.setState({isLoading: true});
    CommonRequest.retrieveMessages(messengerGroup, response => {
      this.setState({isLoading: false});
      setMessagesOnGroup({
        messages: response.data,
        groupId: messengerGroup.id
      })
    })
  }

  retrieveGroup = (flag = null) => {
    const { user, messengerGroup } = this.props.state;
    const { setMessengerGroup } = this.props;
    if(messengerGroup == null || user == null){
      return
    }
    let parameter = {
      condition: [{
        value: messengerGroup.id,
        column: 'id',
        clause: '='
      }],
      account_id: user.id
    }
    CommonRequest.retrieveMessengerGroup(messengerGroup, user, response => {
      if(response.data != null){
        setMessengerGroup(response.data);
        setTimeout(() => {
          this.retrieve(response.data)
          this.setState({keyRefresh: this.state.keyRefresh + 1})
        }, 500)
      }
    })
  }

  sendNewMessage = () => {
    const { messengerGroup, user, messagesOnGroup} = this.props.state;
    const { updateMessagesOnGroup,  updateMessageByCode} = this.props;
    if(messengerGroup == null || user == null || this.state.newMessage == null){
      return
    }
    let parameter = {
      messenger_group_id: messengerGroup.id,
      message: this.state.newMessage,
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
    Api.request(Routes.messengerMessagesCreate, parameter, response => {
      if(response.data != null){
        updateMessageByCode(response.data);
      }
    });
  }

  sendImageWithoutPayload = (parameter) => {
    const { messengerGroup, user, messagesOnGroup } = this.props.state;
    const { updateMessageByCode } = this.props;

    Api.request(Routes.mmCreateWithImageWithoutPayload, parameter, response => {
      if(response.data != null){
        updateMessageByCode(response.data);
      }
    })
  }

  handleChoosePhoto = () => {
    const { user, messengerGroup, messagesOnGroup } = this.props.state;
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response })
        let formData = new FormData();
        let uri = Platform.OS == "android" ? response.uri : response.uri.replace("file://", "");
        let parameter = {
          messenger_group_id: messengerGroup.id,
          message: null,
          account_id: user.id,
          status: 0,
          payload: 'image',
          payload_value: null,
          url: uri,
          code: messagesOnGroup.messages.length + 1
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
        const { updateMessagesOnGroup } = this.props;
        updateMessagesOnGroup(newMessageTemp);
        formData.append("file", {
          name: response.fileName,
          type: response.type,
          uri: uri
        });
        formData.append('file_url', response.fileName);
        formData.append('account_id', user.id);
        Api.upload(Routes.imageUploadUnLink, formData, imageResponse => {
          // add message
          if(imageResponse.data.data != null){
            parameter = {
              ...parameter,
              url: imageResponse.data.data
            }
            this.sendImageWithoutPayload(parameter)
          }
        })
      }else{
        this.setState({ photo: null })
      }
    })
  }

  setImage = (url) => {
    this.setState({imageModalUrl: url})
    setTimeout(() => {
      this.setState({isImageModal: true})
    }, 500)
  }


  updateValidation = (item, status) => {
    const { messengerGroup, user } = this.props.state;
    let parameter = {
      id: item.id,
      status: status,
      messages: {
        messenger_group_id: messengerGroup.id,
        account_id: user.id
      }
    }
    this.setState({isLoading: true})
    Api.request(Routes.requestValidationUpdate, parameter, response => {
      this.setState({isLoading: false})
      // this.retrieveGroup()
    })
  }

  _image = (item) => {
    const { messengerGroup, user } = this.props.state;
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
                  onPress={() => this.setImage(Config.BACKEND_URL  + imageItem.url)} 
                  style={Style.messageImage}
                  key={imageIndex}
                  >
                  {
                    item.sending_flag == true && (
                      <Image source={{uri: imageItem.url}} style={Style.messageImage} key={imageIndex}/>
                    )
                  }
                  {
                    item.sending_flag != true && (
                      <Image source={{uri: Config.BACKEND_URL  + imageItem.url}} style={Style.messageImage} key={imageIndex}/>
                    )
                  }
                  
                </TouchableOpacity>
              );
            })
          }
        </View>
        {
          messengerGroup.account_id == user.id &&
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
                    borderColor: Color.primary
                  }]}
                  >
                  <Text style={[Style.templateText, {
                    color: Color.primary
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
          onPress={() => this.setImage(item.uri)} 
          style={Style.messageImage}
          >
          <Image source={{uri: item.uri}} style={Style.messageImage}/>
        </TouchableOpacity>
      </View>
    );
  }

  _headerRight = (item) => {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <UserImage user={item.account}/>
        <Text style={{
          lineHeight: 30,
          paddingLeft: 10
        }}>{item.account.username}</Text>
      </View>
    );
  }

  _headerLeft = (item) => {
    return (
      <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>
        <Text style={{
          lineHeight: 30,
          paddingRight: 10
        }}>{item.account.username}</Text>
        <UserImage user={item.account}/>
      </View>
    );
  }

  _rightTemplate = (item) => {
    return (
      <View>
        {this._headerRight(item)}
        <Text style={[Style.dateText, {
          textAlign: 'left'
        }]}>{item.created_at_human}</Text>
        {
          item.message != null && Platform.OS == 'android' && (
            <Text style={Style.messageTextRight}>{item.message}</Text>
          )
        }
        {
          item.message != null && Platform.OS == 'ios' && (
            <View style={Style.messageTextRight}>
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

  _leftTemplate = (item) => {
    return (
      <View>
        {this._headerLeft(item)}
        <Text style={[Style.dateText, {
          textAlign: 'right'
        }]}>{item.created_at_human}</Text>
        {
          item.message != null && Platform.OS == 'android' && (
            <Text style={Style.messageTextLeft}>{item.message}</Text>
          )
        }
        {
          item.message != null && Platform.OS == 'ios' && (
            <View style={Style.messageTextLeft}>
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
      </View>
    );
  }

  _conversations = (item, index) => {
    const { user, messagesOnGroup } = this.props.state;
    return (
      <View style={{
        width: '100%',
        marginBottom: index == (messagesOnGroup.messages.length - 1) ? 50: 0
      }}>
        <View style={{
          alignItems: 'flex-end'
        }}>
          {item.account_id == user.id && (this._leftTemplate(item))}
        </View>
        <View style={{
          alignItems: 'flex-start' 
        }}>
          {item.account_id != user.id && (this._rightTemplate(item))}
        </View>
      </View>
    );
  }

  _footer = () => {
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
            icon={ faImage }
            size={BasicStyles.iconSize}
            style={{
              color: Color.primary
            }}
            />
        </TouchableOpacity>
        <TextInput
          style={Style.formControl}
          onChangeText={(newMessage) => this.setState({newMessage})}
          value={this.state.newMessage}
          placeholder={'Type your message here ...'}
        />
        <TouchableOpacity
          onPress={() => this.sendNewMessage()} 
          style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            width: '10%'
          }}
          >
          <FontAwesomeIcon
            icon={ faPaperPlane }
            size={BasicStyles.iconSize}
            style={{
              color: Color.primary
            }}
            />
        </TouchableOpacity>
      </View>
    );
  }

  _flatList = () => {
    const { selected } = this.state;
    const { user, messagesOnGroup, messengerGroup } = this.props.state;
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
            />
          )
        }
      </View>
    );
  }

  render() {
    const { isLoading, isImageModal, imageModalUrl, photo, keyRefresh } = this.state;
    const { messengerGroup, user } = this.props.state;
    return (
      <View key={keyRefresh}>
        <ScrollView
          ref={ref => this.scrollView = ref}
          onContentSizeChange={(contentWidth, contentHeight)=>{        
              this.scrollView.scrollToEnd({animated: true});
          }}
          style={[Style.ScrollView, {
            height: '100%'
          }]}
          onScroll={(event) => {
            if(event.nativeEvent.contentOffset.y <= 0) {
              if(this.state.isLoading == false){
                this.retrieve()
              }
            }
          }}
          >
          <View style={{
            flexDirection: 'row',
            width: '100%'
          }}>
            {this._flatList()}
          </View>
          <View style={{
            flexDirection: 'row',
            width: '100%'
          }}>
            {messengerGroup != null && user !== null && (this._templates())}
          </View>
          {isLoading ? <Spinner mode="overlay"/> : null }
        </ScrollView>
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          borderTopColor: Color.lightGray,
          borderTopWidth: 1,
          backgroundColor: Color.white
        }}>
          {messengerGroup != null && messengerGroup.request.status < 2 && (this._footer())}
        </View>
        <ImageModal
          visible={isImageModal}
          url={imageModalUrl}
          action={() => this.setState({isImageModal: false})}
        ></ImageModal>
      </View>
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messages);
