import React from 'react'
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library'
import 'jest-dom/extend-expect'
import axiosMock from 'axios'
import Places from '../components/Places.js'

afterEach(cleanup);
jest.mock('axios');

test('Displays saved places', async () => {
  let data = [{
    id: 1,
    location: 'Place Name',
    lat: 12.1,
    lon: 13.1
  }]

  const {getByText} = render(
    <Places data={data} />
  )

  expect(getByText('Place Name')).toBeInTheDocument()
})