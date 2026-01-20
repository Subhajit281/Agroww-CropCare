import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";



async function handleUserSignup(req,res,next){
    try{
        
        const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(req.body.password,SALT_ROUNDS);
        const user = await User.create({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword,
        });
        const cust = await User.findOne({email});
        if(!user) return next(new AppError("Couldn't Create Account, Please try again !!",401));
        if (cust) return res.status(400).json({ msg: "Email already registered" });

        return res.status(201).json({
            success:true,
        })
    }catch(err){
        next(err);
    }
}

async function handleLogin(req,res,next){
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) return next(new AppError("Invalid Credentials",401));

        const isMatched =await bcrypt.compare(password,user.password);
        if(!isMatched) return next(new AppError("Invalid Credentials",401));

        const token = jwt.sign({id:user._id,email:user.email},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES_IN}
        );
        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    }catch(err){
        next(err);
    }
    
};

export const getMyProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};


export {handleLogin , handleUserSignup};