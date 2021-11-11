const express = require('express');
const router =  express.Router();
const Product = require('../models/products')
const mongoose =  require('mongoose')
const multer = require('multer');
const jwtAuth = require('../middleware/jwtAuth')
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString()+file.originalname)
    }
    
})
const fileFilter = (req,file,cb)=>{
    if(file.mimetype=== 'image/jpeg' || file.mimetype=== 'image/png'){
        cb(null,true);
    }
    else{
        cb(new Error('File format not supported! Use either jpeg or png'),false);
    }
}
const upload = multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*5
    },
    fileFilter:fileFilter
})

router.post('/',jwtAuth,upload.single('productImage'),(req,res)=>{
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name : req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save().then(succ=>{
        console.log(res);
        res.status(201).json({message:"Post neijaa",product:product})
    })
    .catch(err=>{
        return res.status(500).json(err)
    })
})
router.get('/',(req,res)=>{
    Product.find().select('_id name price productImage').exec()
    .then(doc=>{
        res.status(200).json(doc)
    })
    .catch(err=>{
        res.status(500).json({error:err})
    });
})
router.get('/:prodId',(req,res)=>{
    const prodId =  req.params.prodId;
    Product.findById(prodId).exec()
    .then(doc=>{
        if(doc)
        res.status(200).json(doc)
        else
        res.status(404).json({message:"Not Found"})
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    })
})
router.delete('/:prodId',jwtAuth,(req,res)=>{
    const id = req.params.prodId
    Product.remove({_id:id}).exec()
    .then(succ=>{
        res.status(200).json(succ);
    })
    .catch(e=>{
        res.status(500).json({error:e})
    })
    
})
router.put('/:prodId',jwtAuth,(req,res)=>{
    const id =  req.params.prodId;
    Product.updateOne({_id:id},req.body).exec()
    .then(succ=>{
        res.status(200).json(succ);
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
})
module.exports=router