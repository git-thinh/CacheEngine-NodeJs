//#region [ VARIABLES ]

const _ = require('lodash');
const _REDIS = require("redis");
const _JOB = require('cron').CronJob;

//---------------------------------------

let _CHANNEL = null;
const _SCOPE = 'THREAD_REDIS';
const { Worker, MessageChannel, receiveMessageOnPort, parentPort, workerData } = require('worker_threads');

const ___yyyyMMddHHmmss = Number(new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 8) + new Date().toTimeString().split(' ')[0].replace(/\D/g, ''));

const ___log = (key, ...agrs) => {
    const type = 'INFO';
    const m = { cmd: 'LOG', data: { type: type, scope: _SCOPE, key: _SCOPE + '_' + key, time: ___yyyyMMddHHmmss, log: agrs } };
    parentPort.postMessage(m);
};

const ___error = (key, ...agrs) => {
    const type = 'ERR';
    const m = { cmd: 'LOG', data: { type: type, scope: _SCOPE, key: _SCOPE + '_' + key, time: ___yyyyMMddHHmmss, log: agrs } };
    parentPort.postMessage(m);
};

//---------------------------------------

// Thread, message
const _MSG = [];
let _THREAD_READY = false;
let _CONFIG;

// Redis
const _CLIENT = _REDIS.createClient(6379, '27.0.0.1');
let _REDIS_CONNECTED = false;
let _REDIS_SETTING = false;
let _REDIS_PAUSE = true;

_THREAD_READY = _REDIS_CONNECTED && _REDIS_SETTING && _REDIS_PAUSE == false;

//#endregion

//#region [ ON MESSAGE ]

parentPort.on('message', (m_) => {
    if (m_ && m_.cache_port) {
        _CHANNEL = m_.cache_port;
        thread___start();
    } else {
        thread___on_message(m_);
    }
});

const thread___start = (m_) => {
    ___log('INIT', 'Thread redis update staring ...');
};

const thread___on_message = (m_) => {
    if (m_) {
        if (typeof m_ == 'string') {
            switch (m_) {
                case 'PAUSE':
                    _REDIS_PAUSE = true;
                    break;
                case 'START':
                    _REDIS_PAUSE = false;
                    break;
            }
        } else {
            _MSG.push(m_);
            ___log('MSG', m_);
        }
    }
};

const msg___executing = () => {
    if (_THREAD_READY == false || _MSG.length == 0) {
        setTimeout(function () { msg___executing(); }, 500);
        return;
    }
    const m = _MSG.shift();
    redis___execute(m, (err, res) => {
        if (err) {

        } else {

        }
    });
    setTimeout(function () { msg___executing(); }, 300);
};
msg___executing();

//#endregion

const channel___sendMessage = (m_) => { if (_CHANNEL) _CHANNEL.postMessage(m_); };
const redis___update_state = () => { _THREAD_READY = _REDIS_CONNECTED && _REDIS_SETTING && _REDIS_PAUSE == false; };

//#region [ THREAD REDIS ]

//_CLIENT.on('connect', function () { _REDIS_CONNECTED = false; });
_CLIENT.on('ready', function () {
    _REDIS_CONNECTED = true;
    redis___update_state();
    channel___sendMessage('REDIS_STATE_ON');
});

_CLIENT.on('error', function (err) {
    if (_REDIS_CONNECTED == true) {
        _REDIS_CONNECTED = false;
        redis___update_state();
        channel___sendMessage('REDIS_STATE_OFF');
    }
});

const redis___execute = (m_, callback) => {
    if (m_) {
        const id = m_.id;
        const cmd = m_.cmd;
        const request = m_.request;
        switch (cmd) {
            case 'SET_CONFIG':
                break;
            case 'DB_ADD':
            case 'DB_UPDATE':
            case 'DB_REMOVE':
                if (id) {

                    _CLIENT.multi([
                        ['hmset', 'ids', id, 0, _REDIS.print],
                        ['set', id, m_, _REDIS.print]
                    ]).exec(function (err, replies) {
                        if (err1) {
                            callback({ ok: false, id: id, err: { message: 'Execute update data to Redis fail', error: err }, message: m_ });
                        } else {
                            callback(null, { ok: true, id: id, message: m_ });
                        }
                    });

                } else {
                    callback({ ok: false, id: id, err: { message: 'Data missing {id:..., cmd:..., request:... }', error: null }, message: m_ });
                }
                break;
        }
    }
};

//#endregion

new _JOB('* * * * * *', function () {

}).start();