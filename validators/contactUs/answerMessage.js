const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    subject: {
      type: "string",
      minLength: 3,
    },
    body: {
      type: "string",
      minLength: 1,
    },
  },
  required: ["subject", "body"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
