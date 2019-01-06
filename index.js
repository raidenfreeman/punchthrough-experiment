const dgram = require('dgram');

const client = dgram.createSocket('udp4');

const tarIP = '141.237.113.93';
let i = 0;
console.log('Trying to send on port:', 3788);
const int = setInterval(() => {
    i++;
    if (i > 1000) {
        clearInterval(int);
        client.close();
        console.log('STOPPING!');
    } else {
        const m = 'Rand ' + i + ' bytes!';
        client.send(Buffer.from(m), 3788, tarIP, (err) => {
            if (err) {
                // client.address().
                clearInterval(int);
                client.close();
                console.log(err);
            } else {
                console.log('sending to ', tarIP, ':', 3788, '=>   ', m);
            }
        });
    }
}, 1000);

const express = require('express');
const app = express();

app.listen(process.env.PORT, () => console.log('🖥 👍  Server running on ', process.env.PORT));