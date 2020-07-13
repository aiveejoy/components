import { Color } from 'common';
import { noAuto } from '@fortawesome/fontawesome-svg-core';
export default {
  container: {
    position: 'relative',
    minHeight: 150,
    width: 170,
    marginVertical: 10,
    marginRight: 10,
    marginLeft: 5,
 
    // box-shadow
    backgroundColor: Color.white,
    borderRadius: 5,
    borderColor: '#ddd',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  promoContainer: {
    position: 'absolute',
    top: 5,
    left: 0,
    zIndex: 10,
  },
  promoView: {
    alignSelf: 'flex-start',
    backgroundColor: Color.primary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginBottom: 4,
  },
  promoText: {
    color: Color.white,
    fontSize: 12,
    fontWeight: '400'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  image: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: '100%',
    height: 100
  },
  details: {
    padding: 10,
  },
  title: {
    color: Color.primary,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  ratings: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starRatings: {
    color: '#FFD801',
  },
  textRatings: {
    marginLeft: 3,
    fontSize: 12
  },
  totalRatings: {
    color: Color.darkGray,
    marginLeft: 3,
    fontSize: 10
  },
  distance: {
    fontSize: 12
  }
}