const mongoose=require("mongoose")

const productSchema= new mongoose.Schema({
   
    
     
    
      mobileNumber: {
        type: String,
        require: true,
      },
     otp: {
        type: String,
        require: true,
      }

    
     
})

const otp=mongoose.model("otp",productSchema);
module.exports =otp;