//importing Some Important Modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

//Using Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded());

//Set the template engine
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));
//Database Connection 
mongoose.set('strictQuery',0);
mongoose.connect('http://localhost:27017/urlshort');
const db= mongoose.connection;
db.on('error',console.log.bind(console, "connection error"));
db.once('open',function(callback){
  //console.log("connection success")
});
//Creating Schema
const Schema = new mongoose.Schema({
  url: String,
  linkid: String
});
const model = mongoose.model('url',Schema);

//function
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
//Routing
app.get('/',(req, res)=>{
  res.status(200).render("index",{content:"Genrate URL"});
});
app.post('/short',(req,res)=>{
  const url= req.body.url;
  if(url !=""){
    urlcode=makeid(6);
    const data = new model({
      url: url,
      linkid: urlcode
    });
    data.save().then(res.render("success",{urlcode:urlcode,content:"Url Generated"})).catch(error=>console.log(error))
  }else{
    res.render("index",{content:"Please Enter The url"})
  }
});
app.get("/shorts/:id",function(req, res,next){
  const id = req.params.id;
  if(id.length < 6){
    res.redirect('/');
  }else{
    model.findOne({linkid:id},function(err,response){
      if (err) {
        res.redirect("/");
      } else {
        if(!response){
          res.redirect("/");
        }else{
          url = response.url;
          res.redirect(url);
          //res.send(url);
        }
      }
    });
  }
});
app.get("*",(req, res)=>{
  res.status(400).render("err");
})
//Running The App
app.listen(port,()=>{
  //console.log(`App Running On Port ${port}`);
})
