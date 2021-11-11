const express = require('express');
const router  =  express.Router()
const mongoose = require('mongoose')
const Order =  require('../models/orders');
const Product =  require('../models/products')
const jwtAuth=require('../middleware/jwtAuth')

router.post('/',jwtAuth, async (req,res)=>{
    let prodId =  req.body.productId;
    try{
        const product = await Product.findById(prodId)
    }
    catch{
       return res.status(404).json({message:"Product Not Found"});
    }
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product : req.body.productId,
        quantity:req.body.quantity
    })
    order.save()
    .then(succ=>{
        console.log(res);
        res.status(201).json({message:"Order Post neijaa",order:order})
    })
    .catch(err=>{
        return res.status(500).json(err)
    })
})
router.get('/',(req,res)=>{
    Order.find()
    .populate('product','name')
    .select('_id product quantity').exec()
    .then(doc=>{
        res.status(200).json(doc)
    })
    .catch(err=>{
        res.status(500).json(err)
    });
})
module.exports=router;