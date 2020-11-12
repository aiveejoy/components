import { Color } from 'common';
export default {
  container: {
    minHeight: 150,
    width: '100%',
 
 
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
    elevation: 2,
  },
  promoContainer: {
    position: 'absolute',
    top: 10,
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
    fontSize: 13,
    fontWeight: '500'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  image: {
    marginTop:10,
    borderRadius:5,
    width: '100%',
    height: 100,
  },
  distanceView: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: '17%',
    paddingVertical: 5,
    backgroundColor: Color.white,
    borderRadius: 5,
  },
  distanceText: {
    textAlign: 'center',
    fontWeight: '600'
  },
  details: {
   
   
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  newLeft:{
    paddingTop:50,
    width:'10%',
    flexDirection:'row',
  },
  leftSide: {
    paddingTop:50,
    width: '50%',
    paddingLeft:35,
    marginTop:-9,
    flexDirection: 'column'
  },
  rightSide: {
    padding:10,
    width: '40%',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  title: {
    color: Color.primary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20
  },
  tags: {
    color: Color.darkGray,
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 20
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
    fontWeight: '600'
  },
  totalRatings: {
    color: Color.darkGray,
    marginTop: 3,
    fontSize: 10
  }
}