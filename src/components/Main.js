import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'


const mapStyles = {
  width: '100%',
  height: '100%'
}

class Main extends Component {
  render() {
    return (
      <div>
        <div data-testid='google-map-container' style={{position: 'absolute', width: '50%', height: '100%'}}>
          <GoogleMapReact
            style={mapStyles}
            bootstrapURLKeys={{ key: 'AIzaSyBF-jDwc5-WCjWj-S4pE71cguwIKmEMMaQ' }}
            center={{ lat: 5.6219868, lng: -0.23223 }}
            zoom={1}
          >
          </GoogleMapReact>
        </div>
      </div>
    )
  }
}

export default Main;