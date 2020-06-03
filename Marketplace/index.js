import React, { Component } from 'react';
import Style from './Style.js';
import { View, Text, ScrollView, FlatList, TouchableHighlight} from 'react-native';
import {NavigationActions} from 'react-navigation';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner } from 'components';
import { connect } from 'react-redux';
import { Empty } from 'components';
import Api from 'services/api/index.js';
import { Dimensions } from 'react-native';
import Thumbnail from './Thumbnail.js';

const height = Math.round(Dimensions.get('window').height);
class Marketplace extends Component{
  constructor(props){
    super(props);
    this.state = {
      selected: null,
      isLoading: false,
      data: null
    }
  }

  componentDidMount(){
    const { user } = this.props.state;
    if(user != null){
      this.retrieve();
    }
  }

  FlatListItemSeparator = () => {
    return (
      <View style={BasicStyles.Separator}/>
    );
  };

  setProduct = (item) => {
    this.retrieveProduct(item.id);
  }

  retrieveProduct = (productId) => {
    const { user } = this.props.state;
    if(user == null || productId == null){
      return
    }
    let parameter = {
      account_id: user.id,
      inventory_type: Helper.ecommerce.inventoryType,
      condition: [{
        value: productId,
        column: 'id',
        clause: '='
      }]
    }
    this.setState({isLoading: true})
    Api.request(Routes.productsRetrieve, parameter, response => {
      this.setState({isLoading: false})
      const { setProduct } = this.props;
      if(response.data.length > 0){
        setProduct(response.data[0])
      }else{
        setProduct(null)
      }
      const navigateAction = NavigationActions.navigate({
        routeName: 'Product'
      });
      this.props.navigation.dispatch(navigateAction);
    })
  }

  retrieve = () => {
    const { user } = this.props.state;
    if(user == null){
      return
    }
    let parameter = {
      account_id: user.id,
      inventory_type: Helper.ecommerce.inventoryType,
      condition: [{
        value: 'published',
        column: 'status',
        clause: '='
      }],
      sort: {
        created_at: 'desc'
      }
    }
    this.setState({isLoading: true})
    Api.request(Routes.productsRetrieveBasic, parameter, response => {
      this.setState({isLoading: false})
      this.setState({
        data: response.data
      })
    })
  }

  render() {
    const { selected, isLoading, data } = this.state;
    return (
      <View style={Style.MainContainer}>
        {isLoading ? <Spinner mode="overlay"/> : null }
        <ScrollView
          style={Style.ScrollView}
          onScroll={(event) => {
            if(event.nativeEvent.contentOffset.y <= 0) {
              if(this.state.isLoading == false){
                this.retrieve()
              }
            }
          }}
          >
          {(data == null && isLoading == false) && (<Empty refresh={true} onRefresh={() => this.retrieve()}/>)}
          <View style={[Style.MainContainer, {
            minHeight: height
          }]}>
            {
              (data && isLoading == false) && (
                <FlatList
                  data={data}
                  extraData={selected}
                  ItemSeparatorComponent={this.FlatListItemSeparator}
                  renderItem={({ item, index }) => (
                    <View>
                      <TouchableHighlight
                        onPress={() => {
                          this.setProduct(item)
                        }}
                        underlayColor={Color.gray}
                        >
                        <View style={[Style.TextContainer, {
                          backgroundColor: Color.white
                        }]}>
                        {
                          item != null && (
                            <Thumbnail 
                              item={item}
                            />
                          )
                        }
                        </View>
                      </TouchableHighlight>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              )
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setSelectedProductId: (productId) => dispatch(actions.setSelectedProductId(productId)),
    setProduct: (product) => dispatch(actions.setProduct(product))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Marketplace);