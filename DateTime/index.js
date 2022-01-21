import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Platform, TextInput} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faThList } from '@fortawesome/free-solid-svg-icons';
import { Color, BasicStyles } from 'common';
import Currency from 'services/Currency.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dimensions } from 'react-native';
import { combineReducers } from 'redux';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class DateTime extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      showDatePicker: false, // android and ios
      dateLabel: null,
      timeLabel: null,
      androidDateTime: 'date',
      date: null,
      time: null
    }
  }

  dateHandler = (date) => {
    if(this.props.type == 'date'){
      this.setState({
        showDatePicker: false,
        date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        dateLabel: Currency.getMonth(date.getMonth()) + ' ' + date.getDate() + ', ' + date.getFullYear()
      });
      this.props.onFinish({
        date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        time: null
      })  
    }else if(this.props.type == 'datetime'){
      if(this.state.androidDateTime == 'date'){
        this.setState({
          showDatePicker: false,
          date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
          dateLabel: Currency.getMonth(date.getMonth()) + ' ' + date.getDate() + ', ' + date.getFullYear(),
          androidDateTime: 'time'
        });
        setTimeout(() => {
          this.setState({
            showDatePicker: true
          })
        }, 500)
      }else{
        this.setState({
          showDatePicker: false,
          time: date.getHours() + ':' + date.getMinutes(),
          timeLabel: (date.getHours() % 12 || 12) + ':' + date.getMinutes() + ' ' + (date.getHours() > 12 ? 'PM' : 'AM'),
          androidDateTime: 'time'
        });
        this.props.onFinish({
          date: this.state.date,
          time: this.state.time
        })
      }
    }else if(this.props.type == 'time'){
      this.setState({
        showDatePicker: false,
        time: date.getHours() + ':' + date.getMinutes(),
        timeLabel: (date.getHours() % 12 || 12) + ':' + date.getMinutes() + ' ' + (date.getHours() > 12 ? 'PM' : 'AM')
      });
      this.props.onFinish({
        date: null,
        time: this.state.time
      })
    }
  }

  setDate = (event, date) => {
    if(event.type == "set"){
      this.dateHandler(date)  
    }else{
      this.state.showDatePicker = false
    }
  }

  _showComponent = () => {
    this.setState({
      showDatePicker: true
    })
  }

  _datePickerIOS = () => {
    return (
      <View>
        <DateTimePickerModal value={new Date()}
          isVisible={this.state.showDatePicker}
          mode={this.props.type}
          display="default"
          date={new Date()}
          minimumDate={this.props.minimumDate}
          maximumDate={this.props.maximumDate}
          onCancel={() => this.setState({showDatePicker: false})}
          onConfirm={this.dateHandler} 
          onChange={this.dateHandler} />
      </View>
    );
  }

  _datePickerAndroid = (type) => {
    return (
      <View>
        <DateTimePicker value={new Date()}
          mode={type}
          display="default"
          date={new Date()}
          minimumDate={this.props.minimumDate}
          maximumDate={this.props.maximumDate}
          onCancel={() => this.setState({showDatePicker: false})}
          onConfirm={this.setDate} 
          onChange={this.setDate} />
      </View>
    );
  }

  _dateTimePickerAndroid = () => {
    const { androidDateTime } = this.state;
    return (
      <View>
        {
          androidDateTime == 'date' && (this._datePickerAndroid('date'))
        }
        {
          androidDateTime == 'time' && (this._datePickerAndroid('time'))
        }
      </View>
    );
  }

  _date = () => {
    const { showDatePicker } = this.state;
    return (
      <View>
        {
          (showDatePicker && Platform.OS == 'ios') && (this._datePickerIOS())
        }
        {
          (showDatePicker && Platform.OS == 'android') && (this._datePickerAndroid('type'))
        }
      </View>
    );
  }

  _dateTime = () => {
    const { showDatePicker } = this.state;
    return (
      <View>
        {
          (showDatePicker && Platform.OS == 'ios') && (this._datePickerIOS())
        }
        {
          (showDatePicker && Platform.OS == 'android') && (this._dateTimePickerAndroid())
        }
      </View>
    );
  }

  _time = () => {
    const { showDatePicker } = this.state;
    return (
      <View>
        {
          (showDatePicker && Platform.OS == 'ios') && (this._datePickerIOS())
        }
        {
          (showDatePicker && Platform.OS == 'android') && (this._datePickerAndroid('time'))
        }
      </View>
    );
  }

  render () {
    const { type } = this.props;
    const { dateLabel, timeLabel } = this.state; 
    return (
      <View style={{
        ...this.props.style
      }}>
        <TouchableHighlight style={{
            height: this.props.height ? this.props.height : 50,
            backgroundColor: Color.containerBackground,
            width: '100%',
            paddingLeft: this.props.paddingLeft ? this.props.paddingLeft : 10,
            justifyContent: 'center',
            borderRadius: BasicStyles.inputBorderRadius,
            borderColor: this.props.borderColor ? this.props.borderColor : Color.lightGray,
            borderBottomColor: this.props.borderBottomColor ? this.props.borderBottomColor : Color.lightGray,
            borderWidth: 1,
            marginTop: 20,
            marginBottom: 20
          }}
          onPress={() => {this._showComponent()}}
          underlayColor={Color.white}
            >
            <View style={{
              flexDirection: 'row',
              width: '100%'
            }}>
              {
                (dateLabel == null && timeLabel == null) && (
                  <Text style={{
                      color: Color.gray,
                      width: this.props.icon ? '100%' : '90%',
                      ...this.props.textStyle
                    }}>
                      {this.props.placeholder ? this.props.placeholder : 'Select Date'}
                  </Text>
                )
              }
              {
                (dateLabel != null || timeLabel != null)  && (
                  <Text style={{
                      color: Color.gray,
                      width: this.props.icon ? '100%' : '90%',
                      ...this.props.textStyle
                    }}>
                      {(dateLabel != null && timeLabel == null) && (dateLabel)}
                      {(timeLabel != null && dateLabel == null) && (timeLabel)}
                      {(timeLabel != null && dateLabel != null) && (dateLabel + ' ' + timeLabel)}
                  </Text>
                )
              }
              {
                this.props.icon && (
                  <FontAwesomeIcon 
                    icon={faCalendar}
                    size={20}
                    style={[{
                      color: Color.gray,
                      width: '10%'
                    }, this.props.iconStyle]}
                   />
                )
              }
              
            </View>
        </TouchableHighlight>
        {type == 'date' && (this._date())}
        {type == 'datetime' && (this._dateTime())}
        {type == 'time' && (this._time())}
      </View>
    );
  }
}

export default DateTime;