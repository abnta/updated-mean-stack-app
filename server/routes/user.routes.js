const express = require('express');

const router = express.Router();

const User = require('../models/user.model')

const checkAuth = require('./../middlewear/check.auth');

router.post('/',checkAuth,(req,res,next)=>{
    if(req.body.name && req.body.email && req.body.githubRepo && req.body.age && req.body.gender && req.body.about && req.body.dob){
        console.log('inside add a user')
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        githubRepo:req.body.githubRepo,
        age:req.body.age,
        gender:req.body.gender,
        about:req.body.about,
        dob : new Date(req.body.dob)
    })
    user.save().then((createdUserData)=>{
        res.status(201).json({message:'success',data:createdUserData,error:null})
    }).catch((err)=>{
        console.log(error)
        res.status(400).json({message:'failure',data:null,error:'user creation failed'})
    })
    }else{
        res.status(400).json({message:'failure',data:null,error:'user creation failed'})
    }
})

router.get('/',(req,res,next)=>{
    User.find({}).then((userData)=>{
        res.status(200).json({
            message:'success',
            data:userData,
            error:null
        })
    })
    .catch((err)=>{
        res.status(400).json({
            message:'failure',
            data:null,
            error:'fetch users failed'
        })
    })
})

router.get('/:id',checkAuth,(req,res,next)=>{
    const id = req.params.id;
    if(id){
        User.findById(id).then((response)=>{
            res.status(200).json({message:'success',data:response,error:null})
        })
        .catch((err)=>{
            res.status(400).json({message:'failure',data:null,error:'error in fetching a user'})
        })
    }else{
        res.status(400).json({message:'failure',data:null,error:'error in fetching a user'})
    }
    
})

router.delete('/:id',checkAuth,(req,res,next)=>{
    const id = req.params.id;
    if(id){
        User.findByIdAndDelete(id).then((response)=>{
            res.status(200).json({message:'success',data:response,error:null})
        })
        .catch((err)=>{
            res.status(400).json({message:'failure',data:null,error:'error in deleting the user'})
        })
    }else{
        res.status(400).json({message:'failure',data:null,error:'error in deleting the user'})
    }
    
})

router.put('/:id',checkAuth,(req,res,next)=>{

    const id = req.params.id;
    console.log('id is ', id)
    if(req.params.id && req.body.name && req.body.email && req.body.githubRepo && req.body.age && req.body.gender && req.body.about && req.body.dob){
        const user = new User({
            _id:req.params.id,
            name:req.body.name,
            email:req.body.email,
            githubRepo:req.body.githubRepo,
            age:req.body.age,
            gender:req.body.gender,
            about:req.body.about,
            dob : new Date(req.body.dob)
        })
    
        User.findByIdAndUpdate(id,user)
            .then((response)=>{
                res.status(201).json({message:'success',data:response,error:null})
            })
            .catch((err)=>{
                console.log(err)
                res.status(400).json({message:'failure',data:null,error:'error in updating a user'})
            })
    }else{
        res.status(400).json({message:'failure',data:null,error:'error in updating a user'})
    }

})


module.exports = router