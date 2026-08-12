class AIResponseValidator {
  static sanitizeJSONString(rawResponse) {
    if (typeof rawResponse !== 'string') return '';
    let clean = rawResponse.trim();
    // Remove markdown code fences if present
    clean = clean.replace(/^```(?:json)?\s*/i, '');
    clean = clean.replace(/\s*```$/i, '');
    clean = clean.trim();
    return clean;
  }

  static parseAndValidate(rawResponse) {
    const sanitized = this.sanitizeJSONString(rawResponse);
    let parsed;
    try {
      parsed = JSON.parse(sanitized);
    } catch (parseError) {
      // Try extracting first { ... } block
      const firstBrace = sanitized.indexOf('{');
      const lastBrace = sanitized.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        const extracted = sanitized.slice(firstBrace, lastBrace + 1);
        try {
          parsed = JSON.parse(extracted);
        } catch (err) {
          throw new Error(`Invalid JSON output from AI provider: ${parseError.message}`);
        }
      } else {
        throw new Error(`Invalid JSON output from AI provider: ${parseError.message}`);
      }
    }

    // Validate essential properties
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('AI response is not a valid JSON object');
    }

    if (!Array.isArray(parsed.days) || parsed.days.length === 0) {
      throw new Error('AI response missing valid days array');
    }

    return parsed;
  }
}

module.exports = AIResponseValidator;
