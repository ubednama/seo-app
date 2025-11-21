import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import URLSubmissionForm from '@/components/seo/URLSubmissionForm';
import { Toaster } from 'sonner';

// Mock the api module
jest.mock('@/lib/api', () => ({
  submitURLForAnalysis: jest.fn(),
}));

import { submitURLForAnalysis } from '@/lib/api';
const mockedSubmitURLForAnalysis = submitURLForAnalysis as jest.Mock;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
      <Toaster />
    </QueryClientProvider>
  );
};

describe('URLSubmissionForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow typing in the input field', () => {
    renderWithProviders(<URLSubmissionForm onSuccess={() => {}} />);
    const input = screen.getByPlaceholderText('https://example.com') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'https://google.com' } });
    expect(input.value).toBe('https://google.com');
  });

  it('should show loading state and call the correct API function on submission', async () => {
    // Use mockImplementation with a delay to allow loading state to be tested
    mockedSubmitURLForAnalysis.mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve({ report_id: 123, status: 'processing' }), 50)
        )
    );

    const mockOnSuccess = jest.fn();
    renderWithProviders(<URLSubmissionForm onSuccess={mockOnSuccess} />);

    const input = screen.getByPlaceholderText('https://example.com');
    const button = screen.getByRole('button', { name: /analyze/i });

    fireEvent.change(input, { target: { value: 'https://google.com' } });
    fireEvent.click(button);

    // Check for loading state - it should appear before the promise resolves
    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
    });

    // Wait for the submission to complete
    await waitFor(() => {
      expect(mockedSubmitURLForAnalysis).toHaveBeenCalledWith('https://google.com');
    });
    
    // Check that onSuccess was called
    await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
    });

    // Check that the loading state is gone
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('should display an error message for invalid URL', async () => {
    renderWithProviders(<URLSubmissionForm onSuccess={() => {}} />);
    const input = screen.getByPlaceholderText('https://example.com');
    const button = screen.getByRole('button', { name: /analyze/i });

    fireEvent.change(input, { target: { value: 'invalid-url' } });
    // It's better to submit the form directly for validation tests
    const form = button.closest('form')!;
    fireEvent.submit(form);

    expect(await screen.findByText(/Please enter a valid URL starting with http:\/\/ or https:\/\//i)).toBeInTheDocument();
    expect(mockedSubmitURLForAnalysis).not.toHaveBeenCalled();
  });
});