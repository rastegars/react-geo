// @flow
import React from 'react';
import {
  render, cleanup, waitForElement, waitForDomChange, fireEvent,
} from 'react-testing-library';
import 'jest-dom/extend-expect';
import axiosMock, { $AxiosError } from 'axios';
import type { $AxiosXHR } from 'axios';
import Main from '../components/Main';

afterEach(cleanup);
jest.mock('axios');

let response = {
  data: [
    {
      id: 1,
      location: 'Place Name',
      lat: 48.85,
      lon: 2.35,
    },
  ],
};

test('displays google map', () => {
  axiosMock.get.mockResolvedValueOnce(response);

  const { getByTestId } = render(<Main />);

  expect(getByTestId('google-map-container')).toBeInTheDocument();
});

describe('Component loads', () => {
  describe('successful request', () => {
    test('fetches saved places', async () => {
      axiosMock.get.mockResolvedValueOnce(response);

      const { getAllByText } = render(<Main />);

      await waitForElement((): HTMLElement => getAllByText('Place Name'));
    });

    test('displays markers on the map', async () => {
      axiosMock.get.mockResolvedValueOnce(response);

      const { getByTestId } = render(<Main />);

      await waitForElement((): HTMLElement => getByTestId('marker'));
    });
  });

  describe('failled request', () => {
    test('displays error message', async () => {
      axiosMock.get.mockImplementation((): Promise<$AxiosXHR<$AxiosError>> => Promise.reject());

      const { getByText } = render(<Main />);

      await waitForElement((): HTMLElement => getByText('Something Went Wrong!'));
    });
  });
});

describe('remove button', () => {
  describe('on success', () => {
    test('removes the place from the list', async () => {
      axiosMock.get.mockResolvedValueOnce(response);
      axiosMock.delete.mockResolvedValueOnce(response);

      const { getByText, queryByText } = render(<Main />);

      await waitForElement((): HTMLElement => getByText('Remove'));

      fireEvent.click(getByText('Remove'));

      await waitForDomChange();

      expect(queryByText('Place Name')).toBeNull();
    });
  });

  describe('on error', () => {
    test('displays error message', async () => {
      axiosMock.get.mockResolvedValueOnce(response);
      axiosMock.delete.mockImplementation((): Promise<$AxiosXHR<$AxiosError>> => Promise.reject());

      const { getByText } = render(<Main />);

      await waitForElement((): HTMLElement => getByText('Remove'));

      fireEvent.click(getByText('Remove'));

      await waitForElement((): HTMLElement => getByText('Something Went Wrong!'));
    });
  });
});

describe('when the save button is clicked in search result', () => {
  const searchResult = {
    data: [{
      data: {
        place_id: 1,
        display_name: 'Place Name',
        lat: '48.85',
        lon: '2.35',
      },
    },
    ],
  };

  const places = {
    data: [
      {
        id: 1,
        location: 'Place Name',
        lat: 48.85,
        lon: 2.35,
      },
    ],
  };

  describe('on successful save', () => {
    test('adds location to dom', async () => {
      response = {
        data: {
          id: 2,
          location: 'New Place',
          lat: '-4.479925',
          lon: '-63.5185396',
        },
      };

      axiosMock.get.mockImplementation((url: string): Promise<$AxiosXHR> => {
        if (new URL(url).pathname === '/places/search') {
          return Promise.resolve(searchResult);
        }
        return Promise.resolve(places);
      });

      axiosMock.post.mockResolvedValueOnce(response);

      const {
        getByTestId, getByPlaceholderText, getByText,
      } = render(
        <Main />,
      );

      fireEvent.change(getByPlaceholderText('Search a location'), { target: { value: 'paris' } });

      await waitForElement((): HTMLElement => getByTestId('search-result'));

      expect(getByTestId('search-result')).toHaveTextContent('Place Name');

      fireEvent.click(getByText(/save/i));

      await waitForElement((): HTMLElement => getByTestId('saved-places'));

      expect(getByTestId('saved-places')).toHaveTextContent('New Place');
    });
  });

  describe('on save failed', () => {
    test('displays error message', async () => {
      axiosMock.get.mockImplementation((url: string): Promise<$AxiosXHR> => {
        if (new URL(url).pathname === '/places/search') {
          return Promise.resolve(searchResult);
        }
        return Promise.resolve(places);
      });

      axiosMock.post.mockImplementation((): Promise<$AxiosXHR<$AxiosError>> => Promise.reject());

      const {
        getByTestId, getByPlaceholderText, getByText,
      } = render(
        <Main />,
      );

      fireEvent.change(getByPlaceholderText('Search a location'), { target: { value: 'paris' } });

      await waitForElement((): HTMLElement => getByTestId('search-result'));

      expect(getByTestId('search-result')).toHaveTextContent('Place Name');

      fireEvent.click(getByText(/save/i));

      await waitForElement((): HTMLElement => getByText('Something Went Wrong!'));

      expect(getByText('Something Went Wrong!')).toBeInTheDocument();
    });
  });
});
