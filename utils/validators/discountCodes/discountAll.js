const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    discount: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
  },
  required: ["discount"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
