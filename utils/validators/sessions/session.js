const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 1,
    },
    time: {
      type: "string",
      minLength: 5,
      pattern: `^[0-5][0-9]:(([1-5][0-9])|([0-5][1-9]))$`,
    },
    free: {
      type: "boolean",
      enum: [true, false],
    },
    courseId: {
      type: "string",
    },
  },
  required: ["title", "time", "free", "courseId"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
