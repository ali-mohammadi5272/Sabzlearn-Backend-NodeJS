const Ajv = require("ajv");
const ajv = new Ajv();
const { roles } = require("../../constants");

const schema = {
  type: "object",
  properties: {
    role: {
      type: "string",
      minLength: 3,
      enum: [roles.admin, roles.teacher, roles.teacherHelper, roles.user],
    },
  },
  required: ["role"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
