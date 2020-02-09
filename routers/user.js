const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const mailSend = require('../email/sender')
const jwt = require('jsonwebtoken')

const router = new express.Router()


const upload = multer({
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar',auth, upload.single('upload'), async (req,res)=>{
    
    try{
        const image = await sharp(req.file.buffer).png().toBuffer()
        
        req.user.avatar = image
        await req.user.save()
     
        res.status(200).send()
    }catch(err){
        res.status(400).send()
    }
   
})


router.post('/users/signup', async(req, res) => {
    
    try {
        const user = new User(req.body)
        const token = await user.generateAuthToken()


        mailSend(user.name, token)
        res.status(201).send({userId:user._id, token: token, expiresIn:3600})
        
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/confirm/:token', async (req,res,next)=>{
    console.log('request resived')
    const token = req.params.token
    const decoded = jwt.verify(token, 'thisismynewcourse')
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    if (user){
        user.confirmed = true
        res.writeHead(301,
            {Location: 'http://localhost:4200/user/'+ user._id}
          );
          res.end();
    }else{
        res.status(404).send()
    }

})

router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)
})


router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({userId:user._id, token: token, expiresIn:3600})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.patch('/users/:id', async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = await User.findById(req.params.id)

        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
