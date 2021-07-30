import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, TouchableNativeFeedbackBase, TouchableHighlightBase } from 'react-native';
import styles from './Styles.js';
import Style from 'components/Support/Style';
import Api from 'services/api/index.js';
import { Routes, BasicStyles } from 'common';
import ImagePicker from 'react-native-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImages, faPaperPlane, faClock, faCaretDown, faEllipsisH, faBug } from '@fortawesome/free-solid-svg-icons';
import Color from 'common/Color';
import { Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PostCard from 'modules/generic/PostCard.js';
import ImageModal from 'components/Modal/ImageModal';
import Skeleton from 'components/Loading/Skeleton';
import moment from 'moment';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

class UpdateTicket extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      modalVisible: false,
      data: null
    };
  }

  componentDidMount() {
    this.retrieve();
  }

  retrieve() {
    let parameter = {
      condition: [{
        value: this.props.navigation.state.params.id,
        column: 'id',
        clause: '='
      }]
    };
    this.setState({ isLoading: true })
    Api.request(Routes.ticketsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        console.log({
          data: response.data[0]
        })
        this.setState({
          data: response.data[0]
        })
      }
    }, error => {
      this.setState({
        isLoading: false
      })
    })
  }

  commentHandler = (value) => {
    this.setState({ comment: value })
  }

  replyHandler = (value) => {
    this.setState({ reply: value })
  }

  createComment = (id) => {
    let parameter = {
      account_id: this.props.state.user.id,
      payload_value: id,
      payload: 'ticket_id',
      text: this.state.comment
    };
    this.setState({ isLoading: true })
    console.log(parameter);
    Api.request(Routes.commentCreate, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data !== null) {
        this.setState({ comment: null })
        parameter['account'] = {
          username: this.props.state.user.username
        }
        parameter['account']['profile'] = this.props.state.user.profile
        parameter['created_at_human'] = moment(new Date()).format('MMMM DD, YYYY hh:mm a');
        let temp = [parameter, ...this.props.state.comments?.commentList]
        const { setComments } = this.props;
        setComments({id: id, commentList: temp});
      }
    })
  }

  retrieveComments = (id) => {
    let parameter = {
      condition: [
        {
          value: 'ticket_id',
          column: 'payload',
          clause: '='
        },
        {
          value: id,
          column: 'payload_value',
          clause: '='
        }
      ],
      sort: { created_at: 'desc'}
    };
    this.setState({ isLoading: true })
    console.log(parameter, Routes.commentsRetrieve, "parameter");
    Api.request(Routes.commentsRetrieve, parameter, response => {
      this.setState({ isLoading: false, showComments: true })
      if (response.data.length > 0) {
        const { setCurrentTicketId, setComments} = this.props;
        setCurrentTicketId(id);
        setComments({id: id, commentList: response.data})
      }
    })
  }

  createReply = () => {
    let parameter = {
      account_id: this.props.state.user.id,
      comment_id: this.props.navigation.state.params.id,
      text: this.state.reply
    }
    this.setState({ isLoading: true });
    Api.request(Routes.replyCreate, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data !== null) {
        this.setState({ reply: null })
      }
    })
  }

  selectedValue = value => {
    this.setState({ type: value });
  };

  selectedAssignee = value => {
    this.setState({ assignee: value });
  };

  selectedStatus = value => {
    this.setState({ status: value });
  };

  update() {
    let parameter = {
      id: this.state.id,
      status: 'closed'
    };
    this.setState({ isLoading: true })
    Api.request(Routes.ticketsUpdate, parameter, tickets => {
      this.setState({ isLoading: false })
      if (tickets.data !== null) {
        this.retrieve();
        this.setState({ closeTicket: false })
      }
    })
  }

  renderComments = () => {
    const { theme } = this.props.state;
    return (
      <View>
        {this.state.isLoading && (<Skeleton size={2} template={'block'} height={50}/>)}
        {this.state.title && (
          <View style={{
            marginBottom: 25,
            marginTop: 10,
            width: '100%'
          }}>
            <View style={{
              flexDirection: 'row',
              padding: 10,
            }}>
              <TextInput
                style={
                  [
                    {
                      height: 40,
                      borderColor: Color.gray,
                      borderWidth: .3,
                      borderRadius: 20,
                      width: '90%'
                    },
                    Style.textInput
                  ]
                }
                placeholder={'Comment here...'}
                onChangeText={value => this.commentHandler(value)}
                value={this.state.comment}
              />
              <TouchableOpacity
                onPress={() => { this.createComment(this.props.navigation.state.params.id) }}
                style={{
                  padding: 10
                }}
              >
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  style={{
                    color: theme ? theme.primary : Color.primary
                  }}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            {this.props.state.comments && this.props.state.comments.commentList && this.props.state.comments.commentList.length > 0 && this.props.state.comments.commentList.map((item, index) => {
              return (
                <PostCard
                  data={{
                    user: item.account,
                    comments: item.comment_replies,
                    message: item.text,
                    date: item.created_at_human
                  }}
                  postReply={() => { this.createReply() }}
                  reply={(value) => { this.replyHandler(value) }}
                />
              )
            })}
          </View>)}
      </View>
    )
  }

  renderTicket(){
    const { data } = this.state;
    const { theme } = this.props.state;
    return(
      <ScrollView showsVerticalScrollIndicator={false}>  
        <View style={{
          borderColor: Color.gray,
          borderBottomWidth: .3,
          padding: 20
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <FontAwesomeIcon
              icon={faBug}
              size={25}
              style={{
                marginRight: 5,
                color: theme ? theme.primary : Color.primary
              }}
            />
            <View>
              <Text style={{
              }}>{data.type}</Text>
              <Text style={{
                fontSize: 11
              }}>{moment(new Date(data.created_at)).format('MMMM DD, YYYY hh:mm a')}</Text>
            </View>
          </View>
          <Text style={{ fontWeight: 'bold' }}>{data.title}</Text>
          <Text style={{
            paddingTop: 20,
            paddingBottom: 20,
            fontStyle: 'italic'
          }}>{data.content}</Text>
          
          <View style={{ flexDirection: 'row'}}>
            <Text style={{
              fontWeight: 'bold',
            }}>STATUS: </Text>
            <Text style={{
              color: data.status.toLowerCase() === 'closed' ? Color.danger : Color.success
            }}>{data.status}</Text>
          </View>
        </View>
        {data.comments && this.renderComments()}
      </ScrollView>
    )
  }
  render() {
    const { theme } = this.props.state;
    const { data, isLoading} = this.state;
    return (
      <View style={{
        flex: 1
      }}>
        {isLoading && (<Skeleton size={3} template={'block'} height={50}/>)}
        {
          data && (
            this.renderTicket()
          )
        }
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setComments: (comments) => dispatch(actions.setComments(comments)),
    setCurrentTicketId: (currentTicketId) => dispatch(actions.setCurrentTicketId(currentTicketId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateTicket);
