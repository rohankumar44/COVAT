const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateShopDetails(data) {
  let errors = {};

  data.shopName = !isEmpty(data.shopName) ? data.shopName  : "";

if (isNaN(data.available)) {
    errors.available = "This field must be Number";
  }

  if (isNaN(data.price)) {
    errors.price = "This field must be Number";
  }

  if (data.contactNumber!=null && data.contactNumber.toString().length != 10) {
    errors.contactnumber = "This field must be of 10 digits";
  }

  if (isNaN(data.contactNumber)) {
    errors.contactnumber = "This field must be Number";
  }

  if (Validator.isEmpty(data.shopName)) {
    errors.shopname = "This field is required";
  }

  if (data.contactNumber==null || data.contactNumber=='') {
    errors.contactnumber = "This field is required";
  }

  if (data.available==null || data.available == '' ) {
    errors.available = "This field is required";
  }

  if (data.price==null || data.price == '') {
    errors.price = "This field is required";
  }

return {
    errors,
    isValid: isEmpty(errors)
  };
};