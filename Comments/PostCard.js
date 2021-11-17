import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text, TextInput } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faEllipsisH, faCog, faPencilAlt, faFileAlt, faEyeSlash, faTrashAlt, faPrayingHands, faShare, faHeart } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import UserImage from 'components/User/Image';
import CommentImages from './Images';

const height = Math.round(Dimensions.get('window').height);
const options = [
  { title: 'Post Actions', action: null, icon: faCog },
  { title: 'Edit', action: 'edit', icon: faPencilAlt },
  { title: 'Report', action: 'report', icon: faFileAlt },
  { title: 'Hide', action: 'hide', icon: faEyeSlash },
  { title: 'Delete', action: 'delete', icon: faTrashAlt }
]
class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reply: null,
      options: false
    }
  }

  replyHandler = (value) => {
    this.setState({ reply: value });
    this.props.reply(value);
  }

  renderHeader = (data, top) => {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
      }}>
        <UserImage user={data.user} size={30} />
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
            }}>{data?.user?.username}</Text>
            <Text style={{
              fontSize: BasicStyles.standardFontSize
            }}>
              {data.date}
            </Text>
          </View>
          {top && <TouchableOpacity
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
        }}>{data.message}</Text>
      </View>
    )
  }

  renderActions = (data) => {
    const { theme } = this.props.state
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
            // this.props.onLike(data)
          }}
        >
          <FontAwesomeIcon
            icon={faPrayingHands}
            size={15}
            style={{
            }}
          />
          <Text style={{
            marginLeft: 5,
            fontSize: 13,
          }}>Amen</Text>
        </TouchableOpacity>


        <TouchableOpacity style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 20,
          flexDirection: 'row'
        }}
          onPress={() => {
            // this.props.onLike(data)
          }}
        >
          <FontAwesomeIcon
            icon={faHeart}
            size={15}
            style={{
              color: Color.black
            }}
          />
          <Text style={{
            marginLeft: 5,
            fontSize: 13
          }}>Love</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 20,
          flexDirection: 'row'
        }}
          onPress={() => {
            // this.props.onLike(data)
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
              {this.renderHeader({ user: item.account, date: item.created_at}, false )}
              {this.renderBody({ message: item.text })}
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
            user?.profile?.url ? (
              <Image
                source={user?.profile?.url ? { uri: Config.BACKEND_URL + user.profile?.url } : require('assets/logo.png')}
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
            onSubmitEditing={() => this.props.postReply(comments)}
            onChangeText={(value) => this.replyHandler(value)}
            placeholder={'Type reply here ...'}
          />
        </View>
      </View>
    )
  }

  render() {
    const { data, images } = this.props;
    return (
      <View style={{
        // borderRadius: BasicStyles.standardBorderRadius,
        borderColor: Color.lightGray,
        borderWidth: 1,
        marginBottom: 10,
        ...this.props.style
      }}>
        {this.renderHeader(data, true)}
        {this.renderBody(data)}
        <TouchableOpacity onPress={() => { this.props.showImages(images) }}>
          <CommentImages images={images} />
        </TouchableOpacity>
        {this.renderActions(data)}
        {this.renderComments(data.comments)}
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
                  <View
                    style={{
                      paddingLeft: item.action !== null ? 15 : 5,
                      flexDirection: 'row',
                      paddingBottom: 5
                    }}
                  >
                    <FontAwesomeIcon icon={item.icon} style={{ color: item.action === 'delete' ? Color.danger : null }} />
                    <Text style={{ paddingLeft: 10 }}>{item.title}</Text>
                  </View>
                )
              })}
            </View>
          </View>}
      </View>
    )
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostCard);
