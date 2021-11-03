import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView, TextInput, Text } from 'react-native';
import { Routes, Color, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImages, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import PostCard from './PostCard';
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import CreatePost from 'src/components/Comments/Create';
import Skeleton from 'components/Loading/Skeleton';
import _ from 'lodash';

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      search: null,
      status: null,
      reply: null,
      offset: 0,
      limit: 5,
      createStatus: false
    }
  }

  componentDidMount() {
    this.retrieve(false);
  }

  retrieve = (flag) => {
    const { setComments } = this.props;
    let parameter = {
      limit: this.state.limit,
      offset: flag === true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
      sort: {
        created_at: "desc"
      }
    }
    this.setState({ isLoading: true });
    Api.request(Routes.commentsRetrieve, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data.length > 0) {
        this.setState({ offset: flag === false ? 1 : (this.state.offset + 1) })
        setComments(flag === false ? response.data : _.uniqBy([...this.props.state.comments, ...response.data], 'id'));
        console.log(this.props.state.comments);
      } else {
        this.setState({ offset: flag == false ? 0 : this.state.offset, })
        setComments(flag == false ? [] : this.props.state.comments);
      }
    })
  }

  searchHandler = (value) => {
    this.setState({ search: value })
  }

  statusHandler = (value) => {
    this.setState({ status: value })
  }

  replyHandler = (value) => {
    this.setState({ reply: value })
  }

  onChangeDataHandler = (item) => {
    const { comments } = this.props.state;
    if (comments == null) {
      return
    }
    let temp = comments.map((iItem, iIndex) => {
      if (iItem.id == item.id) {
        return item
      }
      return iItem
    })
    this.props.setComments(temp)
  }

  post = () => {
    const { payload_value, payload } = this.props.navigation.state?.params;
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id,
      payload: payload,
      payload_value: payload_value,
      text: this.state.status
    }
    this.setState({ isLoading: true });
    Api.request(Routes.commentCreate, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data !== null) {
        this.retrieve(false);
        this.setState({ status: null })
      }
    })
  }

  reply = (comment) => {
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id,
      comment_id: comment.id,
      text: this.state.reply
    }
    this.setState({ isLoading: true });
    Api.request(Routes.commentRepliesCreate, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data !== null) {
        this.setState({ reply: null })
        this.retrieve(false);
      }
    })
  }

  render() {
    const { isLoading, createStatus } = this.state;
    const { comments, user } = this.props.state;
    return (
      <View style={{
        padding: 20
      }}>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <ScrollView style={{
          backgroundColor: Color.containerBackground,
          height: '100%'
        }}
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
            let totalHeight = event.nativeEvent.contentSize.height
            if (event.nativeEvent.contentOffset.y <= 0) {
              if (isLoading == false) {
              }
            }
            if (Math.round(scrollingHeight) >= Math.round(totalHeight)) {
              if (isLoading == false) {
                this.retrieve(true)
              }
            }
          }}
        >
          <View style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            padding: 10,
            borderWidth: 1,
            borderColor: Color.lightGray,
            borderRadius: BasicStyles.standardBorderRadius,
            marginBottom: 20
          }}>
            {
              user?.profile?.url ? (
                <Image
                  source={user?.profile?.url ? { uri: Config.BACKEND_URL + user.profile?.url } : require('assets/logo.png')}
                  style={[BasicStyles.profileImageSize, {
                    height: 30,
                    width: 30,
                    borderRadius: 100
                  }]} />
              ) : <FontAwesomeIcon
                icon={faUserCircle}
                size={30}
                style={{
                  color: Color.darkGray
                }}
              />
            }
            <TouchableOpacity
              style={{
                width: '70%',
                paddingLeft: '5%',
                justifyContent: 'center',
              }}
              onPress={()=>{
                this.setState({createStatus: true})
              }}
            >
              {/* <TextInput
                style={{ height: 35 }}
                onChangeText={text => this.statusHandler(text)}
                value={this.state.status}
                placeholder="Create post"
              /> */}
              <Text style={{
                color: Color.darkGray
              }}>Create Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              height: 35,
              width: '25%',
              alignItems: 'center',
              justifyContent: 'center',
              borderLeftWidth: 1,
              borderLeftColor: Color.darkGray,
            }}
              onPress={() => { this.setState({createStatus: true}) }}
            >
              <FontAwesomeIcon
                size={30}
                icon={faImages}
                style={{
                  color: Color.darkGray
                }}
              />
            </TouchableOpacity>
          </View>
          {
              (isLoading) && (
                <Skeleton size={2} template={'block'} height={130}/>
              )
            }
          {comments.length > 0 && comments.map((item, index) => {
            return (
              <PostCard
                navigation={this.props.navigation}
                loader={this.loader}
                data={{
                  user: item.account,
                  comments: item.comment_replies,
                  message: item.text,
                  date: item.created_at_human,
                  id: item.id,
                  members: item.members,
                  index: index
                }}
                images={item.images?.length > 0 ? item.images : []}
                postReply={() => { this.reply(item) }}
                reply={(value) => this.replyHandler(value)}
                style={{
                  backgroundColor: 'white',
                }}
              />
            )
          })}
        </ScrollView>
        <CreatePost
          visible={createStatus}
          close={() => this.setState({ createStatus: false })}
          title={'Create Post'}
        />
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setComments: (comments) => dispatch(actions.setComments(comments))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comments);