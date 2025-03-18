/// <reference types="chrome" />

// Content script for the Arabic Linguistic Correction extension
console.log('Arabic Correction content script loaded');

// Default settings
interface UserSettings {
	processInputs: boolean;
	processTextareas: boolean;
	processContentEditable: boolean;
}

// Default settings - process all by default
let userSettings: UserSettings = {
	processInputs: true,
	processTextareas: true,
	processContentEditable: true,
};

// Track active element to ensure we're correcting the right field
let activeField: HTMLElement | null = null;

// Debounce timer for mutation observer
let debounceTimer: ReturnType<typeof setTimeout>;

// CSS styles for our button
const BUTTON_STYLES = `
  position: absolute;
  z-index: 10000;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 4px;
  font-family: Arial, sans-serif;
`;

// Load user settings from storage
function loadUserSettings() {
	if (typeof chrome !== 'undefined' && chrome.storage) {
		chrome.storage.sync.get(
			{
				processInputs: true,
				processTextareas: true,
				processContentEditable: true,
			},
			(items) => {
				userSettings = items as UserSettings;
				console.log('Loaded settings:', userSettings);
				// Re-process the page with new settings
				addCorrectionButtons();
			}
		);
	} else {
		// If storage API isn't available, use defaults and process anyway
		addCorrectionButtons();
	}
}

// Add correction button to text fields
function addCorrectionButtons() {
	console.log('Adding correction buttons with settings:', userSettings);

	// Get existing buttons to reuse them rather than recreating
	const existingButtons = document.querySelectorAll<HTMLButtonElement>(
		'.arabic-correction-button'
	);
	const buttonPool: HTMLButtonElement[] = Array.from(existingButtons);
	let buttonIndex = 0;

	// Track elements that were processed this time
	const processedElements = new Set<HTMLElement>();

	// Process text inputs if enabled
	if (userSettings.processInputs) {
		const textInputs =
			document.querySelectorAll<HTMLInputElement>('input[type="text"]');
		textInputs.forEach((input) => {
			if (!input.hasAttribute('data-arabic-correction-processed')) {
				processElement(input);
				processedElements.add(input);
			}
		});
	}

	// Process textareas if enabled
	if (userSettings.processTextareas) {
		const textareas =
			document.querySelectorAll<HTMLTextAreaElement>('textarea');
		textareas.forEach((textarea) => {
			if (!textarea.hasAttribute('data-arabic-correction-processed')) {
				processElement(textarea);
				processedElements.add(textarea);
			}
		});
	}

	// Process contenteditable elements if enabled
	if (userSettings.processContentEditable) {
		const editableElements = document.querySelectorAll<HTMLElement>(
			'[contenteditable="true"]'
		);
		editableElements.forEach((element) => {
			if (!element.hasAttribute('data-arabic-correction-processed')) {
				processElement(element);
				processedElements.add(element);
			}
		});
	}

	// Remove buttons for elements that are no longer eligible
	document
		.querySelectorAll<HTMLElement>('[data-arabic-correction-processed]')
		.forEach((element) => {
			if (!processedElements.has(element)) {
				// Check if settings would exclude this element
				const shouldProcess =
					(element instanceof HTMLInputElement &&
						element.type === 'text' &&
						userSettings.processInputs) ||
					(element instanceof HTMLTextAreaElement &&
						userSettings.processTextareas) ||
					(element.hasAttribute('contenteditable') &&
						userSettings.processContentEditable);

				if (!shouldProcess) {
					// Find and remove the button for this element
					const buttonId = element.getAttribute('data-correction-button-id');
					if (buttonId) {
						const button = document.querySelector(`#${buttonId}`);
						if (button) button.remove();
					}

					// Clear the processed flag
					element.removeAttribute('data-arabic-correction-processed');
					element.removeAttribute('data-correction-button-id');
				}
			}
		});

	// Remove any unused buttons from the pool
	while (buttonIndex < buttonPool.length) {
		buttonPool[buttonIndex].remove();
		buttonIndex++;
	}

	// Helper function to process a single element and add/reuse a button
	function processElement(element: HTMLElement) {
		// Reuse a button from the pool if available
		let button: HTMLButtonElement;

		if (buttonIndex < buttonPool.length) {
			button = buttonPool[buttonIndex];
			buttonIndex++;
		} else {
			// Create a new button if none available in the pool
			button = document.createElement('button');
			button.textContent = 'تصحيح'; // "Correct" in Arabic
			button.className = 'arabic-correction-button';
			button.style.cssText = BUTTON_STYLES;
			button.style.display = 'none';

			// Generate a unique ID for the button
			const buttonId =
				'arabic-correction-btn-' +
				Date.now() +
				'-' +
				Math.floor(Math.random() * 1000);
			button.id = buttonId;

			// Append to document body
			document.body.appendChild(button);
		}

		// Mark the element as processed and link it to its button
		element.setAttribute('data-arabic-correction-processed', 'true');
		const buttonId =
			button.id ||
			'arabic-correction-btn-' +
				Date.now() +
				'-' +
				Math.floor(Math.random() * 1000);
		button.id = buttonId;
		element.setAttribute('data-correction-button-id', buttonId);

		// Make sure it's visible on elements that have focus
		if (document.activeElement === element) {
			button.style.display = 'block';
		}

		// Position the button next to the field
		updateButtonPosition(button, element);

		// Make field's parent position relative if it's static
		const fieldParent = element.parentElement;
		if (fieldParent && getComputedStyle(fieldParent).position === 'static') {
			fieldParent.style.position = 'relative';
		}

		// Update event handlers
		setupButtonEvents(button, element);
	}
}

// Set up event handlers for a button and its associated input element
function setupButtonEvents(button: HTMLButtonElement, field: HTMLElement) {
	// Clear existing event listeners by cloning and replacing the button
	const newButton = button.cloneNode(true) as HTMLButtonElement;
	if (button.parentNode) {
		button.parentNode.replaceChild(newButton, button);
		button = newButton;
	}

	// Add click event to correct text
	button.addEventListener('click', () => {
		// Ensure we're correcting the active field
		if (activeField === field) {
			correctText(field);
		} else if (document.activeElement === field) {
			// Handle case where activeField tracking failed but DOM activeElement is correct
			correctText(field);
		} else {
			// Focus the field to make it active then correct it
			field.focus();
			setTimeout(() => correctText(field), 50);
		}
	});

	// For input fields, monitor focus state
	field.addEventListener('focus', () => {
		activeField = field;
		button.style.display = 'block';
		updateButtonPosition(button, field);
	});

	field.addEventListener('blur', (e) => {
		// Don't hide if user clicked our button
		if (e.relatedTarget !== button) {
			// Add small delay to allow button click to register
			setTimeout(() => {
				if (document.activeElement !== button) {
					button.style.display = 'none';
					if (activeField === field) {
						activeField = null;
					}
				}
			}, 200);
		}
	});

	// Update button position on scroll and resize
	window.addEventListener('scroll', () => updateButtonPosition(button, field), {
		passive: true,
	});
	window.addEventListener('resize', () => updateButtonPosition(button, field), {
		passive: true,
	});
}

// Update button position relative to the field
function updateButtonPosition(button: HTMLButtonElement, field: HTMLElement) {
	const fieldRect = field.getBoundingClientRect();

	button.style.top = `${window.scrollY + fieldRect.top}px`;
	button.style.left = `${window.scrollX + fieldRect.right + 5}px`;
}

// Correct the text in a field
function correctText(field: HTMLElement) {
	let text = '';

	// Get text based on field type
	if (
		field instanceof HTMLInputElement ||
		field instanceof HTMLTextAreaElement
	) {
		text = field.value;
		console.log('Correcting input/textarea with text:', text);
	} else if (field.hasAttribute('contenteditable')) {
		text = field.innerText;
		console.log('Correcting contenteditable with text:', text);
	}

	// Only process if there's text and it appears to contain Arabic
	if (text && containsArabic(text)) {
		console.log('Sending text for correction:', text);

		// Check if chrome.runtime is available
		if (typeof chrome !== 'undefined' && chrome.runtime) {
			// Send to background script for correction
			try {
				chrome.runtime.sendMessage(
					{
						type: 'CORRECT_TEXT',
						text: text,
					},
					(response) => {
						// Check for runtime.lastError
						if (chrome.runtime.lastError) {
							console.error(
								'Error sending to background:',
								chrome.runtime.lastError.message
							);
							// Fall back to local correction
							const correctedText = localArabicCorrection(text);
							applyCorrection(field, correctedText);
							return;
						}

						console.log('Received correction response:', response);

						if (response && response.correctedText) {
							// Update the field with corrected text
							applyCorrection(field, response.correctedText);
						} else {
							console.error(
								'No valid correction received from background script'
							);
							// Fall back to local correction
							const correctedText = localArabicCorrection(text);
							applyCorrection(field, correctedText);
						}
					}
				);
			} catch (error) {
				console.error('Exception sending message:', error);
				// Fall back to local correction
				const correctedText = localArabicCorrection(text);
				applyCorrection(field, correctedText);
			}
		} else {
			// Handle the case where chrome.runtime is not available
			console.error('Chrome runtime API is not available');

			// Fallback to a local correction if running in a context without extension APIs
			const correctedText = localArabicCorrection(text);
			applyCorrection(field, correctedText);
		}
	} else {
		console.log('Text is empty or does not contain Arabic:', text);
	}
}

// Helper function to apply correction to a field
function applyCorrection(field: HTMLElement, correctedText: string) {
	if (
		field instanceof HTMLInputElement ||
		field instanceof HTMLTextAreaElement
	) {
		field.value = correctedText;
		field.dispatchEvent(new Event('input', { bubbles: true }));
	} else if (field.hasAttribute('contenteditable')) {
		field.innerText = correctedText;
		field.dispatchEvent(new InputEvent('input', { bubbles: true }));
	}
}

// Basic local correction function as a fallback
function localArabicCorrection(text: string): string {
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

// Function to check if text contains Arabic characters
function containsArabic(text: string): boolean {
	const arabicPattern = /[\u0600-\u06FF]/;
	return arabicPattern.test(text);
}

// Run when content script loads
function init() {
	// Load user settings first, which will call addCorrectionButtons when ready
	loadUserSettings();

	// Set up mutation observer to catch dynamic elements
	const observer = new MutationObserver((mutations) => {
		let shouldCheck = false;

		// Check if mutations are worth processing
		for (const mutation of mutations) {
			// Skip our own modifications if possible
			if (mutation.target instanceof Element) {
				if (
					mutation.target.classList.contains('arabic-correction-button') ||
					mutation.target.hasAttribute('data-arabic-correction-processed')
				) {
					continue;
				}

				// Skip attribute mutations on elements we've already processed
				if (
					mutation.type === 'attributes' &&
					mutation.target.hasAttribute('data-arabic-correction-processed')
				) {
					continue;
				}
			}

			// Only care about added nodes that might contain inputs
			if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
				// Check if any of the added nodes are elements we care about
				for (const node of mutation.addedNodes) {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const element = node as Element;

						// If this is a form element or might contain form elements
						if (
							element.tagName === 'INPUT' ||
							element.tagName === 'TEXTAREA' ||
							element.hasAttribute('contenteditable') ||
							element.querySelectorAll('input, textarea, [contenteditable]')
								.length > 0
						) {
							shouldCheck = true;
							break;
						}
					}
				}

				if (shouldCheck) break;
			}
		}

		if (shouldCheck) {
			// Use a debounce to avoid excessive processing
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				addCorrectionButtons();
			}, 500);
		}
	});

	// Start observing
	observer.observe(document.body, {
		childList: true,
		subtree: true,
		attributes: false, // Don't need to watch attributes
	});

	// Listen for settings changes from the popup
	if (typeof chrome !== 'undefined' && chrome.runtime) {
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			try {
				if (message.type === 'SETTINGS_UPDATED') {
					console.log('Settings updated, reloading...');
					loadUserSettings();
					// Always send a response, even if it's just to acknowledge receipt
					sendResponse({ success: true });
				}
			} catch (error) {
				console.error('Error handling message:', error);
				// Send error response
				sendResponse({ success: false, error: error.message });
			}

			// Return true to indicate we will send a response asynchronously
			return true;
		});
	}
}

// Initialize the content script
init();
