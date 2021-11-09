import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import Config from 'src/config';
import { Color, BasicStyles } from 'common';
import RBSheet from 'react-native-raw-bottom-sheet';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class ImageModal extends Component {
  constructor(props) {
    super(props);
  }

  openBottomSheet = () => {
    this.RBSheet.open()
  }

  manage(item){
    switch(item.type){
      case 'navigation':
        this.props.navigation.navigate(item.route)
        break
      case 'callback':
        if(this.props.onClick){
          this.props.onClick(item)
        }
        break
    }
  }

  render() {
    const { data } = this.props;
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
        </ScrollView>
      </RBSheet>
    );
  }
}

export default ImageModal
