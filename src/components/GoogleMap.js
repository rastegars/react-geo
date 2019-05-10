import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import '../styles/GoogleMap.css';

class GoogleMap extends Component {
  render() {
    return (
      <div data-testid='google-map-container' className='map-container'>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBF-jDwc5-WCjWj-S4pE71cguwIKmEMMaQ' }}
          center={{ lat: 5.6219868, lng: -0.23223 }}
          zoom={1}
        >
        </GoogleMapReact>
      </div>
    )
  }
}

export default GoogleMap;