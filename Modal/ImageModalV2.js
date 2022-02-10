import React, { Component } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import Config from 'src/config';
import { Color } from 'common';
import RBSheet from 'react-native-raw-bottom-sheet';
import VideoPlayer from 'react-native-video-player';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class ImageModal extends Component {
  constructor(props) {
    super(props);
  }

  openBottomSheet = () => {
    this.RBSheet.open()
  }

  render() {
    const { images } = this.props;
    console
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        closeOnDragDown={true}
        dragFromTopOnly={true}
        closeOnPressMask={false}
        height={height}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={{
            marginBottom: 100,
            backgroundColor: Color.gray
          }}>
            {images.length > 0 && images.map((item, index) => {
              return (
                <View style={{
                  width: width,
                  height: 300,
                  borderColor: Color.white,
                  borderWidth: 1
                }}>
                  {item.includes('/storage/file/') ?
                    <VideoPlayer
                      video={{ uri: Config.BACKEND_URL + item }}
                      repeat={true}
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: Color.lightGray
                      }}
                      thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
                    /> :<Image
                    source={{ uri: Config.BACKEND_URL + item }}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'stretch',
                    }}
                  />}
                </View>
              )
            })}
          </View>
        </ScrollView>
      </RBSheet>
    );
  }
}

export default ImageModal
