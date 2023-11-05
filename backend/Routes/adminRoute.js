const adminModel = require("../models/adminModel")
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken')

const adminRegister = async (req, res) => {
  try {
    const { username, password } = req.body;
   
    if (!username) {
      return res.send({ message: "username is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (password.length < 6) {
      return res.send({ message: "Password should have 6 charecters" });
    } 
    

    const exisitingUser = await adminModel.findOne({ username });
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "username already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await new adminModel({
      username,
      password: hashedPassword,
    }).save()

    res.status(201).send({
      success: true,
      message: "Admin Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};



const adminLogin = async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(404).send({
          success: false,
          message: "Invalid email or password",
        });
      }
      const admin = await adminModel.findOne({ username });
      if (!admin) {
        return res.status(404).send({
          success: false,
          message: "Email is not registerd",
        });
      }
  
      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        return res.status(200).send({
          success: false,
          message: "Invalid Password",
        });
      }
      const token = await JWT.sign({ _id: admin._id }, 'clazzoInnovations', {
        expiresIn: "7d",
      });
      res.status(200).send({
        success: true,
        message: "login successfully",
        admin: {
          _id: admin._id,
          username: admin.username, 
        },
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in login",
        error,
      });
    }
  };



module.exports = {adminRegister,adminLogin}