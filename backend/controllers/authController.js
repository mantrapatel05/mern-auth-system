const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId) => {
    return jwt.sign({id : userId}, process.env.JWT_SECRET, {expiresIn : "7d"});
}

2) register(req, res) logic
Write in this exact flow:

const { name, email, password } = req.body
If any missing -> 400
Check existing user by lowercase email
If exists -> 409
Create user (password auto-hashed by model hook)
Generate token using new user id
Return 201 with { user, token } (never password)
Key thinking:

register fails fast
no duplicate email
never leak full user object

const register = async (req,res) => {okay 
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success : false,
                message : "Name,email and password are required!";
            });
        }

        const existingUser = await User.findOne({email : email.toLowerCase()});
        if(existingUser){
            return res,status(409).json({
                success : false,
                message : "User already exists!";
            })
        }

        const user : await User.create({
            name,
            
        })

    } catch(error) {

    }
};