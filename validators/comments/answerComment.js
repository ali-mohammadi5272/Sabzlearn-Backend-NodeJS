const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    body: {
      type: "string",
    },
  },
  required: ["body"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
