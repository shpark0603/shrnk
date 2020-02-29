module.exports = result => {
  let validationErrorMessage = "Invalid ";

  result.errors.forEach((error, index) => {
    if (index === 0) {
      validationErrorMessage += error.param;
    } else if (
      index === result.errors.length - 1 &&
      result.errors.length !== 1
    ) {
      validationErrorMessage += ` and ${error.param}`;
    } else {
      validationErrorMessage += `, ${error.param}`;
    }
  });

  validationErrorMessage += ", please try again";

  return validationErrorMessage;
};
