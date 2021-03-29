import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, TouchableNativeFeedbackBase } from 'react-native';
import styles from './Styles.js';
import Modal from "react-native-modal";
import Style from 'components/Support/Style';
import Api from 'services/api/index.js';
import { Routes, BasicStyles } from 'common';
import ImagePicker from 'react-native-image-picker';
import TicketButton from 'components/Support/createTicket/TicketButton.js';
import Dropdown from 'components/InputField/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImages, faPaperPlane, faClock } from '@fortawesome/free-solid-svg-icons';
import Color from 'common/Color';
import { Spinner } from 'components';
import Picker from '@react-native-community/picker';
import { Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PostCard from 'modules/generic/PostCard.js';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

class UpdateTicket extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: null,
      description: null,
      type: null,
      id: null,
      assignees: [],
      assignee: null,
      status: null,
      isLoading: false,
      images: [],
      comment: null,
      comments: [],
      showComments: false,
      reply: null,
      date: null,
      modalVisible: false,
      image: null
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
      console.log(response.data[0].created_at_human, response.data[0].content, response.data[0].title, "===");
      if (response.data.length > 0) {
        this.setState({
          title: response.data[0].title,
          description: response.data[0].content,
          type: response.data[0].type,
          id: response.data[0].id,
          images: response.data[0].images.split(' '),
          date: response.data[0].created_at_human,
          status: response.data[0].status
        })
        this.retrieveAssignees();
        this.retrieveComments(this.props.navigation.state.params.id);
      }
    })
  }

  retrieveAssignees() {
    let parameter = {
      condition: [{
        value: 'USER',
        column: 'account_type',
        clause: '!='
      }]
    }
    this.setState({ isLoading: true })
    Api.request(Routes.accountRetrieve, parameter, accounts => {
      this.setState({ isLoading: false })
      if (accounts.data.length > 0) {
        let data = []
        accounts.data.map((item) => {
          let assignee = {
            title: item.username,
            value: item.id
          }
          data.push(assignee)
        })
        this.setState({ assignees: data })
      }
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
      payload: 'tickets',
      text: this.state.comment
    };
    this.setState({ isLoading: true })
    console.log(parameter);
    Api.request(Routes.commentCreate, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data !== null) {
        this.setState({ comment: null })
        this.retrieveComments(this.props.navigation.state.params.id);
      }
    })
  }

  retrieveComments = (id) => {
    let parameter = {
      condition: [
        {
          value: id,
          column: 'payload_value',
          clause: '='
        }
      ]
    };
    this.setState({ isLoading: true })
    console.log(parameter);
    Api.request(Routes.commentsRetrieve, parameter, response => {
      this.setState({ isLoading: false, showComments: true })
      if (response.data.length > 0) {
        this.setState({ comments: response.data })
      } else {
        this.setState({ comments: [] })
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
        this.retrieveComments(this.props.navigation.state.params.id);
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
        this.props.navigation.push('supportStack');
      }
    })
  }

  showImage = () => {
    return (
      <View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        style={{
          height: height - 50,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={{ uri: this.state.image && this.state.image }}
          style={{
            width: width - 100,
            height: height / 2,
            marginBottom: 20
          }}
        />
        <View style={[styles.TicketButtonContainer, {marginLeft: 10}]}>
            <TicketButton
              buttonColor={Color.danger}
              buttonWidth="90%"
              buttonHeight={50}
              fontSize={14}
              textColor="#FFFFFF"
              buttonText="Close"
              onPress={() => {this.setState({modalVisible: false})}}
            />
          </View>
      </Modal>
      </View>
    )
  }

  choosePhoto = () => {
    const options = {
      noData: false,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        let images = this.state.images;
        images.push(`data:image/png;base64,${response.data}`);
        this.setState({ images: images });
      } else {
        this.setState({ photo: null });
      }
    })
  }

  renderComments = () => {
    return (
      <View style={{
        marginBottom: 25,
        borderWidth: .3,
        width: width - 45,
        borderColor: Color.gray,
        borderRadius: 5,
        padding: 10,
        marginTop: 20
      }}>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
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
                  width: '91.5%'
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
                color: Color.primary
              }}
              size={20}
            />
          </TouchableOpacity>
        </View>
        {this.state.comments && this.state.comments.map((item, index) => {
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
      </View>
    )
  }

  render() {
    let data = [{ title: 'Bug', value: 'bug' }, { title: 'Question', value: 'question' }, { title: 'Enhancement', value: 'enhancement' }, { title: 'Invalid', value: 'invalid' }, { title: 'Duplicate', value: 'duplicate' }, { title: 'Help wanted', value: 'help wanted' }]
    let status = [{ title: 'Pending', value: 'pending' }, { title: 'Open', value: 'open' }, { title: 'Closed', value: 'closed' }]
    return (
      <View style={styles.CreateTicketContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            borderColor: Color.gray,
            borderBottomWidth: .3,
            paddingBottom: 20
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <FontAwesomeIcon
                icon={faClock}
                size={25}
                style={{ marginRight: 5 }}
              />
              <Text>{this.state.date}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>{this.state.title?.toUpperCase()}</Text>
            </View>
            <View style={{marginTop: 20}}>
              <Text>{this.state.description}</Text>
            </View>
            <Text style={{
              fontStyle: 'italic',
              color: Color.primary,
              marginTop: 30,
              fontWeight: 'bold',
              marginBottom: 10
            }}>Attachment(s)</Text>
            <View style={{ flexDirection: 'row', width: '90%' }}>
              <ScrollView horizontal={true}>
                {this.state.images.map((u, i) => {
                  return (
                    <View key={i} style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            image: u,
                            modalVisible: true
                          })
                        }}
                      >
                        <Image
                          source={{ uri: u }}
                          style={styles.Image}
                        />
                      </TouchableOpacity>
                    </View>
                  )
                })}
              </ScrollView>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 30,}}>
              <Text style={{
                fontWeight: 'bold',
              }}>STATUS: </Text>
              <Text style={{
                color: this.state.status && this.state.status.toLowerCase() === 'closed' ? Color.danger : Color.success
              }}>{this.state.status}</Text>
            </View>
          </View>
          {/* <View style={{ marginBottom: 25 }}>
            {this.state.showComments === false ?
              <TouchableOpacity onPress={() => {
                this.retrieveComments(this.props.navigation.state.params.id);
              }}>
                <Text style={{ fontWeight: 'bold' }}>Show comments...</Text>
              </TouchableOpacity> :
              <TouchableOpacity onPress={() => { this.setState({ showComments: false }) }}>
                <Text style={{ fontWeight: 'bold' }}>Hide comments...</Text>
              </TouchableOpacity>
            }
          </View> */}
          {/* {this.state.showComments === true && ( */}
            {this.renderComments()}
          {/* )} */}
          <View style={styles.TicketButtonContainer}>
            <TicketButton
              buttonColor={Color.danger}
              buttonWidth="90%"
              buttonHeight={50}
              fontSize={14}
              textColor="#FFFFFF"
              buttonText="Close Ticket"
              onPress={this.update.bind(this)}
            />
          </View>
          {this.showImage()}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

export default connect(mapStateToProps)(UpdateTicket);
