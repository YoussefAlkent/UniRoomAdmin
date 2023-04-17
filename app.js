const express = require('express');
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
  res.render('pages\\index')
})
app.post('/login', (req, res, next)=>{
  var [name, pass] = req.body;
  let query = "SELECT * FROM person WHERE email=?"
  con.query(query, name, (err, result)=>{
    if(result.password == pass){
      const token = jwt.sign(user, secretPhrase, {expiresIn:"3h"})
      res.cookie('token', token, {
        httpOnly:true
      })
      transporter.sendMail(SignInEmail(result.name, result.ID, result.email), (err,info)=>{
        if (err) throw err; else console.log("email send" + info.response)
      })
      next();
    } else{
      res.body.password = ""
    }
  })
}, (req, res)=>{
  res.redirect("/bookingInfo")
})
app.get('/bookingInfo', (req,res)=>{
  let query='SELECT * FROM student'
  con.query(query, "", (err, result)=>{
    res.render("pages\\booking", {studentList:result})
  })

})
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

