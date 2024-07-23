const Ajv = require("ajv");
const ajv = new Ajv({
  allErrors: true,
  $data: true,
});

const schema = {
  type: "object",
  properties: {
    firstname: {
      type: "string",
      minLength: 3,
    },
    lastname: {
      type: "string",
      minLength: 3,
    },
    username: {
      type: "string",
      minLength: 3,
    },
    email: {
      type: "string",
      pattern: `^[\\w\\.-_]+@[\\w]{5,8}\\.[a-z]{2,3}$`,
    },
    phone: {
      type: "string",
      pattern: `^(0|\\+98)?9\\d{9}$`,
    },
    password: {
      type: "string",
      minLength: 8,
    },
    confirmPassword: {
      const: {
        $data: "1/password",
      },
      type: "string",
    },
  },
  required: [
    "firstname",
    "lastname",
    "username",
    "email",
    "phone",
    "password",
    "confirmPassword",
  ],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports.default = validate;
