import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Routes } from 'common';
import { faEllipsisH, faPlus, faEnvelope, faEye } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'components';
import Style from 'components/Support/Style';
import Api from 'services/api/index.js';
import Color from 'common/Color';
import Pagination from 'components/Pagination/Dynamic.js';
import Picker from '@react-native-community/picker';

class Support extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      limit: 5,
      status: 'pending',
      active: 0,
      menu: [{title: 'PENDING',},{title: 'OPEN',},{title: 'CLOSED',},],
      isLoading: false,
      user: null
    };
  }

  componentDidMount() {
    this.setState({user: this.props.state.user})
    this.retrieve();
  }

  retrieve() {
    let parameter = {
      condition: [{
        value: this.state.status,
        column: 'status',
        clause: '='
      }]
    };
    this.setState({isLoading: true})
    Api.request(Routes.ticketsRetrieve, parameter, tickets => {
      this.setState({isLoading: false})
      if (tickets.data.length != 0) {
        this.dataHandler(tickets.data)
      } else {
        this.setState({data : null})
      }
    })
  }
  
  dataHandler = value => {
    this.setState({data: value})
  }

  redirect = () => {
    const { user } = this.props.state
    this.props.navigation.push("supportStack", { user })
  }

  change = (value) => {
    this.setState({status: value.title.toLocaleLowerCase()});
    this.setState({active: this.state.menu.indexOf(value)});
    let parameter = {
      condition: [{
        value: value.title.toLowerCase(),
        column: 'status',
        clause: '='
      }]
    };
    this.setState({isLoading: true})
    Api.request(Routes.ticketsRetrieve, parameter, tickets => {
      this.setState({isLoading: false})
      if (tickets.data.length != 0) {
        this.dataHandler(tickets.data)
      } else {
        this.setState({data : null})
      }
    })
  }

  findColor(array, value) {
    let type = array.find(array => array.type == value );
    let color = type.color
    return color
  }

  update = () => {
    this.props.navigation.push('updateTicketStack');
  }

  render() {
    let div;
    const types = [{type: 'bug', color: Color.danger}, {type: 'invalid', color: Color.warning}, {type: 'question', color: Color.info}, {type: 'help wanted', color: Color.secondary}, {type: 'enhancement', color: Color.gray}, {type: 'duplicate', color: Color.darkGray}]
    if (this.state.data != null) {
      div = <View>
      <View>
        {
          this.state.data.map((u, i) => {
            return (
                <View
                  style={Style.Card}
                  key={i}
                >
                  <TouchableOpacity 
                    onPress={() => {
                      this.props.navigation.push('updateTicketStack', {id: u.id});
                    }}>
                  <View style={{alignSelf: 'flex-start', padding: 5, borderRadius: 15, backgroundColor: this.findColor(types, u.type.toLowerCase())}}><Text style={{color: '#ffffff', fontSize:10}}>{u.type}</Text></View>
                  <Text style={Style.TextCard}>{u.content}</Text>
                  <Text style={Style.TextCard, {fontSize:11}} >{u.assigned_to ? 'Assigned to '+ u.assigned_to : 'Not assigned'}</Text>
                  <View style={{flexDirection: 'row-reverse'}}>
                  <TouchableOpacity 
                    onPress={() => {
                      this.props.navigation.push('messagesStack', {user: this.state.user});
                    }}>
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      style={{
                        color: Color.secondary, marginRight: 5
                      }}
                      size={20}
                    />
                  </TouchableOpacity>
                  </View>
                  </TouchableOpacity>
                </View>
            );
          })
        }
      </View>
      </View>
    } else {
      div = <View style={Style.Title}>
      <Text style={Style.Center}>No tickets yet.</Text>
    </View>
    }
    return (
      <View style={Style.View}>
      <View>
        <Pagination
        menu={this.state.menu}
        activeIndex={this.state.active}
        onChange={index => this.change(this.state.menu[index])}
      />
      </View>
      <ScrollView>{div}</ScrollView>
      {this.state.isLoading ? <Spinner mode="overlay"/> : null }
      <TouchableOpacity 
          style={[Style.floatingButton, {width: 70, height: 70, borderRadius: 35}]}
          onPress={() => {
            this.props.navigation.push('createTicketStack', {user: this.state.user});
          }}>
          <FontAwesomeIcon
            icon={faPlus}
            style={{
              color: Color.white
            }}
            size={16}
          />
        </TouchableOpacity>
      </View>
    )
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(mapStateToProps)(Support);
