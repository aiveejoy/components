import { Color } from 'common';
const borderRadius = 5
export default {
  container: {
    height: 200,
    width: '100%',
    backgroundColor: Color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius
  },
  heading: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700'
  },
  caption: {
    color: Color.white,
    fontSize: 12,
    fontWeight: '500'
  },
  image: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: '100%',
    height: 100,
    marginTop: 10
  }
}