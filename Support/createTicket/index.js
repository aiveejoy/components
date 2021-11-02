import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Button, Alert, Dimensions } from 'react-native';
import styles from 'components/Support/createTicket/Styles.js';
import Api from 'services/api/index.js';
import { Routes, BasicStyles } from 'common';
import Dropdown from 'components/InputField/Dropdown'
import { Spinner } from 'components';
import { Card } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import Color from 'common/Color';
import { connect } from 'react-redux';
import GenericButton from 'components/Form/Button';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
import {NavigationActions, StackActions} from 'react-navigation';

class CreateTicket extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: null,
      description: null,
      type: null,
      isLoading: false,
      imageModalUrl: null,
      photo: null,
      isImageModal: false,
      images: [],
      ticketTypes: [
        {
          id: 1,
          type: 'VERIFICATION ISSUE',
          description: 'Having trouble or encountered issues during the verification process? Create a ticket to raise an issue and communicate with PayHiram Support for it to be addressed.'
        },
        {
          id: 2,
          type: 'ACCOUNT ISSUE',
          description: 'Having trouble or encountered issues in managing your account? Create a ticket to raise an issue and communicate with PayHiram Support for it to be addressed.'
        },
        {
          id: 3,
          type: 'TRANSACTION ISSUE',
          description: 'Having trouble or encountered issues in your previous transaction? Create a ticket to raise an issue and communicate with PayHiram Support for it to be addressed.'
        },
        {
          id: 4,
          type: 'UPDATE PLAN ISSUE',
          description: 'Having trouble or encountered issues in updating your plan? Create a ticket to raise an issue and communicate with PayHiram Support for it to be addressed.'
        },
        {
          id: 5,
          type: 'OTHERS',
          description: 'Got other issues that are not mentioned above? Create a ticket to raise the issue and communicate with PayHiram Support for it to be addressed.'
        }
      ],
      selected: null,
      active: null,
      proceed: false
    };
  }

  selectedValue = value => {
    this.setState({ type: value });
  };

  onSelect(item, index) {
    this.setState({
      active: this.active == index ? null : index,
      selected: item,
      type: item.type
    })
  }

  messageAlert(){
    Alert.alert(
      'Message',
      'Please select (1) type of Ticket.',
      [
        { text: 'Ok' }
      ],
      { cancelable: false }
    )
    return
  }

  create = () => {
    if (this.state.title === '' || this.state.description === '' || this.state.title === null || this.state.description === null) {
      Alert.alert(
        'Error in creating ticket.',
        'Please complete all the required fields.',
        [
          { text: 'Ok' }
        ],
        { cancelable: false }
      )
      return
    }
    let account_id = this.props.state?.user?.id
    let parameter = {
      account_id: account_id,
      title: this.state.title,
      content: this.state.description,
      status: 'pending',
      type: this.state.type,
      images: this.state.images.join(' ')
    }
    this.setState({ isLoading: true })
    Api.request(Routes.ticketsCreate, parameter, response => {
      console.log(response);
      this.setState({ isLoading: false })
      if (response.data != null) {
        const navigateAction = NavigationActions.navigate({
          routeName: 'drawerStack',
          action: StackActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({routeName: 'Support'}),
            ]
          })
        });
        this.props.navigation.dispatch(navigateAction);
      }
    }, error => {
      console.log(error);
      this.setState({ isLoading: false })
    })
  }

  uploadPhoto = (payload) => {
    const options = {
      noData: true,
      error: null
    }
    const { user } = this.props.state;
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        ImageResizer.createResizedImage(response.uri, response.width * 0.5, response.height * 0.5, 'JPEG', 72, 0)
          .then(res => {
            let parameter = {
              account_id: user.id,
              payload: payload,
              payload_value: res.uri,
              category: currentValidation?.id
            }
            this.setState({ isLoading: true })
            Api.request(Routes.uploadImage, parameter, response => {
              this.setState({ isLoading: false })
              this.retrieveReceiverPhoto(currentValidation?.id);
            })
          })
          .catch(err => {
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
            console.log(err)
          });
      }else{
        this.setState({
          photo: null
        })
      }
    })
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


  setImage = (url) => {
    this.setState({ imageModalUrl: url })
    setTimeout(() => {
      this.setState({ isImageModal: true })
    }, 500)
  }

  chooseTicketType = () => {
    const { theme } = this.props.state;
    return (
      <View style={{
        width: '100%'
      }}>
        {
         this.state.ticketTypes.map((item, index) => (
            <TouchableOpacity
              style={{
                width: '100%',
                borderRadius: BasicStyles.standardBorderRadius,
                marginBottom: 20,
                justifyContent: 'center',
                backgroundColor: (this.state.selected && this.state.selected.id == item.id) ? (theme ? theme.primary : Color.primary) : (theme ? theme.secondary : Color.secondary)
              }}
              onPress={() => {
                this.onSelect(item, index);
              }}
              key={index}>
              <View style={{
                width: '100%',
                textAlign: 'center',
                paddingTop: 20,
                paddingBottom: 10
              }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: Color.white,
                    textAlign: 'center'
                  }}>
                  {item.type}
                </Text>
              </View>
              <Text
                style={{
                  color: Color.white,
                  padding: 10,
                  paddingBottom: 20,
                  textAlign: 'center',
                  fontStyle: 'italic',
                }}>
                {item.description}
              </Text>
            </TouchableOpacity>

          ))
        }
      </View>
    );
  }

  renderUpload(){
    return (
      <View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text style={styles.TicketInputTitleContainer}>Attachments</Text>
          <GenericButton
            style={{
              backgroundColor: theme ? theme.secondary : Color.secondary,
              width: '30%'
            }}
            title={'Upload'}
            onClick={() => {
              this.choosePhoto();
            }}
          />
        </View>
        <View style={{ flexDirection: 'row'}}>
          <ScrollView horizontal={true} showsVerticalScrollIndicator={false}>
            {this.state.images.map((u, i) => {
              return (
                <View key={i}>
                  <Image
                    source={{ uri: u }}
                    style={styles.Image}
                  />
                </View>
              )
            })}
          </ScrollView>
        </View>
      </View>
    )
  }

  renderCreate(){
    const { theme } = this.props.state;
    const { selected } = this.state; 
    return (
      <View style={{
        flex: 1,
        width: '100%'
      }}>
        <View style={{
          width: '100%'
        }}>
          <Text style={{
            textAlign: 'center',
            fontWeight: 'bold',
            paddingTop: 20,
            paddingBottom: 10
          }}>{this.state.type}</Text>
          {
            selected && (
              <Text style={{
                paddingTop: 10,
                paddingBottom: 10,
                fontStyle: 'italic',
                width: '100%',
                textAlign: 'center'
              }}>{selected.description}</Text>
            )
          }
        </View>
        <View style={styles.InputContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.TicketInputTitleContainer}>Brief description of the issue </Text>
            <Text style={{ color: 'red' }}> *</Text>
          </View>
          <TextInput
            style={BasicStyles.formControl}
            onChangeText={(title) => this.setState({ title })}
            value={this.state.title}
            placeholder={'Description'}
            placeholderTextColor={Color.darkGray}
          />
        </View>
        <View style={styles.InputContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.TicketInputTitleContainer}>Additional information </Text>
            <Text style={{ color: 'red' }}> *</Text>
          </View>
          <TextInput
            style={{
              borderColor: Color.lightGray,
              borderWidth: 1,
              width: width - 40,
              paddingLeft: 10,
              marginBottom: 20,
              borderRadius: 25,
              height: 140,
              paddingTop: 5,
              paddingBottom: 5
            }}
            onChangeText={(description) => this.setState({ description })}
            value={this.state.description}
            placeholder={'Additional information'}
            numberOfLines={6}
            multiline={true}
            placeholderTextColor={Color.darkGray}
          />
        </View>
        
      </View>
    );
  }

  renderStep1(){
    return(
      <View style={{
        height: height,
        alignItems: 'center',
        marginBottom: 100
      }}>
        <Text style={{
          fontWeight: 'bold',
          paddingTop: 10,
          paddingBottom: 40
        }}>Select type of ticket:</Text>
        {this.state.ticketTypes && this.chooseTicketType()}
      </View>
    )
  }
  render() {
    const { theme } = this.props.state;
    let data = [{ title: 'Bug', value: 'bug' }, { title: 'Question', value: 'question' }, { title: 'Enhancement', value: 'enhancement' }, { title: 'Invalid', value: 'invalid' }, { title: 'Duplicate', value: 'duplicate' }, { title: 'Help wanted', value: 'help wanted' }]
    return (
      <View style={{
        flex: 1
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            paddingLeft: 20,
            paddingRight: 20,
            flex: 1,
            minHeight: height * 1.5
          }}>
            {this.state.proceed === false && this.renderStep1()}
            {this.state.proceed == true && this.renderCreate()}
          </View>
        </ScrollView>
        <View style={{
          paddingLeft: 20,
          paddingRight: 20,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: 5
        }}>
          {
            this.state.proceed == false && (
              <GenericButton
                style={{
                  backgroundColor: theme ? theme.primary : Color.primary,
                  width: '100%'
                }}
                title={'Continue'}
                onClick={() => {
                  if (this.state.type) {
                    this.setState({ proceed: true })
                  }else{
                    this.messageAlert()
                  }
                }}
              />
            )
          }
          {
            this.state.proceed == true && (
              <GenericButton
                style={{
                  backgroundColor: theme ? theme.primary : Color.primary,
                  width: '100%'
                }}
                onClick={() => {
                  if (this.state.type) {
                    this.setState({ proceed: true })
                  }else{
                    this.messageAlert()
                  }
                }}
                title={'Submit'}
                onClick={this.create.bind(this)}
              />
            )
          }
        </View>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTicket);
