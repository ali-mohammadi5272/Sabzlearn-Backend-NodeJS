const emailPattern = /^[\w\.\-_]+@[\w]{5,8}\.[a-z]{2,3}$/;
const phoneNumberPattern = /^(0|\+98)?9\d{9}$/;
const phoneNumberPrefixPattern = /^(0|\+98)/;
const sessionTimePattern = /^[0-5][0-9]:(([1-5][0-9])|([0-5][1-9]))$/;

module.exports = {
  emailPattern,
  phoneNumberPattern,
  phoneNumberPrefixPattern,
  sessionTimePattern,
};
