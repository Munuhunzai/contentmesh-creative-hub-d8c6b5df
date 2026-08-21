/**
 * Advanced AI JSON Sanitizer & Truncation Repair Utility.
 * Handles unescaped newlines, control characters, unescaped quotes,
 * and recovers complete scenes even if the AI output was cut off mid-sentence.
 */
export function safeParseAIJson<T = any>(jsonString: string): T {
  if (!jsonString || typeof jsonString !== "string") {
    throw new Error("Empty AI response received.");
  }

  let cleaned = jsonString.trim();

  // 1. Strip Markdown code block backticks if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(json)?\n?/, "")
      .replace(/\n?```$/, "")
      .trim();
  }

  // 2. Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch {
    /* proceed to sanitization & repair */
  }

  // 3. Sanitize raw unescaped newlines within JSON strings
  const sanitizedNewlines = sanitizeJsonStringNewlines(cleaned);
  try {
    return JSON.parse(sanitizedNewlines);
  } catch {
    /* proceed to auto-close */
  }

  // 4. Attempt simple auto-close
  const simpleAutoClosed = autoCloseJson(sanitizedNewlines);
  try {
    return JSON.parse(simpleAutoClosed);
  } catch {
    /* proceed to partial array truncation recovery */
  }

  // 5. Truncation Recovery: Drop incomplete last object in arrays
  const recoveredJson = recoverTruncatedJsonArray(sanitizedNewlines);
  try {
    return JSON.parse(recoveredJson);
  } catch {
    /* final attempt: strip invalid control characters */
  }

  // 6. Final attempt: Strip control chars & parse
  try {
    const finalCleaned = autoCloseJson(cleaned.replace(/[\u0000-\u001F]+/g, " "));
    return JSON.parse(finalCleaned);
  } catch (err: any) {
    console.error("Failed to repair JSON output:", err, "Original Length:", jsonString.length);
    throw new Error(
      "The AI response was truncated due to prompt size limits. Please try again or select fewer scenes.",
    );
  }
}

/**
 * Replaces unescaped raw newlines/tabs inside quotes with escaped \n / \t
 */
function sanitizeJsonStringNewlines(str: string): string {
  let result = "";
  let inString = false;
  let isEscaped = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (isEscaped) {
      result += char;
      isEscaped = false;
      continue;
    }

    if (char === "\\") {
      result += char;
      isEscaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }

    if (inString) {
      if (char === "\n") {
        result += "\\n";
      } else if (char === "\r") {
        // omit \r inside string
      } else if (char === "\t") {
        result += "\\t";
      } else {
        result += char;
      }
    } else {
      result += char;
    }
  }

  return result;
}

/**
 * Recovers truncated JSON arrays (like "scenes": [{...}, {...}, {"partial": ...])
 * by stripping back to the last complete "}" object before truncation.
 */
function recoverTruncatedJsonArray(str: string): string {
  // Find last complete object closing brace '}' inside array
  const lastObjectBraceIndex = str.lastIndexOf("}");
  if (lastObjectBraceIndex === -1) return autoCloseJson(str);

  // Trim everything after the last valid object brace
  let truncatedStr = str.substring(0, lastObjectBraceIndex + 1);

  // Clean trailing commas
  truncatedStr = truncatedStr.replace(/,\s*$/, "");

  // Auto-close remaining brackets/braces
  return autoCloseJson(truncatedStr);
}

/**
 * Auto-closes unclosed strings, objects, and arrays.
 */
function autoCloseJson(str: string): string {
  let inString = false;
  let isEscaped = false;
  const stack: string[] = [];

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (isEscaped) {
      isEscaped = false;
      continue;
    }

    if (char === "\\") {
      isEscaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === "{" || char === "[") {
        stack.push(char);
      } else if (char === "}") {
        if (stack[stack.length - 1] === "{") stack.pop();
      } else if (char === "]") {
        if (stack[stack.length - 1] === "[") stack.pop();
      }
    }
  }

  let result = str;

  // If stuck inside string, close it
  if (inString) {
    result += '"';
  }

  // Remove trailing comma
  result = result.replace(/,\s*$/, "");

  // Close remaining open brackets & braces
  while (stack.length > 0) {
    const openChar = stack.pop();
    if (openChar === "{") {
      result += "}";
    } else if (openChar === "[") {
      result += "]";
    }
  }

  return result;
}
