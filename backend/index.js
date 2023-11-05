const express = require("express");
const mongoose = require("mongoose");
const bodyParser =require("body-parser");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
require('dotenv').config()

const auth = require('./middleware/authMiddleware')
const {adminRegister, adminLogin} = require('./Routes/adminRoute');
const { userRegister, getAllUsers, editUser, deleteUser } = require("./Routes/userRoute");

const PORT= 1998;
const mongodb_url = 'mongodb+srv://clazzo_innovations:yi5mZZrQsuRLKLWx@cluster0.pt8bbn4.mongodb.net/?retryWrites=true&w=majority'
const app = express();
app.use(bodyParser.json());
app.use(cors())

const storage = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname).toLowerCase();
        if (ext !== ".jpg" && ext !== ".jpeg" &&  ext !== ".png") {
            cb(new Error("File type is not supported", false));
            return;
        }
        cb(null, true);
    }
})



app.post('/admin/register',adminRegister)
app.post('/admin/login',adminLogin)
app.post('/user/register',auth,storage.single('photo'),userRegister)
app.get('/user/allusers',getAllUsers)
app.put('/user/edit/:userID',auth,storage.single('photo'),editUser)
app.delete('/user/delete/:userID',auth,deleteUser)



app.get('/', (req, res) => {
    res.send('Hello From clazzo')
})

mongoose.connect(mongodb_url)
    .then(() => app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`)
        console.log('Connected to DataBase')
    })).catch(err => console.log(err.message))