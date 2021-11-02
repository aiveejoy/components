import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text, TextInput } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faTimes, faStar, faUserCircle, faEllipsisH, faCog, faPencilAlt, faFileAlt, faEyeSlash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import UserImage from 'components/User/Image';

const height = Math.round(Dimensions.get('window').height);
const options = [
  {title: 'Post Actions', action: null, icon: faCog},
  {title: 'Edit', action: 'edit', icon: faPencilAlt},
  {title: 'Report', action: 'report', icon: faFileAlt},
  {title: 'Hide', action: 'hide', icon: faEyeSlash},
  {title: 'Delete', action: 'delete', icon: faTrashAlt}
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

  renderHeader = (data) => {
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
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 5,
              top: 0
            }}
            onPress={() => { this.setState({ options: !this.state.options }) }}>
            <FontAwesomeIcon icon={faEllipsisH} />
          </TouchableOpacity>
          {this.state.options === true &&
          <View style={{
            position: 'absolute',
            right: -5,
            top: 20,
            width: 150,
            borderWidth: 1,
            borderColor: Color.gray,
            backgroundColor: Color.white,
            zIndex: 100
          }}
            >
            <View style={{padding: 10}}>  
              {options.map((item, index) => {
                return (
                  <View
                    style={{
                      paddingLeft: item.action !== null ? 25 : 10,
                      flexDirection: 'row',
                      paddingBottom: 15   
                    }}
                  >
                    <FontAwesomeIcon icon={item.icon} style={{color: item.action === 'delete' ? Color.danger : null}}/>
                    <Text style={{paddingLeft: 10 }}>{item.title}</Text>
                  </View>
                )
              })}
            </View>
          </View>}
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
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20,
        flexDirection: 'row'
      }}>
        <TouchableOpacity style={{
          width: 70,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          borderColor: data.like_status == true ? Color.primary : Color.lightGray,
          borderWidth: 1,
          height: 40,
          marginRight: 5,
          backgroundColor: data.like_status == true ? Color.primary : Color.white
        }}
          onPress={() => this.props.onLike({
            ...data,
            like_status: !data.like_status
          })}
        >
          <Text style={{
            color: data.like_status == true ? Color.white : Color.black
          }}>{data.like_status == true ? 'Liked' : 'Like'}</Text>
        </TouchableOpacity>


        <TouchableOpacity style={{
          width: 70,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          borderColor: data.joined_status == true ? Color.primary : Color.lightGray,
          borderWidth: 1,
          height: 40,
          marginRight: 5,
          backgroundColor: data.joined_status == true ? Color.primary : Color.white
        }}
          onPress={() => this.props.onJoin({
            ...data,
            joined_status: !data.joined_status
          })}>
          <Text style={{
            color: data.joined_status == true ? Color.white : Color.black
          }}>{data.joined_status == true ? 'Joined' : 'Join'}</Text>
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
              {this.renderHeader({ user: item.account, date: item.created_at })}
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
    const { data } = this.props;
    return (
      <View style={{
        borderRadius: BasicStyles.standardBorderRadius,
        borderColor: Color.lightGray,
        borderWidth: 1,
        marginBottom: 20,
        ...this.props.style
      }}>
        {this.renderHeader(data)}
        {this.renderBody(data)}
        {/* {this.renderActions(data)} */}
        {this.renderComments(data.comments)}
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
