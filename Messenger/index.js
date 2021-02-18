import React, { Component } from 'react';
import Style from './Style.js';
import { View, TouchableHighlight, Text, ScrollView, FlatList, Platform} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, Empty, UserImage } from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import CommonRequest from 'services/CommonRequest.js';
import { Dimensions } from 'react-native';
const height = Math.round(Dimensions.get('window').height);
class Groups extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      selected: null,
      data: null
    }
  }

  componentDidMount(){
    console.log('mmmmmmmmmmesages modulesssssssadfasdfasdfasdfasdfasdfsssssssssss')
    const { user } = this.props.state;
    if(user != null){
      this.retrieve();
    }
  }

  retrieve = () => {
    const { user } = this.props.state;
    if(user == null){
      return
    }
    this.setState({isLoading: true});
    CommonRequest.retrieveMessengerGroups(user, response => {
      console.log('^^^^^^^^^^^^^^^^^^^^^^^^^', response.data)
      this.setState({isLoading: false, data: response.data});
      const { setMessenger } = this.props;
      const { messenger } = this.props.state;
      if(response.data !== null){
        var counter = 0
        for (var i = 0; i < response.data.length; i++) {
          let item = response.data[i]
          counter += parseInt(item.total_unread_messages)
        }
        setMessenger(counter, messenger.messages)
      }
    })
  }

  updateLastMessageStatus = (item)  => {
    if(parseInt(item.total_unread_messages) > 0){
      let parameter = {
        messenger_group_id: item.id
      }
      CommonRequest.updateMessageStatus(parameter, response => {
        this.state.data.map((dataItem) => {
          if(item.id === dataItem.id){
            const { messenger } = this.props.state;
            const { setMessenger } = this.props;
            let unread = messenger.unread - parseInt(item.total_unread_messages)
            setMessenger(unread, messenger.messages)
            item.total_unread_messages = 0;
            return item;
          }
          return dataItem;
        })
      })
    }
  }

  viewMessages = (item) => {
    const { setMessengerGroup } = this.props;
    console.log('message group', item);
    this.updateLastMessageStatus(item)
    setMessengerGroup(item);
    setTimeout(() => {
      this.props.navigation.navigate('messagesStack');
    }, 500)
  }

  _card = (item) => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {this.viewMessages(item)}}
          underlayColor={Color.lightGray}
          >
          <View>
            <View style={{flexDirection: 'row', marginTop: 5, paddingLeft: 10, paddingRight: 10}}>
              <UserImage user={item.title}/>
              <View style={{
                paddingLeft: 10,
                width: '30%',
                flexDirection: 'row'
              }}>
                <Text style={{
                  color: Color.primary,
                  lineHeight: 30,
                }}>{item.title.username.length > 10 ? item.title.username.substr(0, 10) + '...' : item.title.username}</Text>
                {
                  parseInt(item.total_unread_messages) > 0 && Platform.OS == 'android' && (
                    <Text style={{
                      color: Color.white,
                      lineHeight: 20,
                      paddingLeft: 5,
                      paddingRight: 5,
                      backgroundColor: Color.danger,
                      borderRadius: 5,
                      marginTop: 5,
                      marginBottom: 5,
                      marginLeft: 10
                    }}>{item.total_unread_messages}</Text>
                  )
                }
                {
                  parseInt(item.total_unread_messages) > 0 && Platform.OS == 'ios' && (
                    <View style={{
                      backgroundColor: Color.danger,
                      borderRadius: 5,
                      marginTop: 5,
                      marginBottom: 5,
                      marginLeft: 10
                    }}>
                      <Text style={{
                        color: Color.white,
                        lineHeight: 20,
                        paddingLeft: 5,
                        paddingRight: 5,
                      }}>{item.total_unread_messages}</Text>
                    </View>
                  )
                }
              </View>
              <Text style={{
                color: Color.primary,
                lineHeight: 30,
                paddingLeft: 10,
                fontWeight: 'bold',
                textAlign:'right',
                width: '60%'
              }}>
                {Currency.display((item.request.amount + item.peer.charge).toFixed(2), item.request.currency)}
              </Text>
            </View>
            <View style={{
              paddingLeft: 10,
              paddingRight: 10
            }}>
              <Text style={[Style.dateTextLeft, {
                color: item.request.status < 2 ? Color.danger : Color.normalGray,
                paddingBottom: 0
              }]}>{item.request.status < 2 ? 'Transaction is on going' : 'Transaction completed'}</Text>
            </View>
            <View style={{
              marginBottom: 5,
              paddingLeft: 10,
              paddingRight: 10,
              flexDirection: 'row'
            }}>
              <Text style={[Style.dateTextLeft, {
                width: '40%',
                paddingTop: 2
              }]}>{item.created_at_human}</Text>
              <Text style={[Style.dateTextLeft, {
                width: '60%',
                textAlign: 'right',
                paddingTop: 2
              }]}>{Helper.showRequestType(item.request.type)} - {item.thread.substring(24, 32)}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
  
  FlatListItemSeparator = () => {
    return (
      <View style={Style.Separator}/>
    );
  };

  _flatList = () => {
    const { data, selected } = this.state;
    const { user } = this.props.state;
    return (
      <View style={{
        width: '100%'
      }}>
        {
          data != null && user != null && (
            <FlatList
              data={data}
              extraData={selected}
              ItemSeparatorComponent={this.FlatListItemSeparator}
              style={{
                marginBottom: 50
              }}
              renderItem={({ item, index }) => (
                <View>
                  {this._card(item)}
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )
        }
      </View>
    );
  }

  render() {
    const { isLoading, data } = this.state;
    return (
      <ScrollView 
        style={Style.ScrollViewGroup}
        onScroll={(event) => {
          if(event.nativeEvent.contentOffset.y <= 0) {
            if(this.state.isLoading == false){
              this.retrieve()
            }
          }
        }}
        >
        <View stle={{
          flexDirection: 'row',
          width: '100%',
          minHeight: height
        }}>
          {this._flatList()}
        </View>
        {data == null && (<Empty refresh={true} onRefresh={() => this.retrieve()}/>)}
        {isLoading ? <Spinner mode="overlay"/> : null }
      </ScrollView>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setMessengerGroup: (messengerGroup) => dispatch(actions.setMessengerGroup(messengerGroup)),
    setMessenger: (unread, messages) => dispatch(actions.setMessenger(unread, messages)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Groups);
