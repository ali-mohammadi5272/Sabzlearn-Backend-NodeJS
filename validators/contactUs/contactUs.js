const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    fullname: {
      type: "string",
      minLength: 5,
    },
    email: {
      type: "string",
      pattern: `^[\\w\\.-_]+@[\\w]{5,8}\\.[a-z]{2,3}$`,
    },
    phone: {
      type: "string",
      pattern: `^(0|\\+98)?9\\d{9}$`,
    },
    body: {
      type: "string",
      minLength: 1,
    },
  },
  required: ["fullname", "email", "phone", "body"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
