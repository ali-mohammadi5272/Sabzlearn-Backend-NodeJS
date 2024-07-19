const { default: userModel } = require("../models/user");
const { default: registerValidate } = require("../validators/auth/register");

const register = async (req, res) => {
  const isValidRequestBody = registerValidate(req.body);
  if (!isValidRequestBody) {
    return res.status(422).json({ message: registerValidate.error });
  }
  const { firstname, lastname, username, email, phone, password } = req.body;
  try {
    const addedUser = await userModel.create({
      firstname,
      lastname,
      username,
      email,
      phone,
      password,
    });
    if (!addedUser) {
      return res.status(500).json({ message: "User registration faild !!" });
    }
    return res
      .status(201)
      .json({ message: "User added successfully :))", user: addedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
};
