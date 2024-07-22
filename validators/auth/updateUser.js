const Ajv = require("ajv");
const ajv = new Ajv();

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
    },
    phone: {
      type: "string",
      pattern: `^(0|\\+98)?9\\d{9}$`,
    },
    password: {
      type: "string",
      minLength: 8,
    },
  },
  required: ["firstname", "lastname", "username", "email", "phone", "password"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports.default = validate;
