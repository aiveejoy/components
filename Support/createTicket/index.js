import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Button, Alert, Dimensions } from 'react-native';
import TicketButton from 'components/Support/createTicket/TicketButton.js';
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
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

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
      ticketTypes1: [
        {
          id: 1,
          type: 'VERIFICATION ISSUE',
          description: 'Having trouble or did encountered issues about verifications? Create issues here and communicate with Payhiram Administrator for the said issue to be addressed.'
        },
        {
          id: 2,
          type: 'ACCOUNT ISSUE',
          description: 'Having trouble or did encountered issues in managing your account? Create issues here and communicate with Payhiram Administrator for the said issue to be addressed.'
        }
      ],
      ticketTypes2: [
        {
          id: 3,
          type: 'TRANSACTION ISSUE',
          description: 'Having trouble or did encountered issues in your previous transactions? Create issues here and communicate with Payhiram Administrator for the said issue to be addressed.'
        },
        {
          id: 4,
          type: 'OTHERS',
          description: 'Having trouble or did encountered issues in other matters? Create issues here and communicate with Payhiram Administrator for the said issue to be addressed.'
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
    let account_id = this.props.navigation.state.params.user.id
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
        this.props.navigation.push('supportStack');
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

  chooseTicketType1 = () => {
    const { theme } = this.props.state;
    return (
      <View>
        {
          this.state.ticketTypes1 && this.state.ticketTypes1.map((item, index) => (

            <TouchableOpacity
              style={[styles.CardContainer, { justifyContent: 'center', backgroundColor: (this.state.selected && this.state.selected.id == item.id) ? (theme ? theme.primary : Color.primary) : (theme ? theme.secondary : Color.secondary) }]}
              onPress={() => {
                this.onSelect(item, index);
              }}
              key={index}>
              <View style={styles.title}>
                <Text
                  style={[
                    styles.titleText,
                    { fontSize: BasicStyles.titleText.fontSize },
                  ]}>
                  {item.type}
                </Text>
              </View>
              <View style={[styles.description, {
                paddingBottom: 10
              }]}>
                <Text
                  style={[
                    styles.descriptionText,
                    {
                      fontSize: BasicStyles.titleText.fontSize
                    },
                  ]}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>

          ))
        }
      </View>
    );
  }

  chooseTicketType2 = () => {
    const { theme } = this.props.state;
    return (
      <View>
        {
          this.state.ticketTypes2 && this.state.ticketTypes2.map((item, index) => (

            <TouchableOpacity
              style={[styles.CardContainer, { justifyContent: 'center', backgroundColor: (this.state.selected && this.state.selected.id == item.id) ? (theme ? theme.primary : Color.primary) : (theme ? theme.secondary : Color.secondary) }]}
              onPress={() => {
                this.onSelect(item, index);
              }}
              key={index}>
              <View style={styles.title}>
                <Text
                  style={[
                    styles.titleText,
                    { fontSize: BasicStyles.titleText.fontSize },
                  ]}>
                  {item.type}
                </Text>
              </View>
              <View style={[styles.description, {
                paddingBottom: 15
              }]}>
                <Text
                  style={[
                    styles.descriptionText,
                    {
                      fontSize: BasicStyles.titleText.fontSize
                    },
                  ]}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>

          ))
        }
      </View>
    );
  }

  render() {
    const { theme } = this.props.state;
    let data = [{ title: 'Bug', value: 'bug' }, { title: 'Question', value: 'question' }, { title: 'Enhancement', value: 'enhancement' }, { title: 'Invalid', value: 'invalid' }, { title: 'Duplicate', value: 'duplicate' }, { title: 'Help wanted', value: 'help wanted' }]
    return (
      <View>
        <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom: 50}}>
          <View style={styles.CreateTicketContainer}>
            {this.state.proceed === false && (
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
                {this.chooseTicketType1()}
                {this.chooseTicketType2()}
              </View>)}
            {this.state.proceed == true && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ height: height }}>
                  <View style={styles.InputContainer}>
                    <Text style={styles.TicketInputTitleContainer}>Type of Ticket:</Text>
                    <TextInput
                      style={[BasicStyles.formControl, { backgroundColor: Color.gray }]}
                      value={this.state.type}
                      editable={false}
                    />
                  </View>
                  <View style={styles.InputContainer}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.TicketInputTitleContainer}>Title </Text>
                      <Text style={{ color: 'red' }}> *</Text>
                    </View>
                    <TextInput
                      style={BasicStyles.formControl}
                      onChangeText={(title) => this.setState({ title })}
                      value={this.state.title}
                      placeholder={'Title'}
                    />
                  </View>
                  <View style={styles.InputContainer}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.TicketInputTitleContainer}>Description </Text>
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
                        height: 140
                      }}
                      onChangeText={(description) => this.setState({ description })}
                      value={this.state.description}
                      placeholder={'Description'}
                      numberOfLines={6}
                      multiline={true}
                    />
                  </View>
                  {this.state.isLoading ? <Spinner mode="overlay" /> : null}
                  <Text style={styles.TicketInputTitleContainer}>Attached file(s) </Text>
                  <View style={{ flexDirection: 'row', padding: 15, width: '90%' }}>
                    <TouchableOpacity
                      style={{ marginBottom: 25, padding: 15 }}
                      onPress={() => {
                        this.choosePhoto();
                      }}>
                      <FontAwesomeIcon
                        icon={faImages}
                        style={{
                          color: Color.gray, marginRight: 5
                        }}
                        size={50}
                      />
                    </TouchableOpacity>
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
                  <View style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: 100,
                    marginLeft: '2%'
                  }}>
                    <TicketButton
                      buttonColor="#22B173"
                      buttonWidth={'95%'}
                      buttonHeight={50}
                      fontSize={14}
                      textColor="#FFFFFF"
                      buttonText="Create Ticket"
                      onPress={this.create.bind(this)}
                    />
                  </View>
                </View>
              </ScrollView>)}
          </View>
        </ScrollView>
        {this.state.proceed === false && (
        <View style={{
          width: '100%',
          alignItems: 'center',
          position: 'absolute',
          bottom: 15
        }}>
          <TicketButton
            buttonColor={theme ? theme.primary : Color.primary}
            buttonWidth={'90%'}
            buttonHeight={50}
            fontSize={14}
            textColor="#FFFFFF"
            buttonText="Proceed"
            onPress={() => {
              if (this.state.type) {
                this.setState({ proceed: true })
              }else{
                this.messageAlert()
              }
            }}
          />
        </View>)}
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
