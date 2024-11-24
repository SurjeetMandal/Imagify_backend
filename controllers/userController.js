import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const registeredUser = async(req,res) => {

    const bcrypt = require("bcryptjs");

    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.json({success:false, message:"Missing Details"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password:hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        res.json({success:true, token, user: {name: user.name}})
    }
    catch (error){
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

const loginUser = async(req,res) => {
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success:false, message: "User not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

            res.json({success:true, token, user: {name: user.name}})
        }
        else{
            return res.json({success:false, message: "Invalid Password"})
        }
    }
    catch{
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

const userCredit = async(req,res) => {
    try{
        const {userId} = req.body;

        const user = await userModel.findById(userId)
        res.json({success:true, credits: user.creditBalance, user:{name: user.name}})
    }
    catch(error){
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export {registeredUser, loginUser, userCredit};