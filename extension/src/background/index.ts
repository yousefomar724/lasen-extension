/// <reference types="chrome" />

// Background script for the Arabic Linguistic Correction extension
console.log("Background script loaded")

// API endpoints
const API_URL = "https://lasen-extension.vercel.app/api"
const CORRECT_ENDPOINT = `${API_URL}/correct`
const VALIDATE_ENDPOINT = `${API_URL}/validate`
const DIALECT_ENDPOINT = `${API_URL}/dialect`

// Define dialect names for menu display
const DIALECT_NAMES = {
  egyptian: "المصرية",
  levantine: "الشامية",
  gulf: "الخليجية",
  moroccan: "المغربية",
}

// Default dialect (will be updated from settings)
let defaultDialect = "egyptian"

// Create context menu items when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Create parent menu item
  chrome.contextMenus.create({
    id: "arabic-correction",
    title: "أداة تصحيح العربية",
    contexts: ["selection"],
  })

  // Create correction submenu
  chrome.contextMenus.create({
    id: "correct-text",
    parentId: "arabic-correction",
    title: "تصحيح النص",
    contexts: ["selection"],
  })

  // Create dialect conversion parent menu
  chrome.contextMenus.create({
    id: "convert-dialect",
    parentId: "arabic-correction",
    title: "تحويل اللهجة",
    contexts: ["selection"],
  })

  // Create dialect submenu items
  chrome.contextMenus.create({
    id: "dialect-egyptian",
    parentId: "convert-dialect",
    title: "المصرية",
    contexts: ["selection"],
  })

  chrome.contextMenus.create({
    id: "dialect-levantine",
    parentId: "convert-dialect",
    title: "الشامية",
    contexts: ["selection"],
  })

  chrome.contextMenus.create({
    id: "dialect-gulf",
    parentId: "convert-dialect",
    title: "الخليجية",
    contexts: ["selection"],
  })

  chrome.contextMenus.create({
    id: "dialect-moroccan",
    parentId: "convert-dialect",
    title: "المغربية",
    contexts: ["selection"],
  })

  // Create quick conversion to default dialect
  chrome.contextMenus.create({
    id: "convert-default-dialect",
    parentId: "arabic-correction",
    title: `تحويل إلى اللهجة الافتراضية (${
      DIALECT_NAMES[defaultDialect as keyof typeof DIALECT_NAMES]
    })`,
    contexts: ["selection"],
  })

  // Load default dialect from settings
  if (chrome.storage) {
    chrome.storage.sync.get({ defaultDialect: "egyptian" }, (items) => {
      defaultDialect = items.defaultDialect
      // Update the menu item
      chrome.contextMenus.update("convert-default-dialect", {
        title: `تحويل إلى اللهجة الافتراضية (${
          DIALECT_NAMES[defaultDialect as keyof typeof DIALECT_NAMES]
        })`,
      })
    })
  }
})

// Listen for storage changes to update defaultDialect
chrome.storage.onChanged.addListener((changes) => {
  if (changes.defaultDialect) {
    defaultDialect = changes.defaultDialect.newValue
    // Update the context menu
    chrome.contextMenus.update("convert-default-dialect", {
      title: `تحويل إلى اللهجة الافتراضية (${
        DIALECT_NAMES[defaultDialect as keyof typeof DIALECT_NAMES]
      })`,
    })
  }
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab?.id === undefined) return

  if (info.menuItemId === "correct-text") {
    chrome.tabs.sendMessage(tab.id, { action: "correctText" })
  } else if (info.menuItemId === "convert-default-dialect") {
    chrome.tabs.sendMessage(tab.id, {
      action: "convertDialect",
      dialect: defaultDialect,
    })
  } else if (info.menuItemId === "dialect-egyptian") {
    chrome.tabs.sendMessage(tab.id, {
      action: "convertDialect",
      dialect: "egyptian",
    })
  } else if (info.menuItemId === "dialect-levantine") {
    chrome.tabs.sendMessage(tab.id, {
      action: "convertDialect",
      dialect: "levantine",
    })
  } else if (info.menuItemId === "dialect-gulf") {
    chrome.tabs.sendMessage(tab.id, {
      action: "convertDialect",
      dialect: "gulf",
    })
  } else if (info.menuItemId === "dialect-moroccan") {
    chrome.tabs.sendMessage(tab.id, {
      action: "convertDialect",
      dialect: "moroccan",
    })
  }
})

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    // Handle text correction request
    if (message.type === "CORRECT_TEXT") {
      console.log("Background received correction request:", message.text)

      // Get the text to correct
      const arabicText = message.text

      // Implement a timeout to ensure we always respond
      const responseTimeout = setTimeout(() => {
        console.warn("Response timeout - falling back to local correction")
        const correctedText = mockArabicCorrection(arabicText)
        try {
          sendResponse({ correctedText })
        } catch (error) {
          console.error("Error sending timeout response:", error)
        }
      }, 5000) // 5 second timeout

      // Call the API to correct the text
      correctTextWithAPI(arabicText)
        .then((correctedText) => {
          clearTimeout(responseTimeout)
          console.log("Text corrected successfully:", correctedText)
          try {
            sendResponse({ correctedText })
          } catch (error) {
            console.error("Error sending success response:", error)
          }
        })
        .catch((error) => {
          clearTimeout(responseTimeout)
          console.error("Error correcting text:", error)
          // Fall back to local correction if API fails
          const correctedText = mockArabicCorrection(arabicText)
          console.log("Fallback correction applied:", correctedText)
          try {
            sendResponse({ correctedText })
          } catch (error) {
            console.error("Error sending fallback response:", error)
          }
        })

      return true // Required for async response
    }

    // Handle text validation request
    else if (message.type === "VALIDATE_TEXT") {
      console.log("Background received validation request:", message.text)

      // Get the text to validate
      const arabicText = message.text

      // Implement a timeout to ensure we always respond
      const responseTimeout = setTimeout(() => {
        console.warn("Validation timeout - returning empty result")
        try {
          sendResponse({ incorrectWords: [] })
        } catch (error) {
          console.error("Error sending validation timeout response:", error)
        }
      }, 3000) // 3 second timeout for validation

      // Call the API to validate the text
      validateTextWithAPI(arabicText)
        .then((validationResult) => {
          clearTimeout(responseTimeout)
          console.log("Text validation results:", validationResult)

          // Add additional logging to see what we're sending to content script
          if (validationResult && validationResult.incorrectWords) {
            console.log(
              `Sending ${validationResult.incorrectWords.length} incorrect words to content script:`,
              JSON.stringify(validationResult.incorrectWords)
            )
          } else {
            console.warn("No incorrect words to send to content script")
          }

          try {
            sendResponse(validationResult)
          } catch (error) {
            console.error("Error sending validation response:", error)
          }
        })
        .catch((error) => {
          clearTimeout(responseTimeout)
          console.error("Error validating text:", error)
          // Return empty results on error
          try {
            sendResponse({ incorrectWords: [] })
          } catch (error) {
            console.error("Error sending fallback validation response:", error)
          }
        })

      return true // Required for async response
    }

    // Handle dialect conversion request
    else if (message.type === "CONVERT_DIALECT") {
      console.log("Background received dialect conversion request:", message)

      // Get the text and dialect
      const arabicText = message.text
      const dialect = message.dialect || defaultDialect

      // Implement a timeout to ensure we always respond
      const responseTimeout = setTimeout(() => {
        console.warn("Dialect conversion timeout")
        try {
          sendResponse({
            convertedText: arabicText,
            success: false,
            error: "Timeout",
          })
        } catch (error) {
          console.error("Error sending timeout response:", error)
        }
      }, 5000) // 5 second timeout

      // Call the API to convert the dialect
      convertDialectWithAPI(arabicText, dialect)
        .then((convertedText) => {
          clearTimeout(responseTimeout)
          console.log("Text dialect converted successfully:", convertedText)
          try {
            sendResponse({ convertedText, success: true })
          } catch (error) {
            console.error("Error sending success response:", error)
          }
        })
        .catch((error) => {
          clearTimeout(responseTimeout)
          console.error("Error converting dialect:", error)
          try {
            sendResponse({
              convertedText: arabicText,
              success: false,
              error: error instanceof Error ? error.message : String(error),
            })
          } catch (error) {
            console.error("Error sending fallback response:", error)
          }
        })

      return true // Required for async response
    }
  } catch (error) {
    console.error("Error handling message in background script:", error)
    try {
      sendResponse({ error: "An unexpected error occurred" })
    } catch (responseError) {
      console.error("Error sending error response:", responseError)
    }
    return true
  }
})

// Function to call the correction API
async function correctTextWithAPI(text: string): Promise<string> {
  console.log("Calling API to correct text:", text)
  console.log("Using endpoint:", CORRECT_ENDPOINT)
  try {
    const response = await fetch(CORRECT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `API responded with status: ${response.status}, body: ${errorText}`
      )
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("API correction response:", data)
    return data.correctedText || text
  } catch (error) {
    console.error("API error:", error)
    throw error
  }
}

// Function to call the validation API
async function validateTextWithAPI(text: string): Promise<{
  incorrectWords: Array<{
    word: string
    startIndex: number
    endIndex: number
    suggestions?: string[]
  }>
}> {
  console.log("Calling API to validate text:", text)
  console.log("Using endpoint:", VALIDATE_ENDPOINT)
  try {
    const response = await fetch(VALIDATE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `Validation API error: ${response.status}, body: ${errorText}`
      )
      throw new Error(
        `Validation API responded with status: ${response.status}`
      )
    }

    // Log raw response for debugging
    const responseText = await response.text()
    console.log("Raw validation response:", responseText)

    // Parse the JSON response
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw text:", responseText)
      throw new Error("Failed to parse validation response as JSON")
    }

    // Check response structure
    if (!data.success && !data.data) {
      console.error("Validation API returned error:", data)
      return { incorrectWords: [] }
    }

    // Handle different response formats
    if (data.success && data.data && data.data.incorrectWords) {
      // Format from validate endpoint
      return { incorrectWords: data.data.incorrectWords }
    } else if (data.incorrectWords) {
      // Direct format
      return { incorrectWords: data.incorrectWords }
    } else {
      console.warn("Unexpected validation response format:", data)
      return { incorrectWords: [] }
    }
  } catch (error) {
    console.error("Validation API error:", error)
    throw error
  }
}

// Mock correction function for fallback
function mockArabicCorrection(text: string): string {
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

// Function to call the dialect conversion API
async function convertDialectWithAPI(
  text: string,
  dialect: string
): Promise<string> {
  console.log(`Calling API to convert text to ${dialect} dialect:`, text)
  console.log("Using endpoint:", DIALECT_ENDPOINT)
  try {
    const response = await fetch(DIALECT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, dialect }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `API responded with status: ${response.status}, body: ${errorText}`
      )
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("API dialect conversion response:", data)
    return data.convertedText || text
  } catch (error) {
    console.error("API error:", error)
    throw error
  }
}
