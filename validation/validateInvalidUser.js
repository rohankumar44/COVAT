const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateInvalidUser(data) {
  let errors = {};

  data.details = !isEmpty(data.details) ? data.details : "";

  if (Validator.isEmpty(data.details)) {
    errors.details = "required";
  }
  
return {
    errors,
    isValid: isEmpty(errors)
  };
};