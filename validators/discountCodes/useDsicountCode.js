const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    code: {
      type: "string",
      minLength: 4,
    },
  },
  required: ["code"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
