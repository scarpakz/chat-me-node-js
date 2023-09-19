const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser')
const user = require('./query/user')
const room = require('./query/room')
const messages = require('./query/messages')

app.use(cors())
app.use(bodyParser.json());
// Route handler for the homepage
// TODO: Separate the routers and add handlers for the APIs
app.post('/login', async (req, res) => {
    try {
        const userdata = req.body.codename

        if (!userdata) {
            res.sendStatus(404)
            return
        }

        const data = await user.getUsers()
        const hasResults = data.filter(item => item.code_name === userdata)

        if (hasResults.length > 0) {
            res.sendStatus(400)
        } else {
            await user.addNewUser(userdata)
            const newSetOfUsers = await user.getUsers()
            res.json(newSetOfUsers)
        }
    } catch (e) {
        res.sendStatus(500)
    }
    
})

/**
 * Delete user after logout
 */
app.delete('/logout/:codename', async (req, res) => {
    try {
        const userdata = req.params.codename
        if (!userdata) {
            res.sendStatus(404)
            return
        }

        await user.deleteUserDetail(userdata)
        res.sendStatus(200)
    } catch (e) {
        res.sendStatus(500)
    }
})

app.get('/api/v1/room', async (req, res) => {
    try {
        const rooms = await room.getRooms()
        res.json(rooms)
    } catch (e) {
        res.sendStatus(500)
    }
})

app.post('/api/v1/active_room/detail', async (req, res) => {
    try {
        const room_id = req.body.room_id
        const rooms = await room.getActiveRoomDetail(room_id)
        res.json(rooms)
    } catch (e) {
        res.sendStatus(500)
    }
})

app.post('/api/v1/create/room', async (req, res) => {
    try {
        const room_name = req.body.room_name
        await room.addRoom(room_name)
        res.sendStatus(200)
    } catch (e) {
        res.sendStatus(500)
    }
})

app.post('/api/v1/create/active_room', async (req, res) => {
    try {
        const user_id = req.body.user_id
        const room_id = req.body.room_id
        
        await room.addActiveRoom(user_id, room_id)
        res.sendStatus(200)
    } catch (e) {
        res.sendStatus(500)
    }
})

app.delete('/api/v1/delete/active_room/:user_id', async (req, res) => {
    try {
        const userdata = req.params.user_id
        if (!userdata) {
            res.sendStatus(404)
            return
        }

        await room.deleteActiveRoom(userdata)
        res.sendStatus(200)
    } catch (e) {
        res.sendStatus(500)
    }
})

app.post('/api/v1/create/message', async (req, res) => {
    try {
        const {room_id, user_id, inbox, datetime} = req.body
        console.log(req.body)
        await messages.createMessages({room_id, user_id, inbox, datetime})
        res.sendStatus(200)

    } catch(e) {
        res.sendStatus(500)
    }
})

app.post('/api/v1/room/message', async (req, res) => {
    try {
        const room_id = req.body.room_id
        
        await messages.getMessageDetail(room_id)
        res.sendStatus(200)

    } catch(e) {
        res.sendStatus(500)
    }
})

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`)
})
