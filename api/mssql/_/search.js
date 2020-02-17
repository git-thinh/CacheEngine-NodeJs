(async function (db_type, cache_name, func_name, request) {
    if ($.LOG) $.LOG.f_console_clear();
    const scope = 'API___' + cache_name + '___' + func_name.toUpperCase();
    const api_id = request.___api_id;
    if (api_id == null) return;
    //$.log(scope, api_id, request);
    //--------------------------------------------------------------------------------------------------------------- 
    let m = null;
    let result, result_items;
    let error_message = '';
    const conditons = request.conditons;
    const page_number = request.page_number;
    const page_size = request.page_size;

    //if (conditons != null) {

    //$.log('SEARCH[0]', cache_name);

    //if (cache_name == 'REGION')
    //    $.log('SEARCH[1]', scope, api_id, request);

    const para_var = '_' + api_id.split('-').join('_');
    $.api___search_raw_async(cache_name, { limit: page_size },
        eval('(function () { const ' + para_var + ' = ' + conditons + '; return ' + para_var + '; })()')
        ////function (o_) { return true; }
    ).then(body => {
        $.log('SEARCH[2]', body);
        if (body.indexs == null || body.indexs == 0) {
            result_items = [];
        } else {
            result_items = $.api___get_raw_by_arr_indexs(cache_name, body.indexs);
        }
        m = {
            ok: true,
            v1: true,
            header: { request: request },
            body: {
                ok: true,
                request: request,
                count_result: result_items.count,
                page_total: result_items.total,
                result_items: result_items
            }
        };
        //$.log('SEARCH[2.OK]', m);
        $.api___callback_by_id(api_id, m, true);
    }).catch(err => {
        //$.log('SEARCH[2.ERR]', err);
        m = { ok: false, header: { request: request }, error: err };
        $.api___callback_by_id(api_id, m, true);
    });
})