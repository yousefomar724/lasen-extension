/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="chrome" />

// Content script for the Arabic Linguistic Correction extension
console.log("Arabic Correction content script loaded")

// Default settings
interface UserSettings {
  processInputs: boolean
  processTextareas: boolean
  processContentEditable: boolean
  instantCheck: boolean
}

// Default settings - process all by default, but don't do instant checking
let userSettings: UserSettings = {
  processInputs: true,
  processTextareas: true,
  processContentEditable: true,
  instantCheck: false,
}

// Track active element to ensure we're correcting the right field
let activeField: HTMLElement | null = null

// Debounce timer for mutation observer
let debounceTimer: ReturnType<typeof setTimeout>

// CSS styles for our button
const BUTTON_STYLES = `
  position: absolute;
  z-index: 10000;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease;
  padding: 0;
  overflow: hidden;
  transform: scale(1);
`

// Hover effects are set dynamically in the event handlers
// See setupButtonEvents function for implementation

// Correction icon SVG (pen icon in React Icons style)
// This is based on a common "edit" icon from React Icons libraries
const CORRECTION_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: auto;">
  <path d="M12 20h9"></path>
  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
</svg>
`

// CSS for highlighting incorrect words
const HIGHLIGHT_STYLES = `
  .arabic-correction-highlight {
    position: relative !important;
    display: inline-block !important;
    color: inherit !important;
    text-decoration: none !important;
    padding-bottom: 2px !important;
  }
  
  .arabic-correction-highlight::after {
    content: '' !important;
    position: absolute !important;
    bottom: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 2px !important;
    background-color: #f44336 !important;
    border-radius: 1px !important;
    z-index: 1 !important;
    pointer-events: none !important;
    animation: arabic-correction-pulse 2s infinite !important;
  }
  
  @keyframes arabic-correction-pulse {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
  }
`

// Load user settings from storage
function loadUserSettings() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.sync.get(
      {
        processInputs: true,
        processTextareas: true,
        processContentEditable: true,
        instantCheck: false,
      },
      (items) => {
        userSettings = items as UserSettings
        console.log("Settings loaded:", userSettings)
        // Re-process the page with new settings
        addCorrectionButtons()
      }
    )
  } else {
    // If storage API isn't available, use defaults and process anyway
    addCorrectionButtons()
  }
}

// Add correction button to text fields
function addCorrectionButtons() {
  console.log("Adding correction buttons with settings:", userSettings)

  // Get existing buttons to reuse them rather than recreating
  const existingButtons = document.querySelectorAll<HTMLButtonElement>(
    ".arabic-correction-button"
  )
  const buttonPool: HTMLButtonElement[] = Array.from(existingButtons)
  let buttonIndex = 0

  // Track elements that were processed this time
  const processedElements = new Set<HTMLElement>()

  // Process text inputs if enabled
  if (userSettings.processInputs) {
    const textInputs =
      document.querySelectorAll<HTMLInputElement>('input[type="text"]')
    textInputs.forEach((input) => {
      if (!input.hasAttribute("data-arabic-correction-processed")) {
        processElement(input)
        processedElements.add(input)
      }
    })
  }

  // Process textareas if enabled
  if (userSettings.processTextareas) {
    const textareas = document.querySelectorAll<HTMLTextAreaElement>("textarea")
    textareas.forEach((textarea) => {
      if (!textarea.hasAttribute("data-arabic-correction-processed")) {
        processElement(textarea)
        processedElements.add(textarea)
      }
    })
  }

  // Process contenteditable elements if enabled
  if (userSettings.processContentEditable) {
    const editableElements = document.querySelectorAll<HTMLElement>(
      '[contenteditable="true"]'
    )
    editableElements.forEach((element) => {
      if (!element.hasAttribute("data-arabic-correction-processed")) {
        processElement(element)
        processedElements.add(element)
      }
    })
  }

  // Remove buttons for elements that are no longer eligible
  document
    .querySelectorAll<HTMLElement>("[data-arabic-correction-processed]")
    .forEach((element) => {
      if (!processedElements.has(element)) {
        // Check if settings would exclude this element
        const shouldProcess =
          (element instanceof HTMLInputElement &&
            element.type === "text" &&
            userSettings.processInputs) ||
          (element instanceof HTMLTextAreaElement &&
            userSettings.processTextareas) ||
          (element.hasAttribute("contenteditable") &&
            userSettings.processContentEditable)

        if (!shouldProcess) {
          // Find and remove the button for this element
          const buttonId = element.getAttribute("data-correction-button-id")
          if (buttonId) {
            const button = document.querySelector(`#${buttonId}`)
            if (button) button.remove()
          }

          // Clear the processed flag
          element.removeAttribute("data-arabic-correction-processed")
          element.removeAttribute("data-correction-button-id")
        }
      }
    })

  // Remove any unused buttons from the pool
  while (buttonIndex < buttonPool.length) {
    buttonPool[buttonIndex].remove()
    buttonIndex++
  }

  // Helper function to process a single element and add/reuse a button
  function processElement(element: HTMLElement) {
    // Reuse a button from the pool if available
    let button: HTMLButtonElement

    if (buttonIndex < buttonPool.length) {
      button = buttonPool[buttonIndex]
      buttonIndex++

      // Update the HTML content and styles of the reused button
      button.innerHTML = CORRECTION_ICON
      button.style.cssText = BUTTON_STYLES
      button.title = "تصحيح النص" // Add tooltip: "Correct text" in Arabic

      // Ensure icon is centered
      ensureIconCentered(button)
    } else {
      // Create a new button if none available in the pool
      button = document.createElement("button")
      button.innerHTML = CORRECTION_ICON
      button.className = "arabic-correction-button"
      button.style.cssText = BUTTON_STYLES
      button.style.display = "none"
      button.title = "تصحيح النص" // Add tooltip: "Correct text" in Arabic

      // Ensure icon is centered
      ensureIconCentered(button)

      // Generate a unique ID for the button
      const buttonId =
        "arabic-correction-btn-" +
        Date.now() +
        "-" +
        Math.floor(Math.random() * 1000)
      button.id = buttonId

      // Append to document body
      document.body.appendChild(button)
    }

    // Mark the element as processed and link it to its button
    element.setAttribute("data-arabic-correction-processed", "true")
    const buttonId =
      button.id ||
      "arabic-correction-btn-" +
        Date.now() +
        "-" +
        Math.floor(Math.random() * 1000)
    button.id = buttonId
    element.setAttribute("data-correction-button-id", buttonId)

    // Make sure it's visible on elements that have focus
    if (document.activeElement === element) {
      button.style.display = "block"
    }

    // Position the button next to the field
    updateButtonPosition(button, element)

    // Make field's parent position relative if it's static
    const fieldParent = element.parentElement
    if (fieldParent && getComputedStyle(fieldParent).position === "static") {
      fieldParent.style.position = "relative"
    }

    // Update event handlers
    setupButtonEvents(button, element)

    // Set up validation for this element
    setupValidation(element)
  }
}

// Set up event handlers for a button and its associated input element
function setupButtonEvents(button: HTMLButtonElement, field: HTMLElement) {
  // Add click event
  button.addEventListener("click", () => {
    // Get the text from the field
    let text = ""
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement
    ) {
      text = field.value
    } else if (field.getAttribute("contenteditable") === "true") {
      text = field.innerText || field.textContent || ""
    }

    if (!text.trim()) {
      console.log("No text to correct")
      return
    }

    // Correct the text
    correctText(field)
  })

  // Add hover effects
  button.addEventListener("mouseenter", () => {
    button.style.backgroundColor = "#3367d6" // Darker blue
    button.style.transform = "scale(1.1)" // Slight zoom
    button.style.boxShadow = "0 3px 7px rgba(0, 0, 0, 0.3)" // Enhanced shadow
  })

  button.addEventListener("mouseleave", () => {
    button.style.backgroundColor = "#4285f4" // Original color
    button.style.transform = "scale(1)" // Original scale
    button.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.25)" // Original shadow
  })

  // For input fields, monitor focus state
  field.addEventListener("focus", () => {
    activeField = field
    button.style.display = "block"
    updateButtonPosition(button, field)
  })

  field.addEventListener("blur", (e) => {
    // Don't hide if user clicked our button
    if (e.relatedTarget !== button) {
      // Add small delay to allow button click to register
      setTimeout(() => {
        if (document.activeElement !== button) {
          button.style.display = "none"
          if (activeField === field) {
            activeField = null
          }
        }
      }, 200)
    }
  })

  // Update button position on scroll and resize
  window.addEventListener("scroll", () => updateButtonPosition(button, field), {
    passive: true,
  })
  window.addEventListener("resize", () => updateButtonPosition(button, field), {
    passive: true,
  })
}

// Update button position relative to the field
function updateButtonPosition(button: HTMLButtonElement, field: HTMLElement) {
  const fieldRect = field.getBoundingClientRect()

  // Position the button to the right of the field with a small gap
  const gap = 8 // Gap between field and button
  const buttonSize = 28 // Button size is now 28px

  // Center vertically with the field
  const topPosition =
    window.scrollY + fieldRect.top + (fieldRect.height - buttonSize) / 2

  // Position to the right of the field (outside)
  const leftPosition = window.scrollX + fieldRect.right + gap

  button.style.top = `${topPosition}px`
  button.style.left = `${leftPosition}px`

  // Add hover effect
  button.onmouseover = () => {
    button.style.backgroundColor = "#3367d6"
    button.style.transform = "scale(1.1)"
    button.style.boxShadow = "0 3px 7px rgba(0, 0, 0, 0.3)"
  }

  button.onmouseout = () => {
    button.style.backgroundColor = "#4285f4"
    button.style.transform = "scale(1)"
    button.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.25)"
  }
}

// Correct the text in a field
function correctText(field: HTMLElement) {
  let text = ""

  // Get text based on field type
  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement
  ) {
    text = field.value
    console.log("Correcting input/textarea with text:", text)
  } else if (field.hasAttribute("contenteditable")) {
    text = field.innerText
    console.log("Correcting contenteditable with text:", text)
  }

  // Only process if there's text and it appears to contain Arabic
  if (text && containsArabic(text)) {
    console.log("Sending text for correction:", text)

    // Check if chrome.runtime is available
    if (typeof chrome !== "undefined" && chrome.runtime) {
      // Check if extension context is still valid
      if (chrome.runtime.id === undefined) {
        console.warn(
          "Extension context has been invalidated while correcting text"
        )
        // Fall back to local correction
        const correctedText = localArabicCorrection(text)
        applyCorrection(field, correctedText)
        return
      }

      // Send to background script for correction
      try {
        console.log("Sending message to background for correction")
        chrome.runtime.sendMessage(
          {
            type: "CORRECT_TEXT",
            text: text,
          },
          (response) => {
            // Check for runtime.lastError
            if (chrome.runtime.lastError) {
              const errorMessage = chrome.runtime.lastError.message || ""
              console.error("Error sending to background:", errorMessage)

              // If the error is about invalidated context, attempt recovery
              if (errorMessage.includes("invalidated")) {
                console.warn(
                  "Extension context has been invalidated during correction"
                )
                // We can still correct text locally
              }

              // Fall back to local correction
              const correctedText = localArabicCorrection(text)
              applyCorrection(field, correctedText)
              return
            }

            console.log("Received correction response:", response)

            if (response && response.correctedText) {
              // Update the field with corrected text
              applyCorrection(field, response.correctedText)
            } else {
              console.error(
                "No valid correction received from background script:",
                response
              )
              // Fall back to local correction
              const correctedText = localArabicCorrection(text)
              applyCorrection(field, correctedText)
            }
          }
        )
      } catch (error) {
        console.error("Exception sending message:", error)

        // If the extension context is invalidated, log it but still correct
        if (
          error instanceof Error &&
          (error.message.includes("Extension context invalidated") ||
            error.message.includes("Invalid extension"))
        ) {
          console.warn(
            "Extension context invalidated during correction - using local fallback"
          )
        }

        // Fall back to local correction
        const correctedText = localArabicCorrection(text)
        applyCorrection(field, correctedText)
      }
    } else {
      // Handle the case where chrome.runtime is not available
      console.error("Chrome runtime API is not available")

      // Fallback to a local correction if running in a context without extension APIs
      const correctedText = localArabicCorrection(text)
      applyCorrection(field, correctedText)
    }
  } else {
    console.log("Text is empty or does not contain Arabic:", text)
  }
}

// Helper function to apply correction to a field
function applyCorrection(field: HTMLElement, correctedText: string) {
  // Clear any existing highlights first
  clearHighlights(field)

  // Apply the correction
  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement
  ) {
    field.value = correctedText
    field.dispatchEvent(new Event("input", { bubbles: true }))
  } else if (field.hasAttribute("contenteditable")) {
    // Now set the corrected text
    field.innerText = correctedText
    field.dispatchEvent(new InputEvent("input", { bubbles: true }))
  }
}

// Basic local correction function as a fallback
function localArabicCorrection(text: string): string {
  // Simple replacements for common Arabic errors
  const corrections: { [key: string]: string } = {
    انا: "أنا",
    هاذا: "هذا",
    هاذه: "هذه",
    إنشاءالله: "إن شاء الله",
  }

  let correctedText = text
  Object.keys(corrections).forEach((error) => {
    const regex = new RegExp(error, "g")
    correctedText = correctedText.replace(regex, corrections[error])
  })

  return correctedText
}

// Function to check if text contains Arabic characters
function containsArabic(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF]/
  return arabicPattern.test(text)
}

// Run when content script loads
function init() {
  try {
    // Check if extension context is valid
    if (typeof chrome !== "undefined" && chrome.runtime) {
      try {
        // This will throw if context is invalidated
        const isValid = chrome.runtime.id !== undefined
        if (!isValid) {
          console.warn("Extension context is invalidated at initialization")
          // We still proceed with local functionality
        }
      } catch (e) {
        console.warn("Error checking extension context at initialization:", e)
        // We still proceed with local functionality
      }
    }

    // Add styles for text highlighting
    addHighlightStyles()

    // Load user settings first, which will call addCorrectionButtons when ready
    loadUserSettings()

    // Set up mutation observer to catch dynamic elements
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false

      // Check if mutations are worth processing
      for (const mutation of mutations) {
        // Skip our own modifications if possible
        if (mutation.target instanceof Element) {
          if (
            mutation.target.classList.contains("arabic-correction-button") ||
            mutation.target.hasAttribute("data-arabic-correction-processed")
          ) {
            continue
          }

          // Skip attribute mutations on elements we've already processed
          if (
            mutation.type === "attributes" &&
            mutation.target.hasAttribute("data-arabic-correction-processed")
          ) {
            continue
          }
        }

        // Only care about added nodes that might contain inputs
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          // Check if any of the added nodes are elements we care about
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element

              // If this is a form element or might contain form elements
              if (
                element.tagName === "INPUT" ||
                element.tagName === "TEXTAREA" ||
                element.hasAttribute("contenteditable") ||
                element.querySelectorAll("input, textarea, [contenteditable]")
                  .length > 0
              ) {
                shouldCheck = true
                break
              }
            }
          }

          if (shouldCheck) break
        }
      }

      if (shouldCheck) {
        // Use a debounce to avoid excessive processing
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          try {
            addCorrectionButtons()
          } catch (e) {
            console.error("Error adding correction buttons:", e)
          }
        }, 500)
      }
    })

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false, // Don't need to watch attributes
    })

    // Listen for settings changes from the popup
    if (typeof chrome !== "undefined" && chrome.runtime) {
      try {
        chrome.runtime.onMessage.addListener(
          (message, sender, sendResponse) => {
            try {
              if (message.type === "SETTINGS_UPDATED") {
                console.log("Settings updated, reloading...")
                loadUserSettings()
                // Always send a response, even if it's just to acknowledge receipt
                sendResponse({ success: true })
              }
            } catch (error) {
              console.error("Error handling message:", error)
              // Send error response
              sendResponse({
                success: false,
                error: error instanceof Error ? error.message : String(error),
              })
            }

            // Return true to indicate we will send a response asynchronously
            return true
          }
        )
      } catch (e) {
        console.warn(
          "Could not set up message listener due to extension context issues:",
          e
        )
      }
    }

    console.log("Arabic correction content script initialized successfully")
  } catch (e) {
    console.error("Error during content script initialization:", e)
    // Try to continue with basic functionality
    try {
      addHighlightStyles()
    } catch (styleError) {
      console.error("Could not add highlight styles:", styleError)
    }
  }
}

// Initialize the content script
init()

// Helper function to ensure icon is properly centered in the button
function ensureIconCentered(button: HTMLButtonElement) {
  // Make sure SVG is centered by styling the button's content
  const svg = button.querySelector("svg")
  if (svg) {
    svg.style.display = "block"
    svg.style.margin = "auto"
    svg.style.position = "absolute"
    svg.style.top = "50%"
    svg.style.left = "50%"
    svg.style.transform = "translate(-50%, -50%)"
  }
}

// Add highlight styles to the page
function addHighlightStyles() {
  if (!document.getElementById("arabic-correction-styles")) {
    const styleEl = document.createElement("style")
    styleEl.id = "arabic-correction-styles"
    styleEl.textContent = HIGHLIGHT_STYLES
    document.head.appendChild(styleEl)
  }
}

// Debounce function for performance
function debounce<F extends (...args: unknown[]) => void>(
  func: F,
  wait: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<F>) {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
      timeout = null
    }, wait)
  }
}

// Setup validation only if instantCheck is enabled
function setupValidation(field: HTMLElement) {
  if (!userSettings.instantCheck) {
    return // Skip validation if instant check is disabled
  }

  // Different handling based on field type
  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement
  ) {
    // For regular input fields and textareas
    const validateInputDebounced = debounce((e: any) => {
      const text = (e.target as HTMLInputElement | HTMLTextAreaElement).value
      if (text && containsArabic(text)) {
        validateText(text, field)
      }
    }, 800) // Debounce 800ms

    field.addEventListener("input", validateInputDebounced)
  } else if (field.hasAttribute("contenteditable")) {
    // For contenteditable elements
    const validateContenteditableDebounced = debounce((e: any) => {
      const text = (e.target as HTMLElement).innerText
      if (text && containsArabic(text)) {
        validateText(text, field)
      }
    }, 800) // Debounce 800ms

    field.addEventListener("input", validateContenteditableDebounced)
  }
}

// Validate text and highlight incorrect words
function validateText(text: string, field: HTMLElement) {
  // Don't validate if field is empty or too short
  if (!text || text.length < 2) {
    return
  }

  // Skip if text doesn't contain Arabic
  if (!containsArabic(text)) {
    return
  }

  console.log(
    "Validating text:",
    text.substring(0, 20) + (text.length > 20 ? "..." : "")
  )

  // Check if chrome.runtime is available
  if (typeof chrome !== "undefined" && chrome.runtime) {
    try {
      // First check if extension context is still valid
      if (chrome.runtime.id === undefined) {
        console.warn(
          "Extension context has been invalidated - reloading content script"
        )
        // Reload the page to re-initialize the content script
        window.location.reload()
        return
      }

      chrome.runtime.sendMessage(
        {
          type: "VALIDATE_TEXT",
          text: text,
        },
        (response) => {
          // Check for runtime.lastError
          if (chrome.runtime.lastError) {
            const errorMessage = chrome.runtime.lastError.message || ""
            console.error("Error validating text:", errorMessage)

            // If the error is about invalidated context, attempt to reload
            if (errorMessage.includes("invalidated")) {
              console.warn(
                "Extension context has been invalidated - clearing state"
              )
              clearHighlights(field)
              // We don't reload here as it might create an infinite loop
              // Instead just clear any UI elements we've added
              document
                .querySelectorAll(
                  ".arabic-correction-button, .arabic-correction-overlay"
                )
                .forEach((el) => el.remove())
            }
            return
          }

          console.log("Validation response received from background:", response)

          // Verify response structure
          if (
            response &&
            typeof response === "object" &&
            "incorrectWords" in response &&
            Array.isArray(response.incorrectWords)
          ) {
            console.log(
              `Received ${response.incorrectWords.length} incorrect words for highlighting`
            )

            // Output each incorrect word for debugging
            if (response.incorrectWords.length > 0) {
              response.incorrectWords.forEach((word) => {
                console.log(
                  `Word: "${word.word}" at ${word.startIndex}-${word.endIndex}`
                )
              })
            }

            // Apply highlighting with the incorrect words
            highlightIncorrectWords(field, text, response.incorrectWords)
          } else {
            console.warn("Invalid validation response format:", response)
            // Clear any existing highlights since we can't validate
            clearHighlights(field)
          }
        }
      )
    } catch (error) {
      console.error("Exception sending validation message:", error)

      // If the extension context is invalidated, attempt to reload
      if (
        error instanceof Error &&
        (error.message.includes("Extension context invalidated") ||
          error.message.includes("Invalid extension"))
      ) {
        console.warn("Detected extension context invalidation - clearing state")
        clearHighlights(field)
        // Remove all our UI elements
        document
          .querySelectorAll(
            ".arabic-correction-button, .arabic-correction-overlay"
          )
          .forEach((el) => el.remove())

        // Load styles again when extension is reloaded
        addHighlightStyles()
      }
    }
  }
}

// Clear highlights from a field
function clearHighlights(field: HTMLElement) {
  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement
  ) {
    // Clear border indicators
    field.style.borderColor = ""
    field.style.borderWidth = ""
    field.style.borderStyle = ""
    field.removeAttribute("data-has-incorrect-words")

    // Remove any overlay
    if (field.id) {
      const existingOverlay = document.querySelector(
        `[data-overlay-for="${field.id}"]`
      )
      if (existingOverlay) {
        existingOverlay.remove()
      }
    }
  } else if (field.hasAttribute("contenteditable")) {
    // Clear any highlights in contenteditable
    const highlights = field.querySelectorAll(".arabic-correction-highlight")
    if (highlights.length > 0) {
      highlights.forEach((h) => {
        const parent = h.parentNode
        if (parent) {
          parent.replaceChild(document.createTextNode(h.textContent || ""), h)
        }
      })
      field.normalize() // Merge adjacent text nodes
    }
    field.removeAttribute("data-has-incorrect-words")
  }
}

// Highlight incorrect words in the text
function highlightIncorrectWords(
  field: HTMLElement,
  text: string,
  incorrectWords: Array<{
    word: string
    startIndex: number
    endIndex: number
    suggestions?: string[]
  }>
) {
  // Different handling based on field type
  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement
  ) {
    // For input/textarea, we need to add a highlight overlay
    createHighlightOverlay(field, text, incorrectWords)
  } else if (field.hasAttribute("contenteditable")) {
    // For contenteditable, we can modify the HTML directly
    highlightContentEditableText(field as HTMLElement, text, incorrectWords)
  }
}

// Create overlay div for highlighting text in inputs/textareas
function createHighlightOverlay(
  field: HTMLInputElement | HTMLTextAreaElement,
  text: string,
  incorrectWords: Array<{
    word: string
    startIndex: number
    endIndex: number
    suggestions?: string[]
  }>
) {
  // Remove any existing overlay
  const existingOverlay = document.querySelector(
    `[data-overlay-for="${field.id}"]`
  )
  if (existingOverlay) {
    existingOverlay.remove()
  }

  // Clear any existing highlights
  field.style.borderColor = ""
  field.style.borderWidth = ""
  field.style.borderStyle = ""
  field.removeAttribute("data-has-incorrect-words")

  // Skip if no incorrect words
  if (incorrectWords.length === 0) {
    return
  }

  // Ensure field has an ID
  if (!field.id) {
    field.id =
      "arabic-field-" + Date.now() + "-" + Math.floor(Math.random() * 1000)
  }

  // Mark field as having incorrect words
  field.setAttribute("data-has-incorrect-words", "true")

  // Create an enhanced overlay with underlines for the incorrect words
  try {
    // Create an overlay container
    const overlay = document.createElement("div")
    overlay.style.position = "absolute"
    overlay.style.pointerEvents = "none"
    overlay.style.zIndex = "100000" // Increased z-index to ensure visibility
    overlay.setAttribute("data-overlay-for", field.id)
    overlay.className = "arabic-correction-overlay"

    // Position it relative to the field
    const rect = field.getBoundingClientRect()
    overlay.style.top = `${rect.top + window.scrollY}px`
    overlay.style.left = `${rect.left + window.scrollX}px`
    overlay.style.width = `${rect.width}px`
    overlay.style.height = `${rect.height}px`

    // Check if field is RTL
    const isRTL = getComputedStyle(field).direction === "rtl"

    // Calculate a more accurate character width based on the field's font
    const fontStyle = getComputedStyle(field)
    let approxCharWidth = 8 // Default fallback

    // Create a more accurate character width measurement
    const measureSpan = document.createElement("span")
    measureSpan.style.font = fontStyle.font
    measureSpan.style.visibility = "hidden"
    measureSpan.textContent = "ا" // Alef - common Arabic character for measurement
    document.body.appendChild(measureSpan)
    const spanWidth = measureSpan.getBoundingClientRect().width
    document.body.removeChild(measureSpan)

    if (spanWidth > 0) {
      approxCharWidth = spanWidth
    }
    console.log(`Using character width: ${approxCharWidth}px for highlighting`)

    // Add underlines for each incorrect word
    incorrectWords.forEach(({ word, startIndex, endIndex }) => {
      console.log(`Adding highlight for "${word}" at ${startIndex}-${endIndex}`)

      const wordText = text.substring(startIndex, endIndex)
      const underline = document.createElement("div")
      underline.className = "arabic-correction-underline"
      underline.style.position = "absolute"
      underline.style.height = "2px" // Thinner underline
      underline.style.backgroundColor = "#f44336"

      // Place the underline at the bottom of the text line
      // For single-line inputs, this is simpler
      if (field instanceof HTMLInputElement) {
        underline.style.bottom = "3px"
      } else {
        // For textareas, we need a different approach
        // Simplified: place it based on line height from the top
        // This will need enhancement for multi-line text
        const lineHeight = parseInt(fontStyle.lineHeight) || 20
        const lineIndex = text.substring(0, startIndex).split("\n").length - 1
        underline.style.top = `${lineIndex * lineHeight + lineHeight - 3}px`
      }

      // Calculate position based on text direction and field padding
      const paddingLeft = parseInt(fontStyle.paddingLeft) || 0
      const paddingRight = parseInt(fontStyle.paddingRight) || 0

      if (isRTL) {
        // For RTL text, calculate position from right
        const rightPosition =
          (text.length - endIndex) * approxCharWidth + paddingRight
        const width = (endIndex - startIndex) * approxCharWidth

        underline.style.right = `${rightPosition}px`
        underline.style.width = `${width}px`
      } else {
        // For LTR text, calculate position from left
        const leftPosition = startIndex * approxCharWidth + paddingLeft
        const width = (endIndex - startIndex) * approxCharWidth

        underline.style.left = `${leftPosition}px`
        underline.style.width = `${width}px`
      }

      // Add a tooltip with the word
      underline.title = wordText

      // Add animation for better visibility
      underline.style.animation = "arabic-correction-pulse 2s infinite"

      overlay.appendChild(underline)
    })

    // Add a pulsing animation for the underlines
    const styleEl = document.createElement("style")
    styleEl.textContent = `
			@keyframes arabic-correction-pulse {
				0% { opacity: 0.7; }
				50% { opacity: 1; }
				100% { opacity: 0.7; }
			}
		`
    overlay.appendChild(styleEl)

    document.body.appendChild(overlay)

    // Update overlay position on scroll and input
    const updateOverlayPosition = () => {
      const newRect = field.getBoundingClientRect()
      overlay.style.top = `${newRect.top + window.scrollY}px`
      overlay.style.left = `${newRect.left + window.scrollX}px`
      overlay.style.width = `${newRect.width}px`
      overlay.style.height = `${newRect.height}px`
    }

    window.addEventListener("scroll", updateOverlayPosition, { passive: true })
    field.addEventListener("input", updateOverlayPosition)
    window.addEventListener("resize", updateOverlayPosition, { passive: true })
    field.addEventListener("blur", () => {
      overlay.remove()
      window.removeEventListener("scroll", updateOverlayPosition)
      window.removeEventListener("resize", updateOverlayPosition)
    })
  } catch (error) {
    console.error("Error creating highlight overlay:", error)
  }
}

// Highlight incorrect words in contenteditable elements
function highlightContentEditableText(
  element: HTMLElement,
  text: string,
  incorrectWords: Array<{
    word: string
    startIndex: number
    endIndex: number
    suggestions?: string[]
  }>
) {
  // Skip if no incorrect words
  if (incorrectWords.length === 0) {
    // Clear any existing highlights
    const highlights = element.querySelectorAll(".arabic-correction-highlight")
    highlights.forEach((h) => {
      const parent = h.parentNode
      if (parent) {
        parent.replaceChild(document.createTextNode(h.textContent || ""), h)
        parent.normalize() // Merge adjacent text nodes
      }
    })
    // Remove the data attribute
    element.removeAttribute("data-has-incorrect-words")
    return
  }

  // Mark element as having incorrect words
  element.setAttribute("data-has-incorrect-words", "true")

  console.log(`Highlighting ${incorrectWords.length} words in contenteditable`)

  // First, get clean HTML without any previous highlights
  let cleanHTML = element.innerHTML
  // Remove any existing highlights
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = cleanHTML
  const existingHighlights = tempDiv.querySelectorAll(
    ".arabic-correction-highlight"
  )
  existingHighlights.forEach((node) => {
    const text = node.textContent || ""
    const parent = node.parentNode
    if (parent) {
      parent.replaceChild(document.createTextNode(text), node)
    }
  })
  cleanHTML = tempDiv.innerHTML

  // Now extract just the text content (without HTML tags)
  tempDiv.innerHTML = cleanHTML
  const plainText = tempDiv.textContent || ""

  // Sort words in reverse order (to avoid position shifts)
  const sortedWords = [...incorrectWords].sort(
    (a, b) => b.startIndex - a.startIndex
  )

  // Create a direct HTML replacement approach
  // First, create an array from the plaintext
  const chars = [...plainText]

  // Apply highlighting by wrapping each incorrect word in a span
  for (const word of sortedWords) {
    try {
      // Create the highlight span with an underline effect
      const highlightStart = `<span class="arabic-correction-highlight" data-original-word="${word.word}">`
      const highlightEnd = "</span>"

      // Insert the span tags at the appropriate positions
      chars.splice(word.endIndex, 0, highlightEnd)
      chars.splice(word.startIndex, 0, highlightStart)

      console.log(
        `Wrapped "${word.word}" at positions ${word.startIndex}-${word.endIndex} with highlight span`
      )
    } catch (err) {
      console.error(`Error highlighting word ${word.word}:`, err)
    }
  }

  // Reconstruct the text with highlights
  const highlightedText = chars.join("")

  // Insert the highlighted text into a temporary element
  // We'll use this to extract properly formed HTML
  const finalDiv = document.createElement("div")
  finalDiv.innerHTML = highlightedText

  // Finally, update the original element's HTML
  element.innerHTML = finalDiv.innerHTML

  console.log("Applied highlights to contenteditable")
}

// Handle messages from popup
chrome.runtime.onMessage.addListener(
  (message: { action: string; dialect?: string }) => {
    console.log("Message received in content script:", message)

    if (message.action === "correctText") {
      // Get currently selected text
      const selection = window.getSelection()
      if (selection && selection.toString().trim().length > 0) {
        const selectedText = selection.toString()

        // Process the correction
        processTextCorrection(selectedText, selection)
      } else {
        console.log("No text selected for correction")
      }
    }

    if (message.action === "convertDialect") {
      // Get currently selected text
      const selection = window.getSelection()
      if (selection && selection.toString().trim().length > 0) {
        const selectedText = selection.toString()

        // Check if dialect is defined
        if (message.dialect) {
          // Process the dialect conversion
          processDialectConversion(selectedText, selection, message.dialect)
        } else {
          console.log("No dialect specified for conversion")
        }
      } else {
        console.log("No text selected for dialect conversion")
      }
    }

    return true
  }
)

// Function to process text correction
async function processTextCorrection(text: string, selection: Selection) {
  try {
    // Call the API for correction
    const apiUrl = "http://localhost:3000/api/correct"
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    if (data.correctedText) {
      // Replace the selected text with the corrected text
      replaceSelectedText(selection, data.correctedText)
    }
  } catch (error) {
    console.error("Error correcting text:", error)
  }
}

// Function to process dialect conversion
async function processDialectConversion(
  text: string,
  selection: Selection,
  dialect: string
) {
  try {
    // Full URL for the API endpoint
    const baseUrl = "http://localhost:3000"
    const apiUrl = `${baseUrl}/api/dialect`

    // Call the API for dialect conversion
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, dialect }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API returned ${response.status}: ${errorText}`)
      throw new Error(
        `HTTP error! Status: ${response.status}, Details: ${errorText}`
      )
    }

    const data = await response.json()

    if (data.convertedText) {
      // Replace the selected text with the converted text
      replaceSelectedText(selection, data.convertedText)
    } else {
      alert("خطأ في تحويل النص. يرجى المحاولة مرة أخرى.")
    }
  } catch (error) {
    console.error("Error converting dialect:", error)
    alert("حدث خطأ أثناء تحويل النص. يرجى المحاولة مرة أخرى.")
  }
}

// Helper function to replace selected text
function replaceSelectedText(selection: Selection, newText: string) {
  const range = selection.getRangeAt(0)
  range.deleteContents()
  range.insertNode(document.createTextNode(newText))
}
