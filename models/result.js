const mongoose = require('mongoose');
const schema = mongoose.Schema; // defines the structure of documents that we wanna like to store in db

const resultSchema = new schema({
    rollnumber:{
        type:Number,
        required: true
    },
    name:
    {
        type:String,
        required:true,
    },
    dateofbirth:{
        type:Date,
        required:true
    },
    score:
    {
        type:Number,
        required:true
    },
    created:{
        type:Date,
        default:Date.now
    }
});

const Result = mongoose.model('Result',resultSchema)

module.exports = Result;

