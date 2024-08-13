const departmentModel = require("../../models/department");
const addDepartmentValidate = require("../../validators/department/addDepartment");
const {
  checkDBCollectionIndexes,
} = require("../../utils/checkCollectionIndexes");

const addDepartment = async (req, res) => {
  const isValidRequestBody = addDepartmentValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json(addDepartmentValidate.errors);
  }
  const { title } = req.body;

  try {
    await checkDBCollectionIndexes(departmentModel);
  } catch (err) {
    const isTicketExistBefore = await departmentModel
      .findOne({
        $or: [{ title }],
      })
      .lean();
    if (isTicketExistBefore) {
      return res.status(422).json({ message: "Ticket is already exist !!" });
    }
  }

  try {
    const newTicket = await departmentModel.create(req.body);
    if (!newTicket) {
      return res.status(500).json({ message: "Add Ticket failed !!" });
    }
    const newTicketObject = newTicket.toObject();
    Reflect.deleteProperty(newTicketObject, "__v");

    return res.status(201).json({
      message: "Ticket added successfully :))",
      ticket: newTicketObject,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const departments = await departmentModel.find({}).select("title").lean();
    if (!departments) {
      return res.status(500).json({ message: "Internal Server Error !!" });
    }
    return res.status(200).json(departments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { addDepartment, getAll };
