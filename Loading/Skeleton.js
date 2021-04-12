import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

class Skeleton extends Component {
  constructor(props){
    super(props);
  }

  renderSkeleton = () => {
    const { size } = this.props;
    let content = []

    for (var i = 0; i < size; i++) {
      content.push(
        <View style={{
          width: '100%'
        }}>
          <View style={{
              flexDirection: "row",
              alignItems: "center",
              width: '100%',
            }}>
              <View style={{
                width: '10%'
              }}>
                <View style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15
                }} />
              </View>
              
              <View style={{
                width: '90%'
              }}>
                <View style={{
                  width: '100%',
                  height: 20,
                  borderRadius: 4
                }} />
                <View style={{
                  width: '100%',
                  height: 20,
                  borderRadius: 4,
                  marginTop: 10
                }} />
              </View>
            </View>
            <View style={{
              alignItems: "center",
              width: '100%',
            }}>
              <View style={{
                  width: '100%',
                  height: 20,
                  borderRadius: 4,
                  marginTop: 10
                }} />
            </View>
        </View>
      )
    }

    return(
      <SkeletonPlaceholder>
          <View style={{
            paddingLeft: 20,
            paddingRight: 20,
            width: '100%',
            marginTop: 20
          }}>
          {content}
          </View>
      </SkeletonPlaceholder>
    )
  }

  render() {
    const { size } =  this.props;
    let content = []
    for (var i = 0; i < size; i++) {
      content.push(
        <View key={i}>
          {this.renderSkeleton()}
        </View>
      )
    }

    return (
      <View>
        {this.renderSkeleton()}
      </View>
    );
  }
}


export default Skeleton;