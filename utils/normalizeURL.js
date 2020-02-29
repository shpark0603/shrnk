module.exports = originalURL => {
  originalURL = originalURL.toLowerCase();

  if (
    !originalURL.startsWith("https://") &&
    !originalURL.startsWith("http://")
  ) {
    originalURL = "http://" + originalURL;
  }

  return originalURL;
};
