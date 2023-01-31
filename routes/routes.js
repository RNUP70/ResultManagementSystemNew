const express = require("express")
const router = express.Router();
const result = require('../models/result');


//Home route (get all results data from db)
router.get("/",(req,res)=>{
    result.find().exec((err,results)=>{
        if(err)
        {
           res.json({message:err.message, type:'danger'});
        }
        else
        {
            res.render("home",{
                results:results
               })
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
            console.log(resultRequest.rollnumber);
            console.log(resultRequest.name);
            console.log(resultRequest);
            // res.json({message:err.message, type: 'danger'});
            req.session.message = {
                type:'danger',
                message: err.message
            }
            res.redirect('/');
        }
        else{
           req.session.message = {
            type:'success',
            message:'Result Saved Successfully!'
           }
           //redirect user to home page
           res.redirect('/');
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
            res.redirect('/');
        }
        else{
            if(result === null || result === undefined)
            {
                req.session.message = {
                    type:'danger',
                    message: 'No record is find with this id'
                }
                res.redirect('/');
            }
            else
            {
                res.render('edit_result',{
                    result:result
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
            res.redirect('/');
        }
        else{
            req.session.message = {
                type:'success',
                message:'Result Updated Successfully!'
               }
               //redirect user to home page
               res.redirect('/');
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
            res.redirect('/');
           }
           else
           {
            req.session.message = {
                type:'success',
                message:'Result Deleted Successfully!'
               }
               //redirect user to home page
               res.redirect('/');
           }
    });

})

module.exports = router;