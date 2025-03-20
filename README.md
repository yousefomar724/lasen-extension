# لِسان (Lasen) - Arabic Text Correction Extension & Landing Page

A comprehensive solution for Arabic text correction, including a browser extension and a landing page.

## Project Structure

The project consists of three main components:

- **Client**: Browser extension that provides text correction functionality
- **Landing**: Next.js landing page showcasing features and offering a demo
- **Server**: Node.js backend API that processes text correction requests

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for the entire project:
   ```bash
   npm install
   ```
3. Install dependencies for each component:
   ```bash
   cd client && npm install
   cd ../landing && npm install
   cd ../server && npm install
   ```

### Development

You can run components individually:

```bash
# Run the landing page
npm run dev:landing

# Run the server
npm run dev:server

# Run the client/extension
npm run dev:client
```

Or run both the landing page and server together:

```bash
npm run dev
```

### Environment Setup

Create `.env.local` files in each component directory as needed:

#### landing/.env.local

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### server/.env

```
PORT=5000
GEMINI_API_KEY=your_api_key_here
```

## Features

### Browser Extension

- Text correction within any input field
- Grammar and spelling correction
- Dialect to Fusha (Standard Arabic) conversion

### Landing Page

- Modern, responsive design
- Features showcase
- Pricing plans
- Interactive demo section

### Server API

- Text correction endpoint
- Arabic dialect conversion
- Integration with Google's Gemini API

## Technologies Used

- React & Next.js
- Node.js & Express
- TailwindCSS
- Google Gemini AI API
- Chrome Extension API

## License

This project is licensed under the ISC License.
