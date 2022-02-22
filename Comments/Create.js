import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, ScrollView, Image, Alert, Dimensions } from 'react-native';
import { Routes, Color, BasicStyles } from 'common';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import _ from 'lodash';
import Style from './CreateStyle';
import { Spinner } from 'components';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import ImageModal from 'components/Modal/ImageModal.js';
import RBSheet from 'react-native-raw-bottom-sheet';
const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);
class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      loading: false,
      errorMessage: null,
      list: [],
      vids: [],
      imageModalUrl: null,
      isImageModal: false
    }
  }

  componentDidUpdate() {
    const { visible } = this.props
    if (visible) {
      this.RBSheet.open()
      return;
    }
  }

  statusHandler = (value) => {
    this.setState({ status: value })
  }

  post = async () => {
    const { status, list, vids } = this.state;
    if (status === '' || status === null) {
      this.setState({ errorMessage: 'Empty Status!' })
      return
    }
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id,
      payload: this.props.payload ? 'page' : (user.sub_account ? 'merchant_id' : 'account_id'),
      payload_value: this.props.payload ? this.props.payload?.payload_value : (user.sub_account?.id || user.id),
      text: this.state.status,
      to: user.id,
      from: user.id,
      route: 'statusStack'
    }
    let data = {
      account: {
        email: user.email,
        id: user.id,
        profile: {
          account_id: user.id,
          url: user.account_profile?.url || null
        },
        username: user.username
      },
      account_id: user.id,
      comment_replies: [],
      members: [],
      text: this.state.status,
      created_at_human: moment(new Date()).format('MMMM DD, YYYY hh:mm a')
    }
    this.setState({ loading: true })
    Api.request(Routes.commentsCreate, parameter, response => {
      this.setState({ loading: false })
      if (response.data !== null) {
        if (list.length > 0 || vids.length > 0) {
          if(list.length > 0) {
            this.addPhotos(response.data, data);
          }
          if(vids.length > 0) {
            this.addVid(response.data, data);
          } 
        } else {
          this.props.close()
          this.RBSheet.close()
          data['images'] = []
          this.props.setComments([data, ...this.props.state.comments])
        }
        data['id'] = response.data;
        this.setState({
          status: null,
          errorMessage: null
        })
      }
    })
  }

  handleChoosePhoto = () => {
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
      compressImageMaxWidth: 700,
      compressImageMaxHeight: 700,
      mediaType: 'photo'
    }).then(images => {
      let list = this.state.list
      if((images.length + list.length) <= 4) {
        images?.length > 0 && images.map((item, index) => {
          let name = item.path.split('/')
          let image = {
            file_url: name[name.length - 1],
            file_base64: item.data
          }
          list.push(image)
        })
        this.setState({ list: list });
      } else {
        Alert.alert('Error', 'Cannot upload more than 4 images.')
      }
    });
  }
  
  handleChooseVideo = () => {
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
      mediaType: 'video'
    }).then(images => {
      console.log(images);
      let list = this.state.vids
      if((images.length + list.length) <= 1) {
        images?.length > 0 && images.map((item, index) => {
          let name = item.path.split('/')
          let image = {
            ...item,
            file_url: name[name.length - 1],
            file_base64: item.data,
          }
          list.push(image)
        })
        this.setState({ vids: list });
      } else {
        Alert.alert('Error', 'Cannot upload more than 1 video.')
      }
    });
  }

  addPhotos = (id, data) => {
    const { list, vids } = this.state;
    const { user } = this.props.state;
    let parameter = {
      images: list,
      account_id: user.id,
      payload: 'comment_id',
      payload_value: id
    }
    Api.request(Routes.imageUploadArray, parameter, imageResponse => {
      this.setState({ loading: false })
      if (imageResponse.data.length > 0) {
        let images = []
        imageResponse.data.map(item => {
          images.push(item)
        })
        data['images'] = images
        if(vids.length === 0) {
          this.props.setComments([data, ...this.props.state.comments])
          this.props.close()
          this.RBSheet.close()
        }
      }
    }, error => {
      this.setState({ loading: false })
      console.log(error, 'upload image')
    })
  }

  addVid = (id, data) => {
    const { vids } = this.state;
    const { user } = this.props.state;
    let formData = new FormData();
    let uri = Platform.OS == "android" ? vids[0].path : vids[0].path.replace("file://", "");
    formData.append("file", {
      name: vids[0].file_url,
      type: vids[0].mime,
      uri: uri
    });
    formData.append('file_url', vids[0].file_url);
    formData.append('account_id', user.id);
    formData.append('category', 'video-from-comment');
    this.setState({ loading: true })
    Api.uploadByFetch(Routes.fileUpload, formData, response => {
      this.setState({ loading: false })
      console.log(response)
      if(response.data != null) {
        let par = {
          account_id: user.id,
          payload: 'comment_id',
          payload_value: id,
          category: response.data
        }
        this.setState({ loading: true })
        console.log(Routes.uploadImage, par);
        Api.request(Routes.uploadImage, par, res => {
          this.setState({ loading: false })
          if(res.data) {
            let images = data.images
            images.push({
              category: response.data})
            data['images'] = images
            this.props.setComments([data, ...this.props.state.comments])
            this.props.close()
            this.RBSheet.close()
          }
        }, error => {
          console.log(error, 'payloads')
          this.setState({ loading: true })
        })
      }
    }, error => {
      this.setState({ loading: false })
      console.log(error, 'upload file')
    })
  }

  setImage = (url) => {
    this.setState({ imageModalUrl: url })
    setTimeout(() => {
      this.setState({ isImageModal: true })
    }, 500)
  }

  render() {
    const { theme } = this.props.state;
    const { loading, errorMessage, list, isImageModal, imageModalUrl, vids } = this.state;
    return (
      <View>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          closeOnDragDown={true}
          dragFromTopOnly={true}
          closeOnPressMask={false}
          height={height/2 + (height/4)}
          onClose={() => {
            this.props.close()
          }}
        >
          <View style={Style.centeredView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[Style.container, {
                marginBottom: height/2
              }]}>
                <Text style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: BasicStyles.standardTitleFontSize
                }}>{this.props.title}</Text>
                <Text style={{
                  color: Color.danger
                }}>{errorMessage}</Text>
                <TextInput
                  style={Style.textInput}
                  multiline={true}
                  numberOfLines={7}
                  onChangeText={text => this.statusHandler(text)}
                  value={this.state.status}
                  placeholder="   Express what's on your mind!"
                  placeholderTextColor={Color.darkGray}
                  maxLength={1000}
                />
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  width: '100%',
                  padding: 20,
                  alignItems: 'center'
                }}
                  onPress={() => {
                    this.handleChoosePhoto();
                  }}
                >
                  <FontAwesomeIcon
                    size={30}
                    icon={faImages}
                    style={{
                      color: Color.darkGray,
                      marginRight: 10
                    }}
                  />
                  <Text style={{ color: Color.darkGray }}>Add Photos</Text>
                </TouchableOpacity>
                {list.length > 0 && <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: '100%',
                  padding: 20,
                }}>
                  {list.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          // this.setImage(item.path)
                        }}
                        onLongPress={() => {
                          Alert.alert(
                            'Remove Photo',
                            `Click 'Remove' to remove photo.`,
                            [
                              { text: 'Close', onPress: () => { return }, style: 'cancel' },
                              {
                                text: 'Remove', onPress: () => {
                                  let images = list;
                                  images.splice(index, 1);
                                  this.setState({ list: images });
                                }
                              },
                            ],
                            { cancelable: false }
                          )
                        }}
                        style={{
                          width: '25%',
                          height: 50
                        }}>
                        <Image
                          source={{ uri: `data:image/jpeg;base64,${item.file_base64}` }}
                          style={{
                            width: '100%',
                            height: '100%'
                          }}
                        />
                      </TouchableOpacity>
                    )
                  })}
                </View>}
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  width: '100%',
                  padding: 20,
                  alignItems: 'center'
                }}
                  onPress={() => {
                    this.handleChooseVideo();
                  }}
                >
                  <FontAwesomeIcon
                    size={30}
                    icon={faImages}
                    style={{
                      color: Color.darkGray,
                      marginRight: 10
                    }}
                  />
                  <Text style={{ color: Color.darkGray }}>Add Video</Text>
                </TouchableOpacity>
                {vids.length > 0 && <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: '100%',
                  padding: 20,
                }}>
                  {vids.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onLongPress={() => {
                          Alert.alert(
                            'Remove Photo',
                            `Click 'Remove' to remove video.`,
                            [
                              { text: 'Close', onPress: () => { return }, style: 'cancel' },
                              {
                                text: 'Remove', onPress: () => {
                                  let images = vids;
                                  images.splice(index, 1);
                                  this.setState({ vids: images });
                                }
                              },
                            ],
                            { cancelable: false }
                          )
                        }}
                        style={{
                          width: '100%',
                          backgroundColor: Color.lightGray
                        }}>
                        <Text>{item.file_url}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>}
              </View>
            </ScrollView>
            {loading ? <Spinner mode="overlay" /> : null}
            <View style={{
              flexDirection: 'row-reverse',
              padding: 20,
              position: 'absolute',
              bottom: 5,
              width: width
            }}>
              <TouchableOpacity style={[Style.button, {
                borderColor: theme ? theme.primary : Color.primary,
                backgroundColor: theme ? theme.primary : Color.primary
              }]}
                onPress={() => { this.post() }}
              >
                <Text style={{ color: 'white' }}>Post</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[Style.button, {
                borderColor: Color.secondary,
                backgroundColor: Color.secondary,
                marginRight: 5,
              }]}
                onPress={() => {
                  this.props.close();
                  this.RBSheet.close()
                  this.setState({
                    status: null,
                    list: [],
                    vids: [],
                  });
                }}
              >
                <Text style={{ color: 'white' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
        <ImageModal
          visible={isImageModal}
          url={imageModalUrl}
          action={() => this.setState({ isImageModal: false })}
        ></ImageModal>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setCreateStatus: (createStatus) => dispatch(actions.setCreateStatus(createStatus)),
    setComments: (comments) => dispatch(actions.setComments(comments))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);