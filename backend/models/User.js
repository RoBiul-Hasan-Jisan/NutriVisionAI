const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },


    links:[
        {
            title:String,
            url:String
        }
    ]


},{
    timestamps:true
})


module.exports = mongoose.model(
    "User",
    userSchema
)