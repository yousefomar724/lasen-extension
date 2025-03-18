// Content script for the Arabic Linguistic Correction extension
console.log("Arabic Correction content script loaded")

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
`

// Add correction button to text fields
function addCorrectionButtons() {
  // Get all text input fields, textareas, and contenteditable elements
  const textInputs = document.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement
  >('input[type="text"], textarea')
  const editableElements = document.querySelectorAll<HTMLElement>(
    '[contenteditable="true"]'
  )

  // Process regular input fields and textareas
  textInputs.forEach((input) => {
    addButtonToField(input)
  })

  // Process contenteditable elements
  editableElements.forEach((element) => {
    addButtonToField(element)
  })
}

// Track active element to ensure we're correcting the right field
let activeField: HTMLElement | null = null

// Add button next to a specific field
function addButtonToField(field: HTMLElement) {
  // Check if this field already has our button
  if (field.hasAttribute("data-arabic-correction-processed")) {
    return
  }

  // Mark as processed
  field.setAttribute("data-arabic-correction-processed", "true")

  // Create correction button
  const button = document.createElement("button")
  button.textContent = "تصحيح" // "Correct" in Arabic
  button.className = "arabic-correction-button"
  button.style.cssText = BUTTON_STYLES

  // Make field's parent position relative if it's static
  const fieldParent = field.parentElement
  if (fieldParent && getComputedStyle(fieldParent).position === "static") {
    fieldParent.style.position = "relative"
  }

  // Initial position, will be adjusted based on the field's position
  button.style.display = "none"

  // Append to document body
  document.body.appendChild(button)

  // Position the button next to the field
  updateButtonPosition(button, field)
  button.style.display = "block"

  // Add click event to correct text
  button.addEventListener("click", () => {
    // Ensure we're correcting the active field
    if (activeField === field) {
      correctText(field)
    } else if (document.activeElement === field) {
      // Handle case where activeField tracking failed but DOM activeElement is correct
      correctText(field)
    } else {
      // Focus the field to make it active then correct it
      field.focus()
      setTimeout(() => correctText(field), 50)
    }
  })

  // Update button position on scroll and resize
  window.addEventListener(
    "scroll",
    () => updateButtonPosition(button, field),
    true
  )
  window.addEventListener("resize", () => updateButtonPosition(button, field))

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
}

// Update button position relative to the field
function updateButtonPosition(button: HTMLButtonElement, field: HTMLElement) {
  const fieldRect = field.getBoundingClientRect()

  button.style.top = `${window.scrollY + fieldRect.top}px`
  button.style.left = `${window.scrollX + fieldRect.right + 5}px`
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
      // Send to background script for correction
      chrome.runtime.sendMessage(
        {
          type: "CORRECT_TEXT",
          text: text,
        },
        (response) => {
          console.log("Received correction response:", response)

          if (response && response.correctedText) {
            // Update the field with corrected text
            if (
              field instanceof HTMLInputElement ||
              field instanceof HTMLTextAreaElement
            ) {
              field.value = response.correctedText
              // Trigger input event to notify the page of the change
              field.dispatchEvent(new Event("input", { bubbles: true }))
            } else if (field.hasAttribute("contenteditable")) {
              field.innerText = response.correctedText
              // Trigger input event for contenteditable
              field.dispatchEvent(new InputEvent("input", { bubbles: true }))
            }
          } else {
            console.error("No valid correction received from background script")
          }
        }
      )
    } else {
      // Handle the case where chrome.runtime is not available
      console.error("Chrome runtime API is not available")

      // Fallback to a local correction if running in a context without extension APIs
      const correctedText = localArabicCorrection(text)

      // Apply the correction to the field
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement
      ) {
        field.value = correctedText
        field.dispatchEvent(new Event("input", { bubbles: true }))
      } else if (field.hasAttribute("contenteditable")) {
        field.innerText = correctedText
        field.dispatchEvent(new InputEvent("input", { bubbles: true }))
      }
    }
  } else {
    console.log("Text is empty or does not contain Arabic:", text)
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
  // Initial scan for text fields
  addCorrectionButtons()

  // Observe DOM for dynamically added elements
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false

    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        shouldCheck = true
      }
    })

    if (shouldCheck) {
      addCorrectionButtons()
    }
  })

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

// Initialize the content script
init()
