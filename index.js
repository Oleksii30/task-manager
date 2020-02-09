const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const path = require ('path')
const cors = require ('cors')
const socketio = require('socket.io')
const http = require('http')



const app = express()
const port = process.env.PORT || 3000

const server = http.createServer(app)
const io = socketio(server)


const publicDirectoryPath = path.join(__dirname, './public')
app.use(express.static(publicDirectoryPath))

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(taskRouter)


io.on('connection', (socket)=>{
    console.log('New web socket')
    socket.on('newMessage', message=>{
        io.emit('message', message)
    })

    
})

server.listen(port, () => {
    console.log('Server is up on port ' + port)
})

