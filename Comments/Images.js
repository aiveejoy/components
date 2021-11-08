import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import Styles from './ImagesStyle';
import Config from 'src/config';

class Create extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { images } = this.props;
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
                <View
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
                </View>
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
              <View
                style={{
                  height: '100%',
                  width: '100%',
                }}>
                <Image
                  source={{ uri: Config.BACKEND_URL + images[0].category }}
                  style={Styles.image} />
              </View>
            </View>
            <View style={{
              width: '50%'
            }}>
              <View
                style={{
                  height: '50%',
                  width: '100%',
                }}>
                <Image
                  source={{ uri: Config.BACKEND_URL + images[1].category }}
                  style={Styles.image} />
              </View>
              <View
                style={{
                  height: '50%',
                  width: '100%'
                }}>
                <Image
                  source={{ uri: Config.BACKEND_URL + images[2].category }}
                  style={Styles.image} />
              </View>
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
              <View
                style={{
                  height: '50%',
                  width: '100%',
                }}>
                <Image
                  source={{ uri: Config.BACKEND_URL + images[0].category }}
                  style={Styles.image} />
              </View>
              <View
                style={{
                  height: '50%',
                  width: '100%'
                }}>
                <Image
                  source={{ uri: Config.BACKEND_URL + images[1].category }}
                  style={Styles.image} />
              </View>
            </View>
            <View style={{
              width: '50%'
            }}>
              <View
                style={{
                  height: '50%',
                  width: '100%',
                }}>
                <Image
                  source={{ uri: Config.BACKEND_URL + images[2].category }}
                  style={Styles.image} />
              </View>
              <View
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
              </View>
            </View>
          </View>
        }
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