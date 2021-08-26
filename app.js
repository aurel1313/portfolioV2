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
const ejsLint = require('ejs-lint');

const md5 = require('md5');
const { check, validationResult } = require('express-validator');
app.use(session({secret: 'ssshhhhh'}));
var sess;
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
   
    sess=req.session;
    sess.pseudo =req.body.pseudonyme
   console.log(sess.pseudo)
    res.render('index',{sess:sess});

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

app.use(express.json());
app.post('/inscription',[
check('prenom').isLength({min:5}),
check('email').isEmail(),
//check('password').isLength({min:5}).withMessage('le password doit etre plus securisé')
   
],
(req,res)=>{
    const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
    let prenom =req.body.prenom;
    let nom =req.body.nom;
    let email = req.body.email;
    let password =req.body.mdp;
    let pseudonyme=req.body.pseudonyme
    let hash =md5(password);
    let date=req.body.date;
    
      var connexion =sql.createConnection({
                host:'falbala.futaie.org',
                user:'fabrea',
                password:'quahroh4pait',
                database:'fabrea',
                port:'3306'
               
            });
            connexion.connect(function(err){
                if(err) throw err;
                console.log('connected')
                var insert ='INSERT INTO user(prenom,nom,pseudo,mdp,date_naiss) VALUES ?';
                var values=[
                    [prenom,nom,pseudonyme,hash,date]
                ];
                connexion.query(insert,[values],function(err,result){
                    if(err) throw err;
                    console.log(result.affectedRows)
                })
               
            })
        sess=req.session;
        sess.pseudo =req.body.pseudonyme
        if(sess.pseudo){
            res.render('index',{sess:sess})
        }
    
   
    
})
app.get('/connexion',(req,res)=>{
    res.render('connexion')
})
app.get('/deconnexion',(req,res)=>{
    res.render('deconnexion',{sess:sess})
})
    

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })