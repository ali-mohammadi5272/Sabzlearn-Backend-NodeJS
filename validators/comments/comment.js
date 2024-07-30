const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    body: {
      type: "string",
      minLength: 1,
    },
    courseId: {
      type: "string",
    },
    score: {
      type: "number",
    },
  },
  required: ["body", "courseId", "score"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports.default = validate;
