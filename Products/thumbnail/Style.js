import { Color, BasicStyles } from 'common';

export default {
  container: {
    minHeight:100,
    width: '80%',
    marginVertical: 10,
    // box-shadow
    backgroundColor: Color.white,
    borderRadius: 12,
    borderColor: '#FFFFFF',
    borderWidth:1,
    alignItems:'center',
    ...BasicStyles.standardShadow
  },

//=======================PADDOCK CONTAINERS==================//
  cardContainer: {
    minHeight: 60,
    width: '100%',
    marginTop: 15,
    // box-shadow
    backgroundColor: Color.white,
    borderRadius: BasicStyles.standardBorderRadius,
    borderColor: '#FFFFFF',
    borderWidth:1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
    alignItems:'center',
    flexDirection:'row',
    paddingTop: 15,
    paddingBottom: 15
  },

  paddockInfo:{
    flexDirection:'column',
    width:'60%',
  },

  paddockDate:{
    width: '30%',
    minHeight: 40,
    borderRadius: 5,
    backgroundColor: Color.white,
    borderColor: Color.lightGray,
    borderWidth: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
    alignItems: 'center',
  },

  batchVolume:{
    width:'20%',
    minHeight:40,
    borderRadius: BasicStyles.standardBorderRadius,
    marginLeft:25,
    backgroundColor:Color.white,
    borderColor:'#C0C0C0',
    borderWidth:1.5,
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
  },

  stocks: {
    height: 40,
    width: '30%',
    justifyContent: 'flex-end'
  },
  stocksBox: {
    height: 30,
    width: 30,
    borderRadius: BasicStyles.standardBorderRadius,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stocksText: {
    color: Color.white,
    fontSize: 12,
  },

//=======================PADDOCK CONTAINERS==================//

//=======================IMAGES==================//
imageContainer:{
     marginTop:10,
     width:'50%',
     borderRadius: BasicStyles.standardBorderRadius,
     marginBottom:15,
     alignItems:'center',
 },
 image:{   
  width: '100%',
  height: 100,
  padding:50,
  borderRadius:5,
  resizeMode:'contain'
 },

 //=======================IMAGES==================//


//=======================TEXT==================//
 textContainer:{
    width:'80%',
    flexShrink:1,
    marginBottom:15,
 },
 text:{
   fontFamily:'Roboto',
   textAlign:'center',
   fontWeight:"bold"
 },
 //=======================TEXT==================//


 //======================PRODUCT INFO AND PDF==================//
 productInfoContainer:{
  width: '80%',
  minHeight:350,
  marginVertical: 10,
  // box-shadow
  backgroundColor: Color.white,
  borderRadius: BasicStyles.standardBorderRadius,
  borderColor: '#FFFFFF',
  borderWidth:1,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.23,
  shadowRadius: 2.62,
  elevation: 2,
  flexDirection:'column',
  paddingTop: 15,
  paddingBottom: 15
 },
 pdfContainer:{
  width: '80%',
  minHeight:60,
  marginVertical: 10,
  // box-shadow
  backgroundColor: Color.white,
  borderRadius: 12,
  borderColor: '#FFFFFF',
  borderWidth:1,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.23,
  shadowRadius: 2.62,
  elevation: 2,
  alignItems:'center',
  
 },
 cardInfo:{
    flexDirection:'row',
    justifyContent:'flex-start',
    width:'100%',
    margin:15,
 }
//======================PRODUCT INFO AND PDF==================//

}