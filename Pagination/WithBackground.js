import React, {Component} from 'react';
import styles from './Style';
import {Text, View, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import {BasicStyles, Color, Helper} from 'common';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class PaginationWithBackground extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    const { activeBackground, inactiveBackground, activeTextColor, inActiveTextColor, activeBorder, inActiveBorder } = this.props
    return (
      <View>
        <View style={{ height: 50, marginBottom: 10, backgroundColor: Color.white }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {
              this.props.menu.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => this.props.onChange(index)}
                  style={[
                    {
                      width: width / this.props.menu.length,
                      borderBottomWidth: 2,
                      borderBottomColor: this.props.activeIndex == index ? activeBorder ? activeBorder : Color.primary : inActiveBorder ? inActiveBorder : Color.lightGray,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: this.props.activeIndex == index ? activeBackground ? activeBackground : Color.secondary : inactiveBackground ? inactiveBackground : Color.white
                    }
                  ]}>
                  <Text style={{
                    fontSize: 11,
                    color: this.props.activeIndex == index ? activeTextColor ? activeTextColor: Color.primary : inActiveTextColor ? inActiveTextColor : Color.black,
                    fontWeight: this.props.activeIndex == index ? 'bold' : 'normal'
                  }}>{item.title}</Text>
                </TouchableOpacity>
              ))
            }
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default PaginationWithBackground;