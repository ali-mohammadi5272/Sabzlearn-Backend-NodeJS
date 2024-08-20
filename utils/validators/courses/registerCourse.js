const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    courseId: {
      type: "string",
    },
    price: {
      type: "number",
      minimum: 0,
    },
  },
  required: ["courseId", "price"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
