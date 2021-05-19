const express = require("express")
const path = require("path")
const socketio = require('socket.io')
const http = require('http')
const generatemessage = require("./message")
const app = express()
const { adduser, getuser, removeuser, getuserroom } = require("./user")
const port = process.env.PORT || 5500
const server = http.createServer(app)
const io = socketio(server)

const publicpath = path.join(__dirname, "../public")
app.use(express.static(publicpath))

let count = 0;
io.on('connection', (socket) => {
    let room = "1"
    let username = "anonymous"
    console.log("new websocket connection")

    socket.on("newmessage", (message) => {
        console.log(message)
        io.to(room).emit("newmessage", {...message, username })
    })

    socket.on("join", (user) => {
        if (!user) return
        room = user.room
        username = user.username
        socket.join(user.room)
            // console.log("joining", user)
        let { error, curruser } = adduser({ "id": socket.id, username, room })
        if (error) {
            return
        }
        // console.log("joined", getuserroom(user.room))

        io.to(room).emit("roomdata", {
            userlist: getuserroom(user.room)
        })
        socket.broadcast.to(room).emit("newmessage",
            generatemessage(`${user.username} has joined the chat room`))

    })

    socket.on("sendlocation", (position) => {
        let message = generatemessage(`https://www.google.com/maps?q=${position.lat},${position.long}`)
        io.to(room).emit("locationmessage", {...message, username })

    })

    socket.on("disconnect", (val) => {
        const { error, curruser } = removeuser(socket.id)
        if (error) {
            return
        }
        io.to(room).emit("roomdata", {
                userlist: getuserroom(room)
            })
            // console.log(getuserroom(room))
        console.log("disconnected")
        socket.broadcast.to(room).emit("newmessage", generatemessage(`${username} has left the chat room`))
    })
})




server.listen(port, () => {
    console.log("listening on port 5500")
})