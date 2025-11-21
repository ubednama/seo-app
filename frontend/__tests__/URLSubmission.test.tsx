import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import URLSubmissionForm from '@/components/seo/URLSubmissionForm';
import { submitURLForAnalysis } from '@/lib/api';

// Mock the API call
jest.mock('@/lib/api', () => ({
  submitURLForAnalysis: jest.fn(),
}));

const mockedSubmitURLForAnalysis = submitURLForAnalysis as jest.Mock;

describe('URLSubmissionForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the input form correctly', () => {
    render(<URLSubmissionForm />);
    
    expect(screen.getByLabelText(/website url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze website/i })).toBeInTheDocument();
  });

  it('simulates a user typing a URL and clicking \"Analyze\"', async () => {
    mockedSubmitURLForAnalysis.mockResolvedValue({ report_id: 123, status: 'processing' });

    render(<URLSubmissionForm />);

    const input = screen.getByLabelText(/website url/i);
    const button = screen.getByRole('button', { name: /analyze website/i });

    // Simulate user input
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    expect(input).toHaveValue('https://example.com');

    // Simulate form submission
    fireEvent.click(button);

    // Check for submitting state
    expect(screen.getByText(/analyzing.../i)).toBeInTheDocument();
    expect(button).toBeDisabled();

    // Wait for the API call to be made
    await waitFor(() => {
      expect(mockedSubmitURLForAnalysis).toHaveBeenCalledWith('https://example.com');
    });

    // Check that the form is reset and the success callback is called
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('shows a validation error for an invalid URL', async () => {
    render(<URLSubmissionForm />);

    const input = screen.getByLabelText(/website url/i);
    const button = screen.getByRole('button', { name: /analyze website/i });

    // Simulate user input with an invalid URL
    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.click(button);

    // Check for the validation error message
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
    });

    // Ensure the API call is not made
    expect(mockedSubmitURLForAnalysis).not.toHaveBeenCalled();
  });
});