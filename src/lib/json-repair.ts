/**
 * Robust JSON sanitizer & partial JSON repair utility.
 * Fixes unescaped control characters, unescaped quotes, and auto-closes
 * truncated JSON strings, objects, and arrays from AI responses.
 */
export function safeParseAIJson<T = any>(jsonString: string): T {
  let cleaned = jsonString.trim();

  // Strip Markdown code block wrappers
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "").trim();
  }

  // Try standard parse first
  try {
    return JSON.parse(cleaned);
  } catch {
    /* proceed to repair */
  }

  // Attempt to repair truncated strings, arrays, and objects
  let repaired = autoCloseJson(cleaned);

  try {
    return JSON.parse(repaired);
  } catch (err: any) {
    // Second fallback: strip unescaped control chars
    repaired = repaired.replace(/[\u0000-\u001F]+/g, " ");
    try {
      return JSON.parse(repaired);
    } catch {
      throw new Error(
        "The AI response was truncated or contained invalid formatting. Please reduce the number of scenes or try again."
      );
    }
  }
}

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

  // If stuck inside an unclosed string, close the quote
  if (inString) {
    result += '"';
  }

  // Remove trailing commas inside unclosed objects/arrays
  result = result.replace(/,\s*$/, "");

  // Close unclosed objects and arrays in reverse order
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
