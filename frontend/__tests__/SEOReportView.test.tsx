import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import ReportPage from '@/app/seo-reports/[id]/page';
import { useSEOReport } from '@/lib/hooks/useSEOReports';
import { SEOReport } from '@/types/seo';

// Mock the custom hook
jest.mock('@/lib/hooks/useSEOReports');
const mockedUseSEOReport = useSEOReport as jest.Mock;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
  useParams: () => ({ id: '1' }),
}));

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('ReportPage', () => {
  it('should render a completed report correctly', () => {
    const mockReport: SEOReport = {
      id: 1,
      url: 'https://example.com',
      status: 'completed',
      created_at: new Date().toISOString(),
      title: 'Example Domain',
      meta_description: 'This is an example domain for use in documents.',
      h1_tags: ['Example Domain'],
      h2_tags: [],
      images: [],
      links: [],
      load_time: 0.5,
      accessibility_score: 90,
      performance_score: 85,
      seo_score: 88,
      ai_insights: 'This is a well-structured page.',
      ai_recommendations: ['Consider adding more H2 tags.'],
      error_message: null,
      updated_at: new Date().toISOString(),
    };

    mockedUseSEOReport.mockReturnValue({ 
      data: mockReport, 
      isLoading: false, 
      error: null 
    });

    renderWithProviders(<ReportPage params={{ id: '1' }} />);

    // Check for key elements
    expect(screen.getByText('SEO Analysis Report')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('88')).toBeInTheDocument(); // SEO Score
    expect(screen.getByText('Example Domain', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('This is a well-structured page.')).toBeInTheDocument();
    expect(screen.getByText('Consider adding more H2 tags.')).toBeInTheDocument();
  });

  it('should render a loading state', () => {
    mockedUseSEOReport.mockReturnValue({ 
      data: null, 
      isLoading: true, 
      error: null 
    });

    renderWithProviders(<ReportPage params={{ id: '1' }} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});