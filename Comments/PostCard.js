import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text, TextInput, ScrollView, Alert } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faEllipsisH, faCog, faPencilAlt, faFileAlt, faTrashAlt, faPrayingHands, faShare, faHeart, faImages } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color, Routes } from 'common';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import UserImage from 'components/User/Image';
import CommentImages from './Images';
import Api from 'services/api/index.js';
import Skeleton from 'components/Loading/Skeleton';
import RBSheet from "react-native-raw-bottom-sheet";
import Share from './Share';
import VideoPlayer from 'react-native-video-player';
import ImagePicker from 'react-native-image-crop-picker';
import { Spinner } from 'components';

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);
const options = [
  { title: 'Edit', action: 'edit', icon: faPencilAlt },
  { title: 'Report', action: 'report', icon: faFileAlt },
  { title: 'Delete', action: 'delete', icon: faTrashAlt },
  { title: 'Hide', action: 'hide', icon: faPencilAlt },
]
class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reply: null,
      options: false,
      loading: false,
      errorMessage: null,
      toEdit: null,
      isLoading: false,
      share: false,
      images: [],
      videos: [],
      removedImages: [],
    }
  }

  react = (react) => {
    const { data } = this.props;
    const { user, comments } = this.props.state;
    let list = []
    if (react === 'amen') {
      list = data.amen
    } else {
      list = data.love
    }
    if (list.includes(user.id) === false) {
      let parameter = {
        reaction: react,
        comment_id: data.id,
        account_id: user.id
      }
      this.setState({ loading: true });
      Api.request(Routes.reactionCreate, parameter, response => {
        this.setState({ loading: false });
        if (response.data > 0) {

          let com = comments;
          com.length > 0 && com.map((item, index) => {
            if (item.id == data.id) {
              if (react === 'amen') {
                item.amen.push(user.id)
              } else {
                item.love.push(user.id)
              }
            }
          })
          this.props.setComments(com);
        }
      })
    } else {
      this.removeReaction(react)
    }
  }

  removeReaction = (react) => {
    const { data } = this.props;
    const { user, comments } = this.props.state;
    let parameter = {
      account_id: user.id,
      comment_id: data.id,
      reaction: react
    }
    this.setState({ loading: true });
    Api.request(Routes.reactionDelete, parameter, response => {
      this.setState({ loading: false });
      if (response.data) {
        let com = comments;
        com.length > 0 && com.map((item, index) => {
          if (item.id == data.id) {
            if (react === 'amen') {
              let i = data.amen.indexOf(user.id)
              item.amen.splice(i, 1)
            } else {
              let i = data.love.indexOf(user.id)
              item.love.splice(i, 1)
            }
          }
        })
        this.props.setComments(com);
      }
    })
  }

  clickHide = (id) => {
    console.log('----', id)
  }

  optionClick = (id, action) => {
    const { data } = this.props;
    this.setState({ options: false });
    switch (action) {
      case 'edit':
        let images = []
        let videos = []
        data.images.length > 0 && data.images.map(item => {
          if (item.category.includes('/storage/file')) {
            videos.push(item)
          } else {
            images.push(item)
          }
        })
        this.setState({
          toEdit: data.text,
          images: images,
          videos: videos
        }, () => {
          this.RBSheet.open();
        })
        break;
      case 'report':
        this.clickReport();
        break;
      case 'hide':
        this.clickHide(id);
        break;
      case 'delete':
        Alert.alert('Confirmation', 'Are you sure you want to delete this post?', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              let parameter = {
                id: id
              }
              Api.request(Routes.commentsDelete, parameter, response => {
                if (response.data) {
                  let comments = this.props.state.comments;
                  comments.length > 0 && comments.map((item, index) => {
                    if (item.id == id) {
                      comments.splice(index, 1);
                      return
                    }
                  })
                  this.props.setComments(comments);
                }
              })
            },
          },
        ]);
        break;
      default:
        return;
        break;
    }
  }

  updatePost = () => {
    const { toEdit } = this.state;
    const { data } = this.props;
    if (toEdit == null || toEdit == '') {
      this.setState({ errorMessage: `Can't update post to empty caption.` })
      return
    }
    let parameter = {
      id: data.id,
      text: toEdit
    }
    this.setState({ isLoading: true })
    Api.request(Routes.commentsUpdate, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data) {
        let comments = this.props.state.comments;
        comments.length > 0 && comments.map((item, index) => {
          if (item.id == data.id) {
            item.text = toEdit;
            return
          }
        })
        this.props.setComments(comments);
        this.updateImages(comments);
      }
    }, error => {
      console.log(error)
      this.setState({ isLoading: false })
    })
  }

  updateImages = (comments) => {
    const { removedImages, images, videos } = this.state;
    const { data } = this.props;
    images.length > 0 && images.map((item, index) => {
      if (item.category != null) {
        images.splice(index, 1);
      }
    })
    if (removedImages.length > 0) {
      this.deletePayloads(comments, removedImages);
    }
    if (images.length > 0) {
      this.addPhotos(comments, data.id)
    }
    if (videos.length > 0 && videos[0].category == null) {
      this.addVid(comments, data.id)
    }
  }

  deletePayloads = (comments, removedImages) => {
    let parameter = {
      ids: removedImages
    }
    if(removedImages.length == comments[0]?.images.length) {
      comments[0]['images'] = [];
    }
    comments[0]?.images.length > 0 && comments[0]?.images.map((item, index) => {
      console.log(removedImages, item.id, removedImages.includes(item.id), comments[0]?.images)
      if (removedImages.includes(item.id)) {
        comments[0]?.images.splice(index, 1)
      }
    })
    this.props.setComments(comments);
    this.setState({ isLoading: true })
    Api.request(Routes.deleteIds, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data) {
        this.RBSheet.close()
      }
    }, error => {
      this.setState({ isLoading: false })
      console.log(error, 'upload image')
    })
  }

  addPhotos = (comments, id) => {
    const { images } = this.state;
    const { user } = this.props.state;
    let parameter = {
      images: images,
      account_id: user.id,
      payload: 'comment_id',
      payload_value: id
    }
    this.setState({ isLoading: true })
    Api.request(Routes.imageUploadArray, parameter, imageResponse => {
      this.setState({ isLoading: false })
      if (imageResponse.data.length > 0) {
        imageResponse.data.map(item => {
          comments[0].images.push(item)
        })
        this.props.setComments(comments);
        this.RBSheet.close()
      }
    }, error => {
      this.setState({ isLoading: false })
      console.log(error, 'upload image')
    })
  }

  addVid = (comments, id) => {
    const { videos } = this.state;
    const { user } = this.props.state;
    let formData = new FormData();
    let uri = Platform.OS == "android" ? videos[0].path : videos[0].path.replace("file://", "");
    formData.append("file", {
      name: videos[0].file_url,
      type: videos[0].mime,
      uri: uri
    });
    formData.append('file_url', videos[0].file_url);
    formData.append('account_id', user.id);
    formData.append('category', 'video-from-comment');
    this.setState({ isLoading: true })
    Api.uploadByFetch(Routes.fileUpload, formData, response => {
      this.setState({ isLoading: false })
      console.log(response)
      if (response.data != null) {
        let par = {
          account_id: user.id,
          payload: 'comment_id',
          payload_value: id,
          category: response.data
        }
        this.setState({ isLoading: true })
        console.log(Routes.uploadImage, par);
        Api.request(Routes.uploadImage, par, res => {
          this.setState({ isLoading: false })
          if (res.data) {
            comments[0].images.push({
              category: response.data
            })
            this.props.setComments(comments);
            this.RBSheet.close()
          }
        }, error => {
          console.log(error, 'payloads')
          this.setState({ isLoading: true })
        })
      }
    }, error => {
      this.setState({ isLoading: false })
      console.log(error, 'upload file')
    })
  }

  clickReport = () => {
    const { data } = this.props;
    let parameter = {
      account_id: this.props.state.user.id,
      payload: 'comment_id',
      payload_value: data.id,
      status: 'ongoing'
    }
    this.setState({ loading: true })
    console.log(Routes.reportCreate, parameter);
    Api.request(Routes.reportCreate, parameter, response => {
      this.setState({ loading: false })
    }, error => {
      console.log(error)
      this.setState({ loading: false })
    })
  }

  replyHandler = (value) => {
    this.setState({ reply: value });
    this.props.reply(value);
  }

  handleChoosePhoto = () => {
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
      compressImageMaxWidth: 700,
      compressImageMaxHeight: 700,
      mediaType: 'photo'
    }).then(images => {
      let list = this.state.images
      if ((images.length + list.length) <= 4) {
        images?.length > 0 && images.map((item, index) => {
          let name = item.path.split('/')
          let image = {
            file_url: name[name.length - 1],
            file_base64: item.data,
            category: null
          }
          list.push(image)
        })
        this.setState({ images: list });
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
      let list = this.state.videos
      if ((images.length + list.length) <= 1) {
        images?.length > 0 && images.map((item, index) => {
          let name = item.path.split('/')
          let image = {
            ...item,
            file_url: name[name.length - 1],
            file_base64: item.data,
            category: null
          }
          list.push(image)
        })
        this.setState({ videos: list });
      } else {
        Alert.alert('Error', 'Cannot upload more than 1 video.')
      }
    });
  }

  editPost = () => {
    const { errorMessage, toEdit, isLoading, images, videos, removedImages } = this.state;
    const { theme } = this.props.state;
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        closeOnDragDown={true}
        dragFromTopOnly={true}
        closeOnPressMask={false}
        height={height / 2}
        openDuration={250}
        customStyles={{
          container: {
            marginTop: 10,
            alignItems: "center"
          }
        }}
      >
        <ScrollView>
          {isLoading ? <Spinner mode="overlay" /> : null}
          <View style={{
            width: width,
            marginTop: 10,
            alignItems: 'center',
            marginBottom: height / 4
          }}>
            <Text>Edit Post</Text>
            <Text style={{
              color: Color.danger
            }}>{errorMessage}</Text>
            <TextInput
              style={{
                borderColor: Color.gray,
                borderWidth: .5,
                borderRadius: 15,
                width: '90%',
                marginTop: 10,
                textAlignVertical: 'top'
              }}
              multiline={true}
              numberOfLines={7}
              onChangeText={text => this.setState({ toEdit: text })}
              value={toEdit}
              placeholder={toEdit}
              placeholderTextColor={Color.darkGray}
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
            {images.length > 0 && <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '100%',
              padding: 20,
              paddingTop: 0
            }}>
              {images.map((item, index) => {
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
                              let lis = images;
                              lis.splice(index, 1);
                              let rm = removedImages
                              rm.push(item.id)
                              this.setState({
                                images: lis,
                                removedImages: rm
                              });
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
                      source={{ uri: item.category ? Config.BACKEND_URL + item.category : `data:image/jpeg;base64,${item.file_base64}` }}
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
            {videos.length > 0 && <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '100%',
              padding: 20,
              paddingTop: 0
            }}>
              {videos.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      // this.setImage(item.path)
                    }}
                    onLongPress={() => {
                      Alert.alert(
                        'Remove Video',
                        `Click 'Remove' to remove Video.`,
                        [
                          { text: 'Close', onPress: () => { return }, style: 'cancel' },
                          {
                            text: 'Remove', onPress: () => {
                              let lis = videos;
                              lis.splice(index, 1);
                              let rm = removedImages;
                              rm.push(item.id)
                              this.setState({
                                videos: lis,
                                removedImages: rm
                              });
                            }
                          },
                        ],
                        { cancelable: false }
                      )
                    }}
                    style={{
                      width: item.category == null ? '100%' : '25%',
                      height:  item.category == null ? 40 : 70,
                      backgroundColor: Color.lightGray
                    }}>
                    {item.category == null ? <Text>{item.file_url}</Text> : <VideoPlayer
                      source={{ uri: Config.BACKEND_URL + item.category }}
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                    />}
                  </TouchableOpacity>
                )
              })}
            </View>}
            <TouchableOpacity style={{
              borderColor: theme ? theme.primary : Color.primary,
              backgroundColor: theme ? theme.primary : Color.primary,
              width: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              borderWidth: 1,
              height: 40,
              marginTop: 20
            }}
              onPress={() => { this.updatePost() }}
            >
              <Text style={{ color: 'white' }}>Update</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </RBSheet>
    )
  }

  renderHeader = (data, top) => {
    if (!top) {
      console.log(data)
    }
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
      }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('accountPostsStack', {
              data: {
                account_information: data.account.information,
                account_profile: data.account.profile,
                ...data.account
              },
            })
          }}>
          <UserImage user={data.account} size={30} />
        </TouchableOpacity>
        <View style={{
          paddingLeft: 5,
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: '90%',
          alignItems: 'center'
        }}>
          <View>
            <Text style={{
              fontSize: BasicStyles.standardTitleFontSize,
              fontWeight: 'bold'
            }}>{data?.account?.username}</Text>
            <Text style={{
              fontSize: BasicStyles.standardFontSize
            }}>
              {data.created_at_human}
            </Text>
          </View>
          {data.shared == null && this.props.share !== false && top && <TouchableOpacity
            style={{
              position: 'absolute',
              right: 5,
              top: 0
            }}
            onPress={() => { this.setState({ options: !this.state.options }) }}>
            <FontAwesomeIcon icon={faEllipsisH} />
          </TouchableOpacity>}
        </View>
      </View>
    )
  }



  renderBody = (data) => {
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
      }}>
        <Text style={{
          fontSize: BasicStyles.standardFontSize
        }}>{data.text}</Text>
      </View>
    )
  }

  renderActions = (data) => {
    const { theme, user } = this.props.state
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 10,
        flexDirection: 'row'
      }}>
        <TouchableOpacity style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 20,
          flexDirection: 'row'
        }}
          onPress={() => {
            this.react('amen')
          }}
        >
          <FontAwesomeIcon
            icon={faPrayingHands}
            size={15}
            style={{
              color: data?.amen?.includes(user.id) ? (theme ? theme.primary : Color.primary) : (theme ? theme.secondary : Color.secondary)
            }}
          />
          <Text style={{
            marginLeft: 5,
            fontSize: 13,
          }}>{data?.amen?.length}</Text>
        </TouchableOpacity>


        <TouchableOpacity style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 20,
          flexDirection: 'row'
        }}
          onPress={() => {
            this.react('love')
          }}
        >
          <FontAwesomeIcon
            icon={faHeart}
            size={15}
            style={{
              color: data?.love?.includes(user.id) ? (theme ? theme.primary : Color.primary) : (theme ? theme.secondary : Color.secondary)
            }}
          />
          <Text style={{
            marginLeft: 5,
            fontSize: 13
          }}>{data?.love?.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 20,
          flexDirection: 'row'
        }}
          onPress={() => {
            this.setState({ share: true });
          }}
        >
          <FontAwesomeIcon
            icon={faShare}
            size={15}
            style={{
            }}
          />
          <Text style={{
            marginLeft: 5,
            fontSize: 13,
          }}>Share</Text>
        </TouchableOpacity>

      </View>
    )
  }

  renderComments = (comments) => {
    const { user } = this.props.state;
    return (
      <View style={{
        width: '100%',
        alignItems: 'center',
        borderTopColor: Color.lightGray,
        borderTopWidth: 1,
        paddingLeft: 10
      }}>
        {
          comments && comments.map((item, index) => (
            <View
              key={index}
              style={{
                ...BasicStyles.standardWidth
              }}>
              {this.renderHeader(item, false)}
              {this.renderBody(item)}
            </View>
          ))
        }
        <View style={{
          width: '90%',
          borderTopColor: Color.lightGray,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          justifyContent: 'center',
          marginBottom: -10
        }}>
          {
            user?.account_profile?.url ? (
              <Image
                source={user?.account_profile?.url ? { uri: Config.BACKEND_URL + user.account_profile?.url } : require('assets/logo.png')}
                style={[BasicStyles.profileImageSize, {
                  height: 30,
                  width: 30,
                  borderRadius: 100,
                  marginRight: 5
                }]} />
            ) : <FontAwesomeIcon
              icon={faUserCircle}
              size={30}
              style={{
                color: Color.darkGray,
                marginRight: 5,
                marginTop: -10
              }}
            />
          }
          <TextInput style={{
            width: '100%',
            height: 50,
            marginTop: -10
          }}
            onSubmitEditing={() => {
              this.props.postReply(comments);
              this.setState({ reply: null })
            }}
            value={this.state.reply}
            onChangeText={(value) => this.replyHandler(value)}
            placeholder={'Type reply here ...'}
          />
        </View>
      </View>
    )
  }

  render() {
    const { data, images, share } = this.props;
    const { user } = this.props.state;
    return (
      <View style={{
        // borderRadius: BasicStyles.standardBorderRadius,
        borderColor: Color.lightGray,
        borderWidth: 1,
        marginBottom: 10,
        ...this.props.style
      }}>
        {data.shared && <View style={{
          borderBottomColor: Color.lightGray,
          borderBottomWidth: 1
        }}>
          {this.renderHeader(data.shared, true)}
          <Text style={{
            paddingLeft: 10,
            paddingBottom: 10
          }}>
            {data.shared.text}
          </Text>
        </View>
        }
        {this.renderHeader(data, true)}
        {this.renderBody(data)}
        <TouchableOpacity onPress={() => { this.props.showImages(images) }}>
          <CommentImages images={images} />
        </TouchableOpacity>
        {share !== false && this.renderActions(data)}
        {this.state.loading && <View style={{
          width: width + 43,
          marginLeft: -23
        }}>
          <Skeleton size={1} template={'block'} height={10} />
        </View>}
        {share !== false && this.renderComments(data.comment_replies)}
        {this.props.smallLoader && <View style={{
          width: width + 43,
          marginLeft: -23
        }}>
          <Skeleton size={1} template={'block'} height={10} />
        </View>}
        {this.state.options === true &&
          <View style={{
            position: 'absolute',
            right: 10,
            top: 30,
            width: 150,
            borderWidth: 1,
            borderColor: Color.gray,
            backgroundColor: Color.white,
            zIndex: 10
          }}
          >
            <View style={{ padding: 10 }}>
              {options.map((item, index) => {
                return (
                  <View>
                    {item.title !== 'Report' && (data.shared === null ? data.account.id === user.id : data.shared?.account_id === user.id) && <TouchableOpacity
                      onPress={() => {
                        this.optionClick(data.id, item.action)
                      }}
                      style={{
                        paddingLeft: item.action !== null ? 15 : 5,
                        flexDirection: 'row',
                        paddingBottom: 5
                      }}
                    >
                      <FontAwesomeIcon icon={item.icon} style={{ color: item.action === 'delete' ? Color.danger : null }} />
                      <Text style={{ paddingLeft: 10 }}>{item.title}</Text>
                    </TouchableOpacity>}
                    {(item.title === 'Report' || item.action === null) && (data.shared === null ? data.account.id !== user.id : data.shared?.account_id !== user.id) && <TouchableOpacity
                      onPress={() => {
                        this.optionClick(data.id, item.action)
                      }}
                      style={{
                        paddingLeft: item.action !== null ? 15 : 5,
                        flexDirection: 'row',
                        paddingBottom: 5
                      }}
                    >
                      <FontAwesomeIcon icon={item.icon} style={{ color: item.action === 'delete' ? Color.danger : null }} />
                      <Text style={{ paddingLeft: 10 }}>{item.title}</Text>
                    </TouchableOpacity>}
                  </View>
                )
              })}
            </View>
          </View>}
        {this.editPost()}
        <Share
          visible={this.state.share}
          data={data}
          close={() => {
            this.setState({ share: false })
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setComments: (comments) => dispatch(actions.setComments(comments))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostCard);
