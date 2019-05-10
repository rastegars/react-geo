import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'

const mapContainerStyle = {
  position: 'absolute',
  width: '50%',
  height: '100%'
}

class GoogleMap extends Component {
  render() {
    return (
      <div data-testid='google-map-container' style={mapContainerStyle}>
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