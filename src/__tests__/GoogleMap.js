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


test('updates marker location upon clicking on map', async () => {
  const response = { data:
    [{ data: {
        display_name: 'New Place'
      } 
    }]
  }

  axiosMock.get.mockResolvedValueOnce(response)
  const ref = React.createRef();
  const {getByTestId, getByText, queryByTestId, findByText} = render(<GoogleMap data={data} ref={ref} />)
  
  fireEvent.click(getByTestId('marker'))

  ref.current._map.current.props.onClick({lat: 20.1, lng: 15.4})

  await waitForElement(() =>
    getByText('New Place')
  )
});
