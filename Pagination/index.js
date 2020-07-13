import React, {Component} from 'react';
import styles from './Style';
import {Text, View, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import { Pager, PagerProvider } from '@crowdlinker/react-native-pager';
import {BasicStyles, Color, Helper} from 'common';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    };
  }
  onChange(e){
    console.log('on change', e)
  }

  render(){
    const { activeIndex } = this.state;
    return (
      <View>
        <View style={{ height: 50, marginBottom: 10, backgroundColor: Color.primay }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {
              Helper.pagerMenu.map((item, index) => (
                <TouchableOpacity
                  onPress={() => this.setState({
                    activeIndex: index
                  })}
                  style={{
                    width: width / 3,
                    borderBottomWidth: 2,
                    borderBottomColor: activeIndex == index ? Color.primary : Color.lightGray,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <Text style={{
                    fontSize: 11,
                    color: activeIndex == index ? Color.primary : Color.black
                  }}>{item.title}</Text>
                </TouchableOpacity>
              ))
            }
          </ScrollView>
        </View>
        <PagerProvider activeIndex={activeIndex}>
          <Pager>
            <View style={styles.MainContainer}>
              <Text>Featured</Text>
            </View>
            <View style={styles.MainContainer}>
              <Text>Categories</Text>
            </View>
            <View style={styles.MainContainer}>
              <Text>Shops</Text>
            </View>
          </Pager>
        </PagerProvider>
      </View>
    );
  }
}

export default Pagination;