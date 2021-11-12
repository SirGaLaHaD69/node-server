const express =  require('express')

const app =  express();
const cors =  require('cors')
const productRouter =  require('./routes/products')
const orderRouter =  require('./routes/orders');
const userRouter =  require('./routes/users')
const morgan = require('morgan');
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ritik:'+process.env.MONGO_ATLAS_PW+'@node-demo.n236f.mongodb.net/node-demo?retryWrites=true&w=majority')
app.use(cors())
app.use(morgan('dev'))
app.use('/uploads',express.static('uploads'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.get('/hello',(req,res)=>{
    res.send("HELLO FROM AWS")
})
app.use('/products',productRouter);
app.use('/orders',orderRouter);
app.use('/users',userRouter);
app.post('/api/posts',(req,res)=>{
    console.log(req.body);
    res.status(201).json({
        message:"Post added successfully!"
    })
})
app.use("/api/posts",(req,res,next)=>{
    const posts=[
        {
            id:"haiubce29l",
            title:"first server side code",
            content:"Neijaa"
        },
        {
            id:"87yf2hib29",
            title:"second server side code",
            content:"Neijaa"
        },
        {
            id:"bc727y2rnc",
            title:"third server side code",
            content:"Neijaa"
        },
    ]
    res.status(200).json({
        message:"Heigala",
        posts:posts
    })
})
app.use((req,res,next)=>{
    const error =  new Error("neijaa re error asigala");
    error.status=404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status||500)
    res.json({
        message:error.message
    })
})

module.exports=app;