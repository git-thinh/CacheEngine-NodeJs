let logSingleton = function logSingleton() {
    //#region [ VARIABLE ]

    const $ = this;

    const _ = require('lodash');

    const _A_LOG = [];
    const _A_ERR = [];

    const _SCOPES = [];
    const _KEYS = [];
    let _MAX_SIZE = 1000;
    let _ENABLE = false;

    let _BROAD_CAST_ALL = true;

    let _UDP_LOG = ['127.0.0.1', 2020, true];
    let _UDP_ERROR = ['127.0.0.1', 2121, true];

    let _BROADCAST_KEYS = [];

    const _JOB = require('cron').CronJob;

    var _DGRAM = require('dgram');

    //#endregion

    this.f_console_clear = function () {
        if (_UDP_LOG == null || _UDP_LOG.length < 2 || _UDP_LOG[2] == false) {
            ;
        } else {
            var buf = Buffer.from('~');
            const udp = _DGRAM.createSocket('udp4');
            udp.send(buf, 0, buf.length, _UDP_LOG[1], _UDP_LOG[0], (err) => {
                // Send success
                udp.close();
            });
        }

        if (_UDP_ERROR == null || _UDP_ERROR.length < 2 || _UDP_ERROR[2] == false) {
            ;
        } else { 
            var buf = Buffer.from('~');
            const udp = _DGRAM.createSocket('udp4');
            udp.send(buf, 0, buf.length, _UDP_ERROR[1], _UDP_ERROR[0], (err) => {
                // Send success
                udp.close();
            });
        }
    };

    //--------------------------------------------------------------------------------------------

    this.f_setup_update = function () {

        if ($.CACHE_SETTING && $.CACHE_SETTING.log) {
            if ($.CACHE_SETTING.log.max_size) _MAX_SIZE = $.CACHE_SETTING.log.max_size;
            if ($.CACHE_SETTING.log.enable) _ENABLE = $.CACHE_SETTING.log.enable == true ? true : false;

            if ($.CACHE_SETTING.log.broadcast) {
                const b = $.CACHE_SETTING.log.broadcast;

                if (b.keys) _BROADCAST_KEYS = b.keys;
                if (_BROADCAST_KEYS.length > 0) _BROAD_CAST_ALL = _BROADCAST_KEYS[0] == '*' ? true : false;

                if (b.udp_log && b.udp_log.length > 2) _UDP_LOG = b.udp_log;
                if (b.udp_error && b.udp_error.length > 2) _UDP_ERROR = b.udp_error;
            }
        }

        if (_MAX_SIZE < 1000) _MAX_SIZE = 1000;
    };

    //--------------------------------------------------------------------------------------------
    this.f_write_message = function (m) {
        if (_ENABLE == false) return;

        if (m && m.type == 'ERR')
            _A_ERR.push(m);
        else
            _A_LOG.push(m);
    };

    this.f_write = function (type, scope, key, ...agrs) {
        if (_ENABLE == false) return;

        if (_A_LOG.length == _MAX_SIZE) {
            const len = Math.round(_MAX_SIZE / 3);
            _A_LOG.splice(0, len);
        }

        if (_A_ERR.length == _MAX_SIZE) {
            const len = Math.round(_MAX_SIZE / 3);
            _A_ERR.splice(0, len);
        }

        if (scope != null && scope.length > 0 && _SCOPES.indexOf(scope) == -1) _SCOPES.push(scope);
        if (key != null && key.length > 0 && _KEYS.indexOf(key) == -1) _KEYS.push(key);

        const ___yyyyMMddHHmmss = Number(new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 8) + new Date().toTimeString().split(' ')[0].replace(/\D/g, ''));
        const m = { type: type, scope: scope, key: key, time: ___yyyyMMddHHmmss, log: agrs };

        if (type == 'ERR')
            _A_ERR.push(m);
        else
            _A_LOG.push(m);
    };

    this.f_clear_error = () => _A_ERR = [];
    this.f_get_all_error = () => _A_ERR;

    //--------------------------------------------------------------------------------------------

    this.f_clear = () => _A_LOG = [];

    this.f_get_all = () => _A_LOG;

    //--------------------------------------------------------------------------------------------

    this.f_get_scopes = () => _SCOPES;

    this.f_get_keys = () => _KEYS;

    this.f_filter = (type, value) => {
        if (type == 'scope') {
            const a = _.filter(_A_LOG, function (o_) { return o_.scope = value; });
            return a;
        } else if (type == 'key') {
            const a = _.filter(_A_LOG, function (o_) { return o_.key = value; });
            return a;
        } else if (type == 'err') {
            return _A_ERR;
        }

        return [];
    };

    //--------------------------------------------------------------------------------------------

    new _JOB('* * * * * *', function () {
        if (_A_ERR.length > 0) {
            if (_UDP_ERROR == null || _UDP_ERROR.length < 2 || _UDP_ERROR[2] == false) return;

            const m = _A_ERR.shift();
            var buf = Buffer.from(JSON.stringify(m));
            const udp = _DGRAM.createSocket('udp4');
            udp.send(buf, 0, buf.length, _UDP_ERROR[1], _UDP_ERROR[0], (err) => {
                // Send success
                udp.close();
            });
        }
    }).start();

    new _JOB('* * * * * *', function () {
        if (_A_LOG.length > 0) {
            if (_UDP_LOG == null || _UDP_LOG.length < 2 || _UDP_LOG[2] == false) return;

            const m = _A_LOG.shift();
            let send = false;

            if (_BROAD_CAST_ALL) send = true;
            else if (_BROADCAST_KEYS.indexOf(m.key) != 1) send = true;

            //console.log('LOG = ', send, m);

            if (send) {
                var buf = Buffer.from(JSON.stringify(m));
                const udp = _DGRAM.createSocket('udp4');
                udp.send(buf, 0, buf.length, _UDP_LOG[1], _UDP_LOG[0], (err) => {
                    // Send success
                    udp.close();
                });
            }
        }
    }).start();
    //--------------------------------------------------------------------------------------------    
};

logSingleton.instance = null;
logSingleton.getInstance = function () {
    if (this.instance === null) this.instance = new logSingleton();
    return this.instance;
};
module.exports = logSingleton.getInstance();