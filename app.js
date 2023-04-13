const express = require('express');
const ejs = require('ejs')

var app = express();
app.listen(3000)
app.set('views', __dirname + '\\views')
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))



app.get('/', (req, res)=>{
  res.render('pages\\signup')
})

