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
    categoryId: {
      type: "string",
    },
    href: {
      type: "string",
    },

    publish: {
      type: "number",
    },
  },
  required: ["title", "body", "categoryId", "href", "publish"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
