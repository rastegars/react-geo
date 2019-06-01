// @flow
import React, { PureComponent } from 'react';
import axios from 'axios';
import GoogleMap from './GoogleMap';
import Search from './Search';
import '../styles/Main.css';

type LocationType = {
  id: number,
  location: string,
  lat: string,
  lon: string
};

type LocationsType = Array<LocationType>;

type PropsType = {};

type StateType = {
  locations: LocationsType,
  error: boolean,
  fullScreen: boolean
};

class Main extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { locations: [], error: false, fullScreen: false };
  }

  componentDidMount() {
    this.getPlaces();
    window.addEventListener('fullscreenchange', this.toggleFullScreen);
  }

  toggleFullScreen = () => {
    this.setState((prevState: StateType): {fullScreen: boolean} => ({
      fullScreen: !prevState.fullScreen,
    }));
  }

  getPlaces = () => {
    if (!process.env.REACT_APP_API_HOST) throw new Error('REACT_APP_API_HOST missing');
    axios.get(`${process.env.REACT_APP_API_HOST}/places`).then(({ data }: {data: LocationsType}) => {
      this.setState({
        locations: data,
      });
    }).catch(() => {
      this.setState({ error: true });
    });
  }

  deletePlace = (itemID: number) => {
    if (!process.env.REACT_APP_API_HOST) throw new Error('REACT_APP_API_HOST missing');
    const URL = `${process.env.REACT_APP_API_HOST}/places/${itemID}`;
    axios.delete(URL).then(() => {
      const { locations } = this.state;
      const func = (element: LocationType): boolean => element.id === itemID;
      const findIndex = locations.findIndex(func);
      const newArray = [...locations.slice(0, findIndex), ...locations.slice(findIndex + 1)];
      const result = findIndex >= 0 ? newArray : locations;
      this.setState({ locations: result, error: false });
    }).catch(() => {
      this.setState({ error: true });
    });
  }

  handleKeyDown = (ev: KeyboardEvent) => {
    if (ev.keyCode === 88) {
      this.closeError();
    }
  }

  showError = (): void => this.setState({ error: true })

  closeError = (): void => this.setState({ error: false })

  renderError = (): React$Node => (
    <div className="alert">
      <span className="closebtn" onClick={this.closeError} onKeyDown={this.handleKeyDown} tabIndex="0" role="button">
      &times;
      </span>
      <p style={{ margin: 0 }}>Something Went Wrong!</p>
    </div>
  )

  addLocation = (location: LocationType) => {
    const { locations } = this.state;
    this.setState({ locations: [...locations, location] });
  }

  render(): React$Node {
    const { fullScreen, error, locations } = this.state;
    return (
      <div>
        { !fullScreen
          && (
            <div className="header">
              <a href="#default" className="logo">React Geocoding Exercise</a>
            </div>
          )
        }
        {error && this.renderError()}
        <div className="container">
          <GoogleMap data={locations} showError={this.showError} />
          { !fullScreen
              && (
              <Search
                locations={locations}
                addLocation={this.addLocation}
                showError={this.showError}
                deletePlace={this.deletePlace}
              />
              )
          }
        </div>
      </div>
    );
  }
}

export default Main;
