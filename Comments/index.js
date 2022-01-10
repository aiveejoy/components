import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView, Text } from 'react-native';
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
import ImageModal from 'components/Modal/ImageModalV2.js';

class Comments extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef()
    this.state = {
      isLoading: false,
      search: null,
      status: null,
      reply: null,
      offset: 0,
      limit: 5,
      createStatus: false,
      smallLoading: false,
      images: []
    }
  }

  componentDidMount() {
    this.props.setComments([])
    this.retrieve(false);
  }

  retrieve = (flag) => {
    const { setComments, withImages } = this.props;
    let parameter = null
    if(this.props.payload) {
      parameter = {
        condition: [{
          clause: '=',
          column: 'payload',
          value:  this.props.payload?.payload
        }, {
          clause: '=',
          column: 'payload_value',
          value: this.props.payload?.payload_value
        }],
        limit: this.state.limit,
        offset: flag === true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
        sort: {
          created_at: "desc"
        }
      }
    } else {
      parameter = {
        condition: [{
          clause: '!=',
          column: 'payload',
          value: 'page'
        }],
        limit: this.state.limit,
        offset: flag === true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
        sort: {
          created_at: "desc"
        }
      }
    }
    this.setState({ isLoading: true });
    console.log(withImages ? Routes.commentsRetrieveWithImages : Routes.commentsRetrieve, parameter)
    Api.request(withImages ? Routes.commentsRetrieveWithImages : Routes.commentsRetrieve, parameter, response => {
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

  componentDidUpdate(){
    if(this.props.shouldRetrieve && !this.state.isLoading) {
      this.retrieve(true);
      return
    }
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
    this.setState({ smallLoading: true });
    Api.request(Routes.commentRepliesCreate, parameter, response => {
      this.setState({ smallLoading: false });
      if (response.data) {
        this.retrieve(false);
        this.setState({ reply: null })
      }
    })
  }

  render() {
    const { isLoading, createStatus, smallLoading, images } = this.state;
    const { comments, user } = this.props.state;
    return (
      <View>
        {isLoading ? <Spinner mode="overlay" /> : null}
        {/* <ScrollView style={{
          backgroundColor: Color.containerBackground
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
        > */}
          <View style={{
            paddingBottom: 10,
            paddingTop: 10
          }}>
            <View style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              padding: 10,
              borderWidth: 1,
              borderColor: Color.lightGray
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
                onPress={() => {
                  this.setState({ createStatus: true })
                }}
              >
                <Text style={{
                  color: Color.darkGray
                }}>Say something...</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                height: 35,
                width: '25%',
                alignItems: 'center',
                justifyContent: 'center',
                borderLeftWidth: 1,
                borderLeftColor: Color.darkGray,
              }}
                onPress={() => { this.setState({ createStatus: true }) }}
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
          </View>
          {
            (smallLoading) && (
              <Skeleton size={1} template={'block'} height={10} />
            )
          }
          {/* <View style={{
            paddingLeft: 20,
            paddingRight: 20
          }}> */}
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
                  showImages={(images) => {this.setState({images: images}, () => {
                    this.myRef.current.openBottomSheet()
                  })}}
                  images={item.images}
                  postReply={() => { this.reply(item) }}
                  reply={(value) => this.replyHandler(value)}
                  style={{
                    backgroundColor: 'white',
                  }}
                />
              )
            })}
          {/* </View> */}
          {
            (isLoading) && (
              <Skeleton size={2} template={'block'} height={130} />
            )
          }
        {/* </ScrollView> */}
        <CreatePost
          payload={this.props.payload}
          visible={createStatus}
          close={() => this.setState({ createStatus: false })}
          title={'Create Post'}
          retrieve={() => {
            this.retrieve(false);
          }}
        />
        <ImageModal
          images={images}
          ref={this.myRef}
        ></ImageModal>
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