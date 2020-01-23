import { Color } from 'common';
export default {
  container: {
    flex: 1
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 320,
    height: 320,
  },
  title: {
    fontSize: 22,
    color: Color.primary,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 25,
    fontWeight: 'bold'
  },
  text: {
    color: Color.primaryDark,
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15
  },
  imageSize: {
    height: 100,
    width: 100
  },
  iconSize: 100,
  imageHolder: {
    justifyContent: 'center',
    alignItems: 'center'
  }
};