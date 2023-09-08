const express=require("express");  // IMPORTING EXPRESS MODULE FROM THIRD PARTY PACKAGE
const mongoose=require("mongoose"); // IMPORTING MONGOOSE
const cors=require("cors"); // IMPORTING CORS
const userData=require("./model/userData")
const userData1=require("./model/userData1")
const resume = require("./model/resume")
const changepassword=require("./model/changepassword")
const paymentData=require("./model/paymentData")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const middleware=require("./middleware")
const browseData=require("./model/browseData")
// const jobsData=require('./userdetails1')

const app=express()
app.use(express.json())  // ACCEPTING JSON FORMAT DATA AND PARSING TO LOCAL USER

app.use(cors({origin: "*"}))

//mongo db conncetion WITH NODEJS
mongoose.connect("mongodb+srv://umadevikavuru:umadevi1234@cluster0.drlbwri.mongodb.net/?retryWrites=true&w=majority")
.then((res)=>console.log("db connected"))
.catch((err)=>console.log(err.message))



// main api
app.get("/",(req,res)=>{
    res.send("hello world")
})




// SIGNUP API
app.post("/signup/", async (req, res) => {

  try {
    const isUserExist = await userData.findOne({email:req.body.email})
    console.log(isUserExist)
if(!isUserExist){
  const newUser = {
    "type":req.body.type,
    "fullname":req.body.fullname,
    "email":req.body.email,
    "mobilenumber":req.body.mobilenumber,
    "password":req.body.password,
    "confirmpassword":req.body.confirmpassword
  };
  const userDetails = await userData.create(newUser)   //  POSTING TO COLLECTION OR MODEL
      console.log(userDetails)

      res.status(200).send("user created successfully")

}else {

  // if user mail id is founded send below response
  res.status(400).json("user already registered")

}
  } catch (e) {
    console.log(e.message)
    return res.status(500).json("message: e.message")

  }
})

// login api
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const isUserExist = await userData.findOne({ email });

  if (isUserExist) {
    const ispasswordmatched = await bcrypt.compare(
      password,
      isUserExist.password
    ); //compare to two passwords
    if (ispasswordmatched) {
      let payload = {
        user: isUserExist.id,
      };
      jwt.sign(
        payload,
        "jwtpassword",
        { expiresIn: 36000000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token });
        }
      );
    } else {
      return res.send("password not matched");
    }
  }
});

// // browsejobs API

app.post("/browsejobs",async(req,res)=>{
  try {
      const {
        title,
        salary,
        description,
        companyname,
        cities,
        experience,
        education,
        skillsets,
        jobtype,
        Img,
        email}=req.body;

  
      let newUser = new browseData({
        title,
        salary,
        description,
        companyname,
        cities,
        experience,
        education,
        skillsets,
        jobtype,
        Img,
        email
      });

      const isUserExist = await browseData.findOne({ email: email });
      if (isUserExist) {
        return res.send("user already registered");
      }
      
        newUser.save(); //saving to mongodb collections
        res.send("user created succesfully");  
    }
     catch (e) {
      console.log(e.message);
      res.send("internal server error");
    }
  });



// GET all users API

app.get("/allbrowsers", async(req,res)=>{
  const allusers =await browseData.find({})
  res.status(200).send(allusers)
})


// delete

app.delete("/user/:id",async(req,res)=>{
  const{id}=req.params
  const deleteUser=await browseData.findByIdAndDelete(id)
  if(!deleteUser){
      res.status(404).json("user not found")
  }
  res.status(200).json("user data deleted successful") 
  


})

//profile

app.post("/profile",async(req,res)=>{
  try {
      const {
        fullname,
        State,
        Currentlocation,
        mobile,
        emailE1}=req.body;

  
      let newUser = new userData1({
        fullname,
        State,
        Currentlocation,
        mobile,
      emailE1});

      const isUserExist = await userData1.findOne({ emailE1: emailE1 });
      if (isUserExist) {
        return res.send("user already registered");
      }
      
        newUser.save(); //saving to mongodb collections
        res.send("user created succesfully");  
    }
     catch (e) {
      console.log(e.message);
      res.send("internal server error");
    }
  });

//allprofile

app.get("/allprofiles", async(req,res)=>{
  const allprofile =await userData1.find({})
  res.status(200).send(allprofile)
})

app.post("/changepassword",async(req,res)=>{
  try {
      const {
        OldPassword,
        NewPassword,
        CofirmPassword}=req.body;

  
      let newUser = new changepassword({
        OldPassword,
        NewPassword,
        CofirmPassword});

      const isUserExist = await changepassword.findOne({NewPassword:CofirmPassword});
      if (isUserExist) {
        return res.send("user already registered");
      }
      
        newUser.save(); //saving to mongodb collections
        res.send("user created succesfully");  
    }
     catch (e) {
      console.log(e.message);
      res.send("internal server error");
    }
  });

  app.get("/allpassword", async(req,res)=>{
    const allpassword =await changepassword.find({})
    res.status(200).send(allpassword)
  })

  app.post("/payment",async(req,res)=>{
    try {
        const {
          fullname,
          email,
          mobilenumber,
          amount}=req.body;
  
    
        let newUser = new paymentData({
          fullname,
          email,
          mobilenumber,
          amount});
  
        const isUserExist = await paymentData.findOne({ email:  email});
        if (isUserExist) {
          return res.send("user already registered");
        }
        
          newUser.save(); //saving to mongodb collections
          res.send("user created succesfully");  
      }
       catch (e) {
        console.log(e.message);
        res.send("internal server error");
      }
    });

    // Resume Heading

    app.post("/heading",async(req,res)=>{
      try {
          const {
            heading}=req.body;
    
      
          let newUser = new resume({
            heading});
    
          const isUserExist = await resume.findOne({"":""});
          if (isUserExist) {
            return res.send("user already registered");
          }
          
            newUser.save(); //saving to mongodb collections
            res.send("user created succesfully");  
        }
         catch (e) {
          console.log(e.message);
          res.send("internal server error");
        }
      });
      // profilesummary
      app.post("/profilesummary",async(req,res)=>{
        try {
            const {
              ProfileSummary}=req.body;
      
        
            let newUser = new resume({
              ProfileSummary});
      
            const isUserExist = await resume.findOne({"":""});
            if (isUserExist) {
              return res.send("user already registered");
            }
            
              newUser.save(); //saving to mongodb collections
              res.send("user created succesfully");  
          }
           catch (e) {
            console.log(e.message);
            res.send("internal server error");
          }
        });
        //profileskils
        app.post("/profileskils",async(req,res)=>{
          try {
              const {
                keyskils}=req.body;
        
          
              let newUser = new resume({
                keyskils});
        
              const isUserExist = await resume.findOne({"":""});
              if (isUserExist) {
                return res.send("user already registered");
              }
              
                newUser.save(); //saving to mongodb collections
                res.send("user created succesfully");  
            }
             catch (e) {
              console.log(e.message);
              res.send("internal server error");
            }
          });
          //accomplishment
          app.post("/Accomplishment",async(req,res)=>{
            try {
                const {
                  Accomplishment}=req.body;
          
            
                let newUser = new resume({
                  Accomplishment});
          
                const isUserExist = await resume.findOne({"":""});
                if (isUserExist) {
                  return res.send("user already registered");
                }
                
                  newUser.save(); //saving to mongodb collections
                  res.send("user created succesfully");  
              }
               catch (e) {
                console.log(e.message);
                res.send("internal server error");
              }
            });
            //WorkSample
            app.post("/WorkSample",async(req,res)=>{
              try {
                  const {
                    WorkSample}=req.body;
            
              
                  let newUser = new resume({
                    WorkSample});
            
                  const isUserExist = await resume.findOne({"":""});
                  if (isUserExist) {
                    return res.send("user already registered");
                  }
                  
                    newUser.save(); //saving to mongodb collections
                    res.send("user created succesfully");  
                }
                 catch (e) {
                  console.log(e.message);
                  res.send("internal server error");
                }
              });
    
    // publication
    app.post("/publication",async(req,res)=>{
      try {
          const {
            publication}=req.body;
    
      
          let newUser = new resume({
            publication});
    
          const isUserExist = await resume.findOne({"":""});
          if (isUserExist) {
            return res.send("user already registered");
          }
          
            newUser.save(); //saving to mongodb collections
            res.send("user created succesfully");  
        }
         catch (e) {
          console.log(e.message);
          res.send("internal server error");
        }
      });
      // Presentation
      app.post("/Presentation",async(req,res)=>{
        try {
            const {
              Presentation}=req.body;
      
        
            let newUser = new resume({
              Presentation});
      
            const isUserExist = await resume.findOne({"":""});
            if (isUserExist) {
              return res.send("user already registered");
            }
            
              newUser.save(); //saving to mongodb collections
              res.send("user created succesfully");  
          }
           catch (e) {
            console.log(e.message);
            res.send("internal server error");
          }
        });
        // Patent
        app.post("/patent",async(req,res)=>{
          try {
              const {
                Patent}=req.body;
        
          
              let newUser = new resume({
                Patent});
        
              const isUserExist = await resume.findOne({"":""});
              if (isUserExist) {
                return res.send("user already registered");
              }
              
                newUser.save(); //saving to mongodb collections
                res.send("user created succesfully");  
            }
             catch (e) {
              console.log(e.message);
              res.send("internal server error");
            }
          });
app.listen(5010,()=>{

  console.log("server running")
})


