// Something@something.tld: enough to catch typos without rejecting real addresses
export const isEmail = (text) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim())
