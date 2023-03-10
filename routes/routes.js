const express = require("express")
const router = express.Router();
const result = require('../models/result');
const dayjs = require('dayjs');


//Home route (get all results data from db)
router.get("/home",(req,res)=>{
    result.find().exec((err,results)=>{
        if(err)
        {
           res.json({message:err.message, type:'danger'});
        }
        else
        {
            
            let data = [];
            results.forEach((result)=>{
                let date = dayjs(result.dateofbirth);
                 data.push({
                    _id:result._id,
                    rollnumber: result.rollnumber,
                    name:result.name,
                    dateofbirth:date.format("YYYY-MM-DD"),
                    score:result.score
                 });
            });
            res.render("home",{
                results:data
               });
        }
    })
 
});

//Result save route
router.get("/add",(req,res)=>{
 res.render("add_result")
});

router.post('/add',(req,res)=>{
    console.log("In Save Method")
    const resultRequest = new result({
        rollnumber: req.body.rollnumber,
        name: req.body.name,
        dateofbirth:req.body.dateofbirth,
        score: req.body.score
    });
    resultRequest.save((err)=>{
        if(err)
        {
            // res.json({message:err.message, type: 'danger'});
            req.session.message = {
                type:'danger',
                message: err.message
            }
            res.redirect('/home');
        }
        else{
           req.session.message = {
            type:'success',
            message:'Result Saved Successfully!'
           }
           //redirect user to home page
           res.redirect('/home');
        }
    })
    
});

//edit result

router.get('/edit/:id',(req,res)=>{
    let id = req.params.id;
    console.log(id)
    result.findById(id,(err,result)=>{
        if(err)
        {
            req.session.message = {
                type:'danger',
                message: err.message
            }
            res.redirect('/home');
        }
        else{
            let date = dayjs(result.dateofbirth);
            // console.log(date.format("YYYY-MM-DD"));
            let editResultModel = {
                _id: result._id,
                name: result.name,
                dateofbirth:date.format("YYYY-MM-DD"),
                score:result.score,
                rollnumber:result.rollnumber
            }
            console.log(editResultModel);
            
            if(result === null || result === undefined)
            {
                req.session.message = {
                    type:'danger',
                    message: 'No record is find with this id'
                }
                res.redirect('/home');
            }
            else
            {
                res.render('edit_result',{
                    result:editResultModel
                })
            }
        }
    })
});

//update result

router.post('/edit/:id',(req,res)=>{
      let id = req.params.id;
      result.findByIdAndUpdate(id,{
        rollnumber:req.body.rollnumber,
        name:req.body.name,
        dateofbirth:req.body.dateofbirth,
        score:req.body.score
      },(err,result)=>{
        if(err)
        {
            req.session.message = {
                type:'danger',
                message: err.message
            }
            res.redirect('/home');
        }
        else{
            req.session.message = {
                type:'success',
                message:'Result Updated Successfully!'
               }
               //redirect user to home page
               res.redirect('/home');
        }
      })
});

//Delete Result

router.get('/delete/:id',(req,res)=>{
    let id = req.params.id;
    result.findByIdAndRemove(id,(err,result)=>{
           if(err)
           {
            req.session.message = {
                type:'danger',
                message: err.message
            }
            res.redirect('/home');
           }
           else
           {
            req.session.message = {
                type:'success',
                message:'Result Deleted Successfully!'
               }
               //redirect user to home page
               res.redirect('/home');
           }
    });

})

module.exports = router;