const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 1,
    },
    href: {
      type: "string",
      minLength: 5,
      enum: ["front-end", "back-end"],
    },
  },
  required: ["title", "href"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
