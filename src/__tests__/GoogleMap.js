import React from 'react'
import {render, cleanup, fireEvent, waitForElement, wait, waitForDomChange} from 'react-testing-library'
import 'jest-dom/extend-expect'
import GoogleMap from '../components/GoogleMap'
import axiosMock from 'axios'

afterEach(cleanup);
jest.mock('axios');

const data = [{
  id: 1,
  location: 'Place Name',
  lat: 12.1,
  lon: 13.1
}]

test('renders google map', () => {
  const {getByTestId} = render(<GoogleMap data={data} />)
  expect(getByTestId('google-map-container')).toBeInTheDocument()
});

test('shows edit bar when marker is clicked', () => {
  const {getByTestId, getByText} = render(<GoogleMap data={data} />)
  expect(getByTestId('marker')).toBeInTheDocument()

  fireEvent.click(getByTestId('marker'))

  expect(getByText('Save')).toBeInTheDocument()
});


describe('marker edit', () => {
  const response = { data:
    [{ data: {
        display_name: 'New Place'
      } 
    }]
  }

  const targetCoordinates = { lat: '12', lng: '13' }

  test("updates marker's location when draging marker on map", async () => {
    axiosMock.get.mockResolvedValueOnce(response)
    const ref = React.createRef();
    const {getByTestId, getByText} = render(<GoogleMap data={data} ref={ref} />)
    
    fireEvent.click(getByTestId('marker'))

    ref.current._map.current.props.onChildMouseUp({}, {}, targetCoordinates)

    await waitForElement(() =>
      getByText('New Place')
    )
  })

  test('persists new location', async () => {  
    const postResponse = { data: {
        id: 2,
        location: 'New Place',
        lat: "34.0",
        lon: "15.0",
      }
    }

    axiosMock.get.mockResolvedValueOnce(response)
    axiosMock.patch.mockResolvedValueOnce(postResponse)

    const ref = React.createRef();
    const {getByTestId, getByText, queryByText} = render(<GoogleMap data={data} ref={ref} />)
    
    fireEvent.click(getByTestId('marker'))

    ref.current._map.current.props.onChildMouseUp({}, {}, targetCoordinates)

    await waitForElement(() =>
      getByText('New Place')
    )

    fireEvent.click(getByText('Save'))

    expect(queryByText('Place Name')).not.toBeInTheDocument()

    cleanup()
    const data2 = [{
        id: 2,
        location: 'New Place',
        lat: "34.0",
        lon: "15.0",
      }]
    const { rerender } = render(<GoogleMap data={data2} ref={ref} />)

    rerender(<GoogleMap data={data2} ref={ref} />)

    await waitForElement(() =>
      getByText('New Place')
    )
  })
})