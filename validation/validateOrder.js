const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateOrder(data) {
  let errors = {};

  data.shopName = !isEmpty(data.shopName) ? data.shopName  : "";
  data.shopAddress = !isEmpty(data.shopAddress) ? data.shopAddress  : "";
  data.shippingAddress = !isEmpty(data.shippingAddress) ? data.shippingAddress  : "";

if (isNaN(data.quantity)) {
    errors.quantity = "This field must be Number";
  } else {
      if (data.quantity > data.available) {
          errors.quantity = "The maximum available vaccine is " + data.available.toString();
      }
  }

  if (isNaN(data.price)) {
    errors.price = "This field must be Number";
  }

  if (data.contactNumber!=null && data.contactNumber.toString().length != 10) {
    errors.contactNumber = "This field must be of 10 digits";
  }

  if (isNaN(data.contactNumber)) {
    errors.contactNumber = "This field must be Number";
  }

  if (Validator.isEmpty(data.shopName)) {
    errors.shopName = "This field is required";
  }

  if (Validator.isEmpty(data.shopAddress)) {
    errors.shopAddress = "This field is required";
  }

  if (Validator.isEmpty(data.shippingAddress)) {
    errors.shippingAddress = "This field is required";
  }

  if (data.contactNumber==null || data.contactNumber=='') {
    errors.contactNumber = "This field is required";
  }

  if (data.quantity==null || data.quantity=='') {
    errors.quantity = "This field is required";
  }

  if (data.price==null || data.price=='') {
    errors.price = "This field is required";
  }

return {
    errors,
    isValid: isEmpty(errors)
  };
};