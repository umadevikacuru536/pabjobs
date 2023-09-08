const mongoose=require("mongoose")

const productSchema= new mongoose.Schema({
   
   
    fullname:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    mobilenumber:{
        type:Number,
        require:true,
    },
    amount:{
        type:String,
        require:true,
    },
   
  
})

const paymentData=mongoose.model("paymentData",productSchema);
module.exports =paymentData;