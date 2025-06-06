import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import App from './App';

jest.mock('axios');

jest.mock('react-markdown', () => (props) => {
  return <>{props.children}</>;
});

jest.mock('remark-gfm', () => () => {});

const mockSlides = [
  { id: 1, content: '# Slide 1', layout: 'default' },
  { id: 2, content: '## Slide 2', layout: 'default' },
];

describe('App', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
    axios.post.mockResolvedValue({ data: { id: 3, content: '# New Slide', layout: 'default' } });
    axios.put.mockResolvedValue({ data: {} });
    axios.delete.mockResolvedValue({ data: {} });
  });

  test('renders welcome message when no slides are present', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/# Welcome! Create a new slide to begin./i)).toBeInTheDocument();
  });

  test('fetches and displays slides', async () => {
    axios.get.mockResolvedValue({ data: mockSlides });
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/# Slide 1/i)).toBeInTheDocument();
  });

  test('navigates to the next and previous slides', async () => {
    axios.get.mockResolvedValue({ data: mockSlides });
    await act(async () => {
      render(<App />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/Next/i));
    });
    expect(screen.getByText(/## Slide 2/i)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(/Prev/i));
    });
    expect(screen.getByText(/# Slide 1/i)).toBeInTheDocument();
  });

  test('creates a new slide', async () => {
    axios.get.mockResolvedValueOnce({ data: mockSlides }).mockResolvedValueOnce({ data: [...mockSlides, { id: 3, content: '# New Slide', layout: 'default' }] });
    await act(async () => {
      render(<App />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/New Slide/i));
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/slides', { content: '# New Slide' });
    });
    
    await waitFor(() => {
      expect(screen.getByText(/# New Slide/i)).toBeInTheDocument();
    });
  });

  test('deletes a slide', async () => {
    axios.get.mockResolvedValueOnce({ data: mockSlides }).mockResolvedValueOnce({ data: [mockSlides[1]] });
    await act(async () => {
      render(<App />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/Delete Slide/i));
    });

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('http://localhost:3001/slides/1');
    });

    await waitFor(() => {
      expect(screen.getByText(/## Slide 2/i)).toBeInTheDocument();
    });
  });
});
