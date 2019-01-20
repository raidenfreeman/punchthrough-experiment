const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const uuid = require('uuid/v4');
require('dotenv').config();

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
// app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'passport-tutorial',
    cookie: {
        maxAge: 60000
    },
    resave: false,
    saveUninitialized: false
}));

const router = require('express').Router();
router.get('/', (req, res, next) => {
    res.send(`<h2>${server.address()}</h2><p>hello, these are the registered rooms:</p><p>${registered}</p>`);
})

const rooms = [];
router.get('/rooms', (req, res, next) => {
    if (rooms && rooms.length) {
        console.log('Queried for rooms');
        console.log(`Replying: server,${registered.address},${registered.port}`);
        res.json(rooms);
        // server.send(Buffer.from(`server,${registered.address},${registered.port}`), rinfo.port, rinfo.address);
    } else {
        res.json({
            address: '',
            port: '',
            unset: true
        });
    }
    res.status(200);
});

const validateOwner = ({
    name,
    publicIP,
    publicPort,
    privateIP,
    privatePort
}) => {
    if (!name) {
        return false;
    }
    const isIP = require('net').isIPv4;
    const isValidPort = (port) => (+port) < 65536 && (+port) > 0 && port === (+port).toString();
    if (!(isIP(publicIP) && isIP(privateIP) && isValidPort(publicPort) && isValidPort(privatePort))) {
        return false;
    }
    return true;
}

const validateRoom = ({
    name,
    owner,
    maxClients
}) => {
    if (!(maxClients && maxClients > 1)) {
        return false;
    }
    if (!name) {
        return false;
    }
    if (!(owner && validateOwner(owner))) {
        return false;
    }
    return true;
}

// TODO: All rooms should use user tokens, so that someone knowing the username & room name, can't modify them

const convertRoomToSend = ({
    name,
    owner,
    maxClients,
    id
}) => ({
    name,
    owner,
    maxClients,
    id
});
// Create a room
router.post('/register', (req, res) => {
    try {
        const {
            name,
            owner,
            maxClients
        } = req.body;
    } catch (e) {

        res.status(400);
        return;
    }

    // Check if it already exists
    const existingRoom = rooms.filter(x => x.owner === owner).find(x => x.name === name);
    if (existingRoom) {
        res.status(409).json(convertRoomToSend(existingRoom));
    }
    const room = {
        name,
        owner,
        maxClients,
        id: uuid(),
        lastUpdate: Date.now()
    };
    if (validateRoom(room)) {
        rooms[room.id] = room;
        // Created resource
        res.status(201).json(convertRoomToSend(room));
    } else {
        // Bad request
        res.status(400);
    }
});

router.post('/keepalive', (req, res) => {
    const room = rooms[req.body.id];
    if (!room) {
        res.status(404);
        return;
    } else {
        room.lastUpdate = Date.now();
        res.status(200);
        return;
    }
});

router.post('/close', (req, res) => {
    const room = rooms[req.body.id];
    if (!room) {
        res.status(404);
        return;
    } else {
        delete rooms[req.body.id];
        res.status(200);
        return;
    }
});

router.get('/rooms', (req, res) => {
    res.json(rooms.map(x => convertRoomToSend(x)));
});

app.use('/', router);
const envPort = process.env.PORT;
app.listen(envPort, () => console.log(`🖥 👍  Server running on http://localhost:${envPort}/`));