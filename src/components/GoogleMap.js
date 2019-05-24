// @flow
import React, { PureComponent } from 'react'
import GoogleMapReact from 'google-map-react'
import '../styles/GoogleMap.css'
import axios from 'axios'
import Marker from './Marker'

const mapStyles = {
  width: '100%',
  height: '100%'
}

const defaultCenter = { lat: 5.6219868, lng: -0.23223 }

type Location = {
  id: number,
  location: string,
  lat: string,
  lon: string
};

type Locations = $ReadOnlyArray<Location>;

type Props = {
  data: Locations,
  showError: () => void,
};

type State = {
  locations: Locations,
  center: { lat: number, lng: number },
  activeMarker: ?Location,
  loading: boolean,
  draggable: boolean
};

type Coordinates = {
  lat: string,
  lng: string
};

class GoogleMap extends PureComponent<Props, State> {
  _isMounted = false
  _map: { current: null | HTMLDivElement }

  constructor(props: Props) {
    super(props)
    this.state = { center: defaultCenter, locations: this.props.data, activeMarker: null, loading: false, draggable: true }
    this._map = React.createRef();
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidUpdate(prevProps: { data: Locations }) {
    if(prevProps.data !== this.props.data) {
      this.setState({locations: this.props.data})
    }
  }

  markerClick = (item: Location) => this.setState({activeMarker: item, center: {lat: Number(item.lat), lng: Number(item.lon)}})

  markerTitle = (title: string) => {
    if (title) {
      if (title.length > 20) return title.substring(0, 20) + ' ...'
      return title
    }
  }

  renderMarker = (item: Location) => {
    return (
      <Marker
        key={item.id}
        data={item}
        title={this.markerTitle(item.location) || 'Unknown Location'}
        lat={item.lat}
        lng={item.lon}
        dataTestID={this.state.activeMarker ? "active-marker" : "marker"}
        onClick={this.markerClick}>
      </Marker>
    )
  }

  updateActiveMarkerLocation = ({lat, lng} : {lat : string, lng : string}) => {
    this.setState({
      activeMarker: { ...this.state.activeMarker, lat: lat.toString(), lon: lng.toString()},
      loading: true
    })
  }

  reverseSearch = (lat: string, lon: string) => {
    const URL = `http://localhost:3004/places/reverse_search`
    axios.get(`${URL}/?lat=${lat}&lon=${lon}`).then(({data}) => {
      this.setState({
        activeMarker: { ...this.state.activeMarker, location: data[0].data.display_name },
        loading: false,
        draggable: true,
        center: { lat: Number(lat), lng: Number(lon)}
      })
    }).catch((error) => {
      this.props.showError()
    })
  }

  renderMarkers = () => {
    if (this.state.activeMarker) {
      return this.renderMarker(this.state.activeMarker)
    }
    if (this.state.locations) {
      return this.state.locations.map<{}>(location => this.renderMarker(location))
    } 
  }

  saveEdit = () => {
    if (this.state.activeMarker && !this.state.loading) {
      const {location, lat, lon, id} = this.state.activeMarker
      const URL = 'http://localhost:3004/places'
      axios.patch(`${URL}/${id}`, {
        place: {
          location,
          lat,
          lon
        }
      }).then(({data}) => {
        const locations = this.state.locations.filter(el => el.id !== id)
        
        if (this._isMounted) {
          this.setState({locations: [...locations, data], activeMarker: null})
        }
        
      }).catch((error) => {
        this.props.showError()
      })
    } 
  }

  cancelEdit = () =>
    this.setState({activeMarker: null, center: defaultCenter})

  onChildMouseDown = (childKey: number, childProps: {}, mouse: Coordinates) => {
    this.setState({
      draggable: false,
    });
  }

  onChildMouseUp = (childKey: number, childProps: {}, mouse: Coordinates) => {
    if (this.state.activeMarker) {
      this.reverseSearch(mouse.lat, mouse.lng)
    }
  }

  onChildMouseMove = (childKey: number, childProps: {}, mouse: Coordinates) => {
    if (this.state.activeMarker) {
      this.updateActiveMarkerLocation({lat: mouse.lat, lng: mouse.lng})
    }
  }

  render() {
    return (
      <React.Fragment>
        { this.state.activeMarker &&
          <div className="editBar">
            <button className="button" onClick={this.saveEdit}>Save</button>
            <button className="button" onClick={this.cancelEdit}>Cancel</button>
          </div>
        }
        <div data-testid='google-map-container' className='map-container'>
          <GoogleMapReact
            draggable={this.state.draggable}
            style={mapStyles}
            bootstrapURLKeys={{ key: 'AIzaSyBF-jDwc5-WCjWj-S4pE71cguwIKmEMMaQ' }}
            center={this.state.center}
            zoom={1}
            onChildMouseDown={this.onChildMouseDown}
            onChildMouseUp={this.onChildMouseUp}
            onChildMouseMove={this.onChildMouseMove}    
            ref={this._map}
          >
            {this.renderMarkers()}
          </GoogleMapReact>
        </div>
      </React.Fragment>
    )
  }
}

export default GoogleMap;