const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    title: {
      type: "string",
    },
    body: {
      type: "string",
    },
    departmentId: {
      type: "string",
    },
  },
  required: ["title", "body", "departmentId"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
