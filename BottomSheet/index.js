import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { Dimensions } from 'react-native';
import Config from 'src/config';
import { Color, BasicStyles, Routes } from 'common';
import Api from 'services/api/index.js';
import RBSheet from 'react-native-raw-bottom-sheet';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Modal from 'components/Modal/Sketch';
import moment from 'moment';
import Button from 'components/Form/Button';
import ImagePicker from 'react-native-image-picker';
import Skeleton from 'components/Loading/Skeleton';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ImageModals from 'components/Modal/ImageModal';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class ImageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      photo: null,
      imageLoading: false,
      imageModal: false,
      url: null,
      deleteID: null
    }
  }

  openBottomSheet = () => {
    this.RBSheet.open()
  }

  manage(item) {
    switch (item.type) {
      case 'navigation':
        this.props.navigation.navigate(item.route)
        break
      case 'callback':
        if (this.props.onClick) {
          this.props.onClick(item)
        }
        break
    }
  }

  uploadPhoto = (payload) => {
    const { currentValidation, user } = this.props;
    const options = {
      noData: false,
      error: null
    }
    ImagePicker.launchCamera(options, response => {
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
        let formData = new FormData();
        formData.append('file_url', currentValidation?.id + '_' + response.fileName);
        formData.append('account_id', user.id);
        formData.append('file_base64', response.data);
        this.setState({ imageLoading: true })
        Api.upload(Routes.imageUploadBase64, formData, resp => {
          console.log(resp)
          this.setState({ imageLoading: false })
          let parameter = {
            account_id: user.id,
            payload: payload,
            payload_value: resp.data.data,
            category: currentValidation?.id
          }
          this.setState({ imageLoading: true })
          console.log(Routes.uploadImage, parameter)
          Api.request(Routes.uploadImage, parameter, response => {
            console.log(response)
            this.setState({ imageLoading: false })
            this.props.retrieveReceiverPhoto()
          }, error => {
            console.log(error, 'upload image url to payload')
          })
        }, error => {
          console.log(error, 'upload image')
        })
      }
    })
  }

  closeSketch = () => {
    this.setState({ visible: false })
  }

  sendSketch = (result) => {
    const { myDevice, user, currentValidation } = this.props;
    let d = moment(new Date()).format('l').split('/')
    let date = (moment(new Date()).format('hh:mm:ss')).split(':')
    let formData = new FormData();
    formData.append('file_url', d.join('_') + '_' + date.join('_') + '_' + myDevice?.unique_code);
    formData.append('account_id', user.id);
    formData.append('file_base64', result);
    console.log(d.join('_') + '_' + date.join('_') + '_' + myDevice?.unique_code)
    this.setState({ imageLoading: true })
    Api.upload(Routes.imageUploadBase64, formData, resp => {
      this.setState({ imageLoading: false })
      let parameter = {
        account_id: user.id,
        payload: 'signature',
        payload_value: resp.data.data,
        category: currentValidation?.id
      }
      this.setState({ imageLoading: true })
      Api.request(Routes.uploadImage, parameter, response => {
        this.props.retrieveReceiverPhoto()
        console.log(response, 'upload sketch')
        this.setState({ imageLoading: false })
      }, error => {
        this.setState({ imageLoading: false })
        console.log(error, 'upload photo to payloads')
      })
    }, error => {
      this.setState({ imageLoading: false })
      console.log(error, 'base 64 upload')
    })
  }

  versionOne = () => {
    const { data } = this.props;
    return (
      <View style={{
      }}>
        {
          (data && data.length > 0) && data.map(item => (
            <TouchableOpacity style={{
              width: '100%',
              paddingLeft: 20,
              paddingRight: 20,
              flexDirection: 'row',
              paddingTop: 15,
              paddingBottom: 15
            }}
              onPress={() => {
                this.manage(item)
              }}
            >
              {
                item.icon && (
                  <FontAwesomeIcon icon={item.icon} size={15} />
                )
              }
              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                paddingLeft: 10,
              }}>{item.title}</Text>
            </TouchableOpacity>
          ))
        }
      </View>
    )
  }

  versionTwo = () => {
    const { data, images, pictures, userOwner, currentValidation } = this.props;
    return (
      <View>
        {images ? (
          <View>
            {pictures.length > 0 &&
              <TouchableOpacity
                onPress={() => {
                  this.props.goBack()
                }}
                style={{
                  padding: 10,
                  zIndex: 100
                }}><FontAwesomeIcon
                  icon={faArrowLeft}
                  size={15}
                  style={{
                    color: Color.danger
                  }} />
              </TouchableOpacity>}
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: 20
            }}>
              {
                pictures.length > 0 && pictures.map((ndx, el) => {
                  return (
                    <TouchableOpacity style={{
                      height: 100,
                      width: '50%',
                      borderWidth: 1,
                      borderColor: Color.gray
                    }}
                      onPress={() => {
                        this.setState({
                          deleteID: ndx.id,
                          url: ndx.payload_value,
                          imageModal: true
                        })
                      }}
                      key={el}>
                      <Image
                        source={{ uri: Config.BACKEND_URL + ndx.payload_value }}
                        style={{
                          width: '100%',
                          height: 98
                        }}
                      />
                    </TouchableOpacity>
                  )
                })
              }
            </View>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}>
              {pictures.length == 0 && <View style={{
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'row'
              }}>
                <Text>No requirements submitted yet.</Text>
                <TouchableOpacity onPress={() => {
                  this.props.goBack()
                }}>
                  <Text style={{
                    color: Color.danger
                  }}> Go Back</Text>
                </TouchableOpacity>
              </View>}
              {userOwner && currentValidation?.status != 'accepted' && <View style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Button
                  title={'Decline'}
                  onClick={() => this.props.sendNewMessage(currentValidation.payload)}
                  style={{
                    width: '45%',
                    marginRight: '1%',
                    backgroundColor: Color.danger
                  }}
                />
                <Button
                  title={'Accept'}
                  onClick={() => this.props.updateValidation('accepted')}
                  style={{
                    width: '45%',
                    backgroundColor: Color.success
                  }}
                />
              </View>
              }
              {!userOwner && currentValidation?.status != 'accepted' && <Button
                title={currentValidation?.payload === 'signature' ? 'Upload Signature' : 'Take A Picture'}
                onClick={() => {
                  if (currentValidation?.payload === 'signature') {
                    this.setState({ visible: true })
                  } else {
                    this.uploadPhoto(currentValidation?.payload);
                  }
                }}
                style={{
                  width: '50%',
                  backgroundColor: Color.success,
                  marginBottom: 20
                }}
              />
              }
              {currentValidation?.status == 'accepted' && <Button
                title={'Accepted'}
                onClick={() => {
                  console.log('accepted')
                }}
                style={{
                  width: '50%',
                  backgroundColor: Color.success,
                  marginBottom: 20
                }}
              />
              }
            </View>
          </View>
        ) :
          <View style={{
          }}>
            {
              (data && data.length > 0) && data.map(item => (
                <TouchableOpacity style={{
                  width: '100%',
                  paddingLeft: 20,
                  paddingRight: 20,
                  flexDirection: 'row',
                  paddingTop: 15,
                  paddingBottom: 15
                }}
                  onPress={() => {
                    this.manage(item)
                  }}
                >
                  {
                    item.icon && (
                      <FontAwesomeIcon icon={item.icon} size={15} />
                    )
                  }
                  <Text style={{
                    fontSize: BasicStyles.standardFontSize,
                    paddingLeft: 10,
                    color: item.color ? item.color : null
                  }}>{item.title}</Text>
                  {userOwner && item.btn && <TouchableOpacity style={{
                    position: 'absolute',
                    right: 20,
                    top: 15,
                    zIndex: 10,
                    ...item.btn?.style
                  }}
                    onPress={() => {
                      item.btn?.onClick();
                    }}>
                    <Text style={{
                      color: item.btn?.color
                    }}>{item.btn?.title}</Text>
                  </TouchableOpacity>}
                </TouchableOpacity>
              ))
            }
          </View>}
      </View>
    )
  }

  render() {
    const { version, isLoading, userOwner, currentValidation } = this.props;
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        closeOnDragDown={true}
        dragFromTopOnly={true}
        closeOnPressMask={false}
        height={height / 2}
        onClose={() => {
          if (this.props.onClose) {
            this.props.onClose()
          }
        }}
      >
        <ImageModals
          deleteID={!userOwner && currentValidation?.status != 'accepted' ? this.state.deleteID : null}
          visible={this.state.imageModal}
          url={Config.BACKEND_URL + this.state.url}
          action={() => {
            this.setState({ imageModal: false })
          }}
          route={Routes.uploadImageDelete}
          successDel={() => { this.retrieveReceiverPhoto(currentValidation?.id) }}
        ></ImageModals>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          {this.state.imageLoading || isLoading ? (<Skeleton size={1} template={'block'} height={75} />) : null}
          {!isLoading && version == 1 && this.versionOne()}
          {!isLoading && version == 2 && this.versionTwo()}
        </ScrollView>
        <Modal send={this.sendSketch} close={this.closeSketch} visible={this.state.visible} />
      </RBSheet>
    );
  }
}

export default ImageModal
