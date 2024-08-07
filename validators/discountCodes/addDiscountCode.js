const Ajv = require("ajv");
const ajv = new Ajv();
require("ajv-keywords")(ajv, "transform");

const schema = {
  type: "object",
  properties: {
    code: {
      type: "string",
      minLength: 4,
    },
    percent: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    courses: {
      type: "array",
      uniqueItems: true,
      items: {
        type: "string",
        transform: ["trim", "toLowerCase"],
      },
      minItems: 1,
    },
    maxUse: {
      type: "number",
      minimum: 0,
    },
    expireTime: {
      type: "number",
      minimum: new Date().getTime(),
    },
  },
  required: ["code", "percent", "courses", "maxUse", "expireTime"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
