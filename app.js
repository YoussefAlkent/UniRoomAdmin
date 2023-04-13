const express = require('express');
const ejs = require('ejs')
const sql = require('mysql')
const nodemailer = require('nodemailer')

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
var app = express();
app.listen(3000)
app.set('views', __dirname + '\\views')
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))
app.use(express.json())



app.get('/', (req, res)=>{
  res.render('pages\\bookingInfo')
})
app.post('/blacklistStudent', (req, res)=>{
  console.log("Blacklisted student")
})

