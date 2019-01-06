const dgram = require('dgram');
// const server = dgram.createSocket('udp4');

const client = dgram.createSocket('udp4');

const tarIP = '141.237.113.93';
let i = 0;
const int = setInterval(() => {
    i++;
    if (i > 1000) {
        clearInterval(int);
        client.close();
    } else {
        client.send(Buffer.from('Rand ' + i + ' bytes!'), 37888, tarIP, (err) => {
            if (err) {
                clearInterval(int);
                client.close();
            }
        });
    }
}, 1000);