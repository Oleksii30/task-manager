const mongoose = require('mongoose')
const key = process.env.key
mongoose.connect(`mongodb+srv://Oleksii:${key}@cluster0-1tqyp.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=>{
    console.log("Connected to db")
}).catch(()=>{
    console.log("Connection failed")
})
