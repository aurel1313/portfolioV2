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

var data;
var caseFrance,covidData,france;
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
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })