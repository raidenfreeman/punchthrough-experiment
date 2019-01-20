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

const rooms = {};
const router = require('express').Router();

router.get('/', (req, res, next) => {
    let responseHTML = `<!doctype html><html><body><h2>Room server at ${server.address().address}</h2>`;
    const roomsArray = Object.values(rooms);
    if (roomsArray && roomsArray.length) {
        responseHTML += `<h3>These are the registered rooms:</h3>`;
        responseHTML = roomsArray.reduce((html, room) => html + `<p>${JSON.stringify(room)}</p>`, responseHTML);
    } else {
        responseHTML += `<h3>There are no registered rooms 🤷‍♂️</h3>`;
    }
    responseHTML += `</body></html>`;
    res.send(responseHTML);
})


router.get('/rooms', (req, res, next) => {
    if (rooms) {
        console.log('Queried for rooms');
        res.status(200).json(Object.values(rooms).map(x => convertRoomToSend(x)));
        return;
    } else {
        res.status(404).json({});
        return;
    }
});

const validateOwner = ({
    name,
    publicIP,
    publicPort,
    privateIP,
    privatePort
}) => {
    if (!name) {
        console.error(name);
        return false;
    }
    const isIP = require('net').isIPv4;
    const isValidPort = (port) => (+port) < 65536 && (+port) > 0 && port === (+port).toString();
    if (!(isIP(publicIP) && isIP(privateIP) && isValidPort(publicPort) && isValidPort(privatePort))) {
        console.error(isIP(publicIP), publicPort, isIP(privateIP), privatePort);
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
        console.error(maxClients);
        return false;
    }
    if (!name) {
        console.error(name);
        return false;
    }
    if (!(owner && validateOwner(owner))) {
        console.error(JSON.stringify(owner));
        return false;
    }
    return true;
}

// TODO: All rooms should use user tokens, so that someone knowing the username & room name, can't modify them

// Create a room
router.post('/register', (req, res) => {
    const {
        name,
        owner,
        maxClients
    } = req.body;

    // Check if it already exists
    const existingRoom = Object.values(rooms).filter(x => x.owner.name === owner.name).find(x => x.name === name);
    if (existingRoom) {
        res.status(409).json(convertRoomToSend(existingRoom));
        return;
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
        return;
    } else {
        // Bad request
        res.status(400).json({
            error: "Invalid Room"
        });
        return;
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

const roomTimeout = 10000;

const clearTimedOutRooms = setInterval(() => {
    const now = Date.now();
    Object.keys(rooms).forEach(key => {
        const room = rooms[key];
        if (roomTimeout < now - room.lastUpdate) {
            // TODO: Is that 100% safe?
            // I'm returning a new array and iterating over it, delete shouldn't affect it
            delete rooms[key];
        }
    })
}, roomTimeout);

router.get

app.use('/', router);
const envPort = process.env.PORT || 5000;
const server = app.listen(envPort, () => console.log(`🖥 👍  Server running on http://localhost:${envPort}/`));