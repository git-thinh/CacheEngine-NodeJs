(async function (db_type, cache_name, func_name, request) {
    if ($.LOG) $.LOG.f_console_clear();
    const scope = 'API___' + cache_name + '___' + func_name.toUpperCase();
    const api_id = request.___api_id;
    if (api_id == null) return;
    $.log(scope, api_id, request);
    //--------------------------------------------------------------------------------------------------------------- 
    let m = null;

    m = { ok: false, error: { message: 'Tài khoản phải nhiều hơn 5 ký tự' }, header: { request: request } };

    $.api___callback_by_id(api_id, m, true);
})