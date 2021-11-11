const mongoose =  require('mongoose')
const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt =  require('jsonwebtoken');
exports.signup=async(req,res)=>{
    let user =null;
    try{
         user = await User.findOne({email:req.body.email})
    }
    catch{
        return res.status(500).json({});
    }
    // console.log(user);
    if(user){
        return res.status(409).json({"error":"User already Exists!"})
    }
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            res.status(500).json(err);
        }
        else{
            const user = User({
                _id: new mongoose.Types.ObjectId(),
                email:req.body.email,
                password:hash
            })
            user.save()
            .then(succ=>{
                res.status(200).json(succ);
            })
            .catch(err=>{
                res.status(500).json(err);
            })
        }
    })
    
}
exports.signin=async (req,res)=>{
    let user =  null;
    try {
        user = await User.findOne({email:req.body.email})
    } catch (error) {
        return res.status(500).json(error)
    }
    if(user==null){
        return res.status(404).send("No such user exists")
    }
    const result = await bcrypt.compare(req.body.password, user.password);
    if(result){
        const jwtToken = jwt.sign(
            {   
                id:user._id,
                email: user.email
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn:"1hr"
            }
        )
        return res.status(200).send({
            message:"User Logged in!",
            _id:user._id,
            token:jwtToken
        })
    }
    return res.status(401).send("Bad credentials")

}
exports.deleteUser=async (req,res)=>{
    const id =  req.params.id;
    try {
        await User.deleteOne({_id:id})
    } catch (error) {
        return res.status(409).json({"error":"No Such User Exists!"});
    }
    res.status(200).send("user deleted Successfully!")
    
}
exports.getAllUsers=async (req,res)=>{
    let users=[];
    try {
        users = await User.find()
    } catch (error) {
        return res.status(500).json(error);
    }
    return res.status(200).json(users);
}