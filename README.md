# Arabic Language Correction - Usage Guide

This guide will help you set up and run the Arabic language correction system which uses Gemini AI for more accurate Arabic text correction.

## System Architecture

The project consists of two main parts:

1. **Browser Extension (Client)**: A browser extension that adds a correction button to text inputs in web pages, allowing users to correct Arabic text.
2. **Node.js Server**: A backend server that integrates with Google's Gemini AI and MongoDB to correct Arabic text and store correction history.

## Prerequisites

- Node.js (version 16+)
- MongoDB (local installation or cloud-based)
- Google Gemini API Key

## Setting Up and Running the Server

1. **Navigate to the server directory**:

   ```bash
   cd server
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:
   The `.env` file has been set up with:

   - MongoDB URI
   - Gemini API Key
   - Port (default: 5000)

4. **Start the server**:

   ```bash
   npm start
   ```

   The server will be available at `http://localhost:5000`.

5. **Verify the server is running**:
   Open a browser and navigate to `http://localhost:5000`. You should see a success message.

## Using the Extension

1. **Install the extension in Chrome**:

   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `client` directory

2. **Using the extension on websites**:
   - The extension adds a "تصحيح" (Correct) button next to Arabic text inputs
   - Click the button to correct the Arabic text in the input field
   - The corrected text will replace the original text

## How It Works

1. When you click the correction button, the extension sends the Arabic text to the server.
2. The server processes the text using Google's Gemini AI model, which understands Arabic language nuances.
3. The corrected text is returned to the extension and displayed to the user.
4. The correction is stored in the MongoDB database for future reference.

## Troubleshooting

### Server Issues

- **Cannot connect to MongoDB**:

  - Make sure MongoDB is running (`mongod` command)
  - Check the connection string in the `.env` file

- **Gemini API errors**:
  - Verify the API key in the `.env` file
  - Check API usage quotas and limits

### Extension Issues

- **Extension not working**:

  - Check that the server is running
  - Open the browser's developer console to see error messages
  - Ensure the extension has been loaded correctly in Chrome

- **No correction buttons appearing**:
  - The extension only adds buttons to text inputs containing Arabic text
  - Try refreshing the page

## Future Improvements

- Add user authentication for the API
- Improve the UI of the correction button
- Add support for multiple text correction styles
- Create a correction history viewer in the extension
- Add more language correction options

## API Endpoints

- `POST /api/correct`: Corrects the provided Arabic text

  - Request body: `{ "text": "Arabic text to correct" }`
  - Response: `{ "success": true, "data": { "originalText": "...", "correctedText": "..." } }`

- `GET /api/corrections`: Retrieves correction history
  - Query parameters: `page` (default: 1), `limit` (default: 20)
  - Response: List of past corrections with pagination

## Acknowledgments

Special thanks to the Salam Hackathon for making this project possible. The hackathon provided the platform, resources, and inspiration needed to create this Arabic language correction tool. We're grateful for the opportunity to contribute to improving Arabic digital communication through technology.
