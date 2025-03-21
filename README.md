# لِسان (Lasen) - Arabic Text Correction Extension & Landing Page

A comprehensive solution for Arabic text correction, including a browser extension and a landing page built with the latest technologies.

## Project Structure

The project consists of two main components:

- **extension**: Vite-based Chrome extension that provides real-time Arabic text correction functionality
- **client**: Next.js landing page showcasing features, providing an interactive demo, and serving API endpoints

## Features

### Browser Extension

- Real-time Arabic text correction within any input field, textarea, or contentEditable element
- Grammar, spelling, and linguistic error detection with inline suggestions
- Context menu integration for convenient text correction and dialect conversion
- Customizable settings for different types of text fields
- Support for converting between various Arabic dialects (Egyptian, Levantine, Gulf, Moroccan)
- Visual highlighting of detected errors with suggestion dropdown

### Web Client & API

- Modern, responsive landing page built with Next.js and Tailwind CSS
- Interactive demo allowing users to test correction and dialect conversion
- API endpoints for text correction, validation, and dialect conversion
- Integration with Google's Gemini 1.5 Flash AI model for accurate corrections
- MongoDB integration for storing correction history

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Google Gemini API key for AI-powered corrections

### Installation

#### Extension

```bash
cd extension
npm install
npm run dev   # For development build
npm run build # For production build
```

#### Client/Landing Page

```bash
cd client
npm install
npm run dev
```

### Environment Setup

Create `.env.local` in the client directory:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Extension Usage

1. Build the extension using the instructions above
2. Load the unpacked extension from the `extension/dist` directory in Chrome
3. Navigate to any website with Arabic text input fields
4. Use the correction button that appears next to input fields or the context menu options

## Technologies Used

### Extension

- Vite
- React 19
- TypeScript
- TailwindCSS
- Chrome Extension API

### Client & API

- Next.js 14
- React 18
- TypeScript
- TailwindCSS with Shadcn/UI components
- Google Generative AI (Gemini 1.5 Flash)
- MongoDB with Mongoose
- Axios for API requests

## Development

The extension uses content scripts to inject correction functionality into web pages and a background script to handle API requests and context menu actions.

The client provides both a landing page and API endpoints in a single Next.js application, eliminating the need for a separate server component.

## License

This project is licensed under the ISC License.
