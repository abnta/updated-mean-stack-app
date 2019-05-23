const express = require('express')

const router = express.Router();

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const User = require('./../models/user.model');

const salt = 10

router.post('/signup/',(req,res,next)=>{
    console.log(req.body);
    var userDetails = null
    if(req.body.email && req.body.password && req.body.role){
        User.findOne({email:req.body.email})
        .then((response)=>{
            console.log(response);
            userDetails=response;
            bcrypt.hash(req.body.password, salt).then((hash)=>{
                const user = new User({
                    _id:userDetails._id,
                    name:userDetails.name,
                    email:userDetails.email,
                    githubRepo:userDetails.githubRepo,
                    age:userDetails.age,
                    gender:userDetails.gender,
                    about:userDetails.about,
                    dob:new Date(userDetails.dob),
                    password:hash,
                    role:req.body.role
                })
                User.findByIdAndUpdate(userDetails._id,user)
                .then((signupResponse)=>{
                    console.log(signupResponse)
                    res.status(200).json({message:'success',data:signupResponse,error:null})
                })
                .catch((err)=>{
                    console.log(err)
                    res.status(400).json({message:'failure',data:null,error:'error in sign up'})
                })

            }).catch((err)=>{
                console.log(err)
                res.status(400).json({message:"failure",data:null,error:'error in sign up'})
            })
        })
        .catch((err)=>{
            console.log(err)
            res.status(400).json({message:"failure",data:null,error:'error in sign up, first create the user the sign up'})
        })
    }else{
        res.status(400).json({message:'failure',data:null,error:'error in sign up'})
    }
    
    
})

router.post('/login/',(req,res,next)=>{
    try{
        let fetchedUser = null;
    if(req.body.email && req.body.password){
        console.log('inside if');
        User.findOne({
            email:req.body.email
        }).then(user =>{
            console.log('inside find one')
            console.log(user)
            if(!user){
                console.log('1')
              return res.status(401).json({
                    message:'failure',data:null,error:'enter valid email or password'
                })
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password)
        }).then((result)=>{
            if(!result){
                console.log('2')
               return res.status(401).json({
                    message:'failure',
                    data:null,
                    error:'enter valid email or password'
                })
            }
            console.log('inside bcrypt response')
            const token=jwt.sign({email:fetchedUser.email,userId:fetchedUser._id},
                'secret_protexted',
                {expiresIn:'1h'});
            res.status(200).json({ message:'success',data:{
                token:token,
                expiresIn:3600,
                _id:fetchedUser._id,
                role:fetchedUser.role
            },error:null
            })
        })
        .catch((err)=>{
            console.log(err)
            res.status(401).json({
                message:'failure',
                data:null,
                error:'enter valid email or password'
            })
        })
    }else{
        res.status(401).json({
            message:'failure',data:null,error:'enter valid email or password'
        })
    }
    }catch(err){
        console.log('inside catch')
        console.log(err);
        res.status(401).json({
            message:'failure',data:null,error:'error in login'
        })
        
    }    
})

module.exports = router