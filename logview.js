const PORT = 2020;
const HOST = '127.0.0.1';

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const MSG = [];

let _KEY_WORD = '';
process.argv.forEach((val, index) => {
    //console.log(`${index}: ${val}`);
    if (val.toLowerCase().endsWith(".js") && _KEY_WORD.length == 0) {
        if (index < process.argv.length - 1) {
            _KEY_WORD = process.argv[index + 1];
        }
    }
});
console.log('_KEY_WORD = ' + _KEY_WORD);

server.on('listening', function () {
    var address = server.address();
    console.log('LOG listening on ' + address.address + ':' + address.port);
});

server.on('message', function (buf, remote) {
    if (buf.length == 1 && buf[0] == 126) // ~
        console.clear();
    else
        MSG.push(buf);
});

server.bind(PORT, HOST);

const ___print = function () {
    if (MSG.length == 0) {
        setTimeout(function () { ___print(); }, 100);
    } else {
        const buf = MSG.shift();

        const s = buf.toString('utf8');

        if (_KEY_WORD.length > 0 && s.indexOf(_KEY_WORD) == -1) {
            setTimeout(function () { ___print(); }, 100);
            return;
        }

        console.log('\n');
        const j = JSON.parse(s);
        const type = j.type;
        const scope = j.scope;
        const key = j.key;
        const time = j.time;
        const logs = j.log;

        if (logs.length == 1)
            console.log(' * ', scope, key, logs[0]);
        else {
            console.log(' * ', scope, key);
            logs.forEach(l => {
                //if (typeof l == 'string' || typeof l == 'number') {
                console.log(' -> ', l);
                //} else {
                //    console.log('-> ' + JSON.stringify(l));
                //}
            });
        }

        setTimeout(function () { ___print(); }, 1);
    }
};
___print();