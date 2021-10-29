import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Routes, Color, BasicStyles } from 'common';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import _ from 'lodash';
import Style from './CreateStyle';
import { Spinner } from 'components';
import moment from 'moment';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      loading: false,
      errorMessage: null
    }
  }

  statusHandler = (value) => {
    this.setState({ status: value })
  }

  post = () => {
    const { status } = this.state;
    if(status === '' || status === null) {
      this.setState({errorMessage: 'Empty Status!'})
      return
    }
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id,
      payload: "status",
      payload_value: "1",
      text: this.state.status,
      to: user.id,
      from: user.id,
      route: 'statusStack'
    }
    let data = {
      account: {
        email: user.email,
        id: user.id,
        profile: {
          account_id: user.id,
          url: user.account_profile?.url || null
        },
        username: user.username
      },
      account_id: user.id,
      comment_replies: [],
      members: [],
      text: this.state.status,
      created_at_human: moment(new Date()).format('MMMM DD, YYYY hh:mm a')
    }
    this.setState({loading: true})
    Api.request(Routes.commentsCreate, parameter, response => {
      this.setState({loading: false})
      if (response.data !== null) {
        this.props.close()
        data['id'] = response.data;
        this.props.setComments([data, ...this.props.state.comments])
        this.setState({
          status: null,
          errorMessage: null
        })
      }
    })
  }

  render() {
    const { theme } = this.props.state;
    const { loading, errorMessage } = this.state;
    return (
      <View style={Style.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.visible}
        >
          <View style={Style.centeredView}>
            <View style={Style.modalView}>
              <View style={Style.container}>
                <Text style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: BasicStyles.standardTitleFontSize
                }}>{this.props.title}</Text>
                <Text style={{
                  color: Color.danger
                }}>{errorMessage}</Text>
                 {loading ? <Spinner mode="overlay" /> : null}
                <TextInput
                  style={Style.textInput}
                  multiline={true}
                  onChangeText={text => this.statusHandler(text)}
                  value={this.state.status}
                  placeholder="   Express what's on your mind!"
                  placeholderTextColor={Color.darkGray}
                />
                <View style={{
                  flexDirection: 'row-reverse',
                  padding: 30
                }}>
                  <TouchableOpacity style={[Style.button, {
                    borderColor: theme ? theme.primary : Color.primary,
                    backgroundColor: theme ? theme.primary : Color.primary
                  }]}
                    onPress={() => { this.post() }}
                  >
                    <Text style={{ color: 'white' }}>Post</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[Style.button, {
                    borderColor: Color.secondary,
                    backgroundColor: Color.secondary,
                    marginRight: 5,
                  }]}
                    onPress={() => { this.props.close(), this.setState({ status: null }) }}
                  >
                    <Text style={{ color: 'white' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setCreateStatus: (createStatus) => dispatch(actions.setCreateStatus(createStatus)),
    setComments: (comments) => dispatch(actions.setComments(comments))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);