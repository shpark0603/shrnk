module.exports = result => {
  let validationErrorMessage = "올바르지 않은 ";

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

  validationErrorMessage += ", 다시 시도해주세요.";

  return validationErrorMessage;
};
