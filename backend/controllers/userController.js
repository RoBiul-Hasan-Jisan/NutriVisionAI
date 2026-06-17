const User = require("../models/User")


// Create User
exports.createUser = async(req,res)=>{

    try{

        const {
            username
        } = req.body


        const exists =
        await User.findOne({
            username
        })


        if(exists){

            return res.status(400).json({
                message:"Username already exists"
            })

        }


        const user =
        await User.create({
            username,
            links:[]
        })


        res.json(user)


    }catch(error){

        res.status(500).json({
            message:error.message
        })
    }

}



// Get User

exports.getUser = async(req,res)=>{

    try{

        const {
            username
        }=req.params


        const user =
        await User.findOne({
            username
        })


        if(!user){

            return res.status(404).json({
                message:"User not found"
            })

        }


        res.json(user)


    }catch(error){

        res.status(500).json({
            message:error.message
        })
    }

}