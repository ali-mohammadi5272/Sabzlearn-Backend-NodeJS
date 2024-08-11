const Ajv = require("ajv");
const ajv = new Ajv();

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
    courseId: {
      type: "string",
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
  required: ["code", "percent", "courseId", "maxUse", "expireTime"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
