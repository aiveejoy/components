import React, {Component} from 'react';
import Style from './Style';
import {Text, View} from 'react-native';
import { Color} from 'common';
import { connect } from 'react-redux';
class SystemNotification extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const { systemNotification, user } = this.props.state;
    console.log('systemNotification', systemNotification);
    return (
      <View>
        {
          systemNotification != null && (
            <View style={[Style.MainContainer, {
              backgroundColor: Color.danger,
              paddingLeft: 20,
              paddingRight: 20,
              borderRadius: 5,
              marginBottom: 10,
            }]}>
              <Text style={{
                fontWeight: 'bold',
                color: Color.white,
                paddingTop: 10
              }}>
                  {systemNotification.title}
              </Text>
              <Text style={{
                color: Color.white,
                paddingTop: 5,
                paddingBottom: 10
              }}>
                Hi {user.username}! {systemNotification.description}
              </Text>
            </View>
          )
        }
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });
export default connect(
  mapStateToProps
)(SystemNotification);
