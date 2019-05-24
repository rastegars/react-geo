// @flow
import React, { PureComponent } from 'react'
import axios from 'axios'
import GoogleMap from './GoogleMap'
import Search from './Search'
import '../styles/Main.css'

type Location = {
  id: number,
  location: string,
  lat: string,
  lon: string
};

type Locations = Array<Location>;

type Props = {};

type State = {
  locations: Locations,
  error: boolean,
  fullScreen: boolean
};

class Main extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { locations: [], error: false, fullScreen: false }
  }

  componentDidMount() {
    this.getPlaces()
    window.addEventListener("fullscreenchange", this._toggleFullScreen);
  }

  _toggleFullScreen = () =>
    this.setState(prevState => ({fullScreen: !prevState.fullScreen}))

  getPlaces = () => {
    axios.get('http://localhost:3004/places').then(({data}) => {
      this.setState({
        locations: data
      }) 
    }).catch((error) => {
      this.setState({error: true})
    })
  }

  deletePlace = (itemID: number) => {
    const URL = `http://localhost:3004/places/${itemID}`
    axios.delete(URL).then(() => {
      const arr = this.state.locations
      const findIndex = arr.findIndex((element) => element.id === itemID)
      const result = findIndex >= 0 ? [...arr.slice(0, findIndex), ...arr.slice(findIndex + 1)] : arr
      this.setState({locations: result, error: false})
    }).catch((error) => {
      this.setState({error: true})
    })
  }

  showError = () =>
    this.setState({error: true})

  renderError = () =>
    <div className="alert">
      <span className="closebtn" onClick={() => this.setState({ error: false })}>&times;</span> 
      <p style={{margin: 0}}>Something Went Wrong!</p>
    </div>

  addLocation = (location: Location) => {
    this.setState({locations: [...this.state.locations, location]})
  }

  render() {
    return (
      <div>
        { !this.state.fullScreen &&
          <div className="header">
            <a href="#default" className="logo">React Geocoding Exercise</a>
          </div>
        }
        {this.state.error && this.renderError()}
        <GoogleMap data={this.state.locations} showError={this.showError} />
        {
          !this.state.fullScreen &&
          <Search locations={this.state.locations} addLocation={this.addLocation} showError={this.showError} deletePlace={this.deletePlace} />
        }
        
      </div>
    )
  }
}

export default Main;