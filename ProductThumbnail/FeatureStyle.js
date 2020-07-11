import { Color } from 'common';
const imageBorderRadius = 5
export default {
  container: {
    height: '100%',
    width: 135,
    marginRight: 15,
    overflow: 'hidden',
    borderRadius: imageBorderRadius,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  image: {
    borderRadius: imageBorderRadius,
    width: '100%',
    height: '100%',
  },
  promoWrapper: {
    backgroundColor: Color.primary,
    position: 'absolute',
    bottom: -50,
    right: -5,
    height: 120,
    width: 120, 
    borderRadius: 60
  },
  promoView: {
    position: 'absolute',
    width: 80,
    top: 28,
    left: 20
  },
  promoText: {
    textAlign: 'center',
    color: Color.white,
    fontWeight: '700',
    fontSize: 14
  }
}