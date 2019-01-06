const dgram = require('dgram');
// const server = dgram.createSocket('udp4');

const client = dgram.createSocket('udp4');

const tarIP = '141.237.113.93';
let i = 0;
console.log('Trying to send on port:', process.env.PORT);
const int = setInterval(() => {
    i++;
    if (i > 1000) {
        clearInterval(int);
        client.close();
        console.log('STOPPING!');
    } else {
        const m = 'Rand ' + i + ' bytes!';
        client.send(Buffer.from(m), process.env.PORT, tarIP, (err) => {
            if (err) {
                clearInterval(int);
                client.close();
                console.log(err);
            } else {
                console.log('sent:   ', m);
            }
        });
    }
}, 1000);