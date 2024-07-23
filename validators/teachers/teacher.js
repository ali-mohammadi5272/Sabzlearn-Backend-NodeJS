const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    userId: {
      type: "string",
    },
  },
  required: ["userId"],
};

const validate = ajv.compile(schema);

module.exports.default = validate;
