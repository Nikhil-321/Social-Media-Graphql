const validateUserEmail = (email) => {
  const errors = {};
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!email.match(emailRegex)) {
    console.log("Hello wrong email");
    errors.email = "Please enter a valid email id";
  }

  return {
    errors,
    valid: Object.keys(errors).length
  }
};

module.exports = validateUserEmail;
