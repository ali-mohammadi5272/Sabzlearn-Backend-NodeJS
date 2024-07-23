const Ajv = require("ajv");
const { roles } = require("../../utils/constants");
const ajv = new Ajv();

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

module.exports.default = validate;
