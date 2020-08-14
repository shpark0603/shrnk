module.exports = (originalURL) => {
  if (
    !originalURL.startsWith("https://") &&
    !originalURL.startsWith("http://")
  ) {
    originalURL = "http://" + originalURL;
  }

  return originalURL;
};
