import React, {Component} from 'react';
import{View,FlatList,Text, TouchableHighlight} from "react-native";
import Style from './Style';
import { connect } from 'react-redux';
import { Color } from 'common';
class CustomList extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected: null
    }
  }

  FlatListItemSeparator = () => {
    return (
      <View style={Style.Separator}/>
    );
  };

  select = (selectedItem, selectedIndex) => {
    const { updateProduct, selection, state } = this.props;
    selectedItem.selected = !selectedItem.selected;
    this.setState({selected: selectedItem});
    updateProduct(selectedItem);
    selection(selectedItem)
    this.setState({menu: state.selection.length > 0 ? true : false})
  }

  viewProductDetail = (product) => {
    const { productDetail } = this.props;
    productDetail(product);
    this.props.navigate('productStack');
  }

  render(){
    const { products } = this.props.state;
    const { selected } = this.state;
    return (
      <View style={Style.MainContainer}>
        <FlatList
          data={products}
          extraData={selected}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item, index }) => (
            <View style={Style.containerHolder}>
              <View style={Style.squareContainer}>
                <TouchableHighlight
                  style={item.selected ? Style.squareActive: Style.square}
                  onPress={() => this.select(item, index)}
                  underlayColor={Color.primary}
                  >
                    <Text></Text>
                </TouchableHighlight>
              </View>
              <View style={Style.titleContainer}>
                <TouchableHighlight
                  onPress={() => {this.viewProductDetail(item)}}
                  underlayColor={Color.gray}
                  style={Style.titleContainer}
                  >
                  <Text
                    style={item.link ? Style.titleLink : Style.titleUnLink}
                    >
                    {item.title}
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({state: state})

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    updateProduct: (product) => dispatch(actions.updateProduct(product)),
    removeProduct: (index) => dispatch(actions.removeProduct(index)),
    productDetail: (product) => dispatch(actions.productDetail(product)),
    selection: (product) => dispatch(actions.selection(product))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomList);