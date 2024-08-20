const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    title: {
      type: "string",
    },
    href: {
      type: "string",
    },
    parent: {
      type: "string",
    },
  },
  required: ["title", "href"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
