exports.getSignupErrMsg = errors => {
  let validationErrorMessage = "";

  errors.errors.forEach((error, index) => {
    if (index === 0) {
      validationErrorMessage += error.param;
    } else if (
      index === errors.errors.length - 1 &&
      errors.errors.length !== 1
    ) {
      validationErrorMessage += ` and ${error.param}`;
    } else {
      validationErrorMessage += `, ${error.param}`;
    }
  });

  return validationErrorMessage;
};
