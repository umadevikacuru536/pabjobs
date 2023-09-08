const mongoose=require("mongoose")

const productSchema= new mongoose.Schema({
    heading:{
        type:String,
        require:true,
    },
    ProfileSummary:{
        type:String,
        require:true,
    },
    keyskils:{
        type:String,
        require:true,
    },
    Accomplishment:{
        type:String,
        require:true,
    },
    WorkSample:{
        type:String,
        require:true, 
    },
    publication:{
        type:String,
        require:true, 
    },
    Presentation:{
        type:String,
        require:true, 
    },
    Patent:{
        type:String,
        require:true,
    }



})

const resume=mongoose.model("resume",productSchema);
module.exports = resume;