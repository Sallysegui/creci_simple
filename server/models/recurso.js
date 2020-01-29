const mongoose = require('mongoose');

const recursoSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    }
    ,
    description:{
        type:String,
        required:false
    },
    
    address_doc: {
        type:String,
        required:false
        //it should be true in the future
    },
    
  
    
},{timestamps:true})

const Recurso = mongoose.model('Recurso',recursoSchema )


module.exports = { Recurso }





