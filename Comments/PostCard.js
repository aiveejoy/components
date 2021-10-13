import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text, TextInput } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faTimes, faStar, faUserCircle, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import UserImage from 'components/User/Image';

const height = Math.round(Dimensions.get('window').height);

class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reply: null
    }
  }

  replyHandler = (value) => {
    this.setState({ reply: value });
    this.props.reply(value);
  }

  renderHeader = (data) => {
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15
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
        paddingLeft: 10,
        paddingRight: 10,
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

        <Text>24 joined</Text>
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
        paddingLeft: 20
      }}>
        {
          comments && comments.map((item, index) => (
            <View
              key={index}
              style={{
                ...BasicStyles.standardWidth
              }}>
              {this.renderHeader({ user: item.account, date: item.created_at_human })}
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
            user?.profile.url ? (
              <Image
                source={user?.profile.url ? { uri: Config.BACKEND_URL + user.profile.url } : require('assets/logo.png')}
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
                color: Color.white,
                marginRight: 5
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
        ...BasicStyles.standardWidth,
        borderRadius: BasicStyles.standardBorderRadius,
        borderColor: Color.lightGray,
        borderWidth: 1,
        marginBottom: 20
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
