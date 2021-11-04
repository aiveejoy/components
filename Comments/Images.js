import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import Styles from './ImagesStyle';
import { Color } from 'common';
import Config from 'src/config';
import ImageModal from 'components/Modal/ImageModal.js';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageModalUrl: null,
      isImageModal: false
    }
  }

  setImage = (url) => {
    this.setState({ imageModalUrl: url })
    setTimeout(() => {
      this.setState({ isImageModal: true })
    }, 500)
  }

  render() {
    const { images } = this.props;
    const { isImageModal, imageModalUrl } = this.state;
    return (
      <View>
        {images?.length < 3 && images?.length != 0 &&
          <View style={{
            height: 200,
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}>
            {images.map((item, index) => {
              return (
                <TouchableOpacity onPress={() => { this.setImage(Config.BACKEND_URL + item.category) }}
                  style={{
                    height: '100%',
                    width: images?.length == 1 ? '100%' : '50%',
                  }}>
                  <Image
                    source={{ uri: Config.BACKEND_URL + item.category }}
                    style={{
                      height: '100%',
                      width: '100%',
                      resizeMode: 'stretch'
                    }} />
                </TouchableOpacity>
              )
            })}
          </View>
        }
        {images?.length == 3 &&
          <View style={{
            height: 200,
            width: '100%',
            flexDirection: 'row'
          }}>
            <View style={{
              width: '50%'
            }}>
              <TouchableOpacity onPress={() => { this.setImage(Config.BACKEND_URL + images[0].category) }}
                style={{
                  height: '100%',
                  width: '100%',
                }}>
                <Image
                  source={{ uri: Config.BACKEND_URL + images[0].category }}
                  style={Styles.image} />
              </TouchableOpacity>
            </View>
            <View style={{
              width: '50%'
            }}>
              <TouchableOpacity onPress={() => { this.setImage(Config.BACKEND_URL + images[1].category) }}
                style={{
                  height: '50%',
                  width: '100%',
                }}>
                <Image
                  source={{ uri: Config.BACKEND_URL + images[1].category }}
                  style={Styles.image} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this.setImage(Config.BACKEND_URL + images[2].category) }}
                style={{
                  height: '50%',
                  width: '100%'
                }}>
                <Image
                  source={{ uri: Config.BACKEND_URL + images[2].category }}
                  style={Styles.image} />
              </TouchableOpacity>
            </View>
          </View>
        }
        {images?.length > 3 &&
          <View style={{
            height: 200,
            width: '100%',
            flexDirection: 'row'
          }}>
            <View style={{
              width: '50%'
            }}>
              <TouchableOpacity onPress={() => { this.setImage(Config.BACKEND_URL + images[0].category) }}
                style={{
                  height: '50%',
                  width: '100%',
                }}>
                <Image
                  source={{ uri: Config.BACKEND_URL + images[0].category }}
                  style={Styles.image} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this.setImage(Config.BACKEND_URL + images[1].category) }}
                style={{
                  height: '50%',
                  width: '100%'
                }}>
                <Image
                  source={{ uri: Config.BACKEND_URL + images[1].category }}
                  style={Styles.image} />
              </TouchableOpacity>
            </View>
            <View style={{
              width: '50%'
            }}>
              <TouchableOpacity onPress={() => { this.setImage(Config.BACKEND_URL + images[2].category) }}
                style={{
                  height: '50%',
                  width: '100%',
                }}>
                <Image
                  source={{ uri: Config.BACKEND_URL + images[2].category }}
                  style={Styles.image} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this.setImage(Config.BACKEND_URL + images[3].category) }}
                style={{
                  height: '50%',
                  width: '100%',
                }}>
                <Image
                  source={{ uri: Config.BACKEND_URL + images[3].category }}
                  style={[Styles.image, {
                    opacity:images.length > 4 ? 0.2 : null
                  }]} />
                  {images.length > 4 && <Text style={{
                    position: 'absolute',
                    top: '40%',
                    left: '40%',
                    fontSize: 20
                  }}>+{images.length - 4}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        }
        <ImageModal
          visible={isImageModal}
          url={imageModalUrl}
          action={() => this.setState({ isImageModal: false })}
        ></ImageModal>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);