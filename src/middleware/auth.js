require('dotenv').config();
const formdata = require("../models/formdata");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');



const auth = async (req,res,next) =>{
    try {
        const token = req.cookies.jwtlogin;
       
        const userverify = jwt.verify(token,process.env.SECRET_KEY);

        const user = await formdata.findOne({_id:userverify._id});
        // console.log(userverify);
        // console.log(user);
        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        res.status(401).send(error);
    }
};














module.exports = auth;