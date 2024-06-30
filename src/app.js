require('dotenv').config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
require("./db/conn");
const formdata = require("./models/formdata")
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
// const port = process.env.port || 8000;


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended:false
}))




const pathdir = path.join(__dirname,"../public")
const templates_path = path.join(__dirname,"../templates/views")
const partial_path = path.join(__dirname,"../templates/partials")

app.use(express.static(pathdir));

app.set("view engine","hbs");
app.set("views",templates_path);
hbs.registerPartials(partial_path);




app.get("/",(req,res)=>{
    res.render('login');
})



app.get("/registration",(req,res)=>{
    res.render("registration");
})


app.post("/registration",async(req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if(password===cpassword){
            const newperson = new formdata(

                req.body
                // fname:req.body.fname,
                // lname:req.body.lname,
                // gender:req.body.gender,
                // address:req.body.address,
                // email:req.body.email,
                // phone:req.body.phone,
                // number:req.body.number,
                // password:req.body.password,
                // cpassword:req.body.cpassword,
                
            )

            // CREATING TOKEN

            console.log(process.env.SECRET_KEY);

            const token = jwt.sign({_id:newperson._id.toString()}, process.env.SECRET_KEY);
            newperson.tokens = newperson.tokens.concat({token:token});
        
            // const token = await newperson.generateAuthtoken();

            // ------------ CREATING TOKEN --------------------------

            res.cookie('jwtlogin',token,{
                expires:new Date(Date.now() + 10000 ),
                httpOnly:true
            });


            const registered = await newperson.save();


            res.status(201).render("login");

        }   
        else{
            res.send("password not matching")
        }
    }catch(e){
        res.status(400).send(e)
    }
})


app.get("/login",(req,res)=>{
    res.render("login");
})


app.post("/login",async(req,res)=>{
    try{
        const temail = req.body.email;
        const tpassword = req.body.password;
        const dbemail = await formdata.findOne({email:temail});

        const ismatch = await bcrypt.compare(tpassword,dbemail.password);
         
        const token = jwt.sign({_id:dbemail._id.toString()},process.env.SECRET_KEY);
        dbemail.tokens = dbemail.tokens.concat({token:token});

        res.cookie('jwtlogin',dbemail.tokens[0].token,{
            expires:new Date(Date.now() + 600000 ),
            httpOnly:true
        });

        if(ismatch){
            res.status(200).render("index")
        }
        else{
            res.status(400).send("invalid credentials");
        }

    }catch(e){
        res.status(400).send(e);
    }
    
})

app.get("/weather",auth, (req,res)=>{
    res.render("weather");
})

// app.get("/weather", (req,res)=>{
//     //  console.log(`this is the cookie ${req.cookies.jwtlogin}`) ;
//     res.render("weather");
// })
app.get("/index", (req,res)=>{
    res.render("index");
})



app.get("/about",(req,res)=>{
    res.render("about");
})


app.get("/logout",auth, async(req,res)=>{
    try {

    
        res.clearCookie("jwtlogin");

         
        req.user.tokens = req.user.tokens.filter((Element)=>{
            return Element.token != req.token
        });


        req.user.tokens.save();
        // console.log(req.user);
        res.render("login");


    } catch (error) {
        res.send(error);
    }
})


app.listen(8000,()=>{
    console.log("listening")
})