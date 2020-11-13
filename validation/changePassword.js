const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateChangePassword(data) {
  let errors = {};

  data.currentpassword = !isEmpty(data.currentpassword) ? data.currentpassword : "";
  data.newpassword = !isEmpty(data.newpassword) ? data.newpassword : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (Validator.isEmpty(data.newpassword)) {
    errors.newpassword = "New Password cannot be empty";
  }

  if (Validator.isEmpty(data.currentpassword)) {
    errors.currentpassword = "Current Password field is required";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm New Password field is required";
  }

  if (!Validator.isLength(data.newpassword, { min: 6, max: 30 })) {
    errors.newpassword = "Password must be at least 6 characters";
    errors.password2 = "Password must be at least 6 characters";
  }

  if (!Validator.equals(data.newpassword, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  
return {
    errors,
    isValid: isEmpty(errors)
  };
};