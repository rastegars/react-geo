// @flow
import React, { PureComponent } from 'react';
import GoogleMapReact from 'google-map-react';
import '../styles/GoogleMap.css';
import axios from 'axios';
import Marker from './Marker';

const mapStyles = {
  width: '100%',
  height: '100%',
};

const defaultCenter = { lat: 5.6219868, lng: -0.23223 };

type LocationType = {
  id: number,
  location: string,
  lat: string,
  lon: string
};

type LocationsType = $ReadOnlyArray<LocationType>;

type PropsType = {
  data: LocationsType,
  showError: () => void
};

type StateType = {
  center: { lat: number, lng: number },
  activeMarker: ?LocationType,
  loading: boolean,
  draggable: boolean
};

type CoordinatesType = {
  lat: string,
  lng: string
};

class GoogleMap extends PureComponent<PropsType, StateType> {
  mounted = false

  map: { current: null | HTMLDivElement }

  constructor(props: PropsType) {
    super(props);
    this.state = {
      center: defaultCenter, activeMarker: null, loading: false, draggable: true,
    };
    this.map = React.createRef();
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  markerClick = (item: LocationType) => {
    this.setState({ activeMarker: item, center: { lat: Number(item.lat), lng: Number(item.lon) } });
  }

  markerTitle = (title: string): string => {
    if (title) {
      if (title.length > 20) return `${title.substring(0, 20)} ...`;
      return title;
    }
    return 'Unknown Location';
  }

  renderMarker = (item: LocationType): React$Node => {
    const { activeMarker } = this.state;
    return (
      <Marker
        key={item.id}
        data={item}
        title={this.markerTitle(item.location)}
        lat={item.lat}
        lng={item.lon}
        dataTestID={activeMarker ? 'active-marker' : 'marker'}
        onClick={this.markerClick}
      />
    );
  }

  updateActiveMarkerLocation = ({ lat, lng }: {lat: string, lng: string}) => {
    const { activeMarker } = this.state;
    this.setState({
      activeMarker: { ...activeMarker, lat: lat.toString(), lon: lng.toString() },
      loading: true,
    });
  }

  reverseSearch = (lat: string, lon: string) => {
    const { activeMarker } = this.state;
    const { showError } = this.props;
    if (!process.env.REACT_APP_API_HOST) throw new Error('REACT_APP_API_HOST missing');
    const URL = `${process.env.REACT_APP_API_HOST}/places/reverse_search`;
    axios.get(`${URL}/?lat=${lat}&lon=${lon}`).then(({ data }: {data: Array<{data: { display_name: string }}>}) => {
      this.setState({
        activeMarker: { ...activeMarker, location: data[0].data.display_name },
        loading: false,
        draggable: true,
        center: { lat: Number(lat), lng: Number(lon) },
      });
    }).catch(() => {
      showError();
    });
  }

  renderMarkers = (): Array<React$Node> => {
    const { data } = this.props;
    const { activeMarker } = this.state;
    if (activeMarker) {
      return [this.renderMarker(activeMarker)];
    }
    if (data) {
      return data.map((location: LocationType): React$Node => this.renderMarker(location));
    }
    return [];
  }

  saveEdit = () => {
    const { activeMarker, loading } = this.state;
    const { showError } = this.props;
    if (activeMarker && !loading) {
      const {
        location, lat, lon, id,
      } = activeMarker;
      if (!process.env.REACT_APP_API_HOST) throw new Error('REACT_APP_API_HOST missing');
      const URL = `${process.env.REACT_APP_API_HOST}/places`;
      axios.patch(`${URL}/${id}`, {
        place: {
          location,
          lat,
          lon,
        },
      }).then(() => {
        if (this.mounted) {
          this.setState({ activeMarker: null });
        }
      }).catch(() => {
        showError();
      });
    }
  }

  cancelEdit = () => {
    this.setState({ activeMarker: null, center: defaultCenter });
  }

  onChildMouseDown = () => {
    this.setState({
      draggable: false,
    });
  }

  onChildMouseUp = (childKey: number, childProps: {}, mouse: CoordinatesType) => {
    const { activeMarker } = this.state;
    if (activeMarker) {
      this.reverseSearch(mouse.lat, mouse.lng);
    }
  }

  onChildMouseMove = (childKey: number, childProps: {}, mouse: CoordinatesType) => {
    const { activeMarker } = this.state;
    if (activeMarker) {
      this.updateActiveMarkerLocation({ lat: mouse.lat, lng: mouse.lng });
    }
  }

  render(): React$Node {
    const { activeMarker, draggable, center } = this.state;
    return (
      <React.Fragment>
        { activeMarker
          && (
          <div className="editBar">
            <button type="submit" className="button" onClick={this.saveEdit}>Save</button>
            <button type="button" className="button" onClick={this.cancelEdit}>Cancel</button>
          </div>
          )
        }
        <div data-testid="google-map-container" className="map-container">
          <GoogleMapReact
            draggable={draggable}
            style={mapStyles}
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY }}
            center={center}
            zoom={1}
            onChildMouseDown={this.onChildMouseDown}
            onChildMouseUp={this.onChildMouseUp}
            onChildMouseMove={this.onChildMouseMove}
            ref={this.map}
          >
            {this.renderMarkers()}
          </GoogleMapReact>
        </div>
      </React.Fragment>
    );
  }
}

export default GoogleMap;
