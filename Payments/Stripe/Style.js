import { StyleSheet } from 'react-native';
import Color from 'common/Color';
import { BasicStyles } from 'common';

const styles = StyleSheet.create({
  Button: {
    borderRadius: 50,
    borderColor: Color.gray,
    borderWidth: 0.25,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    height: 50,
    backgroundColor: 'white'
  }
});

export default styles;
