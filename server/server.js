const express = require("express");  // IMPORTING EXPRESS MODULE FROM THIRD PARTY PACKAGE
const mongoose = require("mongoose"); // IMPORTING MONGOOSE
const cors = require("cors"); // IMPORTING CORS
const userData = require("./model/userData")
const userData1 = require("./model/userData1")
const resume = require("./model/resume")
const changepassword = require("./model/changepassword")
const paymentData = require("./model/paymentData")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const middleware=require("./middleware")
const browseData = require("./model/browseData")
const appiledjobData = require("./model/appiledjobData")
const savedjobData = require("./model/savedjob")
const otp = require("./model/otp")
// const jobsData=require('./userdetails1')
                            const { parsePhoneNumberFromString } = require('libphonenumber-js');

const app = express()
app.use(express.json())  // ACCEPTING JSON FORMAT DATA AND PARSING TO LOCAL USER


app.use(cors({ origin: "*" }))

//mongo db conncetion WITH NODEJS
mongoose.connect("mongodb+srv://umadevikavuru:umadevi1234@cluster0.drlbwri.mongodb.net/?retryWrites=true&w=majority")
  .then((res) => console.log("db connected"))
  .catch((err) => console.log(err.message))



// main api
app.get("/", (req, res) => {
  res.send("hello world")
})




// SIGNUP API
app.post("/signup/", async (req, res) => {

  try {
    const isUserExist = await userData.findOne({ email: req.body.email })
    console.log(isUserExist)
    if (!isUserExist) {
      const newUser = {
        "type": req.body.type,
        "fullname": req.body.fullname,
        "email": req.body.email,
        "mobilenumber": req.body.mobilenumber,
        "password": req.body.password,
        "confirmpassword": req.body.confirmpassword
      };
      const userDetails = await userData.create(newUser)   //  POSTING TO COLLECTION OR MODEL
      console.log(userDetails)

      res.status(200).send("user created successfully")

    } else {

      // if user mail id is founded send below response
      res.status(400).json("user already registered")

    }
  } catch (e) {
    console.log(e.message)
    return res.status(500).json("message: e.message")

  }
})


// login api
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const isUserExist = await userData.findOne({email:password });

//   if (isUserExist) {
//     const ispasswordmatched = await bcrypt.compare(
//       email,
//       password,
//       isUserExist.password
//     ); //compare to two passwords
//     if (ispasswordmatched) {
//       let payload = {
//         user: isUserExist.id,
//       };
//       jwt.sign(
//         payload,
//         "jwtpassword",
//         { expiresIn: 36000000 },
//         (err, token) => {
//           if (err) throw err;
//           return res.json({ token });
//         }
//       );
//     } else {
//       return res.send("password not matched");
//     }
//   }
// });
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    
    const isUserExist = await userData.findOne({ email });

    if (!isUserExist) {
      return res.status(401).send('User not found');
    }
   
    const payload = {

      user: isUserExist.id,
    
    };

    jwt.sign(
      payload,
      'jwtpassword',
      { expiresIn: 3600 }, // 3600 seconds = 1 hour
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal server error');
        }
        return res.json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
});



app.post('/otp', async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Generate a random 6-digit OTP
    function generateRandomCode(length) {
      const characters = '0123456789'; // Include characters you want in the code
      let code = '';
    
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
      }
    
      return code;
    }

    const generatedOTP = generateRandomCode(6); // Generate a 6-digit OTP
    console.log('Generated OTP:', generatedOTP); // Log the OTP to the server console

    // Check if mobileNumber is provided and is a valid phone number
    const userExist = await otp.findOne({ mobileNumber }); // Renamed the variable
    
    if (!userExist) {
      // Create a new user document with the OTP
      let newUser = new otp({
        mobileNumber,
        otp: generatedOTP
      });

      // Save the new user document to the database
      await newUser.save();

      // Return a success response
      return res.status(200).json({ message: 'OTP sent successfully', otp: generatedOTP });
    } else {
      // If a user with the same mobile number already exists, return an error response
      return res.status(400).json({ message: 'User with the same mobile number already exists' });
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});





app.get("/allotp", async (req, res) => {

  const allusers1 = await otp.find({})
  res.status(200).send(allusers1)
})
app.post('/companylogin', async (req, res) => {
  try {
    const { companyemail, password } = req.body;

    // Find user by email
    const iscompanyExist = await userData.findOne({ companyemail });

    if (!iscompanyExist) {
      return res.status(401).send('User not found');
    }
    const payload = {
      user: iscompanyExist.id,
    };

    jwt.sign(
      payload,
      'jwtpassword',
      { expiresIn: 3600 }, // 3600 seconds = 1 hour
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal server error');
        }
        return res.json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
});
// // browsejobs API

app.post("/browsejobs", async (req, res) => {
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
      email } = req.body;


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

//appiled jobs
app.post("/appiledjobs", async (req, res) => {
  try {
    const {
      title,
      salary,
      companyname,
      cities,
      experience,
      Img,
      email} = req.body;

      const isUserExist = await appiledjobData.findOne({ email: email });

      if (isUserExist) {
        return res.status(400).json("User already registered");
      }
    let newUser = new appiledjobData({
      title,
      salary,
      companyname,
      cities,
      experience,
      Img,
      email
    });


    await newUser.save();

    res.status(200).json("User created successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal server error");
  }
});
//saved jobs

app.post("/savedjobs", async (req, res) => {
  try {
    const {
      title,
      salary,
      companyname,
      cities,
      experience,
      Img,
      email
    } = req.body;

    // Check if the user already exists in the database
    const isUserExist = await savedjobData.findOne({ email: email });

    if (isUserExist) {
      return res.status(400).json("User already registered");
    }

    // Create a new user
    const newUser = new savedjobData({
      title,
      salary,
      companyname,
      cities,
      experience,
      Img,
      email
    });

    // Save the new user to the database
    await newUser.save();

    res.status(200).json("User created successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal server error");
  }
});
// GET all users API
app.get("/allsavedjobs", async (req, res) => {

  const allusers1 = await savedjobData.find({})
  res.status(200).send(allusers1)
})
app.get("/allappiledjobs", async (req, res) => {

  const allusers1 = await appiledjobData.find({})
  res.status(200).send(allusers1)
})
app.get("/allbrowsers", async (req, res) => {
  const allusers = await browseData.find({})
  res.status(200).send(allusers)
})


// delete

app.delete("/user/:id", async (req, res) => {
  const { id } = req.params
  const deleteUser = await browseData.findByIdAndDelete(id)
  if (!deleteUser) {
    res.status(404).json("user not found")
  }
  res.status(200).json("user data deleted successful")



})

//profile

app.post("/profile", async (req, res) => {
  try {
    const {
      fullname,
      State,
      Currentlocation,
      mobile,
      emailE1 } = req.body;


    let newUser = new userData1({
      fullname,
      State,
      Currentlocation,
      mobile,
      emailE1
    });

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

app.get("/allprofiles", async (req, res) => {
  const allprofile = await userData1.find({})
  res.status(200).send(allprofile)
})

app.post("/changepassword", async (req, res) => {
  try {
    const {
      OldPassword,
      NewPassword,
      CofirmPassword } = req.body;


    let newUser = new changepassword({
      OldPassword,
      NewPassword,
      CofirmPassword
    });

    const isUserExist = await changepassword.findOne({OldPassword: NewPassword });
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

app.get("/allpassword", async (req, res) => {
  const allpassword = await changepassword.find({})
  res.status(200).send(allpassword)
})

app.post("/payment", async (req, res) => {
  try {
    const {
      fullname,
      email,
      mobilenumber,
      amount } = req.body;


    let newUser = new paymentData({
      fullname,
      email,
      mobilenumber,
      amount
    });

    const isUserExist = await paymentData.findOne({ email: email });
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

app.post("/heading", async (req, res) => {
  try {
    const {
      heading } = req.body;


    let newUser = new resume({
      heading
    });

    const isUserExist = await resume.findOne({ "": "" });
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
app.post("/profilesummary", async (req, res) => {
  try {
    const {
      ProfileSummary } = req.body;


    let newUser = new resume({
      ProfileSummary
    });

    const isUserExist = await resume.findOne({ "": "" });
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
app.post("/profileskils", async (req, res) => {
  try {
    const {
      keyskils } = req.body;


    let newUser = new resume({
      keyskils
    });

    const isUserExist = await resume.findOne({ "": "" });
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
app.post("/Accomplishment", async (req, res) => {
  try {
    const {
      Accomplishment } = req.body;


    let newUser = new resume({
      Accomplishment
    });

    const isUserExist = await resume.findOne({ "": "" });
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
app.post("/WorkSample", async (req, res) => {
  try {
    const {
      WorkSample } = req.body;


    let newUser = new resume({
      WorkSample
    });

    const isUserExist = await resume.findOne({ "": "" });
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
app.post("/publication", async (req, res) => {
  try {
    const {
      publication } = req.body;


    let newUser = new resume({
      publication
    });

    const isUserExist = await resume.findOne({ "": "" });
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
app.post("/Presentation", async (req, res) => {
  try {
    const {
      Presentation } = req.body;


    let newUser = new resume({
      Presentation
    });

    const isUserExist = await resume.findOne({ "": "" });
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
app.post("/patent", async (req, res) => {
  try {
    const {
      Patent } = req.body;


    let newUser = new resume({
      Patent
    });

    const isUserExist = await resume.findOne({ "": "" });
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
//certification
app.post("/certification", async (req, res) => {
  try {
    const {
      certification } = req.body;


    let newUser = new resume({
      certification
    });

    const isUserExist = await resume.findOne({ "": "" });
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
//career Profile
app.post("/careerProfile", async (req, res) => {
  try {
    const {
      careerProfile } = req.body;


    let newUser = new resume({
      careerProfile
    });

    const isUserExist = await resume.findOne({ "": "" });
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
app.listen(5010, () => {

  console.log("server running")
})


