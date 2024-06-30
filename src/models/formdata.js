const mongoose = require("mongoose");
const validate = require("validator");
const bcrypt = require('bcryptjs');
const jwt =  require("jsonwebtoken");


const formSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        minlength:3
    },
    lname:{
        type:String,
        required:true,
        minlength:3
    },
    gender:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    cpassword:{
        type:String,
        required:true,
        unique:true
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
});


// CRAETING TOKEN

// formSchema.methods.generateAuthtoken = async function(){
//     `mynameis${this.fname}${this.lname}goodboy`
//     try {
//         const token = jwt.sign({_id:this._id.toString()},"thisistheseceretkeyofhassaansohaib");
//         this.tokens = this.tokens.concat({token:token})
//         console.log(token);
//         await this.save();
//         return token;

//     } catch (error) {
//         res.send(error);
//         console.log(error);
//     }
// }



// HASIGN THE PASSWORD

formSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.cpassword = await bcrypt.hash(this.cpassword,10);
        // this.cpassword = undefined;
    }
    
    next();
})



const formdata = new mongoose.model("formdata",formSchema);


module.exports=formdata;

