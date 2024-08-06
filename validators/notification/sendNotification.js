const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    message: {
      type: "string",
    },
    adminId: {
      type: "string",
    },
  },
  required: ["message", "adminId"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;
