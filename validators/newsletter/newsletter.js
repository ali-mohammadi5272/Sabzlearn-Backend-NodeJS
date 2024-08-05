const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      pattern: `^[\\w\\.-_]+@[\\w]{5,8}\\.[a-z]{2,3}$`,
    },
  },
  required: ["email"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
