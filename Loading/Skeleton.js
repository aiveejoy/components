import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

class Skeleton extends Component {
  constructor(props){
    super(props);
  }

  blockTemplate(i){
    const { size } = this.props;
    return(
      <View style={{
          width: '100%'
        }}
        key={i}>

        <View style={{
            width: '100%',
            alignItems: "center",
            flexDirection: "row",
          }}>
            <View style={{
              width: '100%'
            }}>
              <View style={{
                width: '100%',
                height: this.props.height ? this.props.height : 75,
                borderRadius: 15,
                marginBottom: size > 1 ? 20 : 0
              }} />
            </View>
          </View>
      </View>
    )
  }

  standard(i){
    return(
      <View style={{
          width: '100%'
        }}
        key={i}>
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
  renderSkeleton = () => {
    const { size } = this.props;
    let content = []

    for (var i = 0; i < size; i++) {
      if(this.props.template){
        switch(this.props.template){
          case 'block':
            content.push(
              <View>
                {
                  this.blockTemplate(i)
                }
              </View>
            )
            break
          default:
            content.push(
              <View>
                {
                  this.standard(i)
                }
              </View>
            )
            break
        }
      }else{
        content.push(
          <View>
            {
              this.standard(i)
            }
          </View>
        )
      }
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