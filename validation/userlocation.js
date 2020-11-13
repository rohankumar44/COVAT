const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateUserLocationDetails(data) {
  let errors = {};

  data.locality = !isEmpty(data.locality) ? data.locality : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.state = !isEmpty(data.state) ? data.state : "";
  data.pin = !isEmpty(data.pin) ? data.pin : "";

  if (Validator.isEmpty(data.locality)) {
    errors.locality = "Locality field is required";
  }

  if (Validator.isEmpty(data.country)) {
    errors.country = "Country field is required";
  }

  if (Validator.isEmpty(data.state)) {
    errors.state = "State field is required";
  }

  if (Validator.isEmpty(data.pin)) {
    errors.pin = "PostalCode field is required";
  }
  
return {
    errors,
    isValid: isEmpty(errors)
  };
};