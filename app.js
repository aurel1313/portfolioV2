var http =require('http');
const express =require('express');
const app =express();
const port =8080;
const path = require('path');
var ejs =require('ejs');
const fs =require('fs')
const covid = require('corona-info');
const directory = path.join(__dirname,'src')
app.use('/src',express.static(directory));
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
  }));
var sql =require('mysql');
var session = require('express-session')
var data;
var caseFrance,covidData,france;

const validator=require('node-input-validator');
const { Console } = require('console');
app.get('/',(req,res)=>{
    //recuperer projets dans le dossier//
    console.log(__dirname)
    fs.readdir(__dirname+'/projets',(err,files)=>{
        if(err){
            console.log(err)
        }else{
            files.forEach(file=>{
                console.log(file)
            })
        }
    })
    var connexion =sql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'portfoliov2'
       
    });
    
    res.render('index');

})

app.get('/covid',(req,res)=>{
    covidData=async()=>{
         data =await covid.findData({ country: "all" });
        console.log(data)
    }
    france =async()=>{
        caseFrance =await covid.findData({ country: "france" });
       console.log(caseFrance)
   }
    covidData();
    france();
    res.render('covid',{data:data,france:caseFrance})
    
})

app.get('/inscription',(req,res)=>{
    res.render('inscription')
})

app.post('/inscription',function(req,res){
    const v = new validator.Validator(req.body,{
        pseudo:'required',
        prenom:'required'
    })
      
     
     
     
    v.check().then((matched)=>{
        if(!matched){
             error = v.errors
           
        }
         
        
        /*var connexion =sql.createConnection({
            host:'localhost',
            user:'root',
            password:'',
            database:'portfoliov2'
           
        });
        connexion.connect(function(err){
            if(err) throw err;
            
        })*/
       
    })
    res.render('inscription')
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })