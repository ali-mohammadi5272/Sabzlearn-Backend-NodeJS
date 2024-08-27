const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    file: {
      type: "object",
      properties: {
        fieldname: { type: "string" },
        originalname: { type: "string" },
        encoding: { type: "string" },
        mimetype: { type: "string" },
        destination: { type: "string" },
        filename: { type: "string" },
        path: { type: "string" },
        size: { type: "number" },
      },
      required: [
        "fieldname",
        "originalname",
        "encoding",
        "mimetype",
        "destination",
        "filename",
        "path",
        "size",
      ],
      additionalProperties: false,
    },
  },
  required: ["file"],
};

const validate = ajv.compile(schema);

module.exports = validate;
