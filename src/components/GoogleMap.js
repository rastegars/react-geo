import React, { PureComponent } from 'react'
import GoogleMapReact from 'google-map-react'
import '../styles/GoogleMap.css'
import axios from 'axios'

const mapStyles = {
  width: '100%',
  height: '100%'
}

const Marker = (props) => {
  const markerImageSrc = "https://res.cloudinary.com/og-tech/image/upload/s--OpSJXuvZ--/v1545236805/map-marker_hfipes.png"
  return (
    <div 
      data-testid={props.dataTestid}
      className='marker'
      onClick={() => props.onClick(props.data)}>
      <img
        className='marker-image'
        src={markerImageSrc}
        alt={props.title} />
      <h3>{props.title}</h3>
    </div>
  )
}

class GoogleMap extends PureComponent {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = { center: { lat: 5.6219868, lng: -0.23223 }, locations: this.props.data }
    this._map = React.createRef();
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.data !== this.props.data) {
      this.setState({locations: this.props.data})
    }
  }

  markerClick = (item) => this.setState({activeMarker: item})

  renderMarker = (item) => {
    return (
      <Marker
        key={item.id}
        data={item}
        onClick={this.markerClick}
        title={item.location}
        lat={item.lat}
        lng={item.lon}
        dataTestid={this.state.activeMarker ? "active-marker" : "marker"}
      >
      </Marker>
    )
  }

  updateActiveMarkerLocation = ({lat, lng}) => {
    if (this.state.activeMarker) {
      this.setState({activeMarker: { ...this.state.activeMarker, lat: lat.toString(), lon: lng.toString() }})
      this.reverseSearch(lat, lng)
    }
  }

  reverseSearch = (lat, lon) => {
    const URL = `http://localhost:3004/places/reverse_search`
    axios.get(`${URL}/?lat=${lat}&lon=${lon}`).then(({data}) => {
      this.setState({activeMarker: { ...this.state.activeMarker, location: data[0].data.display_name }})
    }).catch((error) => {
      this.props.showError()
    })
  }

  renderMarkers = () => {
    if (this.state.activeMarker) {
      return this.renderMarker(this.state.activeMarker)
    }
    return this.state.locations.map(location => this.renderMarker(location))
  }

  activeIndex = () => 
    this.state.locations.findIndex(location => location.id === this.state.activeMarker.id)

  finishEdit = () => this.setState({activeMarker: null})

  saveEdit = () => {
    const {id, location, lat, lon} = this.state.activeMarker
    const URL = 'http://localhost:3004/places'
    axios.patch(`${URL}/${this.state.activeMarker.id}`, {
      place: {
        location,
        lat,
        lon
      }
    }).then(({data}) => {
      const locations = this.state.locations.filter(el => el.id !== this.state.activeMarker.id)
      if (this._isMounted) {
        this.setState({locations: [...locations, data], activeMarker: null})
      }
      
    }).catch((error) => {
      this.props.showError()
    })
  }

  render() {
    return (
      <div>
        { this.state.activeMarker &&
          <div className="editBar" onClick={this.saveEdit}>
            <button className="button">Save</button>
          </div>
        }
        <div data-testid='google-map-container' className='map-container'>
          <GoogleMapReact
            style={mapStyles}
            bootstrapURLKeys={{ key: 'AIzaSyBF-jDwc5-WCjWj-S4pE71cguwIKmEMMaQ' }}
            center={this.state.center}
            zoom={1}
            onClick={this.updateActiveMarkerLocation}
            ref={this._map}
          >
            {this.renderMarkers()}
          </GoogleMapReact>
        </div>
      </div>
    )
  }
}

export default GoogleMap;