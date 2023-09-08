const mongoose=require("mongoose")

const productSchema= new mongoose.Schema({
   
    fullname: {
        type: String,
        require: true,
      },
      State: {
        type: String,
        require: true,
      },
      Currentlocation: {
        type: String,
        require: true,
      },
      mobile: {
        type: String,
        require: true,
      },
    
      emailE1: {
        type: String,
        require: true,
      },
     
})

const userData1=mongoose.model("userData1",productSchema);
module.exports =userData1;