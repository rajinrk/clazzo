const userModel = require("../models/userModel")
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

const userRegister = async (req, res) => {
  try {
    const { fullname, email, gender, phone, photo, username, password } = req.body;


    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Email already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: "clazzo",
    });
    
    const user = await new userModel({
      ...req.body,
      photo : cloudinaryResponse.secure_url,
      password: hashedPassword,  
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
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

const getAllUsers = async (req, res) => {
    try {
      const allUsers = await userModel.find();
      
      return res.status(200).json(allUsers);
    } catch (err) {
        console.log(err)
      return res.status(500).json({ error: err.message});
    }
  }

const editUser = async(req,res)=>{
    const {userID} = req.params
    const {fullname,email,gender,phone,photo,username,password} = req.body

    try{
        const user = userModel.findById(userID)
        let newPass = password
        let newPhoto = photo
        if(!user){
            return res.status(400).send('user not found')
        }
       
        
        if( password.length <  10){
          const hashedPassword = await bcrypt.hash(password, 10);
          newPass = hashedPassword
        }

        if(typeof(photo) !== 'string'){
          const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "image",
                folder: "clazzo",
              });

          newPhoto = cloudinaryResponse.secure_url
        }

        user.updateOne({ 
          ...req.body,
          password : newPass,
          photo : newPhoto

       }).then(()=>res.json({
        success:true,
        message : 'user updated'
       }))

      
       
    }
    catch(err){
       console.log(err)
        res.status(500).json({error:err})
    }
};

const deleteUser = async (req, res) => {
    const { userID} = req.params;
    try {
     await userModel.findByIdAndDelete(userID)
                    .then(()=>res.status(200).json({ 
                      success : true,
                      message : 'user deleted successfully' 
                    }))    
      } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };


module.exports = {userRegister,getAllUsers,editUser,deleteUser}