const _220fc579_904e_426e_b04a_380b26ebb331 = { "str_user_name": "chintn", "str_pass_word": "12345", "___api": "api/mssql/user/login", "___api_id": "220fc579-904e-426e-b04a-380b26ebb331" };

(function (db_type, cache_name, func_name, request) {
    const scope = 'API_' + cache_name + '_' + func_name.toUpperCase();
    const api_id = request.___api_id;
    if (api_id == null) return;
    ___log(scope, api_id);
    console.log = (...agrs) => ___log_key(scope, ...agrs);
    const ___callback = (m) => $.api___callback_by_id(api_id, m, true);
    const ___search_raw = (cache_name, condition, callback) => $.api___search_raw(cache_name, condition, callback);
    const ___search_ext = (cache_name, condition, callback) => $.api___search_ext(cache_name, condition, callback);
    //---------------------------------------------------------------------------------------------------------------
    const str_user_name = request.str_user_name;
    const str_pass_word = request.str_pass_word;
    let m = null;

    if (str_user_name === null || str_user_name.length < 5)
        m = { ok: false, error: { message: 'T├ái khoß║ún phß║úi nhiß╗üu h╞ín 5 k├╜ tß╗▒' }, header: { request: request } };
    if (m) {
        ___callback(m);
        return;
    }

    if (str_pass_word === null || str_pass_word.length < 5)
        m = { ok: false, error: { message: 'Mß║¡t khß║⌐u phß║úi nhiß╗üu h╞ín 5 k├╜ tß╗▒' }, header: { request: request } };
    if (m) {
        ___callback(m);
        return;
    }

    ___search_raw(cache_name, function (o) { return true; }, (err1, body1) => {
        if (err) {
            m = { ok: false, error: err1, header: { request: request } };
        } else {
            if (body1 && body1.data && body1.data.length > 0) {
                ___log_key(scope + '_LOGIN_OK', body1);

                const user_ = body1.data[0];
                user_.ok = true;
                user_.int_pol_status = 1; // 0: offline; 1: online

                let user = JSON.parse(JSON.stringify(user_));
                delete user['str_password'];

                let cf = {};
                ___search_raw('POS_SYS_CONFIG', function (o) { return true; }, (err2, body2) => {
                    if (err2) {
                    } else {
                        if (body2 && body2.data) {
                            const acf = body2.data;
                            for (var i = 0; i < acf.length; i++) {
                                let o = acf[i];
                                cf[o.str_code] = o.str_value;
                            }
                        }
                    }
                });
                //console.log('LOGIN = ', acf, cf);
                user.pos_sys_config = cf;

                body.data = user;
                m = { ok: true, body: body, header: { request: request } };
            } else {
                m = { ok: false, error: { message: 'Vui l├▓ng nhß║¡p ch├¡nh x├íc th├┤ng tin t├ái khoß║ún' }, header: { request: request } };
            }
        }
        ___callback(m);
    });
})("mssql", "USER", "login", _220fc579_904e_426e_b04a_380b26ebb331)