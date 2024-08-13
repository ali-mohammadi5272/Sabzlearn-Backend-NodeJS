const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    title: {
      type: "string",
    },
  },
  required: ["title"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
