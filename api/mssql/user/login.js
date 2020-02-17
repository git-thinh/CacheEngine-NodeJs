(async function (db_type, cache_name, func_name, request) {
    if ($.LOG) $.LOG.f_console_clear();
    const scope = 'API___' + cache_name + '___' + func_name.toUpperCase();
    const api_id = request.___api_id;
    if (api_id == null) return;
    //$.log(scope, api_id);
    //---------------------------------------------------------------------------------------------------------------
    const str_user_name = request.str_user_name;
    const str_pass_word = request.str_pass_word;
    let m = null;
     
    if (str_user_name === null || str_user_name.length < 5)
        m = { ok: false, error: { message: 'Tài khoản phải nhiều hơn 5 ký tự' }, header: { request: request } };
    if (m) {
        $.api___callback_by_id(api_id, m, true);
        return;
    }

    if (str_pass_word === null || str_pass_word.length < 5)
        m = { ok: false, error: { message: 'Mật khẩu phải nhiều hơn 5 ký tự' }, header: { request: request } };
    if (m) {
        $.api___callback_by_id(api_id, m, true);
        return;
    }

    const _SYS_SCOPE = {
        'test': [{ str_code: 'test', str_title: 'Test' }],
        'vtp': [{ str_code: 'vtp-pawn', str_title: 'DS hợp đồng VTP' }, { str_code: 'vtp-pawn-invited', str_title: 'DS đơn giới thiệu VTP' }],
        'pol': [{ str_code: 'pawn-online', str_title: 'Quản lý đơn online' }],
        'afsg': [{ str_code: 'affiliate-finance-sg', str_title: 'DS đơn giới thiệu của tài chính Sài Gòn' }],
        'ketoan': [{ str_code: 'affiliate-accountant', str_title: 'DS đơn đối soát kế toán' }]
    };


    ////m = { ok: false, error: { message: 'Tài khoản phải nhiều hơn 5 ký tự' }, header: { request: request } };
    //const _DB_CACHE_123 = {
    //    user: 'sa',
    //    password: 'dev@123',
    //    server: '192.168.10.54',
    //    database: 'POL_20191230',
    //    connectionTimeout: 300000,
    //    requestTimeout: 300000,
    //    pool: {
    //        idleTimeoutMillis: 300000,
    //        max: 100
    //    }
    //};

    //const _SQL = require('mssql');

    //const _TCP_POOL_123 = new _SQL.ConnectionPool(_DB_CACHE_123);
    //const _TCP_POOL_123_CONNECT = _TCP_POOL_123.connect();

    //(async function () { try { await _TCP_POOL_123_CONNECT; } catch (err) { ; } })();
    //request = new Request(
    //    'INSERT INTO TestSchema.Employees (Name, Location) OUTPUT INSERTED.Id VALUES (@Name, @Location);',
    //    function (err, rowCount, rows) {
    //        if (err) {
    //            callback(err);
    //        } else {
    //            console.log(rowCount + ' row(s) inserted');
    //            callback(null, 'Nikita', 'United States');
    //        }
    //    });
    //request.addParameter('Name', TYPES.NVarChar, name);
    //request.addParameter('Location', TYPES.NVarChar, location);

    //// Execute SQL statement
    //connection.execSql(request);

    //$.log(api_id, request);
    //$.api___callback_by_id(api_id, { ok: false, error: { message: '???????????????' }, body: { data: [] }, header: { request: request } }, true);

    $.api___search_raw_async(cache_name, { limit: 1 },
        function (o_) {
            return o_.str_user_name == str_user_name && o_.str_pass_word == str_pass_word;
        }).then(async (body1) => {
        if (body1 != null && Array.isArray(body1.indexs) && body1.indexs.length > 0) {
            const index_ = body1.indexs[0];
            //$.log('LOGIN[2]', index_);
            let user_ = $.api___get_raw_by_index('USER', index_);
            //$.log('LOGIN[3]', user_);
            if (user_ == null) {
                m = { ok: false, error: { message: 'Không tìm thấy tài khoản index = ' + _index }, header: { request: request } };
            } else {
                user_.ok = true;
                user_.int_pol_status = 1; // 0: offline; 1: online

                //$.log('LOGIN[4]', user_);

                let user = JSON.parse(JSON.stringify(user_));
                user.user_id = user.id;
                user.ref_id = user.id;
                user.scope_ids = 'pol';
                delete user['str_password'];

                let cf = {};
                const ucfs = await $.api___get_all_raw_async('POS_SYS_CONFIG');
                //$.log('LOGIN[6]', ucfs);
                if (ucfs) {
                    if (ucfs.ok == true && ucfs.data && ucfs.data.length > 0) {
                        for (var i = 0; i < ucfs.data.length; i++) {
                            let o = ucfs.data[i];
                            cf[o.str_code] = o.str_value;
                        }
                    }
                }
                user.pos_sys_config = cf;
                 
                const token = user.user_id + '12345xxxxxx4xxxxyxxxxxxxxxxxxxxxxxxxxxxxxxxx4xxxxyxxxxxxxxxxxxxxxxxxxxxxxxxxx4xxxxyxxxxxxxxxxxxxxxxxxxxxxxxxxx4xxxxyxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                user.str_token = token;
                 

                let scopes = [];
                if (user.scope_ids) {
                    if (user.scope_ids == '*') {
                        for (const field in _SYS_SCOPE)
                            _SYS_SCOPE[field].forEach(sc => scopes.push(sc));
                    } else {
                        user.scope_ids.split(',').forEach(field => {
                            if (_SYS_SCOPE[field] && _SYS_SCOPE[field].length > 0)
                                _SYS_SCOPE[field].forEach(sc => scopes.push(sc));
                        });
                    }
                }
                user.scope_urls = scopes;
                //user.redirect_url = scopes.length == 0 ? '/' : (scopes[0].str_code + '?token=' + user.str_token);
                user.redirect_url = scopes.length == 0 ? '/' : scopes[0].str_code;


                $.log('LOGIN[6]', request, user);
                //body1.data = user;
                //m = { ok: true, user_id: user.user_id, body: body1, header: { request: request } };
                m = { ok: true, v1: true, user_id: user.user_id, body: user, header: { request: request } };
            }
        } else {
            m = { ok: false, error: { message: 'Vui lòng nhập chính xác thông tin tài khoản' }, header: { request: request } };
        }
        $.api___callback_by_id(api_id, m, true);
    }).catch((err1) => {
        m = { ok: false, error: err1, header: { request: request } };
        $.api___callback_by_id(api_id, m, true);
    });

})