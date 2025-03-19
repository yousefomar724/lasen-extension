/// <reference types="chrome" />

// Background script for the Arabic Linguistic Correction extension
console.log('Background script loaded');

// API endpoints
const API_URL = 'http://localhost:5000/api';
const CORRECT_ENDPOINT = `${API_URL}/correct`;
const VALIDATE_ENDPOINT = `${API_URL}/validate`;

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	try {
		// Handle text correction request
		if (message.type === 'CORRECT_TEXT') {
			console.log('Background received correction request:', message.text);

			// Get the text to correct
			const arabicText = message.text;

			// Implement a timeout to ensure we always respond
			const responseTimeout = setTimeout(() => {
				console.warn('Response timeout - falling back to local correction');
				const correctedText = mockArabicCorrection(arabicText);
				try {
					sendResponse({ correctedText });
				} catch (error) {
					console.error('Error sending timeout response:', error);
				}
			}, 5000); // 5 second timeout

			// Call the API to correct the text
			correctTextWithAPI(arabicText)
				.then((correctedText) => {
					clearTimeout(responseTimeout);
					console.log('Text corrected successfully:', correctedText);
					try {
						sendResponse({ correctedText });
					} catch (error) {
						console.error('Error sending success response:', error);
					}
				})
				.catch((error) => {
					clearTimeout(responseTimeout);
					console.error('Error correcting text:', error);
					// Fall back to local correction if API fails
					const correctedText = mockArabicCorrection(arabicText);
					console.log('Fallback correction applied:', correctedText);
					try {
						sendResponse({ correctedText });
					} catch (error) {
						console.error('Error sending fallback response:', error);
					}
				});

			return true; // Required for async response
		}

		// Handle text validation request
		else if (message.type === 'VALIDATE_TEXT') {
			console.log('Background received validation request:', message.text);

			// Get the text to validate
			const arabicText = message.text;

			// Implement a timeout to ensure we always respond
			const responseTimeout = setTimeout(() => {
				console.warn('Validation timeout - returning empty result');
				try {
					sendResponse({ incorrectWords: [] });
				} catch (error) {
					console.error('Error sending validation timeout response:', error);
				}
			}, 3000); // 3 second timeout for validation

			// Call the API to validate the text
			validateTextWithAPI(arabicText)
				.then((validationResult) => {
					clearTimeout(responseTimeout);
					console.log('Text validation results:', validationResult);

					// Add additional logging to see what we're sending to content script
					if (validationResult && validationResult.incorrectWords) {
						console.log(
							`Sending ${validationResult.incorrectWords.length} incorrect words to content script:`,
							JSON.stringify(validationResult.incorrectWords)
						);
					} else {
						console.warn('No incorrect words to send to content script');
					}

					try {
						sendResponse(validationResult);
					} catch (error) {
						console.error('Error sending validation response:', error);
					}
				})
				.catch((error) => {
					clearTimeout(responseTimeout);
					console.error('Error validating text:', error);
					// Return empty results on error
					try {
						sendResponse({ incorrectWords: [] });
					} catch (error) {
						console.error('Error sending fallback validation response:', error);
					}
				});

			return true; // Required for async response
		}
	} catch (error) {
		console.error('Error handling message in background script:', error);
		try {
			sendResponse({ error: 'An unexpected error occurred' });
		} catch (responseError) {
			console.error('Error sending error response:', responseError);
		}
		return true;
	}
});

// Function to call the correction API
async function correctTextWithAPI(text: string): Promise<string> {
	console.log('Calling API to correct text:', text);
	try {
		const response = await fetch(CORRECT_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ text }),
		});

		if (!response.ok) {
			throw new Error(`API responded with status: ${response.status}`);
		}

		const data = await response.json();
		return data.success && data.data.correctedText
			? data.data.correctedText
			: text;
	} catch (error) {
		console.error('API error:', error);
		throw error;
	}
}

// Function to call the validation API
async function validateTextWithAPI(text: string): Promise<{
	incorrectWords: Array<{
		word: string;
		startIndex: number;
		endIndex: number;
		suggestions?: string[];
	}>;
}> {
	console.log('Calling API to validate text:', text);
	try {
		const response = await fetch(VALIDATE_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ text }),
		});

		if (!response.ok) {
			console.error(
				`Validation API error: ${response.status}, ${await response.text()}`
			);
			throw new Error(
				`Validation API responded with status: ${response.status}`
			);
		}

		// Log raw response for debugging
		const responseText = await response.text();
		console.log('Raw validation response:', responseText);

		// Parse the JSON response
		let data;
		try {
			data = JSON.parse(responseText);
		} catch (parseError) {
			console.error('JSON parse error:', parseError, 'Raw text:', responseText);
			throw new Error('Failed to parse validation response as JSON');
		}

		// Check response structure
		if (!data.success) {
			console.error('Validation API returned error:', data);
			return { incorrectWords: [] };
		}

		// Ensure data.data exists and has incorrectWords array
		if (
			data.data &&
			data.data.incorrectWords &&
			Array.isArray(data.data.incorrectWords)
		) {
			console.log('Valid validation result:', data.data);
			return data.data;
		} else {
			console.error('Validation API returned unexpected data structure:', data);
			return { incorrectWords: [] };
		}
	} catch (error) {
		console.error('Validation API error:', error);
		throw error;
	}
}

// Mock correction function for fallback
function mockArabicCorrection(text: string): string {
	// Simple replacements for common Arabic errors
	const corrections: { [key: string]: string } = {
		انا: 'أنا',
		هاذا: 'هذا',
		هاذه: 'هذه',
		إنشاءالله: 'إن شاء الله',
	};

	let correctedText = text;
	Object.keys(corrections).forEach((error) => {
		const regex = new RegExp(error, 'g');
		correctedText = correctedText.replace(regex, corrections[error]);
	});

	return correctedText;
}
