import React from 'react';
import './App.css';
import Geocode from "react-geocode";
import { connect } from 'react-redux';
import {
  setData,
  setCity,
  setLatitude,
  setLongitude,
  setLoading,
  setError
} from './actions';

class App extends React.Component {
  
   geoLocation = async () => {
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
    if(navigator){
      navigator.geolocation?.getCurrentPosition(async (position) => { 
        const latitude = position.coords.latitude; 
        const longitude= position.coords.longitude;
        this.props.dispatch(setLatitude(latitude));
        this.props.dispatch(setLongitude(longitude));
        if(this.props.latitude == latitude && this.props.longitude == longitude && this.props.city!=''){
          this.loading();
          this.fetch_data();
        }else{
          Geocode.fromLatLng(latitude, longitude).then(
            (response) => {
              let city;
              for (let i = 0; i < response.results[0].address_components.length; i++) {
                for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
                  switch (response.results[0].address_components[i].types[j]) {
                    case "locality":
                      city = response.results[0].address_components[i].long_name;
                      break;
                  }
                }
              }
              this.props.dispatch(setCity(city));
              this.loading();
              this.fetch_data();
            },
            (error) => {
              console.error(error);
            }
          );
        }   
      })
    }
  }  
  loading = async () => {
    this.props.dispatch(setLoading(true));
     setTimeout(() => {
      this.props.dispatch(setLoading(false))
      }, 100)
  }

 fetch_data = async () => {
    const res = await fetch('http://localhost:4000/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `
            query {
              getCityByName(name: "${this.props.city}") {
                id
                name
                country
                coord {
                  lon
                  lat
                }
                weather {
                  summary {
                    title
                    description
                    icon
                  }
                  temperature {
                    actual
                    feelsLike
                    min
                    max
                  }
                  wind {
                    speed
                    deg
                  }
                  clouds {
                    all
                    visibility
                    humidity
                  }
                  timestamp
                }
              }
            }` 
          }),
});

const result = await res.json();
if(result.data.getCityByName == null){
  this.props.dispatch(setError(true));
}else{
  this.props.dispatch(setData(result.data))
  this.props.dispatch(setError(false));
}    
}
  
  render() {
    const { loading, data, city, error } = this.props;
    return(
      <>
      <div className="App">
        <table className={data.getCityByName?.weather?.summary?.description == 'broken clouds' ?  " table1 broken-sky": "table1 clear-sky"} >
          <thead>  
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td>City</td>
                <td>{city}</td>
              </tr>
              <tr>
                <td>Country</td>
                <td>{data.getCityByName?.country}</td>
              </tr>
              <tr>
                <td>Latitude</td>
                <td>{data.getCityByName?.coord.lat}</td>
              </tr>
              <tr>
                <td>Longitude</td>
                <td>{data.getCityByName?.coord.lon}</td>
              </tr>
              <tr>
                <td>Weather</td>
                <td>{data.getCityByName?.weather?.summary?.description}</td>
              </tr> 
              <tr>
                <td>Actual Temperature</td>
                <td>{data.getCityByName?.weather?.temperature?.actual}</td>
              </tr>  
              <tr>
                <td>FeelsLike Temperature</td>
                <td>{data.getCityByName?.weather?.temperature?.feelsLike}</td>
              </tr>  
              <tr>
                <td>Wind Speed</td>
                <td>{data.getCityByName?.weather?.wind?.speed}</td>
              </tr>  
              <tr>
                <td>Humidity</td>
                <td>{data.getCityByName?.weather?.clouds?.humidity}</td>
              </tr>   
          </tbody>  
        </table>
        <div>
          {loading && <span>Loading Data from Server</span>}
          {error && <span className="error">Api response is Null. Use https://graphql-weather-api.herokuapp.com/ as graphql wrapper.</span>}
        </div>
        <div>
          <img src="/refresh.png" onClick= {this.geoLocation} height="50" width="50"></img>
        </div>
      </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(App);
