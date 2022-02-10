import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text, TextInput, ScrollView, Alert } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faEllipsisH, faCog, faPencilAlt, faFileAlt, faTrashAlt, faPrayingHands, faShare, faHeart } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color, Routes } from 'common';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import UserImage from 'components/User/Image';
import CommentImages from './Images';
import Api from 'services/api/index.js';
import Skeleton from 'components/Loading/Skeleton';
import RBSheet from "react-native-raw-bottom-sheet";
import Share from './Share';

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);
const options = [
  { title: 'Edit', action: 'edit', icon: faPencilAlt },
  { title: 'Report', action: 'report', icon: faFileAlt },
  { title: 'Delete', action: 'delete', icon: faTrashAlt }
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
      share: false
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

  optionClick = (id, action) => {
    const { data } = this.props;
    this.setState({ options: false });
    switch (action) {
      case 'edit':
        this.setState({ toEdit: data.text })
        this.RBSheet.open();
        break;
      case 'report':
        this.clickReport();
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
        this.RBSheet.close()
      }
    }, error => {
      console.log(error)
      this.setState({ isLoading: false })
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

  editPost = () => {
    const { errorMessage, toEdit, isLoading } = this.state;
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
          <View style={{
            width: width,
            marginTop: 10,
            alignItems: 'center'
          }}>
            <Text>Edit Post</Text>
            {isLoading && <Skeleton size={1} template={'block'} height={10} />}
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
        <UserImage user={data.account} size={30} />
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
