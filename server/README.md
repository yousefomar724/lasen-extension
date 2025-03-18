# Arabic Correction API Server

This is the backend server for the Arabic Correction browser extension. It provides API endpoints for correcting Arabic language text using Google's Gemini 1.5 Flash model.

## Features

- Arabic text correction via Gemini AI
- Saving correction history to MongoDB
- RESTful API for integration with the browser extension

## Prerequisites

- Node.js 18+
- MongoDB
- Google Gemini API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGO_URI=mongodb://localhost:27017/lasen
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Build the project:

```bash
npm run build
```

3. Start the server:

```bash
npm start
```

For development:

```bash
npm run dev
```

## API Endpoints

### Correct Text

```
POST /api/correct
```

Request body:

```json
{
  "text": "النص العربي المراد تصحيحه",
  "source": "extension" // optional, default: "extension"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "originalText": "النص العربي المراد تصحيحه",
    "correctedText": "النص العربي المصحح"
  }
}
```

### Get Correction History

```
GET /api/corrections?page=1&limit=20
```

Response:

```json
{
  "success": true,
  "count": 20,
  "total": 100,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "123456789",
      "originalText": "النص الاصلي",
      "correctedText": "النص المصحح",
      "source": "extension",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
    // More corrections...
  ]
}
```

## License

MIT
