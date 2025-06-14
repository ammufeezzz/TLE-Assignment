const express = require('express');
const{addUser,getUsers,updateUsers,deleteUser}=require("../controllers/userController")
const router = express.Router();


router.post('/add',addUser);
router.get('/getusers',getUsers)
router.put('/updateUser',updateUsers)
router.delete('/deleteUser',deleteUser)

module.exports = router;