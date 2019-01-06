const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const tarIP = 'localhost';
let i = 0;
const int = setInterval(() => {
    if (i > 20) {
        clearInterval(int);
        console.log('closing client');
        client.close();
    } else {
        i++;
        console.log('sending msg', i);
        client.send(Buffer.from('This is the ' + i + ' message'), 41234, tarIP, (err) => {
            if (err) {
                client.close();
            }
        });
    }
}, 1000);