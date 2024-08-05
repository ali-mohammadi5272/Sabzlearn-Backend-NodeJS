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
    isAnswer: {
      type: "boolean",
    },
    mainCommentId: {
      type: ["string", "null"],
    },
  },
  required: ["body", "courseId", "score", "isAnswer"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
