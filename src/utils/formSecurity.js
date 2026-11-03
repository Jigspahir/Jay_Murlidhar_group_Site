/**
 * JAY MURLIDHAR GROUP (JMG) — PUBLIC FORM SECURITY LAYER
 * 
 * Client-Side Defensive Security:
 * - Anti-bot honeypot detection
 * - Client-side rate limiting / submission throttling
 * - Strict length boundaries & string sanitization (null-byte stripping, whitespace normalization)
 * - Safe error handling (prevents internal diagnostic leakage)
 */

// Storage key for client-side submission rate tracking
const RATE_LIMIT_PREFIX = 'jmg_form_ts_';
const DEFAULT_COOLDOWN_MS = 8000; // 8 seconds cooldown between submissions of the same form

/**
 * Sanitizes input string by stripping null bytes, normalizing whitespace, and bounding length
 */
export function sanitizeString(val, maxLength = 255) {
  if (typeof val !== 'string') return '';
  return val
    .replace(/\0/g, '') // Strip null bytes
    .replace(/[\u202A-\u202E\u2066-\u2069]/g, '') // Strip Unicode bidirectional override characters
    .trim()
    .slice(0, maxLength);
}

/**
 * Checks if a honeypot field contains any value (indicative of automated spam bot)
 * Returns true if CLEAN (human), false if SPAM BOT detected.
 */
export function verifyHoneypot(honeypotValue) {
  if (!honeypotValue) return true;
  return honeypotValue.trim().length === 0;
}

/**
 * Checks client-side submission cooldown to prevent spam bombing
 * Returns true if submission is PERMITTED, false if THROTTLED.
 */
export function checkSubmissionCooldown(formKey = 'default', cooldownMs = DEFAULT_COOLDOWN_MS) {
  try {
    const key = `${RATE_LIMIT_PREFIX}${formKey}`;
    const lastTime = sessionStorage.getItem(key);
    const now = Date.now();

    if (lastTime && now - Number(lastTime) < cooldownMs) {
      const waitSeconds = Math.ceil((cooldownMs - (now - Number(lastTime))) / 1000);
      return {
        allowed: false,
        message: `Please wait ${waitSeconds}s before submitting again.`
      };
    }

    sessionStorage.setItem(key, String(now));
    return { allowed: true };
  } catch {
    // If sessionStorage is disabled/blocked by browser privacy mode, permit submission
    return { allowed: true };
  }
}

/**
 * Validates and sanitizes standard public inquiry form fields
 */
export function validatePublicInquiry({
  name = '',
  email = '',
  phone = '',
  message = '',
  honeypot = ''
}) {
  // 1. Honeypot Bot Check
  if (!verifyHoneypot(honeypot)) {
    return {
      isValid: false,
      isBot: true,
      error: 'Submission rejected.'
    };
  }

  // 2. Sanitization
  const cleanName = sanitizeString(name, 100);
  const cleanEmail = sanitizeString(email, 120).toLowerCase();
  const cleanPhone = sanitizeString(phone, 25);
  const cleanMessage = sanitizeString(message, 2000);

  // 3. Validation
  if (!cleanName || cleanName.length < 2) {
    return { isValid: false, error: 'Please enter a valid full name (minimum 2 characters).' };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  if (cleanPhone) {
    // Digits, spaces, dashes, parentheses and leading +
    const phoneRegex = /^[+]?[\d\s().-]{7,25}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return { isValid: false, error: 'Please enter a valid phone number (e.g. +91 98765 43210).' };
    }
  }

  return {
    isValid: true,
    data: {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage
    }
  };
}

