import React from 'react';
import './App.css';
import Geocode from "react-geocode";
import { connect } from 'react-redux';
import {
  setData,
  setCity,
  setLatitude,
  setLongitude,
  setLoading
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
      fetch('https://graphql-weather-api.herokuapp.com/', {
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
})
.then(res => res.json())
.then(res => 
  //setTimeout(() => {
    this.props.dispatch(setData(res.data))
 // }, 100)
);     
}
  
  render() {
    const { loading, data, city } = this.props;
  
    return(
      <>
      <div className="App">
        <table className={data.getCityByName?.weather?.summary?.description == 'broken clouds' ?  " table1 broken-sky": "table1 clear-sky"} >
          <thead>  
            <tr>
              <th>Key</th>
              <th>Value</th>
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
          </tbody>  
        </table>
        {loading && <span>Loading Data from Server</span>}
        <img src="/refresh.png" onClick= {this.geoLocation} height="50" width="50"></img>
      </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(App);
