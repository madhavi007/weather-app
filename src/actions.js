export function setLatitude(latitude) {
	return {
		type: 'SET_LATITUDE',
		latitude: latitude
	};
}

export function setLongitude(longitude) {
  return {
    type: 'SET_LONGITUDE',
    longitude: longitude
  };
}

export function setCity(city) {
  return {
    type: 'SET_CITY',
    city: city
  };
}

export function setData(data) {
  return {
    type: 'SET_DATA',
    data: data
  };
}

export function setLoading(loading) {
    return {
      type: 'SET_LOADING',
      loading: loading
    };
  }