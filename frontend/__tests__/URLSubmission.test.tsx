import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import URLSubmissionForm from '@/components/seo/URLSubmissionForm';
import { submitURLForAnalysis } from '@/lib/api';

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

  it('simulates a user typing a URL and clicking \'Analyze\'', async () => {
    let resolveSubmit: (value: unknown) => void;
    const promise = new Promise(resolve => {
      resolveSubmit = resolve;
    });
    mockedSubmitURLForAnalysis.mockReturnValue(promise);

    render(<URLSubmissionForm />);

    const input = screen.getByLabelText(/website url/i);
    const button = screen.getByRole('button', { name: /analyze website/i });

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    expect(input).toHaveValue('https://example.com');

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Analyzing.../i)).toBeInTheDocument();
    });
    expect(button).toBeDisabled();
    expect(mockedSubmitURLForAnalysis).toHaveBeenCalledWith('https://example.com');

    await act(async () => {
      resolveSubmit({ report_id: 123, status: 'processing' });
    });

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('shows a validation error for an invalid URL', async () => {
    render(<URLSubmissionForm />);

    const input = screen.getByLabelText(/website url/i);
    const button = screen.getByRole('button', { name: /analyze website/i });

    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.click(button);

    expect(mockedSubmitURLForAnalysis).not.toHaveBeenCalled();
  });
});