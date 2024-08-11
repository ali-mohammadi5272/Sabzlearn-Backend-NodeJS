const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    code: {
      type: "string",
      minLength: 4,
    },
    courseId: {
      type: "string",
    },
  },
  required: ["code", "courseId"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
