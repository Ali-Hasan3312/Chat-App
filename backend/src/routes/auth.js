import express from 'express';

const authRoutes = express.Router();

authRoutes.post('/signup',(req,res)=>{
    res.send("Signup route");
})
authRoutes.post('/login',(req,res)=>{
    res.send("Login route");
})
authRoutes.post('/logout',(req,res)=>{
    res.send("Logged In User route");
})


export default authRoutes;