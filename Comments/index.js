import React, { Component } from 'react';
import Style from './Style.js';
import { BottomSheet } from 'react-native-elements';
import { View, Image, Text, TouchableOpacity, ScrollView, Dimensions, SafeAreaView, TextInput } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Footer from 'modules/generic/Footer'
import PostCard from './PostCard';
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import { constant } from 'lodash';
import { connect } from 'react-redux';
import _ from 'lodash';
const height = Math.round(Dimensions.get('window').height);

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
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

  searchHandler = (value) => {
    this.setState({ search: value })
  }

  statusHandler = (value) => {
    this.setState({ status: value })
  }

  replyHandler = (value) => {
    this.setState({ reply: value })
  }

  retrieve = (flag) => {
    let parameter = {
      condition: [
        {
          value: this.props.navigation.state?.params?.payload,
          column: 'payload',
          clause: '='
        },
        {
          value: this.props.navigation.state?.params?.payload_value,
          column: 'payload_value',
          clause: '='
        }
      ],
      sort: { created_at: 'desc' }
    };
    this.setState({ isLoading: true });
    Api.request(Routes.commentsRetrieve, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data.length > 0) {
        this.setState({
          data: flag === false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id'),
          offset: flag === false ? 1 : (this.state.offset + 1)
        })
      } else {
        this.setState({
          data: flag == false ? [] : this.state.data,
          offset: flag == false ? 0 : this.state.offset,
        })
      }
    })
  }

  onChangeDataHandler = (item) => {
    const { data } = this.state;
    if (data == null) {
      return
    }
    let temp = data.map((iItem, iIndex) => {
      if (iItem.id == item.id) {
        return item
      }
      return iItem
    })

    this.setState({
      data: temp
    })
  }

  post = () => {
    let parameter = {
      account_id: this.props.state.user.id,
      payload: this.props.navigation.state?.params?.payload,
      payload_value: this.props.navigation.state?.params?.payload_value,
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
    let parameter = {
      account_id: this.props.state.user.id,
      comment_id: comment.id,
      text: this.state.reply
    }
    this.setState({ isLoading: true });
    Api.request(Routes.replyCreate, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data !== null) {
        this.setState({ reply: null })
        this.retrieve(false);
      }
    })
  }

  render() {
    const { data, isLoading } = this.state;
    return (
      <SafeAreaView>
        <View style={{
          backgroundColor: 'white',
          paddingTop: 10,
          borderTopEndRadius: 20,
          borderTopStartRadius: 20,
          alignItems: 'center'
        }}>
          <View style={{ alignItems: 'center', flexDirection: 'row', padding: 10 }}>
            <TextInput
              style={{
                width: '75%',
                marginRight: 5,
                paddingLeft: 20,
                borderColor: Color.gray,
                borderWidth: .5,
                borderRadius: 50,
              }}
              multiline={true}
              numberOfLines={2}
              onChangeText={text => this.statusHandler(text)}
              value={this.state.status}
              placeholder="Type your comment here..."
            />
            <TouchableOpacity style={{
              height: 35,
              width: '10%',
              alignItems: 'center',
              justifyContent: 'center'
            }}
              onPress={() => { this.post() }}
            >
              <FontAwesomeIcon size={20} icon={faPaperPlane} />
            </TouchableOpacity>
          </View>
        </View>
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
                // this.retrieve(false)
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
            flex: 1,
            padding: 10
          }}>
            {
              data.length > 0 && data.map((item, index) => (
                <View>
                  <PostCard
                    data={{
                      user: item.account,
                      comments: item.comment_replies,
                      message: item.text,
                      date: item.created_at_human
                    }}
                    postReply={() => { this.reply(item) }}
                    reply={(value) => this.replyHandler(value)}
                    onLike={(params) => this.onChangeDataHandler(params)}
                    onJoin={(params) => this.onChangeDataHandler(params)}
                  />
                </View>
              ))
            }
          </View>
        </ScrollView>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <Footer layer={1} {...this.props} />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Comments);