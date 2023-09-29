const mongoose=require("mongoose")

const productSchema= new mongoose.Schema({
   
    title:{
    
        type:String,
        require:true,
    },
    salary:{
        type:String,
        require:true,
    },
    companyname:{
        type:String,
        require:true,
    },
    cities:{
        type:String,
        require:true,
    },
   
    experience:{
        type:String,
        require:true,
    },
    Img:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    }
    
})

const savedjobData=mongoose.model("savedjobData",productSchema);
module.exports =savedjobData;