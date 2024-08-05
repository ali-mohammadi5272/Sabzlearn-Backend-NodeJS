const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    identifier: {
      type: "string",
    },
    password: {
      type: "string",
      minLength: 8,
    },
  },
  required: ["password", "identifier"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
