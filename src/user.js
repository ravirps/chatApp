let users = []

let adduser = function({ id, username, room }) {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    if (!username || !room) {
        return { "error": "username room r required" }
    }
    const existinguser = users.find(user => {
        user.room === room && username === user.username
    })
    if (existinguser) {
        return { error: "username exist " }
    }
    let curruser = { id, username, room }
    users.push(curruser)
        // console.error(curruser);
    return { curruser }
}

let removeuser = function(id) {
    let index = users.findIndex(user => {
        return user.id === id
    })
    if (index === -1) return { error: "user not found" }
    return { user: users.splice(index, 1)[0] }
}

let getuser = function(id) {
    return { user: users.find(user => user.id === id) }
}

let getuserroom = function(room) {
    let currusers = users.filter(user => user.room === room)
    return { userlist: currusers }
}

module.exports = {
    adduser,
    getuser,
    getuserroom,
    removeuser
}