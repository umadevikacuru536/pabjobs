const mongoose=require("mongoose")

const productSchema= new mongoose.Schema({

     OldPassword: {
        type: String,
        require: true,
      },
      NewPassword: {
        type: String,
        require: true,
      },
      CofirmPassword: {
        type: String,
        require: true,
      },
})

const changepassword=mongoose.model("changepassword",productSchema);
module.exports = changepassword;