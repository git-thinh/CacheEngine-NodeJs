var cacheSingleton = function cacheSingleton() {
    //#region [ VARIABLE ]

    const $ = this;
    const PORT = 1000;

    const SCOPE = 'CACHE';
    const ___log = (...agrs) => { if ($.LOG) $.LOG.f_write('INFO', SCOPE, '', ...agrs); }
    const ___log_key = (key, ...agrs) => { if ($.LOG) $.LOG.f_write('INFO', SCOPE, key, ...agrs); }
    const ___log_error = (key, ...agrs) => { if ($.LOG) $.LOG.f_write('ERR', SCOPE, key, ...agrs); }

    this.log = (...agrs) => ___log(...agrs);
    this.log_key = (key, ...agrs) => log_key(key, ...agrs);

    const ___yyyyMMddHHmmss = () => Number(new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 8) + '' + new Date().toTimeString().split(' ')[0].replace(/\D/g, ''));

    const _UUID = require('uuid');
    const _ = require('lodash');
    const _FS = require('fs');
    const _NET = require('net');
    const { Worker, MessageChannel, workerData } = require('worker_threads');

    _NET.bytesWritten = Number.MAX_SAFE_INTEGER;
    _NET.bufferSize = Number.MAX_SAFE_INTEGER;

    let on_ready_shared = function (add_port_init, add_port_update) { };
    let on_busy_shared = function () { };

    //#endregion

    //#region [ TCP_INIT ]

    let TCP_INIT_BUF_CONNECT_COUNTER = 0;
    let TCP_INIT_BUF_RECEIVE_COUNTER = 0;
    let TCP_INIT_BUF_TOTAL = 0;

    const _TCP_INIT___on_buffering = function (buf) {
        TCP_INIT_BUF_RECEIVE_COUNTER++;

        $.STATE = 'CACHE_BUFFER';

        const text = buf.toString('utf8');
        const json = JSON.parse(text);
        const a = [];
        for (var cache_name in json) {
            a.push(cache_name);
            $.CACHE_DATA_RAW[cache_name] = json[cache_name];
        }

        ___log_key('CACHE_BUFFER_COMPLETE', 'Receive buffer: ' + a.join(', ') + ' Size = ' + buf.length + ' at ' + new Date().toLocaleString() + ' | ', TCP_INIT_BUF_RECEIVE_COUNTER, TCP_INIT_BUF_TOTAL);

        if (TCP_INIT_BUF_TOTAL == TCP_INIT_BUF_RECEIVE_COUNTER) _TCP_INIT___on_done();
    };

    const _TCP_INIT___on_done = function (buf) {
        TCP_INIT_BUF_TOTAL = 0;
        TCP_INIT_BUF_CONNECT_COUNTER = 0;
        TCP_INIT_BUF_RECEIVE_COUNTER = 0;

        $.STATE = 'CACHE_INDEX';

        $.f_cache___index_reset_all();

        $.IS_BUSY = false;
    };

    const _TCP_INIT = _NET.createServer((socket_) => {
        TCP_INIT_BUF_CONNECT_COUNTER++;

        $.IS_BUSY = true;
        $.STATE = 'CACHE_BUFFER';

        const chunks_ = [];
        let last_ = [];

        ___log_key('CACHE_BUFFER_START', 'Begin connect at ' + new Date().toLocaleString());

        socket_.on('error', function (error) {
            $.IS_BUSY = false;
        });
        socket_.on('data', chunk => {
            last_ = chunk;
            chunks_.push(chunk);
        });

        socket_.on('end', () => {
            let done = false;

            if (last_.length == 2)
                if (last_.toString() == 'OK')
                    done = true;

            if (done) {
                TCP_INIT_BUF_TOTAL = TCP_INIT_BUF_CONNECT_COUNTER - 1;
                ___log_key('CACHE_BUFFER_DONE', 'BUFFER RECEIVE OK: ', TCP_INIT_BUF_TOTAL);
                socket_.end();
            } else {
                const buf = Buffer.concat(chunks_);
                setTimeout(function (o) {
                    _TCP_INIT___on_buffering(o);
                }, 1, buf);
            }
        });
    });

    _TCP_INIT.on('error', (err) => {
        $.IS_BUSY = false;
    });

    //#endregion

    //#region [ TCP_UPDATE ]

    const _TCP_UPDATE = _NET.createServer((socket_) => {
        const chunks_ = [];

        socket_.on('data', chunk => chunks_.push(chunk));
        socket_.on('end', () => {
            const file = Buffer.concat(chunks_);
            // do what you want with it

            console.log('client disconnected');
        });

        //socket_.on('data', (data) => { 
        //    console.log(_NET.bufferSize, data.length);
        //    socket_.end();
        //});

        // c.write('hello\r\n');        

        socket_.pipe(socket_);
    });
    _TCP_UPDATE.on('error', (err) => {
        //throw err;
    });

    //#endregion

    //#region [ F_START, IS_BUSY, STATE, ON_READY  ... ]

    this.IS_BUSY = false;
    this.STATE = 'NONE';

    const on_ready = function (add_port_init, add_port_update) {
        $.on_ready_shared(add_port_init, add_port_update);
    };
    this.on_busy = function (state_) {
        this.IS_BUSY = true;
        this.STATE = state_;
        if ($.on_busy_shared) setTimeout(function () { $.on_busy_shared(); }, 1);
    };

    this.f_start = function () {
        _TCP_INIT.listen(PORT, '127.0.0.1', () => {
            $.ADDRESS_PORT_INIT = _TCP_INIT.address();
            console.log('TCP_CACHE_INIT: ', $.ADDRESS_PORT_INIT);

            _TCP_UPDATE.listen(0, '127.0.0.1', () => {
                $.ADDRESS_PORT_UPDATE = _TCP_UPDATE.address();
                console.log('TCP_CACHE_UPDATE: ', $.ADDRESS_PORT_UPDATE);

                redis___Init();
                on_ready($.ADDRESS_PORT_INIT, $.ADDRESS_PORT_UPDATE);
            });
        });
    };

    //#endregion

    //#region [ CACHE SETTING ]

    this.f_get___cache_setting = function () { return this.CACHE_SETTING; };
    this.f_set___cache_setting = (config_) => {
        //___log(config_);

        const _self = this;
        if (config_) {
            for (var key in config_) {
                switch (key) {
                    case 'log':
                    case 'valid':
                    case 'caption':
                    case 'plugin':
                    case 'script':
                    case 'connect_string':
                    case 'join_1_1':
                    case 'join_1_n':
                    case 'full_text_search':
                        _self.CACHE_SETTING[key] = config_[key];
                        break;
                }

                switch (key) {
                    case 'log':
                        $.LOG.f_setup_update();
                        break;
                    case 'valid':
                        break;
                    case 'caption':
                        break;
                    case 'plugin':
                        break;
                    case 'script':
                        break;
                    case 'connect_string':
                        break;
                    case 'join_1_1':
                        break;
                    case 'join_1_n':
                        break;
                    case 'full_text_search':
                        break;
                }
            }
        }
        return _self.CACHE_SETTING;
    };

    //#endregion

    //#region [ CACHE JOIN 1N ]

    this.f_get___cache_join_1n_all = function () {
        const j1n = $.CACHE_JOIN_1N;
        if (j1n) return j1n;
        return [];
    };

    this.f_get___cache_join_1n_by_cache_name = function (cache_name) {
        const j1n = $.CACHE_JOIN_1N;

        if (cache_name && j1n) {
            const api = cache_name.toUpperCase();
            if (j1n[api]) return j1n[api];
        }

        return [];
    };

    this.f_get___cache_join_1n_by_cache_name_id = function (cache_name, id) {
        const j1n = $.CACHE_JOIN_1N;

        if (cache_name && j1n) {
            const api = cache_name.toUpperCase();
            if (j1n[api] && j1n[api][id])
                return j1n[api][id];
        }

        return [];
    };

    this.f_get___cache_join_1n_keys = function () {
        const j1n = $.CACHE_JOIN_1N;
        if (j1n) return Object.keys(j1n);
        return [];
    };

    //#endregion

    //#region [ INDEX ]

    const ___convert_unicode_to_ascii = function (str) {
        if (str == null || str.length == 0) return '';
        str = str.trim();
        if (str.length == 0) return '';

        var AccentsMap = [
            "aàảãáạăằẳẵắặâầẩẫấậ",
            "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
            "dđ", "DĐ",
            "eèẻẽéẹêềểễếệ",
            "EÈẺẼÉẸÊỀỂỄẾỆ",
            "iìỉĩíị",
            "IÌỈĨÍỊ",
            "oòỏõóọôồổỗốộơờởỡớợ",
            "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
            "uùủũúụưừửữứự",
            "UÙỦŨÚỤƯỪỬỮỨỰ",
            "yỳỷỹýỵ",
            "YỲỶỸÝỴ"
        ];
        for (var i = 0; i < AccentsMap.length; i++) {
            var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
            var char = AccentsMap[i][0];
            str = str.replace(re, char);
        }

        str = str
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");

        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        str = str.replace(/ + /g, " ");

        str = str.toLowerCase();

        return str;
    };

    this.f_cache___index_reset_all = function () {
        ___log_key('INDEX', 'Start ... ' + new Date().toLocaleString());

        const setting = $.CACHE_SETTING;
        const master_name = setting.master_name;
        const full_text_search = setting.full_text_search;
        const join_1_n = setting.join_1_n;
        //const full_text_search = { USER: setting.full_text_search['USER'] };
        const raw = $.CACHE_DATA_RAW;
        const ext = $.CACHE_DATA_EXT;
        const inx = $.CACHE_INDEX;
        const j1n = $.CACHE_JOIN_1N;

        if (raw && ext) {
            let i = 0, r, cf, a = [], ex = [], x;

            const cache_names = _.filter(Object.keys(raw), function (o_) { return o_ != master_name; });
            if (master_name) cache_names.push(master_name);

            let has_j1n = false; j1n_cols = [], j1n_apis = [], j1n_colums = [];
            if (master_name && join_1_n && join_1_n[master_name]) {
                const cf_1_n = join_1_n[master_name];
                j1n_cols = Object.keys(join_1_n[master_name]);
                j1n_apis = j1n_cols.map(function (o_) { return cf_1_n[o_].name; });
                j1n_colums = j1n_cols.map(function (o_) { return cf_1_n[o_].column; });
                has_j1n = j1n_cols.length > 0;
                ___log_key('CACHE_JOIN_1N', 'COLUMN', j1n_cols);
                ___log_key('CACHE_JOIN_1N', 'APIS', j1n_apis);
                ___log_key('CACHE_JOIN_1N', 'FIELDS', j1n_colums);
            }

            cache_names.forEach((cache_name) => {
                const is_cacheMaster = master_name == cache_name && master_name != null;

                inx[cache_name] = {};
                cf = full_text_search[cache_name];
                const has_fullTextSearch = (cf != null && cf != undefined);
                a = raw[cache_name];
                ex = [];

                let index_j1n = j1n_apis.indexOf(cache_name);
                const cacheName_is_Index_J1n = index_j1n != -1;
                if (cacheName_is_Index_J1n) {
                    j1n[cache_name] = {};
                    ___log_key('CACHE_JOIN_1N', cache_name + ' INDEXS = ' + index_j1n);
                }

                if (a && a.length > 0) {
                    let join_1_1, join_1_n, col_11 = [], api_11 = [], alias_11 = [];
                    let has_join_11 = false;

                    if (is_cacheMaster) {
                        if (setting.join_1_1) join_1_1 = setting.join_1_1[master_name];
                        if (setting.join_1_n) join_1_n = setting.join_1_n[master_name];
                        if (join_1_1) {
                            col_11 = Object.keys(join_1_1);
                            api_11 = col_11.map(function (o_) { return join_1_1[o_].name; });
                            alias_11 = col_11.map(function (o_) { return join_1_1[o_].alias; });
                            has_join_11 = col_11.length > 0;
                        }
                    }

                    let c_ids = [], c_ascii = [], c_utf8 = [], c_org = [];
                    let ids, ascii, utf8, org;

                    if (has_fullTextSearch) {
                        if (cf.ids) c_ids = _.filter(cf.ids.split(','), function (o_) { return o_.length > 0; });
                        if (cf.ascii) c_ascii = _.filter(cf.ascii.split(','), function (o_) { return o_.length > 0; });
                        if (cf.utf8) c_utf8 = _.filter(cf.utf8.split(','), function (o_) { return o_.length > 0; });
                        if (cf.org) c_org = _.filter(cf.org.split(','), function (o_) { return o_.length > 0; });
                    }

                    for (i = 0; i < a.length; i++) {
                        r = a[i];
                        r.index___ = i;
                        r.___i = i;

                        x = { ___i: i, id: r.id };

                        if (has_fullTextSearch) {
                            ids = (_.map(c_ids, function (c_) { return r[c_]; })).join(' ').trim();
                            ascii = (_.map(c_ascii, function (c_) { return r[c_]; })).join(' ').trim();
                            utf8 = (_.map(c_utf8, function (c_) { return r[c_]; })).join(' ').trim();
                            org = (_.map(c_org, function (c_) { return r[c_]; })).join(' ').trim();
                        }

                        if (is_cacheMaster) {
                            if (has_join_11) {
                                col_11.map((c_, i_) => {
                                    if (r[c_]) x[alias_11[i_]] = inx[api_11[i_]][r[c_]];
                                });
                            }
                        }

                        if (has_fullTextSearch) {
                            if (ids && ids.length > 0) ids = ' ' + ids + ' ';
                            if (ascii && ascii.length > 0) ascii = ' ' + ___convert_unicode_to_ascii(ascii) + ' ';
                            if (utf8 && utf8.length > 0) utf8 = ' ' + utf8.toLowerCase().replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ").replace(/ + /g, " ") + ' ';
                            if (org && org.length > 0) org = ' ' + org + ' ';

                            x.ids = ids;
                            x.ascii = ascii;
                            x.utf8 = utf8;
                            x.org = org;
                        }

                        if (cacheName_is_Index_J1n) {
                            const id_1n = r[j1n_colums[index_j1n]];
                            if (id_1n) {
                                let ra1n = j1n[cache_name][id_1n];
                                if (ra1n == null) {
                                    j1n[cache_name][id_1n] = [];
                                    ra1n = j1n[cache_name][id_1n];
                                }
                                ra1n.push(Number(r.id));

                                //if (i == 0) {
                                //    ___log_key('CACHE_JOIN_1N', cache_name + ' for_id = ', id_1n);
                                //    ___log_key('CACHE_JOIN_1N', cache_name + ' r = ', r);
                                //    ___log_key('CACHE_JOIN_1N', cache_name + ' j1n[' + i + '] = ', ra1n);
                                //}
                            }
                        }

                        if (is_cacheMaster && has_j1n) {
                            j1n_cols.map((c_, i_) => {
                                const j1n_for_ids = j1n[j1n_apis[i_]][r.id];
                                const j1n_for_apis = inx[j1n_apis[i_]];
                                if (j1n_for_ids && j1n_for_apis) {
                                    //x[c_ + '_id'] = j1n_for_ids;
                                    x[c_] = j1n_for_ids.map((id_) => j1n_for_apis[id_]);
                                } else x[c_] = [];

                                // if (i < 3) ___log_key('CACHE_JOIN_1N_TO_MASTER', cache_name, c_, i_, j1n_for_ids, r.id);
                            });
                        }

                        ex.push(x);
                        inx[cache_name][r.id] = r;
                    } // end foreach items

                    ext[cache_name] = ex;
                }
            });
        }

        ___log_key('INDEX', 'Complete at ' + new Date().toLocaleString());
    };

    //#endregion

    //#region [ API TEST: SEACH DATA RAW, EXT ]

    this.f_search___test = function (type, cache_name) {
        let code = 'RAW';
        if (type) code = type.toUpperCase().trim();

        let a = [];
        switch (code) {
            case 'RAW':
                a = $.CACHE_DATA_RAW[cache_name];
                break;
            default:
                a = $.CACHE_DATA_EXT[cache_name];
                break;
        }
        if (a.length > 0)
            a = _.filter(a, function (o_, i_) { return i_ < 10; });

        return a;
    };

    this.f_search___test_id = function (type, cache_name, id) {
        let code = 'RAW';
        if (type) code = type.toUpperCase().trim();

        let a = [];
        switch (code) {
            case 'RAW':
                a = $.CACHE_DATA_RAW[cache_name];
                break;
            default:
                a = $.CACHE_DATA_EXT[cache_name];
                break;
        }

        let id_ = -1;
        if (id != null) id_ = Number(id);
        if (id_ > 0 && a.length > 0)
            a = _.filter(a, function (o_) { return o_.id == Number(id); });

        return a.length > 0 ? a[0] : {};
    };

    //#endregion

    //#region [ API ]

    const API_CALLBACK = {};

    this.api___callback_by_id = (id, data, is_remove) => {
        //___log('API___CALLBACK_BY_ID', id, data);

        if (API_CALLBACK[id]) API_CALLBACK[id](data);
        if (is_remove == true) delete API_CALLBACK[id];
    };

    this.api___execute = async (request, callback) => {
        if (request == null) request = {};
        request.___api_alias = false;
        const id = request.___api_id;

        //___log_key('API___EXECUTE', url, id);

        if (request.___api && id) {
            const a = request.___api.split('/');
            if (a.length == 4) {

                const cache_name = a[2].toUpperCase();
                const db_type = a[0];
                const func_name = a[3];
                let f = '';
                const url = 'api/' + db_type + '/' + cache_name + '/' + func_name + '.js';
                let url_alias = '';

                try {
                    let exist = _FS.existsSync(url);
                    if (exist == false) {
                        url_alias = 'api/' + db_type + '/_/' + func_name + '.js';
                        exist = _FS.existsSync(url_alias);
                        if (exist) {
                            request.___api_alias = true;
                            f = _FS.readFileSync(url_alias).toString('utf8').trim();
                        }
                    } else {
                        f = _FS.readFileSync(url).toString('utf8').trim();
                    }

                    if (exist) {
                        const para_var = '_' + id.split('-').join('_');
                        const para = 'const ' + para_var + ' = ' + JSON.stringify(request) + '; \r\n\r\n';

                        f = f + '("' + db_type + '","' + cache_name + '","' + func_name + '",' + para_var + ')';
                        f = para + f;
                    } else {
                        const m = {
                            ok: false,
                            header: { request: request },
                            error: { message: 'File [ ' + url + '.js | ' + url_alias + ' ] không tồn tại' }
                        };
                        callback(m);
                        return;
                    }
                } catch (e1) {
                    const m = {
                        ok: false,
                        header: { request: request },
                        error: { message: 'File [ ' + url + '.js | ' + url_alias + ' ] không đọc được' }
                    };
                    callback(m);
                    return;
                }

                //console.log(f);

                API_CALLBACK[id] = callback;
                try {
                    eval(f);
                } catch (e1) {
                    const m = {
                        ok: false,
                        header: { request: request },
                        error: { message: 'Lỗi khi thực hiện, Kiểm tra cú pháp các dòng lệnh trong file ' + url + '.js', err: e1 }
                    };
                    $.api___callback_by_id(id, m, true);
                }
            } else {
                const m = {
                    ok: false,
                    header: { request: request },
                    error: { message: 'Api [ ' + url + ' ] không đúng cấu trúc api/{db_type}/{cache_name}/{func_name}' }
                };
                callback(m);
            }
        }
    };

    this.api___get_raw_by_index = (cache_name, ___i) => {
        if ($.CACHE_DATA_RAW) {
            const data = $.CACHE_DATA_RAW[cache_name];
            if (data && data.length > ___i) return data[___i];
        }
        return null;
    };
    this.api___get_raw_by_arr_indexs = (cache_name, arr_indexs) => {
        if (arr_indexs == null || Array.isArray(arr_indexs) == false || arr_indexs.length == 0)
            return [];

        if ($.CACHE_DATA_RAW) {
            const data = $.CACHE_DATA_RAW[cache_name];
            if (data)
                return _.map(arr_indexs, function (i_) { return data[i_]; });
        }

        return [];
    };

    const ___get_all_raw = (cache_name, f_callback) => {
        try {
            if ($.CACHE_DATA_RAW) {
                const data = $.CACHE_DATA_RAW[cache_name];
                if (data) {
                    f_callback(null, { ok: true, data: data, indexs: [], count: data.length, total: data.length });
                } else
                    f_callback({ message: 'Không tìm thấy dữ liệu cache của ' + cache_name });
            } else
                f_callback({ message: 'CACHE_DATA_RAW không tồn tại' });
        } catch (e) {
            f_callback({ message: 'Lỗi khi thực hiện tìm kiếm dối tượng RAW[ ' + cache_name + ' ]', err: e });
        }
    };
    this.api___get_all_raw = (cache_name, f_callback) => ___get_all_raw(cache_name, f_callback);
    this.api___get_all_raw_ext_async = (cache_name) => {
        return new Promise((resolve, reject) => {
            ___get_all_raw(cache_name, (err, body) => {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    };
    this.api___get_all_raw_async = (cache_name) => {
        return new Promise((resolve, reject) => {
            ___get_all_raw(cache_name, (err, body) => {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    };

    const ___search_raw = (cache_name, config, f_condition, f_callback) => {
        try {
            if ($.CACHE_DATA_RAW) {
                const data = $.CACHE_DATA_RAW[cache_name];
                if (data) {

                    let rs = [];
                    const a = [];
                    let i = 0;

                    if (f_condition && typeof f_condition == 'function') {
                        for (i = 0; i < data.length; i++)
                            if (f_condition(data[i]) == true)
                                a.push(data[i].___i);
                    } else {
                        for (i = 0; i < data.length; i++)
                            a.push(data[i].___i);
                    }

                    if (config && config.limit > 0 && a.length > 0) {
                        const max = a.length < config.limit ? a.length - 1 : config.limit;
                        for (i = 0; i < max; i++) rs.push(a[i]);
                    } else rs = a;

                    f_callback(null, { ok: true, data: null, indexs: rs, count: a.length, total: data.length });

                } else
                    f_callback({ message: 'Không tìm thấy dữ liệu cache của ' + cache_name });
            } else
                f_callback({ message: 'CACHE_DATA_RAW không tồn tại' });
        } catch (e) {
            f_callback({ message: 'Lỗi khi thực hiện tìm kiếm dối tượng RAW[ ' + cache_name + ' ]', err: e });
        }
    };
    this.api___search_raw = (cache_name, config, f_condition, f_callback) => ___search_raw(cache_name, config, f_condition, f_callback);
    this.api___search_raw_async = (cache_name, config, f_condition) => {
        return new Promise((resolve, reject) => {
            ___search_raw(cache_name, config, f_condition, (err, body) => {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    };

    this.api___search_ext = (cache_name, f_condition, f_callback) => {
        if ($.CACHE_DATA_EXT) {
            const data = $.CACHE_DATA_EXT[cache_name];
            if (data) {
                const a = _.filter(data, f_condition);
                f_callback(null, { data: a, total: data.length });
            } else
                f_callback({ message: 'Không tìm thấy dữ liệu cache của ' + cache_name });
        } else
            f_callback({ message: 'CACHE_DATA_EXT không tồn tại' });
    };

    //#endregion

    //#region [ THREAD REDIS ]

    const execute = (command, request, callback) => redis___sendMessage(command, request, callback);

    let _REDIS_WORKER;
    let _REDIS_CONNECTED = false;
    let _REDIS_SETTING = false;
    let _REDIS_READY = _REDIS_CONNECTED && _REDIS_SETTING;

    const redis___update_state = () => { _REDIS_READY = _REDIS_CONNECTED && _REDIS_SETTING; return _REDIS_READY; };

    const redis___sendMessage = (command, request, callback) => {
        if (_REDIS_READY) {
            const m = redis___message_build(command, request, callback);
            _REDIS_WORKER.postMessage(m);
        } else {
            callback({ ok: false, err: { message: 'Redis do not ready' }, cmd: command, message: { request: request } });
        }
    };

    const redis___message_build = (command, request, callback) => {
        let id;
        if (request && request.___api_id)
            id = request.___api_id;
        else
            id = _UUID.v4();
        const has_callback = callback != null && typeof callback == 'function';

        const m = { id: id, callback: has_callback, cmd: command, request: request };
        return m;
    };

    const _REDIS_CHANNEL = new MessageChannel();
    const redis___Init = () => {
        _REDIS_WORKER = new Worker('./thread-redis.js', { workerData: {} });
        _REDIS_WORKER.on('message', (m_) => { redis___on_message(m_); });
        _REDIS_WORKER.postMessage({ cache_port: _REDIS_CHANNEL.port1 }, [_REDIS_CHANNEL.port1]);
        _REDIS_CHANNEL.port2.on('message', (m_) => { redis___channel_on_message(m_); });
    };

    const redis___on_change_state = (isOnline) => {
        _REDIS_CONNECTED = isOnline;
        if (_REDIS_CONNECTED == true && _REDIS_SETTING == false) {
            redis___set_config((m_) => {
                ___log('CACHE_REDIS_SETTING', m_);
            });
        }
        redis___update_state();
    };

    const redis___set_config = (callback) => {
        const m = redis___message_build('SET_CONFIG', $.CACHE_SETTING, callback);
        _REDIS_WORKER.postMessage(m);
    };

    const redis___on_message = (m_) => {
        if (m_) {
            switch (m_.cmd) {
                case 'LOG':
                    if (m_.data && $ && $.LOG)
                        $.LOG.f_write_message(m_.data);
                    break;
            }
        }
    };

    const redis___channel_on_message = (res) => {
        console.log('REDIS->CACHE:', res);

        if (res) {
            if (typeof res == 'string') {
                switch (res) {
                    case 'REDIS_STATE_ON':
                        redis___on_change_state(true);
                        break;
                    case 'REDIS_STATE_OFF':
                        redis___on_change_state(false);
                        break;
                }
            } else {
                if (res.message) {
                    const m = res.message;
                    if (m.id && m.callback) $.api___callback_by_id(m.id, res, true);
                }
            }
        }
    };

    //#endregion
};

cacheSingleton.instance = null;
cacheSingleton.getInstance = function () {
    if (this.instance === null) this.instance = new cacheSingleton();
    return this.instance;
};
module.exports = cacheSingleton.getInstance();