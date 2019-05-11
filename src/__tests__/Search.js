import React from 'react'
import {render, fireEvent, waitForElement, cleanup} from 'react-testing-library'
import 'jest-dom/extend-expect'
import axiosMock from 'axios'
import Search from '../components/Search'

afterEach(cleanup);
jest.mock('axios');

const data = [{
  id: 1,
  location: 'Location Name',
  lat: 12.1,
  lon: 13.1
}]

test('renders serach container', () => {
  const {getByTestId} = render(<Search locations={data} />)
  expect(getByTestId('search-container')).toBeInTheDocument()
});

test('Search makes an API call and displays the results when the input is changed', async () => {
  let response = { data: [{
      data: {
        place_id: 1,
        display_name: 'Place Name',
        lat: '48.85',
        lon: '2.35'
      }
    }]
  }

  axiosMock.get.mockResolvedValueOnce(response)

  const {getByText, getByTestId, getByPlaceholderText} = render(
    <Search locations={data} />
  )

  fireEvent.change(getByPlaceholderText("Search a location"), { target: { value: 'paris' }})

  await waitForElement(() =>
    getByTestId('search-result')
  )

  expect(axiosMock.get).toHaveBeenCalledTimes(1)
  expect(getByTestId('search-result')).toHaveTextContent('Place Name')
});