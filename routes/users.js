const express = require('express');
const router =  express.Router();

const { signup, signin, deleteUser, getAllUsers } = require('../controllers/users');


router.post('/signup', signup)
router.post('/signin', signin)
router.delete('/:id',deleteUser)
router.get('/',getAllUsers)

module.exports=router