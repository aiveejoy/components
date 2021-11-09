import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import Config from 'src/config';
import { Color } from 'common';
import RBSheet from 'react-native-raw-bottom-sheet';

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
    console
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        closeOnDragDown={true}
        dragFromTopOnly={true}
        closeOnPressMask={false}
        height={height/2}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={{
            backgroundColor: Color.gray
          }}>
          </View>
        </ScrollView>
      </RBSheet>
    );
  }
}

export default ImageModal
