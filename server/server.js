const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/config').get(process.env.NODE_ENV);
const app = express();
mongoose.connect(config.DATABASE)
mongoose.Promise = global.Promise;
var multer = require('multer')
var cors = require('cors');



app.use(bodyParser.json());
const { Recurso } = require('./models/recurso');
app.use(cookieParser());
app.use(express.static('client/build'))


//  GET  //

app.get('/api/getRecurso',(req,res)=>{
    let id = req.query.id;

    Recurso.findById(id,(err,doc)=>{
        if(err) return res.status(400).send(err);
        res.json(doc);
    })
})

app.get('/api/recursos',(req,res)=>{
    // locahost:3001/api/recursos?skip=3&limit=2&order=asc
    //let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    let order = req.query.order;
    let skip = parseInt(req.query.skip);

    // ORDER = asc || desc
    Recurso.find().skip(skip).sort({rating:order}).limit(limit).exec((err,docus)=>{
        if(err) return res.status(400).send(err);
        res.send(docus);
    })
})



//  POST  //


app.post('/api/recurso',(req,res)=>{
    const recurso = new Recurso(req.body)

    recurso.save((err,doc)=>{
        if(err) return res.status(400).send(err);
        res.status(200).json({
            post:true,
            recursoId: recurso._id
        })
    })
})


//  UPDATE //
app.post('/api/recurso_update',(req,res)=>{
    Recurso.findByIdAndUpdate(req.body._id,req.body,{new:true},(err,doc)=>{
        if(err) return res.status(400).send(err);
        res.json({
            success:true,
            doc
        })
    })
})


//  DELETE //
app.delete('/api/delete_recurso',(req,res)=>{
    let id = req.query.id;

    Recurso.findByIdAndRemove(id,(err,doc)=>{
        if(err) return res.status(400).send(err);
        res.json(true)
    })
})


//////////////////////////////////////////////////////////////
//This is the part that doesn't work

app.use(cors())


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

var upload = multer({ storage: storage }).single('file')

app.post('/upload',function(req, res) {
     
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

    })

});
///////////////////////////////////////////////////////////////////////////////

if(process.env.NODE_ENV ==='production'){
    const path=require('path');
    app.get('/*',(req,res)=>{
    res.sendfile(path.resolve(__dirname,'../client','build','index.html'))
    })
}

const port = process.env.PORT || 3001;
app.listen(port,()=>{
    console.log(`Started on port ${port}`);
})





