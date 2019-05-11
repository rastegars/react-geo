import React from 'react'
import {render, cleanup, waitForElement} from 'react-testing-library'
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

  axiosMock.get.mockResolvedValueOnce(response)

  const {getByTestId, getAllByText} = render(<Main />)

  await waitForElement(() =>
    getByTestId('saved-places'),
  )
});


