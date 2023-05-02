const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const sql = require('mysql')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const secretPhrase ='OhMyGodWereDoingThisAgainPleaseChangeMeTooICannotStressThisEnoughIMPORTANT' //again, what the variable said

var con = sql.createConnection({
  host: "uni-room.mysql.database.azure.com",
  port: 3306,
  user:"Uniroom_Admin",
  password:"vtaiu@12345",
  multipleStatements:true
})
var transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  auth:{
      user: "", //Use an email here, Until we can create one for the entire team
      pass: "" //Use an app specific password here if using 2fa
  }
})
function SignInEmail(name, ID, email){
  return {
          from:'',
          to:email,
          subject:"Your Account has been signed in!",
          text:"You have just signed in with your account"
  }
}
var app = express();
app.listen(3000)
app.set('views', __dirname + '\\views')
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get('/', (req, res)=>{
  res.render('pages\\login', {message:""})
})
app.post('/login', (req, res, next)=>{
  try{
    var cookieUser = jwt.verify(req.cookie.token, secretPhrase)
    let queryCheck = 'SELECT * FROM aiuroom.person WHERE email=' + cookieUser;
    con.query(queryCheck, (err, result)=>{
      if (err) console.log(err); else next();
    });
  } catch{
    res.render("pages/login", {message:"No cookie user found"});
  }
  var name = req.body.ID;
  var pass = req.body.Password
  let query = "SELECT * FROM person WHERE Universityemail=" + name
  con.query(query, (err, result)=>{
    if(result !=null && result[0].Password == pass){
      const token = jwt.sign(user, secretPhrase, {expiresIn:"3h"})
      res.cookie('token', token, {
        httpOnly:true
      })
      transporter.sendMail(SignInEmail(result.name, result.ID, result.email), (err,info)=>{
        if (err) throw err; else console.log("email send" + info.response)
      })
      next();
    } else{
      res.render('pages/login', {message:"Could not find account"});
      //res.body.password = "";
    }
  })
}, (req, res)=>{
  res.redirect("/bookingInfo")
});
app.get('/bookingInfo', (req,res)=>{
  let query='SELECT * FROM student'
  con.query(query, "", (err, result)=>{
  })
  res.render("pages\\booking", {studentList:result})
});
app.post('/SignUpAttempt', (req,res)=>{
  var emailRequest = req.body.SignInEmail
  transporter.sendMail({
    from:email,
    to:'Youssefalkent@gmail.com', //placeholder
    subject:'This Email is requesting access as admin',
    text:"This email \"" + email + "\" is requesting access to be an admin"
  },(err,info)=>{
    if (err) throw err; else console.log("email send" + info.response)
  })
})
app.post('/blacklistStudent', (req,res)=>{
  var user = req.body.ID
    // handle adding a student to the blacklist
   var reason = req.body.reason;
    console.log(reason);
    // do something with the reason, e.g. add the student to the blacklist
    res.json({ message: 'Student added to blacklist' });
    let query = "INSERT INTO aiuroom.blacklist(`Reason`,`StudentId`)  VALUES ('"+ reason +"',  "+ user +");" //query here
    con.query(query, (err, result)=>{
      if (err) throw err;
    })
    });


app.post('/cancelBooking', (req,res)=>{
  let user = req.body.ID;
  
  // handle canceling a booking
  var confirmation = req.body.confirmation;
  console.log(confirmation);
  if (confirmation) {
    // do something to cancel the booking
    res.json({ message: 'Booking canceled' });
  } else {
    res.json({ message: 'Confirmation required to cancel booking' });
  }

  let query = "DELETE FROM aiuroom.booking  WHERE NID=" + user; //query here
  con.query(query, (err, result)=>{
    if (err) throw err;
  });
});

app.post('/changeDate', (req,res)=>{
  var user = req.body.ID
    // handle changing the date
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    console.log(startDate);
    console.log(endDate);
    // do something with the new dates, e.g. update the start and end date of a booking
    res.json({ message: 'Date changed' });
  let query = "UPDATE aiuroom.booking SET  `StartTime` = "+ startTime +",  `EndTime` = "+ endTime +" WHERE `roomid` =  "+ req.body.roomNum;";" //query here
  con.query(query, (err, result)=>{
    if (err) throw err;
  })
});
app.post('/addInfraction', (req,res)=>{
  var user = req.body.ID 
    // handle adding an infraction
    var infraction = req.body.infraction;
    console.log(infraction);
    // do something with the infraction, e.g. add it to a student's record
    res.json({ message: 'Infraction added' });
    let query = "INSERT INTO `aiuroom`.`infraction`  (`SID`,  `infraction_count`,  `reason`)  VALUES  ("+ req.body.ID+",  'infraction_count:',  'reason:');  " //query here
  });  
  
app.post('/searchStudent', (req,res)=>{
  var ID = req.body.searchID
  var name ="John Doe"
  var attendance = "100%"
  var standing = "Good Standing"
  var roomNum = "N/A"
  var bookingNum = "N/A"
  console.log(req.body)
  let query = "SELECT * FROM aiuroom.student WHERE SID ="+ ID
  con.query(query, (err,result)=>{
    if (err) throw err; else{
      name = result[6]
      attendance=result[5]
    }
  let query = ("SELECT * FROM aiuroom.booking WHERE NID =" + ID)
  con.query(query, (err, result)=>{
    if (err) throw err; else{
      if(result != null){
       roomNum = result[4]
       bookingNum = result[3]
      }
    }
    res.render("pages\\bookingInfo", {
      name:name,
      ID:ID,
      attendance:attendance,
      standing:standing,
      roomNum:roomNum,
      bookingNum:bookingNum
    })
  })
  })
})
app.get('/searchStudent', (req,res)=>{
  res.render("pages\\bookingInfo", {
    name:N/A,
    ID:N/A,
    attendance:N/A,
    standing:N/A,
    roomNum:N/A,
    bookingNum:N/A
  })
  res.json({"Page-Status":"Student Search Rendered"})
})