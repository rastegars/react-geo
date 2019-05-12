import React from 'react'
import {render, cleanup, waitForElement, fireEvent} from 'react-testing-library'
import 'jest-dom/extend-expect'
import axiosMock from 'axios'
import Main from '../components/Main'

afterEach(cleanup);
jest.mock('axios');

let response = {
  data: [
    {
      id: 1,
      location: 'Place Name',
      lat: 48.85,
      lon: 2.35
    }
  ]
}

test('displays google map', () => {
  axiosMock.get.mockResolvedValueOnce(response)

  const {getByTestId, getAllByText} = render(<Main />)

  expect(getByTestId('google-map-container')).toBeInTheDocument()
  jest.restoreAllMocks
});

test('fetches saved places', async () => {
  axiosMock.get.mockResolvedValueOnce(response)

  const {getByTestId, getAllByText} = render(<Main />)

  await waitForElement(() =>
    getAllByText('Place Name'),
  )
});

describe('when the save button is clicked in search result', () => {
  describe('on successful save', () => {
    test('adds location to dom', async () => {
      const places =  {
        data: [
          {
            id: 1,
            location: 'Place Name',
            lat: 48.85,
            lon: 2.35
          }
        ]
      }

      const searchResult = {
        data: [{
          data: {
            place_id: 1,
            display_name: 'Place Name',
            lat: '48.85',
            lon: '2.35'
          }
        }
      ]}

      response = {
        data: {
          id: 2,
          location: 'New Place',
          lat: "-4.479925",
          lon: "-63.5185396"
        }
      }

      axiosMock.get.mockImplementation((url) => {
        if (new URL(url).pathname === '/places/search') {
          return Promise.resolve(searchResult);
        } else {
          return Promise.resolve(places);
        }
      });

      axiosMock.post.mockResolvedValueOnce(response)

      const {getAllByText, getByTestId, getByPlaceholderText, getByText} = render(
        <Main />
      )

      fireEvent.change(getByPlaceholderText("Search a location"), { target: { value: 'paris' }})

      await waitForElement(() =>
        getByTestId('search-result'),
      )

      expect(getByTestId('search-result')).toHaveTextContent('Place Name')

      fireEvent.click(getByText(/save/i))

      await waitForElement(() =>
        getByTestId('saved-places'),
      )

      expect(getByTestId('saved-places')).toHaveTextContent('New Place')
    })
  })

  describe('on save failed', () => {
    test('displays error message', async () => {
      const places =  {
        data: [
          {
            id: 1,
            location: 'Place Name',
            lat: 48.85,
            lon: 2.35
          }
        ]
      }

      const searchResult = {
        data: [{
          data: {
            place_id: 1,
            display_name: 'Place Name',
            lat: '48.85',
            lon: '2.35'
          }
        }
      ]}

      response = {
        data: {
          id: 2,
          location: 'New Place',
          lat: "-4.479925",
          lon: "-63.5185396"
        }
      }

      axiosMock.get.mockImplementation((url) => {
        if (new URL(url).pathname === '/places/search') {
          return Promise.resolve(searchResult);
        } else {
          return Promise.resolve(places);
        }
      });

      axiosMock.post.mockImplementation((url) => {
        return Promise.reject();
      });

      const {getAllByText, getByTestId, getByPlaceholderText, getByText} = render(
        <Main />
      )

      fireEvent.change(getByPlaceholderText("Search a location"), { target: { value: 'paris' }})

      await waitForElement(() =>
        getByTestId('search-result'),
      )

      expect(getByTestId('search-result')).toHaveTextContent('Place Name')

      fireEvent.click(getByText(/save/i))

      await waitForElement(() =>
        getByText('Session Timeout!')
      )

      expect(getByText('Session Timeout!')).toBeInTheDocument()
    })
  })
})
