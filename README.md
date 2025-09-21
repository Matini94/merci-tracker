# Merci Tracker

A comprehensive income tracking Progressive Web Application (PWA) built with Next.js 15, React 19, and TypeScript. Track, analyze, and manage your income with powerful analytics and data management tools.

## 🚀 Features

### 📊 Income Tracking

- Add, edit, and delete income entries
- Categorize income sources
- Add detailed notes and descriptions
- Real-time data validation

### 📈 Analytics & Reporting

- Comprehensive dashboard with income summaries
- Visual charts showing income trends and patterns
- Calendar heatmap for activity visualization
- Custom date range analysis
- Monthly, weekly, and daily breakdowns

### 📋 Data Management

- **Export Data**: CSV, JSON, and PDF formats with customizable options
- **Import Data**: CSV import with validation and duplicate detection
- **Backup & Restore**: Complete data backup with integrity checking
- **Data Integrity**: Automatic validation and error reporting

### 🔍 Advanced Features

- Smart filtering and search functionality
- Pagination for large datasets
- Real-time auto-save
- Responsive design for all devices

### 🛠 Technical Features

- Progressive Web App (PWA) support
- Offline functionality
- TypeScript for type safety
- Comprehensive test coverage
- Accessibility compliant (WCAG 2.1 AA)
- Error boundaries and graceful error handling

## 🏗 Architecture

Built with modern web technologies:

- **Next.js 15.5.3** with App Router and Turbopack
- **React 19.1.0** with TypeScript
- **Tailwind CSS v4** for styling
- **Supabase** for backend and database
- **Chart.js & react-chartjs-2** for data visualization
- **Jest & React Testing Library** for testing

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd merci-tracker
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
# Add your Supabase credentials
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚦 Getting Started

1. **First Visit**: Complete the onboarding process to set up your preferences
2. **Add Income**: Navigate to "Add Income" to create your first income entry
3. **View Dashboard**: Check your income overview and recent entries
4. **Analytics**: Explore detailed analytics and trends in the Analytics section
5. **Data Management**: Use import/export tools in the Data Management section

## 📱 PWA Installation

Install Merci Tracker as a PWA on your device:

- **Desktop**: Click the install button in your browser's address bar
- **Mobile**: Use "Add to Home Screen" from your browser's menu

## 📊 Data Export/Import

### Export Options

- **CSV**: Spreadsheet-compatible format
- **JSON**: Full data with metadata
- **PDF**: Formatted reports with charts

### Import Features

- CSV file validation
- Duplicate detection
- Error reporting and correction suggestions
- Preview before import

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

## 📈 Development Milestones

- ✅ **Milestone 1**: Core Infrastructure & Basic Income Entry
- ✅ **Milestone 2**: Dashboard & User Experience
- ✅ **Milestone 3**: Data Management & Analytics
- 🔄 **Milestone 4**: Advanced Features (In Planning)

## 🚀 Deployment

The application is ready for deployment on Vercel, Netlify, or any platform supporting Next.js:

```bash
pnpm build
pnpm start
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support, please open an issue in the GitHub repository or contact the development team.
