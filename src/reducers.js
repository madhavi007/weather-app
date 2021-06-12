var initialState = {
    latitude: '',
    longitude: '',
    city: '',
    data: {},
    loading: false
  };
  
  export default function mainReducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_LATITUDE':
        return Object.assign({}, state, {
            latitude: action.latitude
        });
      case 'SET_LONGITUDE':
        return Object.assign({}, state, {
            longitude: action.longitude
        });
      case 'SET_CITY':
        return Object.assign({}, state, {
            city: action.city
        });
      case 'SET_DATA':
        return Object.assign({}, state, {
            data: action.data
        });
      case 'SET_LOADING':
        return Object.assign({}, state, {
            loading: action.loading
        });  
      default:
        return state;
    }
  }