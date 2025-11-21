# SEO Performance Analyzer - Frontend

This is the Next.js frontend for the SEO Performance Analyzer platform.

## 🚀 How to Run the Frontend

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

```bash
# Navigate to frontend directory
cd seo-fe

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start the development server
npm run dev
```

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:8000`)
- `NEXT_PUBLIC_API_VERSION`: API version (default: `/api/v1`)

## 📁 Frontend Structure

```text
seo-fe/
├── app/                   # Next.js app router
│   ├── seo-reports/      # Dynamic report pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # React components
│   ├── layout/          # Layout components
│   ├── providers/       # Context providers
│   └── seo/             # SEO-specific components
├── lib/                  # Utilities and hooks
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── api.ts           # API client
├── tests/                # Frontend tests
└── types/               # TypeScript types
```

## 🔧 Frontend Development

### Adding New Features

1. Create components in `components/`
2. Add utilities in `lib/utils/`
3. Create hooks in `lib/hooks/`
4. Add types in `types/`
5. Update tests in `tests/`

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

## 🎨 Styling

- Uses TailwindCSS for styling
- Responsive design by default
- Modern, clean UI components

## 🌐 Key Components

- **URLSubmissionForm**: Form for submitting websites for analysis
- **ReportsTable/ReportsGrid**: Display analysis results
- **SEOScore**: Visual SEO score indicator
- **QueryProvider**: React Query configuration

## 🐳 Docker Support

```bash
# Build frontend image
docker build -f Dockerfile.frontend -t seo-frontend .

# Run container
docker run -p 3000:3000 seo-frontend
```
