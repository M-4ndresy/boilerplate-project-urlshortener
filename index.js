require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser")
const dns = require("dns")
const mongoose = require ("mongoose")
// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

mongoose.connect("mongodb+srv://unknwghost091:sainamainty999armda@codecampe.j7epv.mongodb.net/?retryWrites=true&w=majority&appName=codeCampe", { useNewUrlParser: true, useUnifiedTopology: true });

const schema = mongoose.Schema({
  original_url:{
    type:"String",
  },
  short_url:{
    type:"String"
  }

})
const urldb = mongoose.model("url",schema)

app.post('/api/shorturl', function(req, res) {
  const {url} = req.body
  const hostname = new URL(url).hostname
  const website = hostname || url  

  function getData(){
      const short = (Math.random()).toString(16).split(".")[1]
      const data = new urldb({short_url: short,original_url:url})
      data.save((err,data)=>{
        if(err){
          console.log("error : ",err)
        }else{
          console.log("data : ", data)
        }
      })
      res.json({ original_url : url , short_url :short})
        return
    }
    
  dns.lookup(website, (err, address,family) => {
    if (!err && address) {
      getData(website)
  } else {
    res.json({ error: 'invalid url' })
  }
});  
});

app.get('/api/shorturl/:url_short',(req,res)=>{
  const url_short = req.params.url_short
  urldb.find({short_url:url_short},(err,data)=>{
    if(!err){
      return data
    }else{
      console.log("error : ",err)
    }
  }).then((value)=>{
    if(value.length>0){
        res.redirect(value[0].original_url)
      }else{
        res.send("Short url is not valid")
      }
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
