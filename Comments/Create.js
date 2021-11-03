import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, Image } from 'react-native';
import { Routes, Color, BasicStyles } from 'common';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import _ from 'lodash';
import Style from './CreateStyle';
import { Spinner } from 'components';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import Config from 'src/config';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      loading: false,
      errorMessage: null,
      list: []
    }
  }

  statusHandler = (value) => {
    this.setState({ status: value })
  }

  post = () => {
    const { status } = this.state;
    if (status === '' || status === null) {
      this.setState({ errorMessage: 'Empty Status!' })
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
    this.setState({ loading: true })
    Api.request(Routes.commentsCreate, parameter, response => {
      this.setState({ loading: false })
      if (response.data !== null) {
        this.props.close()
        this.addPhotos(response.data);
        data['id'] = response.data;
        this.props.setComments([data, ...this.props.state.comments])
        this.setState({
          status: null,
          errorMessage: null
        })
      }
    })
  }

  handleChoosePhoto = () => {
    const { user } = this.props.state;
    const options = {
      noData: true,
      error: null
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ photo: null })
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ photo: null })
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        this.setState({ photo: null })
      } else {
        this.setState({ photo: response })
        let list = this.state.list
        list.push(response)
        this.setState({ list: list })
      }
    })
  }

  addPhotos = (id) => {
    const { list } = this.state;
    const { user } = this.props.state;
    list.length > 0 && list.map((item, index) => {
      let formData = new FormData();
      let uri = Platform.OS == "android" ? item.uri : item.uri.replace("file://", "/private");
      formData.append("file", {
        name: item.fileName,
        type: item.type,
        uri: uri
      });
      formData.append('file_url', item.fileName);
      formData.append('account_id', user.id);
      Api.upload(Routes.imageUploadBase64, formData, resp => {
        this.setState({ loading: false })
        let parameter = {
          account_id: user.id,
          payload: 'comment_id',
          payload_value: id,
          category: 'post_image'
        }
        this.setState({ loading: true })
        Api.request(Routes.uploadImage, parameter, res => {
          this.setState({ loading: false })
          console.log(res)
        }, error => {
          this.setState({ loading: false })
          console.log(error, 'upload image url to payload')
        })
      }, error => {
        this.setState({ loading: false })
        console.log(error, 'upload image')
      })
    })
  }

  render() {
    const { theme } = this.props.state;
    const { loading, errorMessage, list } = this.state;
    return (
      <View style={Style.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.visible}
        >
          <View style={Style.centeredView}>
            <View style={Style.modalView}>
              <ScrollView>
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
                  <TouchableOpacity style={{
                    flexDirection: 'row',
                    width: '100%',
                    padding: 20,
                    alignItems: 'center'
                  }}
                  onPress={() => {
                    this.handleChoosePhoto();
                  }}
                  >
                    <FontAwesomeIcon
                      size={30}
                      icon={faImages}
                      style={{
                        color: Color.darkGray,
                        marginRight: 10
                      }}
                    />
                    <Text style={{ color: Color.darkGray }}>Add Photos</Text>
                  </TouchableOpacity>
                  <View style={{
                    flexWrap: 'wrap',
                    width: '100%'
                  }}>
                    {list.length > 0 && list.map((item, index) => {
                      <Image
                        source={{ uri: Config.BACKEND_URL + item.data }}
                        style={{
                          width: '25%',
                          height: 50
                        }}
                      />
                    })}
                  </View>
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
              </ScrollView>
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