import React, {Component} from 'react';
import styles from './Style.js';
import {Text, View, TouchableOpacity, Image, ScrollView} from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { Color , BasicStyles, Helper, Routes} from 'common';
import Api from 'services/api/index.js';
import Config from 'src/config.js';
import ImagePicker from 'react-native-image-picker';
class ImageUpload extends Component {
  constructor(props){
    super(props);

    this.state = {
      data: null,
      url: null,
      photo: null
    }
  }

  componentDidMount(){
    this.retrieve()
  }

  retrieve = () => {
    const { user } = this.props.state;
    if(user === null){
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        clause: '=',
        column: 'account_id'
      }],
      sort: {
        created_at: 'desc'
      }
    }

    Api.request(Routes.imageRetrieve, parameter, response => {
      console.log('imageRetrieve', response)
      if(response.data.length > 0){
        this.setState({data: response.data, photo: null})
      }else{
        this.setState({data: null, photo: null})
      }
    });
  }

  onClose = () => {
    const { photo } = this.state;
    if(photo != null){
      return
    }
    this.props.onCLose()
  }

  upload = () => {
    const { photo } = this.state;
    if(photo != null){
      return
    }
    const { user } = this.props.state;
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response })
        let formData = new FormData();
        let uri = Platform.OS == "android" ? response.uri : response.uri.replace("file://", "");
        formData.append("file", {
          name: response.fileName,
          type: response.type,
          uri: uri
        });
        formData.append('file_url', response.fileName);
        formData.append('account_id', user.id);
        console.log(formData)
        Api.upload(Routes.imageUpload, formData, imageResponse => {
          this.retrieve()
        })
      }else{
        this.setState({ photo: null })
      }
    })
  }

  select = () => {
    const { url, photo } = this.state;
    if(url != null && photo == null){
      this.props.onSelect(url)
    }
  }

  setImage = (url) => {
    this.setState({url})
  }

  _images = (data) => {
    return (
      <ScrollView style={{
        width: '100%'
      }}>
        {
          this.state.photo != null && (
            <View style={{
              width: '100%',
              height: 200
            }}>
              <Image
                source={{uri: this.state.photo.uri}}
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}/>
              <View style={{
                textAlign: 'center',
                marginTop: -200,
                width: '100%',
                height: '100%',
                backgroundColor: Color.white,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: .7
              }}>
                <Text style={{
                    color: Color.primary,
                    fontSize: 16
                  }}>
                  Uploading ...
                </Text>
              </View>
            </View>
          )
        }
        {
          data == null && (
            <View style={{
              width: '100%',
              height: 200,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{
                color: Color.primary,
                textAlign: 'center'
              }}>Start uploading now!</Text>
            </View>
          )
        }
        {
          data != null && data.map((imageItem, imageIndex) => {
            return (
              <TouchableOpacity
                onPress={() => this.setImage(imageItem.url)} 
                key={imageIndex}
                style={{
                  borderBottomColor: imageItem.url === this.state.url ? Color.secondary : Color.gray,
                  borderBottomWidth: imageItem.url === this.state.url ? 5 : 1,
                  borderTopWidth: imageItem.url === this.state.url ? 5 : 0,
                  borderTopColor: Color.secondary,
                  width: '100%',
                  height: 200
                }}
                >
                <View style={{
                  width: '100%'
                }}>
                  <Image
                    source={{uri: Config.BACKEND_URL + imageItem.url}}
                    style={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}/>
                </View>
              </TouchableOpacity>
            )
          })
        }
      </ScrollView>
    );
  }

  render(){
    const { data } = this.state;
    return (
      <View>
        <Modal isVisible={this.props.visible}>
          <View style={styles.mainContainer}>
            <View style={[styles.container, {
              height: '90%',
              marginTop: '10%'
            }]}>
              <View style={styles.header}>
                <View style={{
                  width: '70%'
                }}
                >
                  <Text style={[styles.text, {
                    color: Color.primaryDark,
                    fontWeight: 'bold' 
                  }]}>Select photos</Text>
                </View>
                <View style={{
                  width: '30%',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  <TouchableOpacity onPress={() => this.onClose()} style={styles.close}>
                    <FontAwesomeIcon icon={ faTimes } style={{
                      color: Color.primaryDark,
                      fontWeight: 'bold'
                    }} size={BasicStyles.iconSize} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.content, {
                height: '88%',
                width: '100%'
              }]}>
                {
                  this._images(data)
                }
              </View>
              <View style={[styles.action, {
                flexDirection: 'row',
                height: '8%'
              }]}>
                <View style={{
                  width: '50%',
                  alignItems: 'center',
                  height: '100%'
                }}>
                  <TouchableOpacity 
                    onPress={() => this.upload()}
                    underlayColor={Color.gray}
                    >
                    <Text style={[styles.text, {
                      color: Color.primary,
                      width: '100%'
                    }]}>Upload</Text>
                  </TouchableOpacity>
                </View>
                <View style={{
                  width: '50%',
                  alignItems: 'center',
                  height: '100%',
                  borderLeftColor: Color.gray,
                  borderLeftWidth: 1
                }}>
                  <TouchableOpacity 
                    onPress={() => this.select()}
                    underlayColor={Color.gray}
                    >
                    <Text style={[styles.text, {
                      color: Color.primary,
                      width: '100%'
                    }]}>Select</Text>
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

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
    setUserLedger: (userLedger) => dispatch(actions.setUserLedger(userLedger))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageUpload);

