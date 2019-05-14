import React, { PureComponent } from 'react'
import GoogleMapReact from 'google-map-react'
import '../styles/GoogleMap.css'

const mapStyles = {
  width: '100%',
  height: '100%'
}

const Marker = ({ title }) => {
  const markerImageSrc = "https://res.cloudinary.com/og-tech/image/upload/s--OpSJXuvZ--/v1545236805/map-marker_hfipes.png"
  return <div data-testid="marker" className='marker'>
    <img
       className='marker-image'
       src={markerImageSrc}
       alt={title} />
    <h3>{title}</h3>
  </div>
}

class GoogleMap extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { center: { lat: 5.6219868, lng: -0.23223 }, locations: this.props.data }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.locations !== this.props.data) {
      this.setState({locations: this.props.data})
    }
  }

  renderMarker = (item) => {
    return (
      <Marker
        key={item.id}
        title={item.location}
        lat={item.lat}
        lng={item.lon}
      >
      </Marker>
    )
  }

  render() {
    return (
      <div data-testid='google-map-container' className='map-container'>
        <GoogleMapReact
          style={mapStyles}
          bootstrapURLKeys={{ key: 'AIzaSyBF-jDwc5-WCjWj-S4pE71cguwIKmEMMaQ' }}
          center={this.state.center}
          zoom={1}
        >
          {this.state.locations.map(location => this.renderMarker(location))}
        </GoogleMapReact>
      </div>
    )
  }
}

export default GoogleMap;