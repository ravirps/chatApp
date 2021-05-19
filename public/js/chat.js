const socket = io()
let message_template = document.querySelector('#message_template').innerHTML
let location_template = document.querySelector('#location_template').innerHTML
let sidebar_template = document.querySelector('#sidebar_template').innerHTML
let chat_div = document.querySelector("#chat_div")
let sendbtn = document.querySelector('#sendbtn')
let input_box = document.querySelector("input")
let sidebar = document.querySelector('.chat__sidebar')

let user = Qs.parse(location.search, { ignoreQueryPrefix: true })

const generatemessage = function(text) {
    return {
        "text": text,
        "created_at": new Date().getTime()
    }
}
socket.emit("join", user, (error) => {
    alert(error)
})
socket.on("roomdata", (data) => {
    console.log(data.userlist.userlist)
    let html = Mustache.render(sidebar_template, {
        "room": user.room,
        "users": data.userlist.userlist
    })
    console.log(html)
    sidebar.innerHTML = html

})
let autoscroll = () => {
    chat_div.scrollTop = chat_div.scrollHeight
}
socket.on("locationmessage", (message) => {
    let html = Mustache.render(location_template, {
        "message": message.text,
        "created_at": moment(message.created_at).format("H:m a"),
        "username": message.username
    })
    chat_div.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
socket.on("newmessage", (message) => {
    console.log(message)
    let html = Mustache.render(message_template, {
        "message": message.text,
        "created_at": moment(message.created_at).format("H:m a"),
        "username": message.username
    })
    chat_div.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

document.querySelector('#message-form').addEventListener('submit',
    (e) => {
        e.preventDefault()
        sendbtn.setAttribute("disabled", "disabled")

        input_box.focus()
        console.log("clicked send")
        let text = document.querySelector('#message').value
        input_box.value = ''
        if (text) {
            socket.emit('newmessage', generatemessage(text), (message) => {
                console.log("returned ", message)
            })
        }
        sendbtn.removeAttribute("disabled")
    })

document.querySelector('#send-location').addEventListener('click',
    () => {
        if (!navigator.geolocation) {
            alert("yoiu dont have location support")
        }
        navigator.geolocation.getCurrentPosition((position) => {
            // console.log("sending", position.coords.latitude)
            socket.emit("sendlocation", {
                    "lat": position.coords.latitude,
                    "long": position.coords.longitude
                },
                (message) => {
                    console.log(message)
                })
        })
    })