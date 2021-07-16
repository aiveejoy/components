import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, TextInput, BackHandler, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Routes } from 'common';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import EmptyMessage from './EmptyMessage/index';
import Style from 'components/Support/Style';
import Api from 'services/api/index.js';
import Color from 'common/Color';
import Skeleton from 'components/Loading/Skeleton';
import Footer from 'modules/generic/Footer'
import _ from 'lodash';

const height = Math.round(Dimensions.get('window').height);

class Support extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      limit: 5,
      status: 'pending',
      active: 0,
      menu: [{ title: 'PENDING', }, { title: 'OPEN', }, { title: 'CLOSED' }],
      isLoading: false,
      user: null,
      limit: 7,
      offset: 0
    };
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    return true
  };

  componentDidMount() {
    this.setState({ user: this.props.state.user })
    this.retrieve(false);
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }

  retrieve(flag) {
    const { user } = this.props.state;
    if(user == null){
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        column: 'account_id',
        clause: '='
      }],
      sort: {
        created_at: 'desc'
      },
      limit: this.state.limit,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset
    };
    this.setState({ isLoading: true })
    Api.request(Routes.ticketsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({
          data: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id'),
          offset: flag == false ? 1 : (this.state.offset + 1)
        })
      } else {
        this.setState({
          data: flag == false ? [] : this.state.data,
          offset: flag == false ? 0 : this.state.offset
        })
      }
    })
  }

  dataHandler = value => {
    this.setState({ data: value })
  }

  redirect = () => {
    const { user } = this.props.state
    this.props.navigation.push("supportStack", { user })
  }

  change = (value) => {
    this.setState({ status: value.title.toLocaleLowerCase() });
    this.setState({ active: this.state.menu.indexOf(value) });
    let parameter = {
      condition: [{
        value: value.title.toLowerCase(),
        column: 'status',
        clause: '='
      }]
    };
    this.setState({ isLoading: true })
    Api.request(Routes.ticketsRetrieve, parameter, tickets => {
      this.setState({ isLoading: false })
      if (tickets.data.length != 0) {
        this.dataHandler(tickets.data)
      } else {
        this.setState({ data: [] })
      }
    })
  }

  findColor(array, value) {
    let type = array.find(array => array.type == value);
    let color = type?.color
    return color
  }

  update = () => {
    this.props.navigation.push('updateTicketStack');
  }

  render() {
    let div;
    const { theme } = this.props.state;
    const types = [{ type: 'verification issue', color: Color.danger }, { type: 'account issue', color: Color.warning }, { type: 'transaction issue', color: Color.info }, { type: 'others', color: Color.secondary }]
    return (
      <View style={Style.View}>
        {/* <View>
        <Pagination
        menu={this.state.menu}
        activeIndex={this.state.active}
        onChange={index => this.change(this.state.menu[index])}
      />
      </View> */}
        {this.state.data.length > 0 && (
          <ScrollView
            onScroll={(event) => {
              let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
              let totalHeight = event.nativeEvent.contentSize.height
              if (event.nativeEvent.contentOffset.y <= 0) {
                if (this.state.loading == false) {
                  // this.retrieve(false)
                }
              }
              if (scrollingHeight >= (totalHeight)) {
                if (this.state.loading == false) {
                  this.retrieve(true)
                }
              }
            }}
          >
            <View style={{
              marginBottom: 50,
              paddingLeft: 20,
              paddingRight: 20
            }}>
              <Text style={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 20
              }}>My Tickets</Text>
              {
                this.state.data.map((u, i) => {
                  return (
                    <TouchableOpacity
                      style={{
                        marginBottom: 10
                      }}
                      onPress={() => {
                        this.props.navigation.navigate('updateTicketStack', { id: u.id });
                      }}>
                      <View style={{
                        padding: 10,
                        borderRadius: 10,
                        borderColor: Color.lightGray,
                        borderWidth: 1
                      }}>
                        <View style={{
                          alignSelf: 'flex-start',
                          padding: 5,
                          borderRadius: 15,
                          backgroundColor: this.findColor(types, u.type.toLowerCase())
                        }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 11
                            }}
                          >
                            {u.type}
                          </Text>
                        </View>
                        
                        <Text style={{
                          paddingTop: 10
                        }} numberOfLines={2}>{u.title}</Text>
                        <Text style={{
                          fontSize: 11,
                          paddingTop: 10
                        }}>{u.assigned_to ? 'Assigned to ' + u.assigned_to : 'Not assigned'}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              }
            </View>
          </ScrollView>
        )}
        {this.state.isLoading == false && this.state.data.length == 0 && (
          <View style={{
            height: height / 2,
            padding: 10
          }}>
            <EmptyMessage navigation={this.props.navigation} message={'No existing tickets'}/>
          </View>
        )}
        {this.state.isLoading && (<Skeleton size={3} template={'block'} height={50}/>)}
        <TouchableOpacity
          style={[Style.floatingButton, {
            backgroundColor: theme ? theme.secondary : Color.secondary,
            height: 60,
            width: 60,
            borderRadius: 30,
            bottom: 70
          }]}
          onPress={() => {
            this.props.navigation.push('createTicketStack', { user: this.state.user });
          }}>
          <FontAwesomeIcon
            icon={faPlus}
            style={{
              color: Color.white
            }}
            size={16}
          />
        </TouchableOpacity>
        <Footer
          {...this.props}
          selected={null}
          onSelect={(value) => {
            this.setState({
              page: value,
              activeIndex: value == 'summary' ? 0 : 1
            })
          }}
          from={'support'}
        />
      </View>
    )
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(mapStateToProps)(Support);
