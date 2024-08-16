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
      type: ["string", "null"],
    },
  },
  required: ["title", "href", "parent"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
