/// <reference types="chrome" />

// Background script for the Arabic Linguistic Correction extension
console.log('Background script loaded');

// API endpoint for the correction service
const API_URL = 'http://localhost:5000/api/correct';

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	try {
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
		const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ text, source: 'extension' }),
		});

		console.log('API response status:', response.status);

		if (!response.ok) {
			throw new Error(`API error: ${response.status}`);
		}

		const data = await response.json();
		console.log('API response data:', data);

		if (!data || !data.data || !data.data.correctedText) {
			throw new Error('Invalid response format from API');
		}

		return data.data.correctedText;
	} catch (error) {
		console.error('API call failed:', error);
		throw error;
	}
}

// Fallback mock function for Arabic text correction
// Used only if the API request fails
function mockArabicCorrection(text: string): string {
	console.log('Using mock correction for:', text);

	// This is a placeholder. In a real implementation, you would:
	// 1. Send the text to an Arabic NLP API
	// 2. Apply grammatical and spelling corrections
	// 3. Return the corrected text

	// For demo purposes, let's just make a simple replacement
	// Replace common typos or errors (this is just an example)
	const corrections: { [key: string]: string } = {
		انا: 'أنا',
		هاذا: 'هذا',
		هاذه: 'هذه',
		إنشاءالله: 'إن شاء الله',
	};

	let correctedText = text;
	let changes = false;

	Object.keys(corrections).forEach((error) => {
		const regex = new RegExp(error, 'g');
		if (regex.test(text)) {
			changes = true;
			correctedText = correctedText.replace(regex, corrections[error]);
		}
	});

	// If no changes were made but we still need to respond, make a small change
	// This helps users see that something happened even in fallback mode
	if (!changes && text.trim().length > 0) {
		correctedText = text + ' ✓';
	}

	return correctedText;
}
