import { Color } from 'common';
export default {
  container: {
    flexDirection: 'row',
    width: '100%'
  },
  imageContainer: {
  },
  image: {
    borderRadius: 10,
    height: 100,
    width: 100
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  upper: {
    paddingTop: 5,
    paddingLeft: 10
  },
  lower: {
    paddingBottom: 5,
    paddingLeft: 10
  },
  title: {
    fontWeight: '500'
  },
  tagsContainer: {
    flexDirection: 'row'
  },
  tags: {
    fontSize: 12,
    fontWeight: '300'
  },
  ratings: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  starRatings: {
    color: Color.goldenYellow
  },
  avgRating: {
    marginHorizontal: 3,
    fontWeight: '300'
  },
  totalReviews: {
    color: Color.normalGray,
    fontSize: 12
  },
  timeAndDistance: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  deliveryTime: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '300'
  },
  circleDivider: {
    marginHorizontal: 5
  },
  distance: {
    fontSize: 12,
    fontWeight: '300'
  }
}