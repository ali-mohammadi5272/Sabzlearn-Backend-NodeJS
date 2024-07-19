const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      minLength: 3,
    },
    email: {
      type: "string",
    },
    password: {
      type: "string",
      minLength: 8,
    },
  },
  oneOf: [{ required: ["username"] }, { required: ["email"] }],
  required: ["password"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports.default = validate;
