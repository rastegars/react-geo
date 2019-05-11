import React from 'react'
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library'
import 'jest-dom/extend-expect'
import axiosMock from 'axios'
import SearchResult from '../components/SearchResult'

afterEach(cleanup);
jest.mock('axios');
test('renders search results with a save button', async () => {
  let response = {
    data: {
      id: 27,
      location: "Place Name",
      lat: "-4.479925",
      lon: "-63.5185396"
    }
  }

  axiosMock.get.mockResolvedValueOnce(response)
  
  let locations = [{ data: { place_id: 1, display_name: 'Display Name', lat: 11.2, lon: 12.4 }}]

  const {getAllByText, getByTestId} = render(
    <SearchResult data={locations} />
  )

  await waitForElement(() =>
    getByTestId('search-result'),
  )

  expect(getByTestId('search-result')).toHaveTextContent('Display Name')
})
