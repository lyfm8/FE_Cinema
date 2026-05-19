export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isRequired(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== undefined && value !== null && String(value).trim() !== '';
}

export function minLength(value, min = 6) {
  return String(value ?? '').trim().length >= min;
}

export function validateLoginForm(payload) {
  const errors = {};

  if (!isRequired(payload?.email)) {
    errors.email = 'Email is required.';
  } else if (!isEmail(payload.email)) {
    errors.email = 'Email format is invalid.';
  }

  if (!isRequired(payload?.password)) {
    errors.password = 'Password is required.';
  } else if (!minLength(payload.password, 6)) {
    errors.password = 'Password must have at least 6 characters.';
  }

  return errors;
}

export default {
  isEmail,
  isRequired,
  minLength,
  validateLoginForm,
};
