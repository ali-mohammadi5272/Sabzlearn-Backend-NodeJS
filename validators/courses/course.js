const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 5,
    },
    shortDescription: {
      type: "string",
    },
    longDescription: {
      type: "string",
    },
    categoryId: {
      type: "string",
    },
    price: {
      type: "number",
      minimum: 0,
    },
    supportMethod: {
      type: "string",
    },
    watchMethod: {
      type: "string",
      enum: ["online", "offline"],
    },
    qualification: {
      type: "array",
      items: { type: "string" },
    },
    discount: {
      type: "number",
      minimum: 0,
    },
    status: {
      type: "string",
      enum: ["preSell", "in-Process", "completed", "stop-selling"],
    },
  },
  required: [
    "title",
    "shortDescription",
    "longDescription",
    "categoryId",
    "price",
    "supportMethod",
    "watchMethod",
    "qualification",
    "discount",
    "status",
  ],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
