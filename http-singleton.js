let httpSingleton = function httpSingleton() {
    const _API_URI_START = '/pol/api';

    //#region [ VARIABLE ]
    const $ = this;

    const _UUID = require('uuid');
    const _ = require('lodash');
    const _PATH = require('path');
    const _FS = require('fs');

    const PORT = 12345;

    const SCOPE = 'API';
    const ___log = (...agrs) => { if ($.LOG) $.LOG.f_write('INFO', SCOPE, '', ...agrs); }
    const ___log_key = (key, ...agrs) => { if ($.LOG) $.LOG.f_write('INFO', SCOPE, key, ...agrs); }
    const ___log_error = (key, ...agrs) => { if ($.LOG) $.LOG.f_write('ERR', SCOPE, key, ...agrs); }
    console.log = (...agrs) => ___log_key(SCOPE, ...agrs);

    const ___guid = function () {
        return 'id-xxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };


    //#endregion

    //#region [ API SETUP ]

    const _HTTP_EXPRESS = require('express');
    const _HTTP_BODY_PARSER = require('body-parser');
    const _HTTP_COOKIE_PARSER = require('cookie-parser');
    const _HTTP_APP = _HTTP_EXPRESS();

    const _HTTP_SERVER = require('http').createServer(_HTTP_APP);
    const _IO = require('socket.io')(_HTTP_SERVER);

    //--------------------------------------------------------------------------------------------    

    _HTTP_APP.use(_HTTP_EXPRESS.static(_PATH.join(__dirname, 'htdocs')));
    _HTTP_APP.use(_HTTP_COOKIE_PARSER());
    _HTTP_APP.use(_HTTP_BODY_PARSER.json());
    _HTTP_APP.use((error, req, res, next) => {
        if ($.CACHE_STORE.IS_BUSY) {
            return res.json({ ok: false, state: $.CACHE_STORE.STATE, mesage: 'Api is caching ...' });
        }
        if (error !== null) {
            return res.json({ ok: false, mesage: 'Invalid json ' + error.toString() });
        }
        return next();
    });

    //#endregion

    //#region [ htdocs: /login /pawn-online ]

    _HTTP_APP.get('/login', function (req, res) {
        _FS.readFile('./htdocs/login.html', function read(err, data) {
            res.setHeader('content-type', 'text/html');
            if (err) {
                res.send('');
            } else {
                res.send(data);
            }
        });
    });

    _HTTP_APP.get('/pawn-online', function (req, res) {
        _FS.readFile('./htdocs/pawn-online.html', function read(err, data) {
            res.setHeader('content-type', 'text/html');
            if (err) {
                res.send('');
            } else {
                res.send(data);
            }
        });
    });

    //#endregion

    //#region [ API: /api-execute /api/:cache_name/all ]

    const http___cookie_get_user_id = (req) => {
        let user_id = 0;
        if (req.cookies) {
            const ___user_id = req.cookies.___user_id;
            if (___user_id != null && ___user_id != undefined) user_id = Number(___user_id);
        }
        return user_id;
    };

    const api___cache_callback = (m) => {
        console.log('API___RESPONSE_CALLBACK: ', m);

        if (m) {
            if (m.header && m.header.request && m.header.request.___api_id) {
                const id = m.header.request.___api_id;
                if (_API_RES[id]) {
                    const res = _API_RES[id];
                    if (m && m.ok == true && m.user_id) 
                        res.cookie('___user_id', m.user_id, { maxAge: 900000, httpOnly: true }); 
                    res.json(m);
                    res.end();
                    delete _API_RES[id];
                }
            }
        }
    };

    const _API_RES = {};
    _HTTP_APP.post(_API_URI_START + '-execute', function (req, res) {
        let api = req.query.api;
        if (api && api.length > 0) {
            if ($.CACHE_STORE) {
                let m = req.body;
                if (m == null || m == undefined) m = {};

                m.___user_id = http___cookie_get_user_id(req);
                m.___api = api;

                const id = _UUID.v4();
                if (m.___api_id == null) m.___api_id = id;
                else id = m.___api_id;

                _API_RES[id] = res;
                $.CACHE_STORE.api___execute(m, api___cache_callback);
            } else {
                res.json({ ok: false, error: { message: '$.CACHE_STORE is null' } });
            }
        } else {
            res.json({ ok: false, message: 'Cannot find ?api=' });
        }
    });

    _HTTP_APP.get(_API_URI_START + '/log/console/clear', function (req, res) {
        if ($.LOG) $.LOG.f_console_clear();
        res.end('OK');
    });

    _HTTP_APP.get(_API_URI_START + '/:cache_name/all', function (req, res) {
        const cache_name = req.params.cache_name.toUpperCase();
        $.CACHE_STORE.api___get_all_raw_ext_async(cache_name).then(body => {
            const data = body.data;
            if (data == null) data = [];
            const len = data.length;
            res.json({ ok: true, request: {}, total_items: len, count_result: len, result_items: data });
        }).catch(err => {
            res.json({ ok: false, message: err.message });
        });
    });

    //#endregion

    //#region [ /view-data/ raw | ext ]

    _HTTP_APP.get('/view-data/:type/:cache_name', function (req, res) {
        const api = req.params.cache_name;
        const type = req.params.type;
        let a = [];
        if (api) a = $.CACHE_STORE.f_search___test(type, api.toUpperCase());
        res.json(a);
    });

    _HTTP_APP.get('/view-data/:type/:cache_name/:id', function (req, res) {
        const api = req.params.cache_name;
        const type = req.params.type;
        const id = req.params.id;
        let o = {};
        if (api) o = $.CACHE_STORE.f_search___test_id(type, api.toUpperCase(), id);
        res.json(o);
    });

    //#endregion

    //#region [ /info ]

    _HTTP_APP.get('/info', function (req, res) {
        res.json($.INFO);
    });

    //#endregion

    //#region [ TEST ]

    _HTTP_APP.get('/test-log', function (req, res) {
        const s = $.INFO.APP_NAME + ' Test LOG at ' + new Date().toLocaleString();
        $.LOG.info(s);
        res.json({ ok: true, message: s });
    });

    //#endregion

    //#region [ LOG ]

    _HTTP_APP.get('/log', function (req, res) {
        const log = $.LOG.f_get_all();
        res.json(log);
    });

    //--------------------------------------------------

    _HTTP_APP.get('/log/keys', function (req, res) {
        const log = $.LOG.f_get_keys();
        res.json(log);
    });

    _HTTP_APP.get('/log/scopes', function (req, res) {
        const log = $.LOG.f_get_scopes();
        res.json(log);
    });

    //--------------------------------------------------

    _HTTP_APP.get('/log/clear', function (req, res) {
        const log = $.LOG.f_clear();
        res.json(log);
    });

    _HTTP_APP.get('/log/setting', function (req, res) {
        const log = $.CACHE_SETTING.log;
        if (log) res.json(log);
        else res.json({});
    });

    //--------------------------------------------------

    _HTTP_APP.get('/log/filter/scope/:scope', function (req, res) {
        const value = req.params.scope;
        if (value) {
            const a = $.LOG.f_filter('scope', value);
            res.json(log);
        } else
            res.json([]);
    });

    _HTTP_APP.get('/log/filter/key/:key', function (req, res) {
        const value = req.params.key;
        if (value) {
            const a = $.LOG.f_filter('key', value);
            res.json(a);
        } else
            res.json([]);
    });

    //--------------------------------------------------

    //#endregion

    //#region [ /cache-setting ]

    _HTTP_APP.get('/cache-setting', function (req, res) {

        const val = $.CACHE_STORE.f_get___cache_setting();
        //___log(val);

        res.json(val);
    });

    _HTTP_APP.post('/cache-setting', function (req, res) {
        const m_ = req.body;
        $.CACHE_STORE.f_set___cache_setting(m_);
        res.json($.CACHE_STORE.f_get___cache_setting());
    });

    //#endregion

    //#region [ /cache-index ]

    _HTTP_APP.get('/cache-index', function (req, res) {

        const val = $.CACHE_STORE.f_get___cache_setting();
        //___log(val);

        res.json(val);
    });

    //#endregion

    //#region [ /cache-join-1n ]

    _HTTP_APP.get('/cache-join-1n/all', function (req, res) {
        const val = $.CACHE_STORE.f_get___cache_join_1n_all();
        res.json(val);
    });

    _HTTP_APP.get('/cache-join-1n/key/all', function (req, res) {
        const val = $.CACHE_STORE.f_get___cache_join_1n_keys();
        res.json(val);
    });

    _HTTP_APP.get('/cache-join-1n/key/:cache_name', function (req, res) {
        const cache_name = req.params.cache_name;
        if (cache_name) {
            const val = $.CACHE_STORE.f_get___cache_join_1n_by_cache_name(cache_name);
            res.json(val);
        } else res.json([]);
    });

    _HTTP_APP.get('/cache-join-1n/key/:cache_name/:id', function (req, res) {
        const cache_name = req.params.cache_name;
        const id = req.params.id;
        if (cache_name && id && id > 0) {
            const val = $.CACHE_STORE.f_get___cache_join_1n_by_cache_name_id(cache_name, id);
            res.json(val);
        } else res.json([]);
    });

    //#endregion
     
    //--------------------------------------------------------------------------------------------

    const on_ready = function (add_port_api) {
        $.on_ready_shared(add_port_api);
    };

    this.f_response_message = function (m_) {
        ___log(m_);

        if (m_ && 'key___' in m_) {
            const key = m.key___;
            if (key) {
                if (_RESPONSE.has(key)) {
                    const res = _RESPONSE.get(key);
                    res.json(m_);
                    res.end();
                    _RESPONSE.del(key);
                }

                if (_REQUEST.has(key)) _REQUEST.del(key);
            }
        }
    };

    this.f_start = function () {

        _HTTP_SERVER.listen(PORT, '127.0.0.1', () => {
            $.ADDRESS_PORT = _HTTP_SERVER.address();
            console.log('HTTP_API: ', $.ADDRESS_PORT);
            on_ready($.ADDRESS_PORT);
        });

        _IO.on('connection', client => {
            ////////if (___CACHE_DONE == false) return;

            ////////const c = client.handshake.headers.cookie;
            ////////let uid = '';
            ////////if (c && c.indexOf('user_id=') != -1) {
            ////////    const pos = c.indexOf('user_id=') + 8;
            ////////    uid = c.substr(pos, c.length - pos).split(';')[0].trim();
            ////////}
            ////////console.log(uid);

            //////let user_id;

            //////client.on('push', data => {
            //////    //if (___CACHE_DONE == false) return;

            //////    //if (user_id == null) ___users_socketio[data.id] = client;
            //////    //user_id = data.id;

            //////    //if (___users_online[user_id] == null || ___users_online[user_id] == 0) {
            //////    //    ___users_online[user_id] = 1;

            //////    //    db___execute_callback(null, null, 'mobile.user_biz_update_user', {
            //////    //        user_id: user_id,
            //////    //        int_type: 1,
            //////    //        int_pol_status: data.status,
            //////    //        int_pol_region: 0,
            //////    //        int_user_create: user_id
            //////    //    }, function (m_) {
            //////    //    }, function (m_) {
            //////    //    });
            //////    //}
            //////});

            //////client.on('disconnect', (data) => {
            //////    //if (___CACHE_DONE == false) return;

            //////    //if (user_id != null && ___users_online[user_id] != null) {
            //////    //    //console.log('IO.CLOSE: ...11111111111111111111111111111111111', user_id, data);

            //////    //    ___users_online[user_id] = 0;

            //////    //    db___execute_callback(null, null, 'mobile.user_biz_update_user', {
            //////    //        user_id: user_id,
            //////    //        int_type: 1,
            //////    //        int_pol_status: 0,
            //////    //        int_pol_region: 0,
            //////    //        int_user_create: user_id
            //////    //    }, function (m_) {
            //////    //        //console.log('OK=', m_);
            //////    //    }, function (m_) {
            //////    //        //console.log('FAIL=', m_);
            //////    //    });

            //////    //}
            //////    //if (___users_socketio[user_id]) ___users_socketio[user_id] == null;
            //////});
        });
    };
};

httpSingleton.instance = null;
httpSingleton.getInstance = function () {
    if (this.instance === null) this.instance = new httpSingleton();
    return this.instance;
};
module.exports = httpSingleton.getInstance();