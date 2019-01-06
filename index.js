const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
require('dotenv').config();
// const mongodUri = process.env.MONGOD_URI;
// if (!mongodUri) {
//     throw new Error('💣 MongoDB URI environment variable missing');
// }

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
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

if (!isProduction) {
    app.use(errorHandler());
}

//Configure Mongoose
// mongoose.connect(mongodUri, {
//     useMongoClient: true,
//     promiseLibrary: global.Promise
// });
// mongoose.set('debug', true);

// require('./models/users');
// require('./config/passport');
// app.use(require('./routes'));


//Error handlers & middlewares
// mongoose.connect('mongodb://localhost/passport-tutorial');
// mongoose.set('debug', true);

//Error handlers & middlewares
// if (!isProduction) {
//     app.use((err, req, res) => {
//         res.status(err.status || 500);

//         res.json({
//             errors: {
//                 message: err.message,
//                 error: err,
//             },
//         });
//     });
// }

// app.use((err, req, res) => {
//     res.status(err.status || 500);

//     res.json({
//         errors: {
//             message: err.message,
//             error: {},
//         },
//     });
// });

const router = require('express').Router();
router.get('/registered', (req, res, next) => {
    if (registered) {
        console.log('Queried for rooms');
        console.log(`Replying: server,${registered.address},${registered.port}`);
        res.json(registered);
        // server.send(Buffer.from(`server,${registered.address},${registered.port}`), rinfo.port, rinfo.address);
    } else {
        res.json({
            address: '',
            port: '',
            unset: true
        });
    }
});
app.use('/', router);
const envPort = process.env.PORT;
app.listen(envPort, () => console.log(`🖥 👍  Server running on http://localhost:${envPort}/`));


const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');

const commonPort = require('./commonPort');

// const tarIP = '52.202.215.126';
// const punchthrough = () => {
//     return new Promise((resolve, reject) => {
//         client.send(message, commonPort, tarIP, (err) => {
//             console.log('Sent some stuff!🎉🎉🎉🎉');
//             client.close();
//             if (err) {
//                 console.log('💣💣💣💣💣');
//                 reject(err);
//             } else {
//                 console.log('🐤🐤🐤🐤🐤🐤');
//                 resolve();
//             }
//         });
//     })
// }

// punchthrough().then(() => console.log('send packet to', tarIP, ':', commonPort)).catch((err) => console.log('Caught error:', err));

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});
let registered;
server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    const str = msg.toString();
    if (str === 'register') {
        console.log('Registering', rinfo);
        registered = rinfo;
    }
});


server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(commonPort);
// let i = 0;
// const interval = setInterval(() => {
//     i++;
//     if (i > 20) {
//         console.log('closing');
//         server.close();
//         clearInterval(interval);
//         // process.exit(0);
//     } else {
//         (i % 5 === 0) && console.log(i);
//     }
// }, 1000);
// server listening 0.0.0.0:commonPort