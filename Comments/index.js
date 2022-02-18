import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView, Text, Image } from 'react-native';
import { Routes, Color, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faImages, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import PostCard from './PostCard';
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import CreatePost from 'src/components/Comments/Create';
import Skeleton from 'components/Loading/Skeleton';
import _ from 'lodash';
import Config from 'src/config';
import ImageModal from 'components/Modal/ImageModalV2.js';
import Style from './Style';

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
      images: [],
      showFilterOptions: false,
      selectedFilter: 'Date'
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.props.setComments([])
      this.retrieve(false);
    })
  }

  retrieveByFilter = (by) => {
    const { selectedFilter } = this.state;
    let previousFilter = selectedFilter
    this.setState({
      selectedFilter: by,
      showFilterOptions: false
    }, () => {
      if(previousFilter !== by) {
        this.props.setComments([])
        this.retrieve(false);
      }
    })
  }

  retrieve = (flag) => {
    const { setComments, withImages } = this.props;
    const { selectedFilter } = this.state;
    let parameter = null
    if (this.props.payload) {
      parameter = {
        condition: [{
          clause: '=',
          column: 'payload',
          value: this.props.payload?.payload
        }, {
          clause: '=',
          column: 'payload_value',
          value: this.props.payload?.payload_value
        }],
        limit: this.state.limit,
        offset: flag === true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
        sort: {
          created_at: selectedFilter === 'Date' ? 'desc' : 'asc'
        }
      }
    } else if(this.props.account) {
      parameter = {
        condition: [{
          clause: '=',
          column: 'account_id',
          value: this.props.account
        }],
        limit: this.state.limit,
        offset: flag === true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
        sort: {
          created_at: selectedFilter === 'Date' ? 'desc' : 'asc'
        }
      }
    }else {
      parameter = {
        condition: [{
          clause: '!=',
          column: 'payload',
          value: 'page'
        }],
        limit: this.state.limit,
        offset: flag === true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
        sort: {
          created_at: selectedFilter === 'Date' ? 'desc' : 'asc'
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

  componentDidUpdate() {
    if (this.props.shouldRetrieve && !this.state.isLoading) {
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
    const { user, comments } = this.props.state;
    let parameter = {
      account_id: user.id,
      comment_id: comment.id,
      text: this.state.reply
    }
    let newReply = {
      account: {
        information: user.account_information,
        profile: user.account_profile,
        ...user
      },
      ...parameter
    }
    this.setState({ smallLoading: true });
    Api.request(Routes.commentRepliesCreate, parameter, response => {
      this.setState({ smallLoading: false });
      if (response.data) {
        let com = comments;
        com.length > 0 && com.map((item, index) => {
          if (item.id == comment.id) {
            if (item.comment_replies == null) {
              item.comment_replies = [];
              item.comment_replies.push(newReply);
            } else {
              item.comment_replies.push(newReply);
            }
          }
        })
        this.setState({ reply: null });
        this.props.setComments(com);
      }
    })
  }

  render() {
    const { isLoading, createStatus, smallLoading, images, selectedFilter, showFilterOptions } = this.state;
    const { comments, user } = this.props.state;
    return (
      <View>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <View style={{
          paddingBottom: 10,
          paddingTop: 10
        }}>
          <View style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            padding: 10,
            borderWidth: 1,
            borderColor: Color.lightGray,
            marginBottom: 10
          }}>
            
            <Text style={{
              width: '50%'
            }}>Filter Results By</Text>
            <TouchableOpacity
            style={{
              width: '45%',
              marginRight: 5
            }}
              onPress={() => {
                this.setState({showFilterOptions: !showFilterOptions})
              }}
            ><Text style={{
              textAlign: 'right'
            }}
            >{selectedFilter || 'Date'}</Text></TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({showFilterOptions: !showFilterOptions})
              }}
            >
              <FontAwesomeIcon
              icon={faChevronDown}
              style={{
                marginTop: 2
              }}
            />
            </TouchableOpacity>
          </View>
          {showFilterOptions && <View style={Style.optionContainer}>
          <TouchableOpacity onPress={() => { this.retrieveByFilter('Date') }}><Text style={Style.option}>Date</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { this.retrieveByFilter('Followed Churches') }}><Text style={Style.option}>Followed Churches</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { this.retrieveByFilter('Country') }}><Text style={Style.option}>Country</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { this.retrieveByFilter('Followed Communities') }}><Text style={Style.option}>Followed Communities</Text></TouchableOpacity>
          </View>}
          <View style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            padding: 10,
            borderWidth: 1,
            borderColor: Color.lightGray
          }}>
            {
              user?.account_profile?.url ? (
                <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('accountPostsStack', {data: user})
                }}><Image
                  source={user?.account_profile?.url ? { uri: Config.BACKEND_URL + user.account_profile?.url } : require('assets/logo.png')}
                  style={[BasicStyles.profileImageSize, {
                    height: 30,
                    width: 30,
                    borderRadius: 100,
                    marginTop: 2
                  }]}
                />
                </TouchableOpacity>
              ) : <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('accountPostsStack', {data: user})
              }}><FontAwesomeIcon
                icon={faUserCircle}
                size={30}
                style={{
                  color: Color.darkGray
                }}
              />
              </TouchableOpacity>
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
        {comments.length > 0 && comments.map((item, index) => {
          return (
            <PostCard
              navigation={this.props.navigation}
              loader={this.loader}
              data={item}
              showImages={(images) => {
                let temp = [];
                images.map(item => {
                  temp.push(item.category)
                })
                this.setState({ images: temp }, () => {
                  this.myRef.current.openBottomSheet()
                })
              }}
              images={item.images}
              smallLoader={smallLoading}
              postReply={() => { this.reply(item) }}
              reply={(value) => this.replyHandler(value)}
              style={{
                backgroundColor: 'white',
              }}
            />
          )
        })}
        {
          (isLoading) && (
            <Skeleton size={2} template={'block'} height={130} />
          )
        }
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