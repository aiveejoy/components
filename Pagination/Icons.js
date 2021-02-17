import React, {Component} from 'react';
import styles from './Style';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {BasicStyles, Color, Helper} from 'common';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
class GradientBorder extends Component {
  constructor(props) {
    super(props);
  }
 

  render() {
    const pages = this.props.pages;
    return (
      <View>
        <View
          style={{
            height: 100,
            marginBottom: 10,
            backgroundColor: Color.white
        }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {this.props.pages != null && pages.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => this.props.onChange(index)}
                    style={{
                      width: width / this.props.pages.length,
                      borderBottomWidth: 2,
                      borderBottomColor:
                        this.props.activeIndex == index
                          ? Color.primary
                          : Color.white,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: this.props.activeIndex == index ? Color.primary : Color.secondary,
                        marginBottom: 20
                      }}>
                        <FontAwesomeIcon
                          icon={item.icon}
                          color={Color.white}
                          size={30}
                          />
                      </View>
                  </TouchableOpacity>
                ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default GradientBorder;
