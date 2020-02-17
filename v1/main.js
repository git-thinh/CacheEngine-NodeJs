const ___PORT_API = 3500;
const ___PORT_TCP_SERVER = 3456;
let _thread_page_size = 1000;
const _sql_select_top = ''; //top 50000   

const ___log = (...agrs) => console.log(...agrs);

//#region [ DEV-LOCAL ]

//const _DB_CACHE_123 = {
//    user: 'sa',
//    password: '',
//    server: '192.168.10.54',
//    database: 'POL_20191230',
//    connectionTimeout: 30000000,
//    requestTimeout: 30000000,
//    pool: {
//        idleTimeoutMillis: 30000000,
//        max: 100
//    }
//};

//const _DB_CACHE_POS_AMAZON = {
//    user: 'mobile',
//    password: '',
//    server: '192.168.10.37',
//    database: 'Release_FB51_App',
//    connectionTimeout: 30000000,
//    requestTimeout: 30000000,
//    pool: {
//        idleTimeoutMillis: 30000000,
//        max: 100
//    }
//};

const _DB_CACHE_123 = {
    user: 'mobile',
    password: '',
    server: '171.244.51.123',
    database: 'POL_20191230',
    connectionTimeout: 30000000,
    requestTimeout: 30000000,
    pool: {
        idleTimeoutMillis: 30000000,
        max: 100
    }
};

const _DB_CACHE_POS_AMAZON = {
    user: 'mobile',
    password: '',
    server: '171.244.51.123',
    database: 'Release_FB51_App_230919',
    connectionTimeout: 30000000,
    requestTimeout: 30000000,
    pool: {
        idleTimeoutMillis: 30000000,
        max: 100
    }
};

//#endregion

const _USER_ID_ADMIN_CALL = 617;

const ___response_write = function (req, res, data) {
    if (req == null || res == null) {
        console.log('ERROR: ___response_write(req, res ... is NULL');
        return;
    }

    if (data == null || data == undefined) data = {};

    let file, a = [], header = {}, col;
    if (req.query) file = req.query.___file;

    switch (file) {
        case 'csv':
            if (Array.isArray(data) == false) {
                for (col in data) header[col] = col;
                a.push(header);
                a.push(data);
            }
            else {
                for (col in data) header[col] = col;
                data.splice(0, 0, header);
                a = data;
            }
            res.csv(a);
            break;
        default:
            if (typeof data == 'string')
                res.send(data);
            else
                res.json(data);
            break;
    }
};

const affilate___fetch_callback = function (type_pol_pos_id, id, IsF88Cus, cancelReason, cancelContent) {
    // khi huy don set value cho cancelReason, cancelContent
    // khi hoan tat hop dong thi moi co IsF88Cus

    if (IsF88Cus == null || isNaN(Number(IsF88Cus))) IsF88Cus = 0;
    if (cancelReason == null) cancelReason = '';
    if (cancelContent == null) cancelContent = '';

    let p;
    if (type_pol_pos_id == 'pos')
        p = _.find(___cache['POL_PAWN'], function (o) { return o.int_pawn_id_pos == id; });
    else
        p = _.find(___cache['POL_PAWN'], function (o) { return o.id == id; });

    if (p) {
        const obj = {
            pawnOnlineId: p.id,
            action: p.int_status,
            //referenceTypeStr: p.int_reference_type,
            referenceTypeStr: -1,
            transactionID: p.str_reference_affilate_id,
            isShop: 1,
            cancelReason: cancelReason,
            cancelContent: cancelContent,
            IsF88Cus: IsF88Cus
        };
        const url = 'https://apilienket.f88.vn/SendAffiliate';
        //const url = 'http://192.168.10.20:1809/SendAffiliate';
        _FETCH(url, { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) })
            .then(res => res.json())
            .then(m => {
                //console.log('?????????' + url, obj, m);
            }).catch(err => {
                //console.log(url, err.message);
            });
    }
};

const ___exe_callback = {
    pol_process_biz_addnew: function (objInput, objResult) {
        if (objResult && objResult.ok == true) {
            if (objInput && objInput.int_pol_pawn_id) {
                affilate___fetch_callback('pol', objInput.int_pol_pawn_id, null, objInput.str_canceled_reason, objInput.str_content);
            }
        }
    },
    pol_process_biz_chiadon: function (objInput, objResult) {
        if (objResult && objResult.ok == true) {
            if (objInput && objInput.obj_item_check) {
                var ids = objInput.obj_item_check.split(',');
                Array.from(ids).forEach(id_ => affilate___fetch_callback('pol', id_));
            }
        }
    }
};

//#region [ VARIABLE ]

let ___CACHE_DONE = false;
const ___page_size = 30;

//----------------------------------------------------------------------------

const { Worker, MessageChannel, workerData } = require('worker_threads');

const _NET = require('net');
const _PATH = require('path');
const _FS = require('fs');
const _SQL = require('mssql');
const _ = require('lodash');
const _URL = require('url');

const _JOB = require('cron').CronJob;

const _FETCH = require('node-fetch');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

//----------------------------------------------------------------------------

let IP___LOCAL = '';
const _OS = require('os');
const _IFACES = _OS.networkInterfaces();

Object.keys(_IFACES).forEach(function (ifname) {
    _IFACES[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }
        //console.log(iface.address);
        if (iface.address && iface.address.indexOf('192.168.') != -1) IP___LOCAL = iface.address;
    });
});

console.log('-> ', IP___LOCAL, ___PORT_API, ___PORT_TCP_SERVER);
console.log('\n' + new Date().toLocaleString() + '\n');

//#endregion

//#region [ db___execute_callback ]

const _TCP_POOL_123 = new _SQL.ConnectionPool(_DB_CACHE_123);
const _TCP_POOL_123_CONNECT = _TCP_POOL_123.connect();
(async function () { try { await _TCP_POOL_123_CONNECT; } catch (err) { ; } })();
const db___execute_callback = function (socket_response, request_, store, data, callback_ok, callback_err) {

    let cmd = _TCP_POOL_123.request();
    cmd.input('IP___', _SQL.VarChar(36), IP___LOCAL);
    cmd.input('USER_ID___', _SQL.Int, 0);
    cmd.input('TOKEN___', _SQL.VarChar(_SQL.MAX), '');

    let v, t, errs = [], v_encode;
    for (let key in data) {
        if (key != '___exe_callback') {
            v = data[key];
            if (v == undefined) {
                //console.log('!!!!!!!!!!!!', key, v);
                errs.push('[' + key + '] must be not NULL');
            } else {
                t = typeof v == 'string';
                cmd.input(key, t ? _SQL.NVarChar(_SQL.MAX) : _SQL.BigInt, data[key]);
            }
        }
        //console.log(key, v, t);
    }

    cmd.output('___ok', _SQL.Bit, 0);
    cmd.output('___msg', _SQL.NVarChar(255), '');
    cmd.output('___callback', _SQL.NVarChar(255), '');
    cmd.output('___data', _SQL.NVarChar(_SQL.MAX), '{}');

    if (errs.length > 0) {
        const val = errs.join('|');
        if (callback_err) callback_err(socket_response, val);
    } else {
        cmd.execute(store, (err_, result) => {
            if (err_) {
                if (callback_err) callback_err(socket_response, { ok: false, message: err_.message });
            } else {
                let m_ = { ok: false, message: '', callback: '', data: null };

                if (result.output) {
                    m_.ok = result.output.___ok;
                    m_.message = result.output.___msg;
                    m_.callback = result.output.___callback;
                    try {
                        if (result.output.___data
                            && result.output.___data.length > 0) {
                            if (result.output.___data[0] == '[' || result.output.___data[0] == '{') {
                                m_.data = JSON.parse(result.output.___data);
                            } else {
                                m_.data = result.output.___data;
                            }
                        }
                    } catch (err_) { ; }
                }

                if (callback_ok) callback_ok(socket_response, m_);
            }
        });
    }
};

//#endregion

//#region [ BASE ]

const ___guid = function () {
    return 'id-xxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const ___base64Random = function () {
    return '12345xxxxxx4xxxxyxxxxxxxxxxxxxxxxxxxxxxxxxxx4xxxxyxxxxxxxxxxxxxxxxxxxxxxxxxxx4xxxxyxxxxxxxxxxxxxxxxxxxxxxxxxxx4xxxxyxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

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

const ___convert_datetime_yyyyMMdd = function (date) {
    var d = new Date();
    if (date && typeof date == 'string') d = new Date(date);

    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(), year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return parseInt([year, month, day].join(''));
};

const ___convert_datetime_HHmmss = function (date) {
    var d = new Date();
    if (date && typeof date == 'string') d = new Date(date);

    var hour = '' + d.getHours(),
        minus = '' + d.getMinutes(),
        seconds = d.getSeconds();

    if (hour.length < 2) hour = '0' + hour;
    if (minus.length < 2) minus = '0' + minus;
    if (seconds.length < 2) seconds = '0' + seconds;

    return parseInt([hour, minus, seconds].join(''));
};

const ___convert_number = function (text, val_default) {
    if (text) {
        const v = Number(text);
        if (isNaN(v) == false) return v;
    }
    if (val_default == null) val_default = -1;
    return val_default;
};

const ___format_text_before_update_database = function (text) {
    if (text == null || text == undefined) text = '';
    if (typeof text != 'string') text = JSON.stringify(text);
    return text;
};

//#endregion

//#region [ SYNC_DATA: USER LOGIN, DATA CHANGED(INSERT,UPDATE,REMOVE) ... ]

const ___sync_user_login_success = function (user_) {

};

//#endregion

//#region [ JOBS ]

let ___jobs_result = {
    API_TEST: {
        REPORT_NAME: {
            'ALL': {},
            'KEY-1': {
                'ID-1': { data: new Date() }
            }
        }
    },
    POL_PAWN: {
        REPORT_STATUS_YEAR_REMAIN: {},
        REPORT_STATUS_YEAR_CURRENT: {},
        EMPLOYEE_MANNAGER: {},
        EXCEL_STATUS_YEAR_REMAIN: {},
        EXCEL_STATUS_YEAR_CURRENT: {},
        EXE_CHIA_DON_TU_DONG: {
            'ALL': {},
            '1': {}
        }
    }
};

let ___job_reduce_init = function () {
    console.log('JOB > INIT ...');

    for (var api_name in ___jobs_function) {
        for (var f in ___jobs_function[api_name]) {
            if (typeof ___jobs_function[api_name][f] == 'function') {
                setTimeout(___jobs_function[api_name][f], 1);
            }
        }
    }
};

let ___job_reduce = function (api_name) {
    if (___jobs_function[api_name]) {
        for (var f in ___jobs_function[api_name]) {
            if (typeof ___jobs_function[api_name][f] == 'function') {
                setTimeout(___jobs_function[api_name][f], 1);
            }
        }
    }
};


const ___jobs_function = {
    POL_PAWN: {
        EMPLOYEE_MANNAGER: function () {
            var ___cacheuser = ___cache['USER'];

            //var group____id = ___cacheuser.filter(d => d.group_id == 44);
            //console.log('sdssdasdasdasda===', group____id);
            var a = _.map(___cacheuser, function (o) {
                return {
                    id: o.id,
                    group_id: o.group_id,
                    int_pol_region: o.int_pol_region,
                    str_name: '',
                    int_don: '',
                    int_pol_status: o.int_pol_status,
                    str_full_name: o.str_full_name_
                };
            });

            a = _.filter(a, function (o) { return o.group_id == 44 });
            //console.log('===ddddddddddddddd a ====', a);

            const lsg = _.groupBy(a, function (o) { return o.id; });

            const grs = _.map(lsg, function (vals_, name) { return vals_[0]; });

            if (grs) {
                var val = {};

                val.result_items = ___cache['POL_PAWN'];

                //var _____year = [2015, 2016, 2017, 2018];
                var _mag = [];
                for (var i = 0; i < grs.length; i++) {
                    var group____id = [];
                    group____id = val.result_items.filter(d => d.group_id == 44);
                    // console.log('===group____id group____id ====', group____id.length);
                    var group____id1 = [];
                    group____id1 = group____id.filter(d => d.int_status == 1 || d.int_status == 2);
                    //console.log('===group____id1 group____id1 ====', group____id1.length);
                    //var group____id2 = [];
                    //group____id2 = group____id1.filter(d => d.int_status == 2);

                    var group____id3 = [];
                    group____id3 = group____id1.filter(d => d.caller_online_id == grs[i].id);

                    int_don: '';
                    var item = {

                        int_don: ''
                    };
                    item.int_don = group____id3.length;
                    // console.log('===lsglsglsglsglsglsglsglsg lsga ====', item.int_don);
                    _mag.push(item);


                    //___report_status_year_('POL_PAWN', 'EMPLOYEE_MANNAGER', grs[i].id, '2019', _mag);

                }
                ___report_status_year_('POL_PAWN', 'EMPLOYEE_MANNAGER', 'all', 'all', _mag);

            }
            // console.log('done',_mag);

        },

        REPORT_STATUS_YEAR_REMAIN: function () {
            var ___cacheshop = ___cache['GROUP'];
            if (___cacheshop) {
                var val = {};

                val.result_items = ___cache['POL_PAWN'];

                var _____year = [2015, 2016, 2017, 2018];
                for (var i = 0; i < ___cacheshop.length; i++) {
                    var group____id = [];
                    group____id = val.result_items.filter(d => d.group_id == ___cacheshop[i].id);

                    for (var year = 0; year < _____year.length; year++) {
                        var data__year = [];
                        data__year = group____id.filter(d => d.int_created_date.toString().substr(0, 4) === _____year[year].toString());
                        //console.log('yearrrrr===', _____year[year]);
                        var data__year_created_pos = [];
                        data__year_created_pos = group____id.filter(d => d.int_create_date_pos.toString().substr(0, 4) === _____year[year].toString());
                        var data__year_month = [];
                        var data__year_month_created_pos = [];
                        var _mag = [];
                        for (var j = 1; j <= 12; j++) {

                            //var totalDaChuyenThanhHopDong = '';
                            var totalcxl = '';
                            var totalDaDangKy = '';
                            var totalDaXuLy = '';
                            var totaldcthd = '';

                            var item = {
                                totalDaDangKy: '',
                                totalDaXuLy: '',
                                totalDaChuyenThanhHopDong: '',
                                totalChoXuLy: ''
                            };

                            if (j < 10) {
                                var m = '0' + j;

                            }
                            else {
                                m = '' + j;
                            }


                            data__year_month = data__year.filter(d => d.int_created_date.toString().substr(4, 2) === m);
                            data__year_month_created_pos = data__year_created_pos.filter(d => d.int_create_date_pos.toString().substr(4, 2) === m);
                            //(d.current_group_id == __shop_id || __shop_id == 44) && d.int_created_date.toString().substr(0, 4) === year && d.int_created_date.toString().substr(4, 2) === j
                            //console.log('lng_created_dtime.lng_created_dtime====', val.result_items[0].lng_created_dtime.toString().substr(0, 4));
                            //totalDaDangKy = data__year.filter(d => (d.group_id == i || i == 44));
                            totalDaDangKy = data__year_month.length;
                            // console.log('month.month====', totalDaDangKy.length);
                            totaldcthd = data__year_month_created_pos.filter(d => d.int_status == 4);
                            if (i == 44) {
                                //  console.log('====44')
                                totalcxl = data__year_month.filter(d => d.int_status == 1);
                                totalDaXuLy = data__year_month.filter(d => d.int_status != 0 && d.int_queued == -1);
                            }
                            else {
                                // console.log('====213213')
                                totalcxl = data__year_month.filter(d => d.int_group_status == 0);
                                totalDaXuLy = data__year_month.filter(d => d.int_group_status != 0 && d.int_queued == -1);
                            }

                            //totalall1 = totalall1 + totalDaDangKy.length;

                            item.totalDaXuLy = totalDaXuLy.length;
                            item.totalDaDangKy = totalDaDangKy;
                            item.totalDaChuyenThanhHopDong = totaldcthd.length;
                            item.totalChoXuLy = totalcxl.length;

                            _mag.push(item);


                        }
                        //  console.log('mangr====', _mag);
                        ___report_status_year_('POL_PAWN', 'REPORT_STATUS_YEAR_REMAIN', ___cacheshop[i].id, _____year[year], _mag);

                    }
                    //console.log('done');
                }
                //console.log('done');

            }
        },
        REPORT_STATUS_YEAR_CURRENT: function () {
            var year_current = 2019;
            var val = {};
            var dt = new Date();
            var data__year = [];
            val.result_items = ___cache['POL_PAWN'];
            var ___cacheshop = ___cache['GROUP'];
            var group_data = [];
            var group_data_created_pos = [];
            data__year = val.result_items.filter(d => d.int_created_date.toString().substr(0, 4) === year_current.toString());
            var data__year_created_pos = [];
            data__year_created_pos = val.result_items.filter(d => d.int_create_date_pos.toString().substr(0, 4) === year_current.toString());
            var d_month = dt.getMonth();
            if (___cacheshop) {
                for (var i = 0; i < ___cacheshop.length; i++) {
                    group_data = data__year.filter(d => d.group_id == ___cacheshop[i].id);
                    group_data_created_pos = data__year_created_pos.filter(d => d.group_id == ___cacheshop[i].id);
                    var _mag = [];
                    for (var j = 1; j <= d_month + 1; j++) {
                        var data__year_month = [];
                        var data__year_month_created_pos = [];
                        //var totalDaChuyenThanhHopDong = '';
                        var totalcxl = '';
                        var totalDaDangKy = '';
                        var totalDaXuLy = '';
                        var totaldcthd = '';

                        var item = {
                            totalDaDangKy: '',
                            totalDaXuLy: '',
                            totalDaChuyenThanhHopDong: '',
                            totalChoXuLy: ''
                        };

                        if (j < 10) {
                            var m = '0' + j;

                        }
                        else {
                            m = '' + j;
                        }
                        data__year_month = group_data.filter(d => d.int_created_date.toString().substr(4, 2) === m);
                        data__year_month_created_pos = group_data_created_pos.filter(d => d.int_create_date_pos.toString().substr(4, 2) === m);
                        totalDaDangKy = data__year_month.length;

                        totaldcthd = data__year_month_created_pos.filter(d => d.int_status == 4);
                        if (i == 44) {

                            totalcxl = data__year_month.filter(d => d.int_status == 1);
                            totalDaXuLy = data__year_month.filter(d => d.int_status != 0 && d.int_queued == -1);
                        }
                        else {
                            // console.log('====213213')
                            totalcxl = data__year_month.filter(d => d.int_group_status == 0);
                            totalDaXuLy = data__year_month.filter(d => d.int_group_status != 0 && d.int_queued == -1);
                        }

                        //totalall1 = totalall1 + totalDaDangKy.length;

                        item.totalDaXuLy = totalDaXuLy.length;
                        item.totalDaDangKy = totalDaDangKy;
                        item.totalDaChuyenThanhHopDong = totaldcthd.length;
                        item.totalChoXuLy = totalcxl.length;

                        _mag.push(item);


                    }

                    ___report_status_year_('POL_PAWN', 'REPORT_STATUS_YEAR_CURRENT', ___cacheshop[i].id, year_current, _mag);

                }
                //console.log('done=====');
            }




            //___jobs_result.POL_PAWN.REPORT_STATUS = {
            //    result_items: []
            //};


        },
        EXE_CHIA_DON_TU_DONG: function () {

        },
        EXCEL_STATUS_YEAR_REMAIN: function () {
            var val = {};
            val.result_items = ___cache['POL_PAWN'];
            var process = {};
            process.result_items = ___cache['POL_PROCESS'];
            var ___data = val.result_items;

            var data_excel = [];
            //var ____process = process.result_items.filter(d => d.int_pol_pawn_id == 36 && d.int_action == 3);
            //console.log('loogogoogog', ____process);
            //console.log('loogogoogog', ____process[0].lng_created_at);
            //  console.log('dataaaaa', ___data);
            //for (var j = 40000; j < ___data.lengt; j++) {
            //    console.log('ssssssssssss====', ___data[j]);
            //}

            for (var i = 0; i < ___data.length; i++) {
                var obj___ =
                {
                    str_phone: '',
                    str_full_name: '',
                    str_address: '',
                    str_city_name: '',
                    str_district_name: '',
                    ma_don: '',
                    str_url: '',
                    str_channel_name: '',
                    str_codeno_pos: '',
                    int_create_date_pos: '',
                    int_create_date_time_pos: '',//ngày tạo hợp đồng
                    str_asset_type_name: '',
                    str_trademark: '',
                    str_trademark1: '',
                    int_loan_money_pos: '',
                    int_created_date: '',
                    int_created_date_time: '',
                    kpi_created: '',
                    kpi_created_time: '',
                    int_first_call: '',
                    int_first_call_date: '',
                    int_time: '',
                    int_status: '',
                    //  int_from_date_pos: '',
                    int_create_date_pos1: '',//ngày vay
                    author_full_name: '', //str_full_name
                    str_group_name: '',//CurrentGroupName
                    first_proc_shop: '',
                    first_proc_shop_date: '',
                    canceled_time_shop: '',
                    canceled_time_shop_date: '',
                    canceled_reason: '',
                    canceled_content: '',
                    bit_car_in_bank: '',
                    duration: ''
                    //int_created_date______:''
                };
                if (___data[i] && ___data[i].___customer && ___data[i].___customer.str_phone && ___data[i].___customer.str_phone == '') {
                    obj___.str_phone = '';
                }

                obj___.str_phone = ___data[i].___customer.str_phone;
                obj___.str_full_name = ___data[i].___customer.str_name;
                obj___.str_address = ___data[i].___customer.str_address;
                obj___.str_city_name = ___data[i].str_city_name;
                obj___.str_district_name = ___data[i].str_district_name;
                obj___.ma_don = ___data[i].id;
                obj___.str_url = ___data[i].str_url;
                obj___.str_channel_name = ___data[i].str_channel_name;
                obj___.str_codeno_pos = ___data[i].str_codeno_pos;
                //obj___.int_created_date______ = ___data[i].int_created_date;

                if (___data[i].int_create_date_pos == null || ___data[i].int_create_date_pos == '') {
                    ___data[i].int_create_date_pos = 0;
                }
                if (___data[i].int_created_date == null || ___data[i].int_created_date == '') {
                    ___data[i].int_created_date = 0;
                }
                if (___data[i].int_first_call == null || ___data[i].int_first_call == '') {
                    ___data[i].int_first_call = 0;
                }

                if (___data[i].int_from_date_pos == null || ___data[i].int_from_date_pos == '') {
                    ___data[i].int_from_date_pos = 0;
                }
                // var date_int_create_date_pos = ___data[i].int_create_date_pos.toString().substr(6, 2) + '/' + ___data[i].int_create_date_pos.toString().substr(4, 2) + '/' + ___data[i].int_create_date_pos.toString().substr(0, 4);
                obj___.int_create_date_pos = ___data[i].int_create_date_pos;//ngày tạo hợp đồng
                //var date_int_create_date_time_pos = ___data[i].int_create_date_pos.toString().substr(8, 2) + ':' + ___data[i].int_create_date_pos.toString().substr(10, 2);
                obj___.int_create_date_time_pos = ___data[i].int_create_date_pos; //thời gian tạo hợp đồng

                obj___.str_asset_type_name = ___data[i].str_asset_type_name;
                obj___.str_trademark = ___data[i].str_trademark;
                obj___.str_trademark1 = ___data[i].str_trademark;
                obj___.int_loan_money_pos = ___data[i].int_loan_money_pos;
                //var date_int_created_date = ___data[i].int_created_date.toString().substr(0, 8);
                obj___.int_created_date = ___data[i].int_created_date;//fomart
                // var date_int_created_time = ___data[i].int_created_time.toString().substr(0, 2) + ':' + ___data[i].int_created_time.toString().substr(2, 2) + ':' + ___data[i].int_created_time.toString().substr(4, 2);
                obj___.int_created_date_time = ___data[i].int_created_time;//time hhmm
                obj___.kpi_created = ___data[i].int_created_date;
                obj___.kpi_created_time = ___data[i].int_created_time;//time hhmm
                // var date_int_first_call = ___data[i].int_first_call.toString().substr(6, 2) + '/' + ___data[i].int_first_call.toString().substr(4, 2) + '/' + ___data[i].int_first_call.toString().substr(0, 4);
                obj___.int_first_call = ___data[i].int_first_call;
                //var date_int_first_call_date = ___data[i].int_first_call.toString().substr(8, 2) + ':' + ___data[i].int_first_call.toString().substr(10, 2);
                obj___.int_first_call_date = ___data[i].int_first_call;//hhmmint_time
                obj___.int_time = '';
                var text_int_status = '';
                if (___data[i].int_status == 0) {
                    text_int_status = 'Hủy đăng ký';
                } else if (___data[i].int_status == 1) {
                    text_int_status = 'Chưa tư vấn';
                } else if (___data[i].int_status == 2 && ___data[i].int_sms != 1) {
                    text_int_status = 'Đăng chăm sóc';
                } else if (___data[i].int_status == 2 && ___data[i].int_sms == 1) {
                    text_int_status = 'Không liên lạc được';
                }
                else if (___data[i].int_status == 4) {

                    text_int_status = 'Nhận cầm cố';
                }
                else {
                    text_int_status = '';
                }
                obj___.int_status = text_int_status;//lấy ra text
                //var date_int_from_date_pos = ___data[i].int_from_date_pos.toString().substr(6, 2) + '/' + ___data[i].int_from_date_pos.toString().substr(4, 2) + '/' + ___data[i].int_from_date_pos.toString().substr(0, 4);
                // obj___.int_from_date_pos = ___data[i].int_from_date_pos;

                obj___.int_create_date_pos1 = ___data[i].int_create_date_pos;//ngày vay
                if (___data[i].___user_created && ___data[i].___user_created.str_full_name == '') {
                    obj___.author_full_name = '';
                }
                // obj___.author_full_name = ___data[i].___user_created.str_full_name;
                obj___.str_group_name = ___data[i].___group.str_name;
                obj___.first_proc_shop = ___data[i].int_create_date_pos;//tính sau
                obj___.first_proc_shop_date = ___data[i].int_create_date_pos;//tính sau /hhmm

                var text_bit_car_in_bank = '';
                if (___data[i].bit_car_in_bank == 1) {
                    text_bit_car_in_bank = 'TCNH';
                }
                else {
                    text_bit_car_in_bank = '';
                }
                obj___.bit_car_in_bank = text_bit_car_in_bank;// phải lấy text
                obj___.duration = '';//chưa tính được

                // var ____CanceledTimeShop = process.result_items.filter(d => d.int_pol_pawn_id == ___data[i].pos_pawn_id && d.int_action == 3);
                //var ____CanceledReason = process.result_items.filter(d => d.int_pol_pawn_id == ___data[i].pos_pawn_id && d.int_action == 3);
                //console.log('loogogoogog', ____CanceledTimeShop);
                //if (____CanceledTimeShop == '') {
                //    obj___.CanceledTimeShop = '';
                //}
                //else { obj___.CanceledTimeShop = ____CanceledTimeShop[0].lng_created_at; }
                //if (____CanceledReason == '') {
                //    obj___.CanceledReason = '';
                //    obj___.CanceledContent = '';
                //} else {
                //    obj___.CanceledReason = ____CanceledReason[0].str_canceled_reason;
                //    obj___.CanceledContent = ____CanceledReason[0].str_content;
                //}
                if (___data[i].___list_online_process.int_action == 3) {
                    obj___.canceled_time_shop = ___data[i].___list_online_process.lng_created_at;
                    obj___.canceled_time_shop_date = ___data[i].___list_online_process.lng_created_at;
                    obj___.canceled_reason = ___data[i].___list_online_process.str_canceled_reason;
                    obj___.canceled_content = ___data[i].___list_online_process.str_content;


                }

                data_excel.push(obj___);
                //  console.log('dsadsadsad====', obj___.int_created_date______);
                // console.log('dsadsadsad====',data_excel);
                ___jobs_result.POL_PAWN.EXCEL_STATUS_YEAR_REMAIN = {
                    data_excel
                };

            }

            // console.log('done____excel');

        },
        EXCEL_STATUS_YEAR_CURRENT: function () {
        }
    }
};

/////////////////////////////////////////////////////////////////////////////////////////

const ___report_excel_ = function (api_name, store_name, data) {
    //___jobs_result[api_name][store_name] = {};


    ___jobs_result[api_name][store_name] = {
        data
    };
};

///////////////////////////////////////////////////////////////////////////////////////////

const ___report_status_year_ = function (api_name, store_name, shop_id, year, data) {
    //___jobs_result[api_name][store_name] = {};


    //  console.log('vaooooooooooooooooooooooooooooooooo', api_name, store_name, shop_id, year, data);

    if (___jobs_result[api_name][store_name][shop_id] == null
        || ___jobs_result[api_name][store_name][shop_id] == undefined) ___jobs_result[api_name][store_name][shop_id] = {};

    ___jobs_result[api_name][store_name][shop_id][year] = {
        shop_id: shop_id,
        int_year: year,
        str_date_created: new Date().toString(),
        arr_data: data
    };
};

//#endregion

//#region [ TCP_SERVER ]

let _SUBSCRIBES_CLIENTS = [];

const ___MSG_DB2CACHE = [];
new _JOB('* * * * * *', function () {
    if (___MSG_DB2CACHE.length > 0) {
        const m = ___MSG_DB2CACHE.shift();
        if (m) {
            const text = m.text, socket = m.client;
            if (socket && text && text.length > 36) {
                const s = text.substr(1);

                //console.log(s);
                //console.log('\r\n\r\n');
                //return;

                if (s[0] == '{' && s[s.length - 1] == '}') {
                    let validJson = false;
                    let validTextCommand = false;
                    let obj;
                    try {
                        obj = JSON.parse(s);
                        if (typeof obj == 'object') validJson = true;
                    } catch (e1) {
                        validJson = false;
                    }
                    if (validJson) {
                        let k = 0, i = 0;
                        let sync_ok = false;

                        let id;
                        let api_name = obj.a;
                        let cache_name = api_name ? api_name.toLocaleUpperCase() : '';

                        const data = obj.d ? obj.d : [];
                        const key = obj.c;
                        const token = obj.t;
                        const user_id = obj.ui;
                        const user_command = obj.uc;
                        const user_para = obj.up;

                        const master_table = obj.mt;
                        const master_id = obj.mi;
                        const col_update = obj.v;

                        switch (key) {
                            case 'CACHE_ALL_USER':
                                if (___cache['USER']) {
                                    ___cache['USER'] = [];
                                    cache___initFromDB('user.sql');
                                    //socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                                }
                                socket.destroy();

                                break;
                            case 'CACHE_ALL_SHOP':

                                if (___cache['SHOP']) {
                                    ___cache['SHOP'] = [];
                                    cache___initFromDB('shop.sql');
                                    //socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                                }
                                socket.destroy();

                                break;
                            case 'CACHE_ALL_GROUP':

                                if (___cache['GROUP']) {
                                    ___cache['GROUP'] = [];
                                    cache___initFromDB('group.sql');
                                    //socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                                }
                                socket.destroy();

                                break;
                            case 'DB_INSERT':

                                for (i = 0; i < data.length; i++) {
                                    k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                                    if (k == -1) {
                                        data[i].index___ = ___cache[cache_name].length;

                                        data[i] = ___row_changed_update_cache(cache_name, data[i]);

                                        ___cache[cache_name].push(data[i]);
                                        ___index[cache_name][data[i].id] = ___cache[cache_name].length - 1;

                                        sync_ok = true;
                                    }
                                }

                                if (master_table && master_id) {
                                    ___row_changed_update_cache(master_table, master_id);
                                }

                                break;
                            case 'DB_UPDATE':
                                for (i = 0; i < data.length; i++) {
                                    k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                                    if (k != -1) {
                                        data[i] = ___row_changed_update_cache(cache_name, data[i]);
                                        ___cache[cache_name][k] = data[i];
                                        sync_ok = true;
                                    }
                                }

                                if (master_table && master_id) {
                                    ___row_changed_update_cache(master_table, master_id);
                                }

                                break;
                            case 'DB_UPDATE_V':
                                if (col_update) {

                                    for (i = 0; i < data.length; i++) {
                                        k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                                        if (k != -1) {
                                            ___cache[cache_name][k][col_update] = data[i]['v'];
                                            if (col_update == 'caller_online_id')
                                                ___cache[cache_name][k].int_queued = -1;
                                            //console.log(key, cache_name, data[i].id);
                                        }
                                    }

                                }
                                break;
                            default:
                                if (key.startsWith('CACHE_ALL_POL_')) {
                                    cache_name = key.substr('CACHE_ALL_'.length);
                                    if (___cache[cache_name]) {
                                        ___cache[cache_name] = [];
                                        cache___initFromDB(cache_name.toLowerCase() + '.sql');
                                        //socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                                    }
                                    socket.destroy();
                                }
                                break;
                        }

                        if (sync_ok) {
                            ___job_reduce(cache_name);
                            if (data && data.length > 0) ___notify_write(key, cache_name, data[0]);
                        }
                        //console.log('', cache_name, sync_ok, obj);
                    }
                }
            }
        }
    }
}).start();

const ___MSG_AFFILATE = [];
const ___PAWN_ONLINE_AFFILATE___CONVERT_PARA = function (lading, is_auto_test) {
    //var lading = {};
    if (lading == null) return {};

    var para = {
        pawn_online_id: -1,
        customer_id: -1,
        lng_money: null, //Int64 : Tiền KH muốn vay
        int_days: null, //int : Số ngày muốn vay 

        int_status: 1, //@Status tinyint: 1 Chưa tư vấn 
        int_queued: null, //@Queued
        int_trans_to_shop_date: null, //@TransToShopTime
        int_trans_to_shop_time: null, //@TransToShopTime

        int_region_id: null, //int

        str_cus_name: null, //@Name
        str_cus_phone: null, //@Mobile
        str_cus_address: null, // @Address
        str_cus_province: null, //@Province

        int_priority: null, //@Priority

        //pawn_detail
        int_urgent_level: null, //@UrgentLevel
        int_order_priority: null, //@OrderPriority 
        int_reference_type: null, //@ReferenceType
        str_reference_affilate_id: null, //@TransactionID

        int_current_group_id: null, //@CurrentGroupID
        str_group_ids_reveiced: null, //@SteepedGroupID
        area_id: null, //@POLRegion -> ID miền 0=Miền Bắc; 1=Miền Nam
        caller_shop_id: null, //@ShopCallerID -> Lưu vào caller_shop_id (chia luôn cho shop); ID CVKD xử lý đơn

        str_asset_type_name: null, //@Asset
        str_link: null, //@Link
        str_trademark: null, //@Trademark
        str_channel_name: null, //@Source
        str_description: null, //@Description

        //-------------------------------------------

        asset_type_id: null, // int
        channel_id: null, // int 

        city_id: null, // int
        district_id: null, // int

        str_city_name: null, // nvarchar(255)
        str_district_name: null // nvarchar(255)
    };

    if (lading.PawnOnlineId) para.pawn_online_id = lading.PawnOnlineId;
    if (lading.CustomerId) para.customer_id = lading.CustomerId;

    //#region [ LadingPage ]

    ////public class LadingPage {
    ////    public bool ? Delay { get; set; }
    ////    public int ? OrderPriority { get; set; } 
    ////    public string Trademark { get; set; }
    ////    public string Source { get; set; } 

    ////----------------------------------------------------------------------------------------------

    ////    public string name { get; set; } //tên khách hàng
    ////    public string phone { get; set; } // số điện thoại
    ////    public string select1 { get; set; } // loại tài sản
    ////    public string select2 { get; set; } // tỉnh thành phố (địa chỉ khách hàng)
    ////    public string select3 { get; set; } // tiền vay

    ////    public int Status { get; set; } // Mã khách hàng
    ////    public string RegionID { get; set; }

    ////    public string CurrentGroupID { get; set; }
    ////    public string POLRegion { get; set; }
    ////    public string ShopCallerID { get; set; }

    ////    public string Description { get; set; } // Số ngày muốn vay 
    ////    public string link { get; set; } // tên tài sản

    ////    public int ? ReferenceType { get; set; } // type of MasOffer, affilate 
    ////    public string TransactionID { get; set; } // MasOffer, affilate id


    ////----------------------------------------------------------------------------------------------

    ////    public Int64 Money { get; set; } // Tiền KH muốn vay
    ////    public int Days { get; set; } // Số ngày muốn vay 
    ////    public string ReferenceTypeStr { get; set; } // type of MasOffer, affilate 
    ////    public int PawnID { get; set; } // Mã hợp đồng
    ////    public int ? PawnType { get; set; } // Loại hợp đồng
    ////    public int CustomerID { get; set; } // Mã khách hàng
    ////    public int AffCustomerID { get; set; } // Mã khách hàng
    ////    public int AffPawnID { get; set; } // Mã khách hàng
    ////    public string Publisher { get; set; } // Mã Publisher
    ////    public string AT_conversion_result_id { get; set; } // Mã Publisher
    ////    public string AT_transaction_value { get; set; } // Mã Publisher
    ////    public string LoginToken { get; set; } // MasOffer, affilate id
    ////    public string Province { get; set; }
    ////    public string District { get; set; }
    ////}

    //INSERT INTO [pos].[PawnOnline]
    //    ([Asset],[Trademark],[Created],[CustomerID],[Status]
    //    ,[Source],[CurrentGroupID],[SteepedGroupID],[Priority],[UrgentLevel]
    //    ,[LastTrans],[Url],[ReferenceId],[ReferenceType],[OrderPriority]
    //    ,[Queued],[RegisterDate],[Description],[POLRegion],[ShopCallerID]
    //    ,[TransToShopTime])
    //VALUES
    //    (@Asset,@Trademark,(SELECT DATEADD(hour, 7, GETUTCDATE())),@CustomerID,1,
    //    @Source,@CurrentGroupID,@SteepedGroupID,@Priority,@UrgentLevel,
    //    (SELECT DATEADD(hour, 7, GETUTCDATE())),@Url,@ReferenceId,@ReferenceType,@OrderPriority,
    //    @Queued,(SELECT DATEADD(hour, 7, GETUTCDATE())),@Description,@POLRegion,@ShopCallerID,
    //    @TransToShopTime);

    if (is_auto_test == true) {
        lading = {
            Delay: null, //bit -> @Queued = lading.Delay ? 1 : 0 ????????????????????????????????????????
            OrderPriority: null,// 1,2,3,4,5
            Trademark: null,
            Source: null,

            name: null, //string: tên khách hàng -> @Name
            phone: null, //string: số điện thoại -> @Mobile
            Province: null,//string: -> tỉnh thành phố -> @Province
            select2: null, //string : tỉnh thành phố -> địa chỉ -> @Address


            Status: null, //int : Mã khách hàng
            Money: null, //Int64 : Tiền KH muốn vay
            Days: null, //int : Số ngày muốn vay 
            RegionID: null,//string :

            SteepedGroupID: null,//string :
            CurrentGroupID: null,//string :
            POLRegion: null,//string :
            ShopCallerID: null,//string :

            link: null, //string : tên tài sản
            ReferenceType: null, //int : type of MasOffer, affilate 

            select1: null, //string : loại tài sản -> @Asset
            Description: null, //string 
            //----------------------------------------------------------------
            ReferenceTypeStr: null, //string : type of MasOffer, affilate 
            select3: null, //string : tiền vay
            PawnID: null, //int : Mã hợp đồng
            PawnType: null, //int : Loại hợp đồng
            CustomerID: null, //int : Mã khách hàng
            AffCustomerID: null, //int : Mã khách hàng
            AffPawnID: null, //int : Mã khách hàng
            Publisher: null, //string : Mã Publisher
            AT_conversion_result_id: null, //string : Mã Publisher
            AT_transaction_value: null, //string : Mã Publisher
            TransactionID: null, //string : MasOffer, affilate id
            LoginToken: null, //string : MasOffer, affilate id
            District: null,//string :
        };
    }

    //#endregion

    //#region [ STUB FOR TEST ]

    if (is_auto_test == true) {
        var _items, _index;
        var _str_cus_phone = '0' + (Math.floor(Math.random() * 999999999) + 100000000);
        var _int_phone = parseInt(_str_cus_phone);

        _items = ___cache['POL_CHANNEL'];
        _index = Math.floor(Math.random() * _items.length);
        var _channel_id = _items[_index].id;
        var _str_channel_name = _items[_index].str_name;

        _items = _.filter(___cache['REGION'], function (o) { return o.int_pid == 0; });
        _index = Math.floor(Math.random() * _items.length);
        var _city_id = _items[_index].id;
        var _str_city_name = _items[_index].str_name;

        _items = _.filter(___cache['REGION'], function (o) { return o.int_pid == _city_id; });
        _index = Math.floor(Math.random() * _items.length);
        var _district_id = _items[_index].id;
        var _str_district_name = _items[_index].str_name;
        //-----------------------------------------

        _items = ___cache['USER'];
        _index = Math.floor(Math.random() * _items.length);

        var _user_created_id = _items[_index].id;
        var _shop_id = _items[_index].shop_id;
        var _group_id = _items[_index].group_id;
        if (_int_phone % 2 == 0) {
            //chintn
            _user_created_id = 617;
            _group_id = 44;
            _shop_id = 21;
        } else if (_int_phone % 4 == 0) {
            //yennh
            _user_created_id = 619;
            _group_id = 44;
            _shop_id = 21;
        } else if (_int_phone % 3 == 0) {
            //kiennt Nhóm CH 82 Phùng Hưng
            _user_created_id = 703;
            _group_id = 26;
            shop_id = 147;
        } else if (_int_phone % 5 == 0) {
            //hoant Nhóm CH 82 Phùng Hưng
            _user_created_id = 507;
            _group_id = 26;
            _shop_id = 147;
        }

        //-----------------------------------------

        _items = ___cache['POL_ASSET_TYPE'];
        _index = Math.floor(Math.random() * _items.length);
        var _asset_type_id = _items[_index].id;
        var _str_asset_type_name = _items[_index].str_name;

        //-----------------------------------------
        //-----------------------------------------

        lading.Delay = _int_phone % 2 == 0 ? 0 : 1; //bit -> @Queued = lading.Delay ? 1 = 0 ????????????????????????????????????????
        lading.OrderPriority = Math.floor(Math.random() * 5) + 1;//int 1;2;3;4;5
        lading.link = 'http://' + ___guid();//string
        lading.Trademark = ___test_random_text(9);//string
        lading.Source = _str_channel_name; //string

        lading.RegionID = '' + _district_id;//string =

        lading.name = ___test_random_text(3); //string= tên khách hàng -> @Name
        lading.phone = _str_cus_phone; //string= số điện thoại -> @Mobile
        lading.Province = _str_city_name;//string= -> tỉnh thành phố -> @Province
        lading.select2 = ___test_random_text(9); //string = tỉnh thành phố -> địa chỉ -> @Address

        lading.RegionID = '' + _district_id;
        lading.Status = 1; //int = Mã khách hàng
        lading.Money = Math.floor(Math.random() * 99999999) + 1000000; //Int64 = Tiền KH muốn vay
        lading.Days = Math.floor(Math.random() * 99) + 30; //int = Số ngày muốn vay 

        lading.SteepedGroupID = '' + _group_id;//string =
        lading.CurrentGroupID = '' + _group_id;//string =
        lading.POLRegion = '' + (_int_phone % 2 == 0 ? 0 : 1);//string =
        lading.ShopCallerID = '' + _shop_id;//string =

        lading.ReferenceType = Math.floor(Math.random() * 9) + 1; //int = type of MasOffer; affilate 
        lading.ReferenceTypeStr = ___guid().split('-')[0]; //string = type of MasOffer; affilate 

        lading.select1 = _str_asset_type_name; //string = loại tài sản -> @Asset
        lading.Description = ___test_random_text(15); //string 
    }

    //#endregion

    //-------------------------------------------------------------------------------------------------------

    //#region [ @Money, @Days, @RegionID ]

    //para.lng_money = ___convert_number(lading.Money); //Int64 : Tiền KH muốn vay
    //para.int_days = ___convert_number(lading.Days); //int : Số ngày muốn vay 
    para.lng_money = ___convert_number(lading.select3, 0); //Int64 : Tiền KH muốn vay
    para.int_days = 0; //int : Số ngày muốn vay 
    para.int_region_id = ___convert_number(lading.RegionID);

    //#endregion

    //-------------------------------------------------------------------------------------------------------

    //#region [ @Name, @Mobile, @Address, @Province ]

    //paramCustomer.Add("@Name", lading.name); // tên khách hàng
    //paramCustomer.Add("@Mobile", lading.phone); // điện thoại
    //paramCustomer.Add("@Address", lading.select2); // tỉnh thành phố
    //paramCustomer.Add("@Province", lading.Province); // tỉnh thành phố

    para.str_cus_name = ___format_text_before_update_database(lading.name);
    para.str_cus_phone = ___format_text_before_update_database(lading.phone);
    para.str_cus_address = ___format_text_before_update_database(lading.select2);
    para.str_cus_province = ___format_text_before_update_database(lading.Province);

    //#endregion

    //-------------------------------------------------------------------------------------------------------

    //#region [ @Priority, @UrgentLevel, @OrderPriority ]

    var PAWN_ONLINE_PRIORITY = {
        Low: 1,//Thấp
        Medium: 2,//Trung bình
        Hight: 3//Cao
    };

    // SteepedGroupID = CurrentGroupID 
    // paramPawn.Add("@Priority", (byte)PawnOnlinePriority.Medium + "");
    // paramPawn.Add("@UrgentLevel", (byte)PawnOnlineUrgentLevel.Medium + "");
    // mặc định = 2

    para.int_priority = PAWN_ONLINE_PRIORITY.Medium;
    para.int_urgent_level = PAWN_ONLINE_PRIORITY.Medium;
    para.int_order_priority = ___convert_number(lading.OrderPriority);

    //#endregion

    //-------------------------------------------------------------------------------------------------------

    //#region [ @CurrentGroupID, @SteepedGroupID, @POLRegion, @ShopCallerID ]

    para.int_current_group_id = ___convert_number(lading.CurrentGroupID);
    para.str_group_ids_reveiced = ___format_text_before_update_database(lading.SteepedGroupID);
    para.area_id = ___convert_number(lading.POLRegion, 0);
    para.caller_shop_id = ___convert_number(lading.ShopCallerID);

    //#endregion

    //-------------------------------------------------------------------------------------------------------

    //#region [ @ReferenceType, @TransactionID ]

    para.int_reference_type = ___convert_number(lading.ReferenceType);
    para.str_reference_affilate_id = ___format_text_before_update_database(lading.TransactionID);

    //#endregion

    //-------------------------------------------------------------------------------------------------------

    //#region [ @Asset, @Link, @Trademark, @Source, @Description ]

    para.str_asset_type_name = ___format_text_before_update_database(lading.select1); // tên loại tài sản
    para.str_link = ___format_text_before_update_database(lading.link);
    para.str_trademark = ___format_text_before_update_database(lading.Trademark);
    para.str_channel_name = ___format_text_before_update_database(lading.Source);
    para.str_description = ___format_text_before_update_database(lading.Description);

    //#endregion

    //-------------------------------------------------------------------------------------------------------

    //#region [ @Queued, @TransToShopTime ]

    //-> Đơn chưa được chia
    para.int_group_id == 44;

    //paramPawn.Add("@Queued", lading.Delay ? 1 : 0);
    //paramPawn.Add("@TransToShopTime", null);
    para.int_queued = lading.Delay == true ? 1 : 0;
    para.int_trans_to_shop_date = -1;
    para.int_trans_to_shop_time = -1;



    //////if (para.int_group_id == 44) {
    //////    //-> Đơn chưa được chia

    //////    //paramPawn.Add("@Queued", lading.Delay ? 1 : 0);
    //////    //paramPawn.Add("@TransToShopTime", null);
    //////    para.int_queued = lading.Delay == true ? 1 : 0;
    //////    para.int_trans_to_shop_date = -1;
    //////    para.int_trans_to_shop_time = -1;
    //////}
    //////else {
    //////    //-> Đơn đã dc chia đơn từ trên đầu phễu

    //////    //paramPawn.Add("@Queued", null);
    //////    //paramPawn.Add("@TransToShopTime", DateTime.Now);

    //////    para.int_queued = -1; //null
    //////    para.int_trans_to_shop_date = ___convert_datetime_yyyyMMdd();
    //////    para.int_trans_to_shop_time = ___convert_datetime_HHmmss();
    //////}

    //#endregion

    //-------------------------------------------------------------------------------------------------------

    para.asset_type_id = -1;
    var asset_ = _.find(___cache['POL_ASSET_TYPE'], function (o) { return o.str_name == para.str_asset_type_name; });
    if (asset_) { para.asset_type_id = asset_.id; }
    else {
        db___execute_callback(null, null, 'mobile.pol_pol_asset_type_biz_addnew', { str_asset_type_name: para.str_asset_type_name },
            function (r_, m_) {
                if (m_.ok && m_.data) {
                    para.asset_type_id = m_.data;
                }
            },
            function (r_, m_) {
            }
        );
    }

    para.channel_id = -1;
    var channel_ = _.find(___cache['POL_CHANNEL'], function (o) { return o.str_name == para.str_channel_name; });
    if (channel_) {
        para.channel_id = channel_.id;
    }
    else {
        db___execute_callback(null, null, 'mobile.pol_pol_channel_biz_addnew', { str_channel_name: para.str_channel_name },
            function (r_, m_) {
                if (m_.ok && m_.data) {
                    para.channel_id = m_.data;
                }
            },
            function (r_, m_) {
            }
        );
    }


    para.city_id = -1;
    para.str_city_name = '';
    para.district_id = para.int_region_id;
    para.str_district_name = '';
    var district_ = _.find(___cache['REGION'], function (o) { return o.id == para.int_region_id; });
    if (district_) {
        para.city_id = district_.int_pid;
        para.str_city_name = district_.str_parent_name;
        para.str_district_name = district_.str_name;
    }

    if (para.lng_money == -1) para.lng_money = 0;
    if (para.int_days == -1) para.int_days = 0;

    // Nếu group_id != 44 && group_id > 0 -> đã chia trên đầu phễu
    // Nếu group_id == 44 -> sẽ phải chia tự động
    if (para.int_current_group_id == 44) {
        para.int_queued = 0; // đơn chưa chia
        para.caller_shop_id = -1;
    } else if (para.int_current_group_id != 44 && para.int_current_group_id > 0) {
        para.int_queued = -1; // đơn đã chia cho 1 nhóm nào đó
        para.str_group_ids_reveiced = '' + para.int_current_group_id;

    }

    return para;
};
new _JOB('* * * * * *', function () {
    if (___MSG_AFFILATE.length > 0) {
        const m = ___MSG_AFFILATE.shift();
        if (m) {
            const text = m.text, socket = m.client;
            if (socket && text && text.length > 36) {
                let lading, para;
                const type = text[0].charCodeAt(0);
                switch (type) {
                    case 106:
                        //#region [ PAWN_ONLINE_CREATE_BY_AFFILATE_SUCCESS ]

                        /// <summary>
                        /// Tiếp nhận đơn đầu phễu
                        /// Input: data = new string []{ item_json, ... }
                        /// item_josn = ???????
                        /// Ouput: oResult( ok: true|false; data: [{...}]; là mảng đối tượng { int_customer_id: ..., int_pawn_online_id: ... } )
                        /// </summary>
                        /// PAWN_ONLINE_CREATE_BY_AFFILATE_SUCCESS = 106

                        lading = JSON.parse(text.substr(37));
                        para = ___PAWN_ONLINE_AFFILATE___CONVERT_PARA(lading);

                        //console.log('PAWN_ONLINE_CREATE_BY_AFFILATE_SUCCESS lading =', lading);
                        //console.log('PAWN_ONLINE_CREATE_BY_AFFILATE_SUCCESS para =', para);

                        db___execute_callback(socket, null, 'mobile.pol_pawn_biz_job_PAWN_ONLINE_CREATE_BY_AFFILATE_SUCCESS', para,
                            function (client, msg_) {
                                client.write(JSON.stringify(msg_));
                                client.destroy();
                            },
                            function (client, msg_) {
                                client.write(JSON.stringify(msg_));
                                client.destroy();
                            });

                        //#endregion
                        break;
                    case 107:
                        //#region [ PAWN_ONLINE_UPDATE_BY_AFFILATE_SUCCESS ]

                        /// <summary>
                        /// Cập nhật đơn đầu phễu
                        /// Input: data = new string []{ item_json, ... }
                        /// Ouput: oResult( ok: true|false; data: là string thông báo nếu false )
                        /// </summary>
                        /// PAWN_ONLINE_UPDATE_BY_AFFILATE_SUCCESS = 107


                        lading = JSON.parse(text.substr(37));
                        para = ___PAWN_ONLINE_AFFILATE___CONVERT_PARA(lading);

                        //console.log('PAWN_ONLINE_UPDATE_BY_AFFILATE_SUCCESS lading =', lading);
                        //console.log('PAWN_ONLINE_UPDATE_BY_AFFILATE_SUCCESS para =', para);

                        db___execute_callback(socket, null, 'mobile.pol_pawn_biz_job_PAWN_ONLINE_UPDATE_BY_AFFILATE_SUCCESS', para,
                            function (client, msg_) {
                                client.write(JSON.stringify(msg_));
                                client.destroy();
                            },
                            function (client, msg_) {
                                client.write(JSON.stringify(msg_));
                                client.destroy();
                            });

                        //#endregion
                        break;
                    default:
                        socket.destroy();
                        break;
                }
            }
        }
    }
}).start();

let ___tokens = {};
const ___MSG_TOKEN = [];
const ___user_build_profile_token = function (user_id, token) {
    const user_ = _.find(___cache['USER'], function (o) { return o.id == user_id; });

    //  console.log('222', user_);
    if (user_) {
        user_.ok = true;
        user_.int_pol_status = 1; // 0: offline; 1: online

        let user = JSON.parse(JSON.stringify(user_));
        delete user['str_password'];

        let cf = {}, acf = (___cache['POS_SYS_CONFIG'] == null ? [] : ___cache['POS_SYS_CONFIG']);
        for (var i = 0; i < acf.length; i++) {
            let o = ___cache['POS_SYS_CONFIG'][i];
            cf[o.str_code] = o.str_value;
        }

        //console.log('LOGIN = ', acf, cf);

        user.pos_sys_config = cf;

        user.ok = true;

        if (token == null || token == undefined) {
            //user.str_token = user___get_token(user.user_id, user.str_user_name, user.scope_ids);
            token = user.user_id + ___base64Random();
        }
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

        //console.log("LOGIN: OK = ", user);
        return user;
    }

    return { ok: false };
};
new _JOB('* * * * * *', function () {
    if (___MSG_TOKEN.length > 0) {
        const m = ___MSG_TOKEN.shift();
        if (m) {
            const text = m.text, socket = m.client;
            if (socket && text && text.length > 36) {
                let user_id, token, key, user;
                const type = text[0].charCodeAt(0);
                switch (type) {
                    case 1:
                        //TOKEN_RETURN_LOGIN_SUCCESS = 1,
                        user_id = Number(text.substr(37));
                        //console.log('TOKEN_RETURN_LOGIN_SUCCESS = ', user_id);
                        if (isNaN(user_id) == false) {
                            token = user_id + ___base64Random();
                            key = token.substr(0, 36);
                            ___tokens[key] = user_id;
                            socket.write(token);
                            socket.destroy();
                        }
                        break;
                    case 2:
                        //TOKEN_VALID = 2,
                        token = text.substr(37);
                        key = token.substr(0, 36);
                        //console.log('TOKEN_VALID = ', token);
                        if (___tokens[key]) {
                            user_id = ___tokens[key];
                            user = ___user_build_profile_token(user_id, token);
                            //console.log(user_id, user);
                            if (user) {
                                socket.write(JSON.stringify(user));
                            }
                        }

                        socket.destroy();
                        break;
                    default:
                        socket.destroy();
                        break;
                }
            }
        }
    }
}).start();

const ___MSG_POS = [];
new _JOB('* * * * * *', function () {
    if (___MSG_POS.length > 0) {
        const m = ___MSG_POS.shift();
        if (m) {
            const text = m.text, socket = m.client;
            if (socket && text && text.length > 36) {
                const para = text.substr(37);
                const type = text[0].charCodeAt(0);

                let pawn_id;
                let obj = {}, a = [], arr = [], str = '', ok = false;
                switch (type) {
                    case 102:
                        //#region [ PAWN_ONLINE_UPDATE_SUCCESS ]

                        arr = para.split('|');
                        if (arr.length > 1) {
                            pawn_id = Number(arr[0]);

                            if (!isNaN(pawn_id)) {

                                obj = { int_pawn_id: pawn_id };

                                //console.log('PAWN_ONLINE_UPDATE_SUCCESS obj =', obj);

                                db___execute_callback(socket, null, 'mobile.pol_pawn_biz_PAWN_ONLINE_POS_PUSH_STATUS_SUCCESS', obj,
                                    function (client, msg_) {
                                        client.write(JSON.stringify(msg_));
                                        client.destroy();
                                        affilate___fetch_callback('pos', pawn_id);
                                    },
                                    function (client, msg_) {
                                        client.write(JSON.stringify(msg_));
                                        client.destroy();
                                    });
                            }
                        } else {
                            socket.write(JSON.stringify({ ok: false, message: 'Error: Input data = new string[]{ PawnId, PawnOnlineId } ' }));
                            socket.destroy();
                        }

                        //#endregion
                        break;
                    case 104:
                        //#region [ PAWN_ONLINE_POS_CHECK_PHONE_LIST_SUCCESS ]

                        /// <summary>
                        /// Thực hiện kiểm tra số điện thoại khi tạo hợp đồng trên POS có trên hệ thống POL ko?
                        /// Input: data = new string[]{ Phone1, yyyyMMdd_1, Phone2, yyyyMMdd_2 ... }
                        /// + Phone là số điện thoại trên hợp đồng đang tạo mới
                        /// + yyyyMMdd là ngày tháng của hợp đồng cuối cùng của số điện thoại trên
                        /// Ouput: oResult( ok: true|false; data: [{...}] là mảng đối tượng { int_pawn_online_id: ..., int_create_date: .... } )
                        /// + int_pawn_online_id là mã đơn online
                        /// + int_create_date là ngày tạo đơn online
                        /// </summary>
                        /// PAWN_ONLINE_POS_CHECK_PHONE_LIST_SUCCESS = 104

                        a = para.split('|');
                        //console.log('1', a);
                        if (a.length > 0 && a.length % 2 == 0) {
                            const phones = _.filter(a, function (o, index_) { return index_ % 2 == 0; });
                            const dates = _.filter(a, function (o, index_) { return index_ % 2 != 0; });

                            //console.log('2', phones, dates);

                            if (phones.length == dates.length) {
                                const arr_phone_date = _.map(phones, function (o, index_) {
                                    return { phone: o, date: dates[index_] };
                                });

                                //console.log('3', arr_phone_date);

                                let arr_result = [], int_date = 0;
                                ok = false;
                                arr_phone_date.forEach(pi => {
                                    ok = false;
                                    if (pi.date.length == 0) {

                                        //console.log(pi.phone)

                                        arr_result = _.filter(___cache['POL_PAWN'],
                                            function (o) {
                                                return o.___customer != null &&
                                                    o.___customer.str_phone == pi.phone &&
                                                    o.int_status == 2; //[1] tim trong don dang xu ly
                                            });

                                        if (arr_result.length == 0) {
                                            arr_result = _.filter(___cache['POL_PAWN'],
                                                function (o) {
                                                    //return o.___customer && str.indexOf('|' + o.___customer.str_phone + '|') != -1;
                                                    return o.___customer != null &&
                                                        o.___customer.str_phone == pi.phone &&
                                                        o.int_status == 1;//[2] tim trong don da huy
                                                });
                                        }

                                        //console.log(pi.phone, arr_result)
                                    } else {
                                        int_date = Number(pi.date);
                                        if (!isNaN(int_date) && pi.date != null && pi.date.length == 8) {

                                            //console.log('4', int_date, pi.phone);

                                            arr_result = _.filter(___cache['POL_PAWN'],
                                                function (o) {
                                                    //return o.___customer && str.indexOf('|' + o.___customer.str_phone + '|') != -1;
                                                    return o.___customer != null &&
                                                        o.___customer.str_phone == pi.phone &&
                                                        o.int_created_date != null &&
                                                        o.int_created_date >= int_date &&
                                                        o.int_status == 2; //[1] tim trong don dang xu ly
                                                });

                                            if (arr_result.length == 0) {
                                                arr_result = _.filter(___cache['POL_PAWN'],
                                                    function (o) {
                                                        //return o.___customer && str.indexOf('|' + o.___customer.str_phone + '|') != -1;
                                                        return o.___customer != null &&
                                                            o.___customer.str_phone == pi.phone &&
                                                            o.int_created_date != null &&
                                                            o.int_created_date >= int_date &&
                                                            o.int_status == 1;//[2] tim trong don da huy
                                                    });
                                            }
                                        }
                                    }

                                    if (arr_result.length > 0) {
                                        arr.push({ phone: pi.phone, date: pi.date, pawns: arr_result });
                                        ok = true;
                                    }

                                    if (ok == false) arr.push({ phone: pi.phone, date: pi.date, pawns: [] });
                                });
                                socket.write(JSON.stringify({ ok: true, data: arr }));
                            } else {
                                socket.write(JSON.stringify({ ok: false, data: 'Dữ liệu sai định dạng data = new string[]{ Phone1, yyyyMMdd_1, Phone2, yyyyMMdd_2 ... } ' }));
                            }
                        }

                        socket.destroy();

                        //#endregion
                        break;
                    case 105:
                        //#region [ PAWN_ONLINE_POS_PUSH_STATUS_SUCCESS ]

                        /// <summary>
                        /// Cập nhật trạng thái thành công của đơn online đã được tạo
                        /// Input: data = new string[]{ PawnId, PawnOnlineId }
                        /// Ouput: oResult( ok: true|false; data: là dữ liệu thông báo nếu thất bại )
                        /// </summary>
                        /// PAWN_ONLINE_POS_PUSH_STATUS_SUCCESS = 105

                        arr = para.split('|');
                        if (arr.length > 1) {
                            pawn_id = Number(arr[0]);
                            const pawn_online_id = Number(arr[1]);

                            if (!isNaN(pawn_id) && !isNaN(pawn_online_id)) {

                                obj = { int_pawn_id: pawn_id, int_pawn_online_id: pawn_online_id };

                                //console.log('PAWN_ONLINE_POS_PUSH_STATUS_SUCCESS obj =', obj);

                                db___execute_callback(socket, null, 'mobile.pol_pawn_biz_PAWN_ONLINE_POS_PUSH_STATUS_SUCCESS', obj,
                                    function (client, msg_) {
                                        client.write(JSON.stringify(msg_));
                                        client.destroy();
                                    },
                                    function (client, msg_) {
                                        client.write(JSON.stringify(msg_));
                                        client.destroy();
                                    });
                            }
                        } else {
                            socket.write(JSON.stringify({ ok: false, message: 'Error: Input data = new string[]{ PawnId, PawnOnlineId } ' }));
                            socket.destroy();
                        }

                        //#endregion
                        break;
                    case 121:
                        //#region [ PAWN_CREATE_NEW_SUCCESS ]

                        /// <summary>
                        /// Tạo Pawn thành công (bảng pos.Pawn)
                        /// Input:
                        ///     data = new string[]{ PawnId }
                        /// Output:
                        ///     oResult( ok: true|false; data: string thông báo )
                        /// </summary>
                        /// PAWN_CREATE_NEW_SUCCESS = 121


                        //#endregion
                        break;
                    //#region [ PAWN_UPDATE_SUCCESS ]
                    //case 122:
                    //    //#region [ PAWN_UPDATE_SUCCESS ]

                    //    /// <summary>
                    //    /// Thay đổi thông tin Pawn (bảng pos.Pawn)
                    //    ///     + Update thay đổi thông tin các bản ghi của đối tượng Pawn
                    //    ///     + Thay đổi trạng thái Pawn: Khóa, cấm, kích hoạt, duyệt, ...
                    //    /// Input:
                    //    ///     data = new string[]{ PawnId }
                    //    /// Output:
                    //    ///     oResult( ok: true|false; data: string thông báo )
                    //    /// </summary>
                    //    /// PAWN_UPDATE_SUCCESS = 122

                    //    pawn_id = Number(para);

                    //    if (!isNaN(pawn_id)) {
                    //        obj = { int_pos_pawn_id: pawn_id };
                    //        //console.log('PAWN_UPDATE_SUCCESS obj =', obj);

                    //        db___execute_callback(socket,null, 'mobile.pol_pawn_biz_pos_push_status_success', obj,
                    //            function (client, msg_) {
                    //                client.write(JSON.stringify(msg_));
                    //                client.destroy();
                    //            },
                    //            function (client, msg_) {
                    //                client.write(JSON.stringify(msg_));
                    //                client.destroy();
                    //            });
                    //    }

                    //    //#endregion
                    //    break;
                    //#endregion
                    case 122:
                        //#region [ PAWN_UPDATE_SUCCESS ]

                        /// <summary>
                        /// Thay đổi thông tin Pawn (bảng pos.Pawn)
                        ///     + Update thay đổi thông tin các bản ghi của đối tượng Pawn
                        ///     + Thay đổi trạng thái Pawn: Khóa, cấm, kích hoạt, duyệt, ...
                        /// Input:
                        ///     data = new string[]{ PawnId, loan_money_org , is_f88_cus(0|1), pawn_asset_code_pos(000017...)  }
                        /// Output:
                        ///     oResult( ok: true|false; data: string thông báo )
                        /// </summary>
                        /// PAWN_UPDATE_SUCCESS = 122

                        //  pawn_id = Number(para);

                        a = para.split('|');
                        ok = false;
                        switch (a.length) {
                            case 1:
                                //#region []
                                pawn_id = Number(a[0]);
                                if (isNaN(pawn_id)) {
                                    socket.write(JSON.stringify({ ok: false, message: 'Dữ liệu không đúng định dạng data = new string[]{ PawnId }' }));
                                    socket.destroy();
                                } else {
                                    obj = {
                                        int_pos_pawn_id: pawn_id,
                                        loan_money_org: -1,
                                        is_f88_cus: -1,
                                        asset_code_pos: ''
                                    };

                                    //console.log('PAWN_UPDATE_SUCCESS obj =', obj);
                                    ok = true;
                                }
                                //#endregion
                                break;
                            case 4:
                                //#region []
                                pawn_id = Number(a[0]);
                                const loan_money_org = Number(a[1]);
                                const is_f88_cus = Number(a[2]);
                                const pawn_asset_code_pos = a[3];

                                if (isNaN(pawn_id) || isNaN(loan_money_org) || isNaN(is_f88_cus)) {
                                    socket.write(JSON.stringify({ ok: false, message: 'Dữ liệu không đúng định dạng data = new string[]{ PawnId, loan_money_org , is_f88_cus(0|1), pawn_asset_code_pos(000017...)  }' }));
                                    socket.destroy();
                                } else {
                                    obj = {
                                        int_pos_pawn_id: pawn_id,
                                        loan_money_org: loan_money_org,
                                        is_f88_cus: is_f88_cus,
                                        asset_code_pos: pawn_asset_code_pos
                                    };

                                    //console.log('PAWN_UPDATE_SUCCESS obj =', obj);
                                    ok = true;
                                }
                                //#endregion
                                break;
                            default:
                                break;
                        }

                        if (ok) {
                            db___execute_callback(socket, null,
                                'mobile.pol_pawn_biz_pos_push_status_success',
                                obj,
                                function (client, msg_) {
                                    client.write(JSON.stringify(msg_));
                                    client.destroy();
                                },
                                function (client, msg_) {
                                    client.write(JSON.stringify(msg_));
                                    client.destroy();
                                });
                        }
                        //#endregion
                        break;
                    case 11:
                        //#region [ USER_CREATE_NEW_SUCCESS ]

                        /// <summary>
                        /// Tạo tài khoản thành công
                        /// Input:
                        ///     data = new string[]{ user_id }
                        /// Output:
                        ///     oResult( ok: true|false; data: string thông báo )
                        /// </summary>
                        /// USER_CREATE_NEW_SUCCESS = 11,

                        if (___cache['USER']) {
                            ___cache['USER'] = [];
                            cache___initFromDB('user.sql');
                            socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                        }
                        socket.destroy();

                        //#endregion
                        break;
                    case 12:
                        //#region [ USER_UPDATE_SUCCESS ]

                        /// <summary>
                        /// Thay đổi thông tin tài khoản thành công
                        ///     + Update thay đổi thông tin các bản ghi của đối tượng tài khoản(user)
                        ///     + Đổi mật khẩu
                        ///     + Update profile
                        ///     + Thay đổi trạng thái: Khóa tài khoản, ...
                        /// Input:
                        ///     data = new string[]{ user_id }
                        /// Output:
                        ///     oResult( ok: true|false; data: string thông báo )
                        /// </summary>
                        /// USER_UPDATE_SUCCESS = 12,

                        if (___cache['USER']) {
                            ___cache['USER'] = [];
                            cache___initFromDB('user.sql');
                            socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                        }
                        socket.destroy();

                        //#endregion
                        break;
                    case 13:
                        //#region [ USER_REMOVE_SUCCESS ]

                        /// <summary>
                        /// Xóa tài khoản thành công
                        /// Input:
                        ///     data = new string[]{ user_id }
                        /// Output:
                        ///     oResult( ok: true|false; data: string thông báo )
                        /// </summary>
                        /// USER_REMOVE_SUCCESS = 13,

                        if (___cache['USER']) {
                            ___cache['USER'] = [];
                            cache___initFromDB('user.sql');
                            socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                        }
                        socket.destroy();

                        //#endregion
                        break;
                    case 21:
                        //#region [ SHOP_CREATE_NEW_SUCCESS ]

                        if (___cache['SHOP']) {
                            ___cache['SHOP'] = [];
                            cache___initFromDB('shop.sql');
                            socket.write(JSON.stringify({ ok: true, message: 'Data shop ' + para + ' sync success' }));
                        }
                        socket.destroy();

                        //#endregion
                        break;
                    case 22:
                        //#region [ SHOP_UPDATE_SUCCESS ]

                        if (___cache['SHOP']) {
                            ___cache['SHOP'] = [];
                            cache___initFromDB('shop.sql');
                            socket.write(JSON.stringify({ ok: true, message: 'Data shop ' + para + ' sync success' }));
                        }
                        socket.destroy();

                        //#endregion
                        break;
                    case 23:
                        //#region [ SHOP_REMOVE_SUCCESS ]

                        if (___cache['SHOP']) {
                            ___cache['SHOP'] = [];
                            cache___initFromDB('shop.sql');
                            socket.write(JSON.stringify({ ok: true, message: 'Data shop ' + para + ' sync success' }));
                        }
                        socket.destroy();

                        //#endregion
                        break;
                    case 31:
                        //#region [ GROUP_CREATE_NEW_SUCCESS ]

                        if (___cache["GROUP"]) {
                            ___cache['GROUP'] = [];
                            cache___initFromDB('group.sql');
                            socket.write(JSON.stringify({ ok: true, message: 'Data group ' + para + ' sync success' }));
                        }
                        socket.destroy();

                        //#endregion
                        break;
                    case 32:
                        //#region [ GROUP_UPDATE_SUCCESS ]

                        if (___cache["GROUP"]) {
                            ___cache['GROUP'] = [];
                            cache___initFromDB('group.sql');
                            socket.write(JSON.stringify({ ok: true, message: 'Data group ' + para + ' sync success' }));
                        }
                        socket.destroy();

                        //#endregion
                        break;
                    case 33:
                        //#region [ GROUP_REMOVE_SUCCESS ]

                        if (___cache["GROUP"]) {
                            ___cache['GROUP'] = [];
                            cache___initFromDB('group.sql');
                            socket.write(JSON.stringify({ ok: true, message: 'Data group ' + para + ' sync success' }));
                        }
                        socket.destroy();

                        //#endregion
                        break;
                    default:
                        socket.destroy();
                        break;
                }
            }
        }
    }
}).start();

// ------------------ chia don, chuyển đơn ---------------------
const ___MSG_CHIADON_TAY = [];
new _JOB('* * * * * *', function () {
    if (___MSG_CHIADON_TAY.length > 0) {
        const m = ___MSG_CHIADON_TAY.shift();
        if (m) {
            const text = m.text, socket = m.client;
            if (socket && text && text.length > 36) {
                const s = text.substr(1);

                if (s[0] == '{' && s[s.length - 1] == '}') {
                    let validJson = false;
                    let validTextCommand = false;
                    let obj;
                    try {
                        obj = JSON.parse(s);
                        if (typeof obj == 'object') validJson = true;
                    } catch (e1) {
                        validJson = false;
                    }
                    if (validJson) {
                        let k = 0, i = 0;
                        let sync_ok = false;

                        let api_name = obj.a;
                        let cache_name = api_name ? api_name.toLocaleUpperCase() : '';

                        const data = obj.d ? obj.d : [];
                        const key = obj.c;
                        const token = obj.t;

                        const master_table = obj.mt;
                        const master_id = obj.mi;
                        const col_update = obj.v;

                        switch (key) {
                            case 'DB_UPDATE':

                                for (i = 0; i < data.length; i++) {
                                    k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                                    if (k != -1) {
                                        data[i] = ___row_changed_update_cache(cache_name, data[i]);
                                        ___cache[cache_name][k] = data[i];
                                        sync_ok = true;
                                    }
                                }

                                if (master_table && master_id) {
                                    ___row_changed_update_cache(master_table, master_id);
                                }

                                break;
                        }

                        if (sync_ok) {
                            ___job_reduce(cache_name);
                            if (data && data.length > 0) ___notify_write(key, cache_name, data[0]);
                        }

                        //console.log('', cache_name, sync_ok, obj);
                    }
                }
            }
        }
    }
}).start();

// ------------------ chia don, chuyển đơn ---------------------

// ------------------ NOTIFY ---------------------
const ___MSG_NOTIFY = [];
new _JOB('* * * * * *', function () {
    if (___MSG_NOTIFY.length > 0) {
        const m = ___MSG_NOTIFY.shift();
        if (m) {
            const text = m.text, socket = m.client;
            if (socket && text && text.length > 36) {
                const s = text.substr(1);

                if (s[0] == '{' && s[s.length - 1] == '}') {
                    let validJson = false;
                    let validTextCommand = false;
                    let obj;
                    try {
                        obj = JSON.parse(s);
                        if (typeof obj == 'object') validJson = true;
                    } catch (e1) {
                        validJson = false;
                    }
                    if (validJson) {
                        let k = 0, i = 0;
                        let sync_ok = false;

                        let api_name = obj.a;
                        let cache_name = api_name ? api_name.toLocaleUpperCase() : '';

                        const data = obj.d ? obj.d : [];
                        const key = obj.c;
                        const token = obj.t;

                        const master_table = obj.mt;
                        const master_id = obj.mi;
                        const col_update = obj.v;

                        switch (key) {
                            case 'DB_INSERT':

                                for (i = 0; i < data.length; i++) {
                                    k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                                    if (k == -1) {
                                        data[i].index___ = ___cache[cache_name].length;

                                        data[i] = ___row_changed_update_cache(cache_name, data[i]);

                                        ___cache[cache_name].push(data[i]);
                                        ___index[cache_name][data[i].id] = ___cache[cache_name].length - 1;

                                        sync_ok = true;
                                    }
                                }

                                if (master_table && master_id) {
                                    ___row_changed_update_cache(master_table, master_id);
                                }

                                break;
                        }

                        if (sync_ok) {
                            ___job_reduce(cache_name);
                            if (data && data.length > 0) ___notify_write(key, cache_name, data[0]);
                        }

                        //console.log('', cache_name, sync_ok, obj);
                    }
                }
            }
        }
    }
}).start();

// ------------------ NOTIFY ---------------------

let _TCP_INDEX_COUNTER = 0;

const _TCP_SERVER = _NET.createServer(function (socket) {
    //   socket.bufferSize = Number.MAX_SAFE_INTEGER;

    socket.on('error', function (error) {
        //console.log('Error : ' + error.message);
        //Raise client distroy connection
    });

    socket.on('data', function (buf) {
        if (___CACHE_DONE == false) {
            return;
        }

        const text = buf.toString('utf8');
        //console.log(text);

        switch (buf[0]) {
            case 33:    //  key store sql = !
                //console.log('UPDATE_CACHE = ', text);
                ___MSG_DB2CACHE.push({ client: socket, text: text });
                return;
            case 36:    //  key store sql = $
                //  console.log('___MSG_CHIADON_TAY = ', text);
                ___MSG_CHIADON_TAY.push({ client: socket, text: text });
                return;
            case 37:    //  key store sql = %
                //console.log('___MSG_NOTIFY = ', text);
                ___MSG_NOTIFY.push({ client: socket, text: text });
                return;
            case 1:
            case 2:
                //TOKEN_RETURN_LOGIN_SUCCESS = 1,
                //TOKEN_VALID = 2,
                ___MSG_TOKEN.push({ client: socket, text: text });
                return;
            case 106:
            case 107:
            case 108:
                //PAWN_ONLINE_CREATE_BY_AFFILATE_SUCCESS = 106
                //PAWN_ONLINE_UPDATE_BY_AFFILATE_SUCCESS = 107
                //PAWN_ONLINE_CHECK_PHONE_AFFILATE_SUCCESS = 108
                ___MSG_AFFILATE.push({ client: socket, text: text });
                return;
            default:
                ___MSG_POS.push({ client: socket, text: text });
                break;
        }
    });
});
_TCP_SERVER.listen(___PORT_TCP_SERVER, '127.0.0.1');


//#endregion

//#region [ CACHE CONFIG ] 

let pawn_length = 0;
let _CACHE_COUNTER = 0;

const _CACHE_NAME_MAIN = 'POL_PAWN';

const ___cache = { TEST: [] }; // ___cache['CHANNEL'] = [{...},...]
const ___cache_config = {
    POL_PAWN: {
        user_created_id: 'USER',
        cus_created_id: 'POL_CUSTOMER',
        customer_id: 'POL_CUSTOMER',
        caller_shop_id: 'USER',
        caller_online_id: 'USER',
        group_id: 'GROUP'
    }
};
const ___cache_config_ids = {
    POL_PAWN: {
        ___list_support_schedule: 'POL_SUPPORT_SCHEDULE.int_pawn_online_id',
        ___list_online_process: 'POL_PROCESS.int_pol_pawn_id'
    }
};
const ___cache_cols_config = {
    POL_PAWN: {
        ids: ',id,customer_id,int_pawn_id_pos,',
        ascii: ',lng_money,int_days,int_created_date,str_channel_name,',
        utf8: ',str_asset_type_name,str_channel_name,str_city_name,str_district_name,str_description,str_trademark,',
        org: ',str_asset_type_name,'
    },
    POL_CUSTOMER: {
        ids: ',id,',
        ascii: ',str_phone,str_email,int_created_date,str_name,',
        utf8: ',str_name,str_address,',
        org: ',str_name,str_address,'
    },
    POL_CHANNEL: {
        ids: ',id,',
        ascii: ',str_name,',
        utf8: ',str_name,'
    },
    REGION: {
        ids: ',id,',
        ascii: ',str_name,',
        utf8: ',str_name,'
    },
    SHOP: {
        ids: ',id,',
        ascii: ',str_name,',
        utf8: ',str_name,'
    },
    USER: {
        ids: ',id,shop_id,group_id,',
        ascii: ',str_user_name,str_possition,str_shop_name,',
        utf8: ',str_full_name,str_shop_name,'
    },
    GROUP: {
        ids: ',id,',
        ascii: ',str_name,str_code,',
        utf8: ',str_name,str_code,'
    },
    POL_ASSET_TYPE: {
        ids: ',id,',
        ascii: ',str_name,',
        utf8: ',str_name,'
    },
    POL_PRIORITY: {
        ids: ',,',
        ascii: ',str_priority_name,',
        utf8: ',str_priority_name,'
    },
    POL_REASON_FAIL: {
        ids: ',,',
        ascii: ',str_canceled_reason,',
        utf8: ',str_canceled_reason,'
    }
};

const ___index = {};
const ___ids = {};
const ___list_online_process = {};
const ___list_support_schedule = {};

const ___row_changed_update_cache = function (cache_name, item, not_index_ids) {
    if (typeof item == 'string' || typeof item == 'number') {
        const v = _.find(___cache[cache_name], function (o) { return o.id == item });
        //console.log('$$$$$ = ', cache_name, item, v);
        item = v;
    }

    const vals = [];
    const cf = ___cache_config[cache_name];
    const hasJoin = cf ? true : false;

    let cf_cols = ___cache_cols_config[cache_name];

    const arr_ids = [], arr_ascii = [], arr_utf8 = [], arr_org = [];

    for (const col in item) {
        if (hasJoin && cf[col]) {
            const join_api_name = cf[col];
            const join_id = item[col];
            const join_col = '___' + col.substr(0, col.length - 3);
            item[join_col] = {};

            if (join_id == -1) {
                ;
            } else {
                // join 1 -> 1
                //console.log('1----', hasJoin, join_api_name, join_id, ___index[join_api_name], ___index[join_api_name][join_id]);
                const join_index = ___index[join_api_name][join_id];
                if (___cache[join_api_name][join_index]) {
                    const obj_joined = ___cache[join_api_name][join_index];
                    item[join_col] = obj_joined;



                    if (obj_joined['#ids'] && obj_joined['#ids'].length > 0) {
                        arr_ids.push(obj_joined['#ids']);
                    }

                    if (obj_joined['#ascii'] && obj_joined['#ascii'].length > 0) {
                        arr_ascii.push(obj_joined['#ascii']);
                    }

                    if (obj_joined['#utf8'] && obj_joined['#utf8'].length > 0) {
                        arr_utf8.push(obj_joined['#utf8']);
                    }

                    if (obj_joined['#org'] && obj_joined['#org'].length > 0) {
                        arr_org.push(obj_joined['#org']);
                    }
                }
            }
        }

        //if (item[col]) vals.push(item[col]);
        //if (item[col] && typeof item[col] == 'object' && item[col]['#']) {
        //    vals.push(item[col]['#']);
        //    //delete item[ci]['#'];
        //}

        if (cf_cols) {
            if (cf_cols.ids && cf_cols.ids.indexOf(',' + col + ',') != -1 && item[col] != -1) {
                arr_ids.push(item[col]);
            }

            if (cf_cols.ascii && cf_cols.ascii.indexOf(',' + col + ',') != -1 && item[col] != -1) {
                arr_ascii.push(item[col]);
            }

            if (cf_cols.utf8 && cf_cols.utf8.indexOf(',' + col + ',') != -1 && item[col] != -1) {
                arr_utf8.push(item[col]);
            }

            if (cf_cols.org && cf_cols.org.indexOf(',' + col + ',') != -1 && item[col] != -1) {
                arr_org.push(item[col]);
            }
        }

        //if (item[col] && item[col] != -1 && typeof item[col] == 'object') {
        //    if (item[col]['#ids'] && item[col]['#ids'].length > 0) {
        //        arr_ids.push(item[col]['#ids']);
        //    }
        //    if (item[col]['#ascii'] && item[col]['#ascii'].length > 0) {
        //        arr_ids.push(item[col]['#ascii']);
        //    }
        //    if (item[col]['#utf8'] && item[col]['#utf8'].length > 0) {
        //        arr_ids.push(item[col]['#utf8']);
        //    }
        //}
    }

    if (not_index_ids != true) {
        //////// join 1 -> n
        //////const cf_ids = ___cache_config_ids[cache_name];
        //////if (cf_ids) {
        //////    for (const col in cf_ids) {
        //////        item[col] = [];
        //////        const a = cf_ids[col].split('.');
        //////        //console.log('$$$$$ col = ', col, a);
        //////        if (a.length == 2) {
        //////            const join_api_name = a[0];
        //////            const join_col = a[1];
        //////            const ja = _.filter(___cache[join_api_name], function (o) { return o[join_col] == item.id; });
        //////            item[col] = ja;
        //////            //console.log('$$$$$ col = ', col, join_api_name, join_col, item.id, ja);
        //////        }
        //////    }
        //////}

        item = ___row_changed_update_cache_ids(cache_name, item);
    }

    //item['#'] = ___convert_unicode_to_ascii(vals.join(' ')) + ' ' + vals.join(' ').toLowerCase();

    //str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    //str = str.replace(/ + /g, " ");

    if (arr_ids.length > 0)
        item['#ids'] = ' ' + arr_ids.join(' ') + ' ';

    if (arr_ascii.length > 0)
        item['#ascii'] = ' ' + ___convert_unicode_to_ascii(arr_ascii.join(' ')) + ' ';

    if (arr_utf8.length > 0)
        item['#utf8'] = ' ' + arr_utf8.join(' ').toLowerCase().replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ").replace(/ + /g, " ") + ' ';

    if (arr_org.length > 0)
        item['#org'] = arr_org.join(' ');

    return item;
};
const ___row_changed_update_cache_ids = function (cache_name, item) {

    // join 1 -> n
    const cf_ids = ___cache_config_ids[cache_name];
    if (cf_ids) {
        for (const col in cf_ids) {
            item[col] = [];
            const a = cf_ids[col].split('.');
            //console.log('$$$$$ col = ', col, a);
            if (a.length == 2) {
                const join_api_name = a[0];
                const join_col = a[1];
                const ja = _.filter(___cache[join_api_name], function (o) { return o[join_col] == item.id; });
                item[col] = ja;
                //console.log('$$$$$ col = ', col, join_api_name, join_col, item.id, ja);
            }
        }
    }

    return item;
};

const ___main_CacheSetupDB_Scripts = () => {
    return {
        POL_PAWN: "SELECT " + _sql_select_top + " *,isnull( (select * from [SplitStringToTable](str_url,'&')),'') as str_campaign FROM mobile.pol_pawn order by id desc",
        POL_CUSTOMER: "SELECT " + _sql_select_top + " * FROM mobile.pol_customer order by id desc",
        //POL_CUSTOMER: "SELECT top 5000 * FROM mobile.pol_customer order by id desc",
        GROUP: "SELECT \
                    GroupID as id \
                    ,ParentID as parent_id \
                    ,Code as str_code \
                    ,[Name] as str_name \
                    ,[Status] as int_status \
            FROM [pos].[Group] where IsShop=1 or GroupID=44",
        POS_SYS_CONFIG: "SELECT \
                            0 as id \
                        ,[Code] as str_code \
                        ,[Type] as str_type \
                        ,[Value] as str_value \
                        ,[Name] as str_name \
                        ,[Status] as int_status \
                        FROM [pos].[SysConfig] \
                        where Type='PawnOnlineOption'",
        SHOP: "select \
                    shopid as id \
                    , code \
                    , [name] as str_name \
            from pos.shopdetail",
        REGION: "select \
                        [RegionID] as id \
                        ,[Name] as str_name \
                        ,isnull([ParentID],0) as int_pid \
                        , isnull((select [Name] from pos.region as b where b.[RegionID] = a.[ParentID] ),'') as str_parent_name \
                from pos.region as a where [status]=1",
        USER: "SELECT  u.UserID as id, \
                ISNULL(u.CalloutToken,'') as str_call_out_tooken, \
                u.ApproveLevel as int_approve_level, \
                ISNULL(u.UserPosition,0) as str_user_position, \
                ug.GroupID as group_id, \
                u.UserName as str_user_name, \
                        ISNULL( u.[POLStatus],0) as int_pol_status, \
                        ISNULL( [POLRegion],0) as int_pol_region, \
                g.[Name] as str_group_name, \
                u.UserFullName as str_full_name, \
                '12345' as str_pass_word, \
                        u.[UserPass] as str_pass, \
                (CASE \
                        WHEN u.ApproveLevel = 1 AND UserPosition = 4 THEN N'Nhân viên cửa hàng' \
                        WHEN u.ApproveLevel = 1 AND UserPosition = 3 THEN N'Quản lý CH' \
                        WHEN u.ApproveLevel = 2 THEN 'QLKV' END) \
                        as str_possition, \
                    (CASE \
                        WHEN ug.GroupID = 44  THEN N'1' else (select top(1) s.ShopID from pos.[GroupShop] gs  inner JOIN pos.[ShopDetail] s ON gs.ShopCode = s.Code where g.GroupID = gs.GroupID) \
                            end) as shop_id, \
                        (CASE \
                WHEN ug.GroupID = 44  THEN N'Hỗ trợ khách hàng' else  (select top(1) s.[Name] from pos.[GroupShop] gs  inner JOIN pos.[ShopDetail] s ON gs.ShopCode = s.Code where g.GroupID = gs.GroupID) \
                end) as str_shop_name, \
                        (case u.UserID when 617 then 1 else 0 end) as bit_admin_caller \
                ,isnull(u.UserEmail,'') as str_user_email \
                FROM [pos].[User]  u \
                left JOIN pos.[UserGroup] ug ON ug.UserID = u.UserID \
                left JOIN pos.[Group] g ON ug.GroupID = g.GroupID  AND g.STATUS = 1 \
            where u.Status =1",
        POL_ASSET_TYPE: "SELECT * FROM mobile.pol_asset",
        POL_AREA: "select  * from mobile.pol_area",
        POL_CHANNEL: "select * from mobile.pol_channel",
        POL_PRIORITY: "SELECT * FROM [mobile].[pol_priority]",
        POL_PROCESS: "SELECT " + _sql_select_top + " * FROM mobile.pol_online_process order by int_pol_pawn_id desc",
        POL_NOTIFY: "SELECT * FROM mobile.pol_notify order by int_date,int_time desc",
        POL_NOTIFY_STATE: "SELECT * FROM mobile.pol_notify_state order by int_date,int_time desc",
        POL_REASON_FAIL: "SELECT  * FROM mobile.pol_reason_fail",
        POL_STEP: "select * from mobile.pol_step",
        POL_SUPPORT_SCHEDULE: "SELECT  * FROM mobile.pol_support_schedule",
        POL_SYS_EMAIL: "SELECT * FROM [mobile].[sys_email]",
        POL_SYS_SMS: "SELECT * FROM [mobile].[sys_sms]"
    };
};

//#endregion

//#region [ CACHE FROM DB ]

const ___main_Start = () => {
    ___log('\nMAIN: Start ...');
    ___thread_initOnMain();
};

const ___main_CacheReady = () => {
    ___log('\nMAIN: Cache ready ...');
    ___main_Start();
};

const cache___initFromDB = async (file_sql_to_cache) => {
    const key_name = file_sql_to_cache.substr(0, file_sql_to_cache.length - 4).toUpperCase();
    return ___main_CacheSetupDB(key_name);
};

const ___main_CacheSetupDB = async (key_name) => {
    let scripts = ___main_CacheSetupDB_Scripts();

    if (key_name != null) {
        const sql = scripts[key_name];
        scripts = {};
        scripts[key_name] = sql;
    }

    _CACHE_TOTAL = Object.keys(scripts).length;

    const _POOL_AMAZON = new _SQL.ConnectionPool(_DB_CACHE_POS_AMAZON);
    const _POOL_AMAZON_CONNECT = _POOL_AMAZON.connect();

    const _POOL_123 = new _SQL.ConnectionPool(_DB_CACHE_123);
    const _POOL_123_CONNECT = _POOL_123.connect();

    // ensures that the pool has been created
    await _POOL_AMAZON_CONNECT;
    await _POOL_123_CONNECT;

    let type = '', text_sql = '', request;
    for (let cache_name in scripts) {

        if (___cache[cache_name] == null) ___cache[cache_name] = [];
        if (___ids[cache_name] == null) ___ids[cache_name] = [];
        if (___index[cache_name] == null) ___index[cache_name] = {};

        type = 'AMZ';
        if (cache_name.startsWith('POL_')) type = '123';

        text_sql = scripts[cache_name].trim();

        switch (type) {
            case 'AMZ':
                request = _POOL_AMAZON.request();
                break;
            case '123':
                request = _POOL_123.request();
                break;
        }

        request.stream = true;
        request.query(text_sql);

        request.on('recordset', columns => { });

        request.on('row', row => {
            //___log(cache_name + ': ', row);
            const ix___ = ___cache[cache_name].length;
            row.ix___ = ix___;

            if (cache_name != _CACHE_NAME_MAIN)
                row = ___row_changed_update_cache(cache_name, row);

            if (cache_name == 'USER') {
                row.user_id = row.id;
                row.ref_id = row.id;
                row.scope_ids = 'pol';
            }

            ___cache[cache_name].push(row);

            ___index[cache_name][row.id] = ix___;

            //___ids[cache_name].push(Number(row.id));

            switch (cache_name) {
                case 'POL_SUPPORT_SCHEDULE':
                    if (row.int_pawn_online_id) {
                        if (___list_support_schedule[row.int_pawn_online_id] == null)
                            ___list_support_schedule[row.int_pawn_online_id] = [ix___];
                        else
                            ___list_support_schedule[row.int_pawn_online_id].push(ix___);
                    }
                    break;
                case 'POL_PROCESS':
                    if (row.int_pol_pawn_id) {
                        if (___list_online_process[row.int_pol_pawn_id] == null)
                            ___list_online_process[row.int_pol_pawn_id] = [ix___];
                        else
                            ___list_online_process[row.int_pol_pawn_id].push(ix___);
                    }
                    break;
            }
        });

        request.on('error', err => {
            ___log('ERROR = ' + cache_name, err.toString());
        });

        request.on('done', result => {
            ___log('--- CACHE_' + type + ': ' + cache_name + ' \t\t\t\t\t\t= ' + result.rowsAffected[0]);

            _CACHE_COUNTER++;
            if (_CACHE_COUNTER == _CACHE_TOTAL) ___main_CacheReady();
        });
    }
};

const ___main_Setup = () => {
    ___main_CacheSetupDB();
};

const ___main_cache_IndexsDone = () => {
    ___CACHE_DONE = true;

    ___log('\nCACHE INDEXS DONE ...');

    ___log('\n' + new Date().toLocaleString() + '\n');
};

//#endregion

___main_Setup();

//#region [ API ]

require('dotenv').config({ path: 'variables.env' });

const _HTTP_EXPRESS = require('express');
const _HTTP_WEB_PUSH = require('web-push');
const _HTTP_BODY_PARSER = require('body-parser');
const _HTTP_CORS = require('cors');
const _HTTP_APP = _HTTP_EXPRESS();

const _HTTP_SERVER = require('http').createServer(_HTTP_APP);
const _IO = require('socket.io')(_HTTP_SERVER);




_HTTP_APP.use(_HTTP_CORS());
_HTTP_APP.use(_HTTP_BODY_PARSER.json());
_HTTP_APP.use((error, req, res, next) => {
    if (___CACHE_DONE == false) {
        return res.json({ ok: false, mesage: 'Api is caching ...' });
    }
    if (error !== null) {
        return res.json({ ok: false, mesage: 'Invalid json ' + error.toString() });
    }
    return next();
});

_HTTP_APP.use(_HTTP_EXPRESS.static(_PATH.join(__dirname, 'www')));

_HTTP_WEB_PUSH.setVapidDetails('mailto:test@example.com', process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);

const ___response_ok = (request, arr_items, total_items, page_number, page_size) => {
    if (page_number == null) page_number = 1;
    if (page_size == null) page_size = ___page_size;
    if (arr_items == null) arr_items = [];
    if (request == null) request = {};

    const count_result = arr_items.length;
    let page_total = parseInt((count_result / page_size).toString().split('.')[0]);
    if (count_result % page_size > 0) page_total++;

    var it, min = (page_number - 1) * page_size, max = page_number * page_size;
    if (max > arr_items.length) max = arr_items.length;

    const rs = [];
    if (arr_items.length > 0) {
        for (var k = min; k < max; k++) {
            it = arr_items[k];
            it.index___ = k + 1;
            rs.push(it);
        }
    }

    return {
        ok: true,
        request: request,
        total_items: total_items,
        count_result: count_result,
        page_total: page_total,
        page_number: page_number,
        page_size: page_size,
        result_items: rs
    };
};
const ___response_fail = (request, message) => { return { ok: false, request: request, message: message }; };

//--------------------------------------------------------------------------
const ___notify_user = {};

const ___notify_send = function (user_id, str_message) {

    if (___notify_user[user_id])
        ___notify_user[user_id].write('data: ' + str_message + '\n\n');

    if (___users_socketio[user_id])
        //  ___users_socketio[user_id].emit('messages', str_message);
        ___users_socketio[user_id].emit('broadcast', str_message);
};

const ___notify_write = function (db_action, cache_name, o) {
    if (db_action && cache_name && o && o.id) {
        const id = o.id;
        let user_id;
        let u;
        let a = [];

        switch (cache_name) {
            case 'POL_PAWN':
                //console.log(db_action + ' = ' + o.id);

                switch (db_action) {
                    case 'DB_INSERT':
                        user_id = _USER_ID_ADMIN_CALL;
                        ___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ALL', data: o }));

                        if (___notify_user[user_id])
                            ___notify_user[user_id].write('data: ' + + '\n\n');

                        user_id = o.caller_online_id;
                        ___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ALL', data: o }));

                        user_id = o.caller_shop_id;
                        ___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ALL', data: o }));

                        if (o.group_id != 44) {
                            u = _.find('USER', function (x) { return x.group_id == o.group_id && x.int_approve_level == 1 && x.str_user_position == '3'; });
                            if (u) {
                                user_id = u.id;
                                ___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ALL', data: o }));
                            }
                        }

                        break;
                    default: // DB_UPDATE,DB_UPDATE_V, ...
                        //user_id = _USER_ID_ADMIN_CALL;
                        //___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ID', id: id, data: o }));

                        //user_id = o.caller_online_id;
                        //___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ID', id: id, data: o }));

                        //user_id = o.caller_shop_id;
                        //___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ID', id: id, data: o }));

                        //if (o.group_id != 44) {
                        //    u = _.find('USER', function (x) { return x.group_id == o.group_id && x.int_approve_level == 1 && x.str_user_position == '3'; });
                        //    if (u) {
                        //        user_id = u.id;
                        //        ___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ID', id: id, data: o }));
                        //    }
                        //}

                        //for (const user_id in ___users_socketio) {
                        //    ___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ID', id: id, data: o }));
                        //}

                        _IO.emit('broadcast', JSON.stringify({ command: 'PAWN_RELOAD_ID', id: id, data: o }));

                        break;
                }
                break;
            case 'POL_NOTIFY':
                //console.log(o);

                //_IO.emit('broadcast', JSON.stringify({ command: 'NOTIFY_RELOAD_ALL', id: id, data: o })); 

                if (o.user_ids && o.user_ids.length > 0) {
                    a = _.filter(o.user_ids.split(','), function (x) { return x.trim().length > 0 && isNaN(Number(x)) == false; });
                    //console.log(o.message, a);
                    if (a.length > 0) {
                        for (var i = 0; i < a.length; i++) {
                            user_id = a[i];
                            ___notify_send(user_id, JSON.stringify({ command: 'NOTIFY_RELOAD_ALL', data: o }));
                        }
                    }
                }

                break;
        }
    }
};

_HTTP_APP.get('/get-test', function (req, res) {
    res.json({ ok: true });
});


_HTTP_APP.get('/j1/config', function (req, res) {
    res.json(J1_CONFIG);
});

_HTTP_APP.post('/j1/config/:id/:token', function (req, res) {
    const data = req.body; // [3,3] or [3,10]
    const id = req.params.id;
    const token = req.params.token;

    if (token == ___TOKEN_API) {
        J1_CONFIG[id] = data;

        res.json({ ok: true, config: J1_CONFIG });
    } else {
        res.json({ ok: false, config: J1_CONFIG });
    }
});


_HTTP_APP.get('/get-notify/:user_id', function (req, res) {
    const user_id = req.params.user_id;
    if (user_id.length > 0) {
        //console.log(user_id);
        res.writeHead(200, {
            'Connection': 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache'
        });
        ___notify_user[user_id] = res;
        return;
    }
    res.json({ ok: true });
    //setInterval(function (r_) {
    //    r_.write('data: {"msg":"' + ___guid() + '"}\n\n');
    //}, 1000, res);
});

//--------------------------------------------------------------------------
let _HTTP_APP_API_SEARCH_DROPDOWN_FUNC_CONDITIONS = function () { return true; };
_HTTP_APP.post('/api/dropdown/search/:token/:api_name', (req, res) => {
    const data = req.body;
    const key = req.params.api_name.toUpperCase();

    if (___cache[key] && data && data.conditons) {
        eval('_HTTP_APP_API_SEARCH_DROPDOWN_FUNC_CONDITIONS = ' + data.conditons);
        const a = _.filter(___cache[key], _HTTP_APP_API_SEARCH_DROPDOWN_FUNC_CONDITIONS);
        res.json(a);
        return;
    }

    res.json([]);
});

//--------------------------------------------------------------------------
// LOCAL

_HTTP_APP.get('/api/valid/token/:token', (req, res) => {
    var v = [];
    const token = req.params.token;
    const api_name = 'USER';
    const key = token.substr(0, 36);
    if (___tokens[key]) {
        const user_id = ___tokens[key];
        let user = ___user_build_profile_token(user_id, token);
        res.json(user);

        return;
    }

    return res.json({ ok: false });
});

// Từ token lấy về profile của user
_HTTP_APP.get('/local/user/profile/:token', (req, res) => {
    var v = [];
    const token = req.params.token;
    const api_name = 'USER';

    const key = token.substr(0, 36);

    if (___tokens[key]) {
        const user_id = ___tokens[key];

        //console.log(user_id, u);

        if (u) {
            res.json(u);
            return;
        }
    }

    return res.json({ ok: false });
});

_HTTP_APP.get('/local/user/token/:id', (req, res) => {
    var v = [];
    const id = Number(req.params.id);
    const api_name = 'USER';

    if (___cache[api_name] && id >= -99999) {
        v = _.filter(___cache[api_name], function (o) { return o.id == id; });
        if (v.length > 0) {
            const user = v[0];
            const str_token = user___get_token(user.user_id, user.str_user_name, user.scope_ids);
            return res.status(200).send(str_token);
        }
    }

    return res.status(200).send('');
});

_HTTP_APP.get('/local/:api_name/:id', (req, res) => {
    var v = [];
    const id = Number(req.params.id);
    const api_name = req.params.api_name.toUpperCase();

    if (___cache[api_name] && id >= -99999) {
        v = _.filter(___cache[api_name], function (o) { return o.id == id; });
        if (v.length > 0) res.json(v[0]);
    }

    res.json({ id: id });
});

//--------------------------------------------------------------------------

function ___pos_dashboard_date_time(yyyyMMdd, HHmmss) {
    if (yyyyMMdd == -1 || HHmmss == -1 || yyyyMMdd == '-1' || HHmmss == '-1' || yyyyMMdd == null || HHmmss == null) return null;
    return "\/Date(" + yyyyMMdd + HHmmss + ")\/";
}
function ___pos_dashboard_date_time___get_created(yyyyMMdd, HHmmss) {
    //"GetCreated": "20/11/2019 14:38",
    if (yyyyMMdd == -1 || HHmmss == -1 || yyyyMMdd == '-1' || HHmmss == '-1' || yyyyMMdd == null || HHmmss == null) return null;
    return "20/11/2019 14:38";
}

_HTTP_APP.get('/api/pos-dashboard/:shop_id/:group_id/:user_id/:token', (req, res) => {
    const shop_id = Number(req.params.shop_id);
    const group_id = Number(req.params.group_id);
    const user_id = Number(req.params.user_id);
    const begin = Number(req.params.begin);
    const end = Number(req.params.end);
    const token = req.params.token;
    let a = [], items = [], status_text = '';

    //begin=1,
    //end=10,

    //if (!isNaN(begin) && !isNaN(end) && !isNaN(shop_id) && !isNaN(group_id) && !isNaN(user_id) && !isNaN(user_id)) {
    if (true) {
        const u = _.find(___cache['USER'], function (o) { return o.id == user_id; });
        if (u) {
            //const g = _.find(___cache['GROUP'], function (o) { return o.id == group_id; });

            //const is_call_online = u.bit_admin_caller == 1;
            //const is_call_online_employer = u.group_id == 44 && u.bit_admin_caller != 1;
            const is_shop_admin = u.int_approve_level == 1 && u.str_user_position == '3';
            const is_shop_employer = u.int_approve_level == 1 && u.str_user_position == '4';

            a = _.filter(___cache['POL_PAWN'], function (o, index) { return index < 10; });
            //if (is_shop_admin)
            //    a = _.find(___cache['POL_PAWN'], function (o) { return o.group_id == group_id });
            //else if (is_shop_employer)
            //    a = _.find(___cache['POL_PAWN'], function (o) { return o.group_id == group_id && o.caller_shop_id == user_id });


            if (a.length > 0) {
                items = _.map(a, function (o, index) {

                    if (o.int_status == 0) status_text = 'Hủy đăng ký';
                    else if (o.int_status == 1) status_text = 'Chưa tư vấn';
                    else if (o.int_status == 2) status_text = 'Đang chăm sóc';
                    else if (o.int_status == 4) status_text = 'Nhận cầm cố';

                    return {
                        "PawnOnlineID": o.id,
                        "Asset": o.str_asset_type_name,
                        "Trademark": o.str_asset_type_name,
                        "ProductionYear": o.str_product_year,
                        "Description": o.str_description,
                        "Money": o.lng_money,
                        "Days": o.int_days,
                        "Interest": null,
                        "TotalInterest": null,
                        "TotalMoney": null,
                        "Created": ___pos_dashboard_date_time(o.int_created_date, o.int_created_time),
                        "Status": o.int_status,
                        "CustomerID": o.customer_id,
                        "Comment1": null,
                        "Comment2": null,
                        "Comment3": null,
                        "Comment4": null,
                        "ShopID": null,
                        "Note": null,
                        "ReserveTime": null,
                        "PawnID": null,
                        "RejectComment": null,
                        "ToShopDate": null,
                        "Author": null,
                        "CallerId": user_id,
                        "Source": o.str_channel_name,
                        "CurrentGroupID": group_id,
                        "SteepedGroupID": o.str_group_ids_reveiced,
                        "Priority": o.int_priority_id,
                        "UrgentLevel": null,
                        "LastTrans": ___pos_dashboard_date_time(o.int_created_date, o.int_created_time),
                        "Url": "https://camoto30phut.f88.vn",
                        "PaperType": null,
                        "ReferenceId": null,
                        "ReferenceType": o.int_reference_type,
                        "ReCallTime": null,
                        "OrderPriority": o.int_priority_id,
                        "FirstCall": ___pos_dashboard_date_time(o.int_created_date, o.int_created_time),
                        "CurrentGroupState": 0,
                        "AutoCanceled": null,
                        "AutoCanceledAt": null,
                        "Queued": null,
                        "RegisterDate": ___pos_dashboard_date_time(o.int_created_date, o.int_created_time),
                        "CarInBank": null,
                        "Province": null,
                        "County": null,
                        "RegionID": null,
                        "NoContactedAt": null,
                        "ShopCallerId": 0,
                        "TickDate": null,
                        "Duration": null,
                        "Is2Step": null,
                        "TransToShopTime": ___pos_dashboard_date_time(o.int_created_date, o.int_created_time),
                        "FirstShopActionTime": null,
                        "TotalChoXuLy": 0,
                        "TotalDaDangKy": 0,
                        "TotalDaXuLy": 0,
                        "TotalDaChuyenThanhHopDong": 0,
                        "Month": 0,
                        "ShopName": null,
                        "GetCreated": ___pos_dashboard_date_time___get_created(o.int_created_date, o.int_created_time),
                        "GetRecallTime": "",
                        "Background": "red",
                        "CreatePawn": false,
                        "GetReserveTime": "",
                        "Total": a.length,
                        "STT": (index + 1),
                        "CustomerMobile": (o.___customer) ? o.___customer.str_phone : "",
                        "CustomerName": (o.___customer) ? o.___customer.str_name : "",
                        "CustomerAddress": (o.___customer) ? o.___customer.str_address : "",
                        "AuthorFullName": null,
                        "PawnCodeNo": null,
                        "ProductFullName": "  ",
                        "StatusText": status_text,
                        "Contracts": null,
                        "PawnDate": null,
                        "GetPawnDate": "",
                        "PawnMoney": null,
                        "LstProcess": null,
                        "CurrentGroupName": u.str_group_name,
                        "CanceledReason": null,
                        "CanceledContent": null,
                        "Contents": null,
                        "FirstProcShop": null,
                        "CanceledTimeShop": null,
                        "PawnCreated": null,
                        "ten_vv": null,
                        "PawnAssetName": null,
                        "TranShopName": null,
                        "SupportScheduleTime": null,
                        "Region": null,
                        "Campaign": null
                    };
                });
            }
        }
    }

    res.json(items);
});

_HTTP_APP.get('/api/notify/:user_id', (req, res) => {
    const user_id = Number(req.params.user_id);
    let a = [];

    if (!isNaN(user_id)) {
        a = _.filter(___cache['POL_NOTIFY'], function (o) {
            return o.int_status == 0 && o.user_ids != null && o.user_ids.length > 0 && o.user_ids.indexOf(',' + user_id + ',') != -1;
        });
        a = _.sortBy(a, 'id');
        a.reverse();
        if (a.length > 1000) {
            a = _.filter(a, function (o, index) { return index < 1000; });
        }
    }

    res.json(a);
});

_HTTP_APP.get('/api/notify/limit/:user_id/:id_max', (req, res) => {
    const user_id = Number(req.params.user_id);
    const id_max = Number(req.params.id_max);
    let a = [];

    if (!isNaN(user_id) && !isNaN(id_max)) {
        a = _.filter(___cache['POL_NOTIFY'], function (o) {
            return o.int_status == 0 && o.id > id_max && o.user_ids != null && o.user_ids.length > 0 && o.user_ids.indexOf(',' + user_id + ',') != -1;
        });
        a = _.sortBy(a, 'id');
        a.reverse();
        if (a.length > 1000) {
            a = _.filter(a, function (o, index) { return index < 1000; });
        }
    }

    res.json(a);
});

_HTTP_APP.post('/api/notify/update/:user_id/:id_max/:token', async (req, res) => {
    const token = req.params.token;
    const user_id = Number(req.params.user_id);
    const id_max = Number(req.params.id_max);

    if (!isNaN(user_id) && !isNaN(id_max) && token == ___TOKEN_API) {

        db___execute_callback(res, null, 'mobile.pol_notify_biz_update_status', { max_id: id_max, user_id: user_id, int_status: 1 },
            function (res_, m_) {
                var a = _.filter(___cache['POL_NOTIFY'], function (o) {
                    return o.int_status == 0 && o.id <= id_max && o.user_ids != null && o.user_ids.length > 0 && o.user_ids.indexOf(',' + user_id + ',') != -1;
                });
                if (a.length > 0) {
                    a.forEach(ai => ai.int_status = 1);
                }
                res_.json(m_);
            },
            function (res_, m_) {
                res_.json(m_);
            }
        );
    }
});

_HTTP_APP.get('/api/test/csv', (req, res) => {
    res.csv([
        ["a", "b", "c"]
        , ["d", "e", "f"]
    ]);
});

_HTTP_APP.get('/api/test/:api_name/:id', (req, res) => {
    let v = [];
    //let id = Number(req.params.id);
    let api_name = req.params.api_name.toUpperCase();
    if (___cache[api_name]) {
        v = _.filter(___cache[api_name], function (o) { return o.id == req.params.id; });
        if (v.length == 0) v.push({ id: req.params.id });
    }

    res.json(v[0]);
});

//--------------------------------------------------------------------------
_HTTP_APP.post('/subscribe', (req, res) => {
    const subscription = req.body;
    //console.log('WEB_PUSH: subscribe == ', subscription);
    _SUBSCRIBES_CLIENTS.push(subscription);
    res.status(201).json({ ok: true, total_clients: _SUBSCRIBES_CLIENTS.length });

    setInterval(function (_subscription) {
        const payload = JSON.stringify({ title: new Date() });
        _HTTP_WEB_PUSH.sendNotification(_subscription, payload).catch(error => console.error(error));
        //console.log('WEB_PUSH: -> NOTIFY: ' + payload);
    }, 5000, subscription);
});
//--------------------------------------------------------------------------
_HTTP_APP.get('/api/index', (req, res) => { ___response_write(req, res, ___index); });
//--------------------------------------------------------------------------

const _SYS_SCOPE = {
    'test': [{ str_code: 'test', str_title: 'Test' }],
    'vtp': [{ str_code: 'vtp-pawn', str_title: 'DS hợp đồng VTP' }, { str_code: 'vtp-pawn-invited', str_title: 'DS đơn giới thiệu VTP' }],
    'pol': [{ str_code: 'pawn-online', str_title: 'Quản lý đơn online' }],
    'afsg': [{ str_code: 'affiliate-finance-sg', str_title: 'DS đơn giới thiệu của tài chính Sài Gòn' }],
    'ketoan': [{ str_code: 'affiliate-accountant', str_title: 'DS đơn đối soát kế toán' }]
};

//const _SYS_USER = [
//    { user_id: 1, ref_id: 1, scope_ids: '*', str_username: 'admin', str_password: '12345', str_fullname: 'Administrator' },
//    { user_id: 1, ref_id: 1, scope_ids: 'test', str_username: 'test', str_password: '12345', str_fullname: 'Test' },
//    { user_id: 2, ref_id: 1, scope_ids: 'ketoan', str_username: 'ketoan', str_password: '12345', str_fullname: 'Kế toán' },
//    { user_id: 4, ref_id: 1, scope_ids: 'afsg', str_username: 'afsg', str_password: '12345', str_fullname: 'Tài chính Sài Gòn' },
//    { user_id: 4, ref_id: 1, scope_ids: 'vtp', str_username: 'vtp', str_password: '12345', str_fullname: 'Viettel-Post' },
//    { user_id: 5, ref_id: 1, scope_ids: 'pol', str_username: 'pol', str_password: '12345', str_fullname: 'PawnOnline DRS' }
//];

function user___get_token(user_id, str_user_name, scope_ids) {
    var token = JSON.stringify({ user_id: user_id, time: new Date().toString(), str_username: str_user_name, scope_ids: scope_ids });
    var encode_url = encodeURIComponent(token);

    //return btoa(encode_url);
    //If you need to convert to Base64 you could do so using Buffer:
    //console.log(Buffer.from('Hello World!').toString('base64'));
    //Reverse(assuming the content you're decoding is a utf8 string):
    //console.log(Buffer.from(b64Encoded, 'base64').toString());

    return Buffer.from(encode_url).toString('base64');
}

function user___decode_token(token) {
    //let token = 'c3RhY2thYnVzZS5jb20=';
    let buff = new Buffer(token, 'base64');
    let text = buff.toString('utf8');
    return text;
}

//--------------------------------------------------------------------------

_HTTP_APP.get('/api/report/:report_name/:token', (req, res) => {
    const report_name = req.params.report_name.toUpperCase();
    const token = req.params.token.toLowerCase();
    let arr = [], a = [], temp;
    if (token == ___TOKEN_API) {
        switch (report_name) {
            case 'REPORT_PAWN_BY_YEAR_GROUP_BY_STATUS':
                const year = Number('' + (req.query != null && req.query.year != null ? req.query.year : (new Date()).getFullYear()) + '1231');
                if (isNaN(year)) {
                    res.json({ ok: false, inputs: { report: report_name }, message: 'QueryString ?year=NUMBER ' });
                } else {

                    const type = req.query != null && req.query.type != null ? req.query.type : '';
                    const user_id = req.query != null && req.query.user_id != null ? Number(req.query.user_id) : -1;
                    const group_id = req.query != null && req.query.type != null ? Number(req.query.group_id) : -1;

                    switch (type) {
                        case 'CALL_ADMIN':
                            a = _.filter(___cache['POL_PAWN'], function (o) {
                                return o.int_created_date >= 10000000 && o.int_created_date <= year && o.group_id == group_id;
                            });
                            break;
                        case 'CALL_EMPLOYER':
                            a = _.filter(___cache['POL_PAWN'], function (o) {
                                return o.int_created_date >= 10000000 && o.int_created_date <= year && o.caller_online_id == user_id;
                            });
                            break;
                        case 'SHOP_ADMIN':
                            a = _.filter(___cache['POL_PAWN'], function (o) {
                                return o.int_created_date >= 10000000 && o.int_created_date <= year && o.group_id == group_id;
                            });
                            break;
                        case 'SHOP_EMPLOYER':
                            a = _.filter(___cache['POL_PAWN'], function (o) {
                                return o.int_created_date >= 10000000 && o.int_created_date <= year && o.caller_shop_id == user_id;
                            });
                            break;
                    }

                    const groups_ = _.groupBy(a, function (o) { return o.int_status; });
                    arr = _.map(groups_, function (vals_, key_) {
                        temp = _.map(vals_, function (o2) { return o2.int_created_date.toString().substr(4, 2); });
                        const groups2_ = _.groupBy(temp, function (o) { return o; });
                        return {
                            counter: vals_.length, int_status: Number(key_), months: (_.map(groups2_, function (vals2_, key2_) {
                                let it2 = {};
                                it2[key2_] = vals2_.length;
                                return it2;
                            }))
                        };
                    });

                    res.json({ ok: true, inputs: { report: report_name, year: year }, data: { size: arr.length, results: arr } });
                }
                break;
            case 'REPORT_PAWN_EXPORT_CSV_BY_FROM_DATE_TO_DATE': //
                const date_from = Number(req.query != null && req.query.date_from != null ? req.query.date_from : '0');
                const date_to = Number(req.query != null && req.query.date_to != null ? req.query.date_to : '0');
                if (isNaN(date_from) || isNaN(date_to)) {
                    res.json({ ok: false, inputs: { report: report_name, date_from: date_from, date_to: date_to }, message: 'QueryString ? date_from = yyyyMMdd & date_to = yyyyMMdd ' });
                } else {
                    if (date_from > date_to) {
                        res.json({ ok: false, inputs: { report: report_name, date_from: date_from, date_to: date_to }, message: 'Error date_from must be > date_to' });
                    } else {

                        arr = _.filter(___cache['POL_PAWN'], function (o) {
                            return o.int_created_date >= date_from && o.int_created_date <= date_to && o.group_id != 53;
                        });

                        res.json({ ok: true, inputs: { report: report_name, date_from: date_from, date_to: date_to }, data: { size: arr.length, results: arr } });
                    }
                }
                break;
            default:
                res.json({ ok: false, inputs: { report: report_name } });
                break;
        }
        return;
    }

    res.json({ ok: false });
});

//--------------------------------------------------------------------------

const ___pos_check_phone = (req, res) => {
    //const data = req.body;
    let token = req.header('token');
    if ((token == null || token.length == 0) && req.query) token = req.query.token;

    const phone = req.params.phone;
    const date = Number(req.params.date);
    const api_name = 'POL_PAWN';

    let a = [];

    if (token == 'c384b7b1-ce52-4b47-ba22-260f1a9882fa' && phone.length > 0 && date > 0) {
        a = _.filter(___cache[api_name], function (o) {
            return o.___customer && o.___customer.str_phone == phone
                && o.int_created_date && o.int_created_date >= date;
        });
    }

    res.json(a);
};

_HTTP_APP.get('/api/pos_check_phone/:date/:phone', ___pos_check_phone);
_HTTP_APP.post('/api/pos_check_phone/:date/:phone', ___pos_check_phone);

//--------------------------------------------------------------------------
///NamLe
_HTTP_APP.get('/job/POL_PAWN/EXCEL_STATUS_YEAR_REMAIN/:from_date/:to_date/:csv', (req, res) => {
    var rs = {};
    var from_date = req.params.from_date;
    var to_date = req.params.to_date;

    //for (var i = 0; i < ___jobs_result.POL_PAWN.EXCEL_STATUS_YEAR_REMAIN.data_excel.length(); i++) {

    //} SET @fromDate = Getdate()     SET @toDate = @fromDate   

    var dt = new Date();

    if (from_date == '' || from_date == null) {
        from_date = dt.getDate();
        to_date = from_date;
    }
    if (to_date == '' || to_date == null) {
        to_date = from_date;
    }
    //console.log(from_date, to_date);

    //console.log(' console.log(___data_excel1);====', ___jobs_result.POL_PAWN.EXCEL_STATUS_YEAR_REMAIN.data_excel);
    //
    var ___data_excel1 = ___jobs_result.POL_PAWN.EXCEL_STATUS_YEAR_REMAIN.data_excel.filter(d => d.int_created_date >= from_date);
    // console.log(' console.log(___data_excel1);====',___data_excel1);
    var ___data_excel2 = ___data_excel1.filter(d => d.int_created_date < to_date);
    //  console.log(' console.log(___data_excel1);====', ___data_excel2);
    //for (var i = 0; i < ___data_excel2.length; i++) {
    //    ___data_excel2[i].int_created_date = ___data_excel2[i].int_created_date.toString().substr(6, 2) + '/' + ___data_excel2[i].int_created_date.toString().substr(4, 2) + '/' + ___data_excel2[i].int_created_date.toString().substr(0, 4);

    //}

    ////20191127 - Fix utf8 + Header - Start
    //const utf8 = require('utf-8');
    //NamLe
    //var header = {
    //    str_phone: 'Lê Hoài Nam',
    //    str_full_name: 'HEADER',
    //    str_address: 'HEADER',
    //    str_city_name: 'HEADER',
    //    str_district_name: 'HEADER',
    //    ma_don: 'HEADER',
    //    str_url: 'HEADER',
    //    str_channel_name: 'HEADER',
    //    str_codeno_pos: 'HEADER',
    //    int_create_date_pos: 'HEADER',
    //    int_create_date_time_pos: 'HEADER',
    //    str_asset_type_name: 'HEADER',
    //    str_trademark: 'HEADER',
    //    int_loan_money_pos: 'HEADER',
    //    int_created_date: 'HEADER',
    //    int_created_date_time: 'HEADER',
    //    kpi_created: 'HEADER',
    //    kpi_created_time: 'HEADER',
    //    int_first_call: 'HEADER',
    //    int_first_call_date: 'HEADER',
    //    int_status: 'HEADER',
    //    int_from_date_pos: 'HEADER',
    //    int_create_date_pos1: 'HEADER',
    //    author_full_name: 'HEADER',
    //    str_group_name: 'HEADER',
    //    first_proc_shop: 'HEADER',
    //    first_proc_shop_date: 'HEADER',
    //    canceled_time_shop: 'HEADER',
    //    canceled_time_shop_date: 'HEADER',
    //    canceled_reason: 'HEADER',
    //    canceled_content: 'HEADER',
    //    bit_car_in_bank: 'HEADER',
    //    duration: 'HEADER'
    //};
    //___data_excel2.unshift(header);
    ////20191127 - Fix utf8 + Header - End

    //console.log(' console.log(___data_excel2);====',___data_excel2);
    var ___da_ta = [];
    //chỗ này a nhé  longdd
    for (var m = 0; m < ___data_excel2.length - 1000; m++) {
        ___da_ta[m] = ___data_excel2[m];
    }

    // res.csv(___data_excel2, 'charset=utf-8');
    ___response_write(req, res, ___da_ta);
});


//_HTTP_APP.get('/job/:api_name/:job_name/:key/:id/csv', (req, res) => {
//    var rs = [];
//    rs = ___jobs_result.POL_PAWN.EXCEL_STATUS_YEAR_REMAIN;
//    console.log('excel===', rs);
//    ___response_write(req, res,rs);
//});

//_HTTP_APP.get('/job/:api_name/:job_name/:key/:id/csv', (req, res) => {
//    var data123 = [{ name: "jo2e", id: 2 }, { name: "jo1e", id: 3 }, { name: "jo3e", id: 1 }, { name: "j1e", id: 3 }];
//    console.log('dsadsadsad====', ___jobs_result.POL_PAWN.EXCEL_STATUS_YEAR_REMAIN.data_excel);
//    // ___response_write(req, res, ___jobs_result.POL_PAWN.EXCEL_STATUS_YEAR_REMAIN);
//    res.csv(___jobs_result.POL_PAWN.EXCEL_STATUS_YEAR_REMAIN.data_excel);
//});
//_HTTP_APP.get('/job/:api_name/:job_name/:key/:id/csv', function (req, res){
//    const api_name = req.params.api_name.toUpperCase();
//    const job_name = req.params.job_name.toUpperCase();
//    const key = req.params.key.toUpperCase();
//    const id = req.params.id.toUpperCase();
//    res.csv([
//        ["a", "b", "c"]
//        , ["d", "e", "f"]
//    ]);
//});

_HTTP_APP.get('/job/:api_name/:job_name/:key/:id', (req, res) => {
    var rs = {};
    const api_name = req.params.api_name.toUpperCase();
    const job_name = req.params.job_name.toUpperCase();
    const key = req.params.key.toUpperCase();
    const id = req.params.id.toUpperCase();

    //___response_write(req, res,___jobs_result.POL_PAWN);

    // console.log(api_name, job_name, key, id);

    setTimeout(function () {

        if (key == 'ALL' && id == 'ALL') {
            if (___jobs_result[api_name]
                && ___jobs_result[api_name][job_name]
                && ___jobs_result[api_name][job_name]) {
                rs = ___jobs_result[api_name][job_name];
            }
            ___response_write(req, res, rs);
            return;
        }

        if (key.length > 0 && id == 'ALL') {
            if (___jobs_result[api_name]
                && ___jobs_result[api_name][job_name]
                && ___jobs_result[api_name][job_name][key]) {
                rs = ___jobs_result[api_name][job_name][key];
            }
            ___response_write(req, res, rs);
            return;
        }

        if (key.length > 0 && id.length > 0) {
            if (___jobs_result[api_name] && ___jobs_result[api_name][job_name]
                && ___jobs_result[api_name][job_name][key] && ___jobs_result[api_name][job_name][key][id]) {
                rs = ___jobs_result[api_name][job_name][key][id];
            }
            ___response_write(req, res, rs);
            return;
        }
        ___response_write(req, res, rs);

    }, 300);

});

_HTTP_APP.get('/api/sys_scope', (req, res) => { ___response_write(req, res, _SYS_USER); });
//_HTTP_APP.get('/api/sys_user', (req, res) => { ___response_write(req, res,_SYS_USER); });
_HTTP_APP.post('/api/login', (req, res) => {
    const data = req.body;

    if (data.str_user_name == null || data.str_pass_word == null) {
        ___response_write(req, res, { ok: false, message: 'Data format must be: {"str_user_name":"...", "str_pass_word":"..."}' });
        return;
    }

    const user_ = _.find(___cache['USER'], function (o) { return o.str_user_name == data.str_user_name && o.str_pass_word == data.str_pass_word; });
    if (user_) {

        setTimeout(function (u_) { ___sync_user_login_success(u_); }, 1, user_);


        let user = ___user_build_profile_token(user_.user_id);
        const key = user.str_token.substr(0, 36);
        ___tokens[key] = user.user_id;


        ___response_write(req, res, user);
    } else {
        ___response_write(req, res, { ok: false, message: 'Đăng nhập không thành công' });
    }
});

//--------------------------------------------------------------------------

let _HTTP_APP_API_SEARCH_FUNC_CONDITIONS = function () { };

_HTTP_APP.post('/api/:api_name/search', (req, res) => {
    const data = req.body;
    const api_name = req.params.api_name;
    if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
        let a = [];
        for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

        ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
        return;
    }

    var page_number = data.page_number;
    var page_size = data.page_size;

    if (page_number == null) page_number = 1;
    if (page_size == null) page_size = ___page_size;

    eval('_HTTP_APP_API_SEARCH_FUNC_CONDITIONS = ' + data.conditons);
    const key = api_name.toLocaleUpperCase();
    var a = _.filter(___cache[key], _HTTP_APP_API_SEARCH_FUNC_CONDITIONS);

    data.___url = _URL.parse(req.url).pathname;
    data.___api = key;
    //console.log('POST_SEARCH: ', key, JSON.stringify(data), ' -> ', a.length);

    if (api_name.toLocaleUpperCase() == 'POL_PAWN') {
        a = _.sortBy(a, 'id');
        a.reverse();

    }

    const m = ___response_ok(data, a, ___cache[key].length, page_number, page_size);
    ___response_write(req, res, m);
});

_HTTP_APP.post('/api/:api_name/add_new', (req, res) => {
    const data = req.body;
    const api_name = req.params.api_name;
    if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
        let a = [];
        for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

        ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
        return;
    }

    //push cache
    const cache_name = api_name.toLocaleUpperCase();
    const it = ___row_changed_update_cache(cache_name, data);
    ___cache[cache_name].push(it);
    if (it.id) ___index[cache_name][it.id] = ___cache[cache_name].length - 1;

    ___response_write(req, res, { ok: true });
});

_HTTP_APP.post('/api/:api_name/update', (req, res) => {
    const data = req.body;
    const api_name = req.params.api_name;

    if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
        let a = [];
        for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

        ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
        return;
    }

    let item = _.find(___cache[api_name.toLocaleUpperCase()], function (o) { return o.id == data.id; });
    if (item == null) {
        ___response_write(req, res, { ok: false, message: 'Cannot find item has id = ' + data.id });
        return;
    }

    for (const col in data) item[col] = data[col];

    // push cache
    const cache_name = api_name.toLocaleUpperCase();
    item = ___row_changed_update_cache(cache_name, item);

    ___response_write(req, res, { ok: true });
});

_HTTP_APP.post('/api/:api_name/remove/:id', (req, res) => {
    const api_name = req.params.api_name;
    if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
        let a = [];
        for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

        ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
        return;
    }

    const id = Number(req.params.id);
    if (id == null) {
        ___response_write(req, res, { ok: false, message: 'Cannot find item has id = ' + id });
        return;
    }

    const index = _.findIndex(___cache[api_name.toLocaleUpperCase()], function (o) { return o.id == id; });
    if (index == -1) {
        ___response_write(req, res, { ok: false, message: 'Cannot find item has id = ' + id });
        return;
    }

    ___cache[api_name.toLocaleUpperCase()].splice(index, 1);

    ___response_write(req, res, { ok: true });
});

const _POOL_DB_API_UPDATE = new _SQL.ConnectionPool(_DB_CACHE_123);
const _POOL_DB_API_UPDATE_CONNECTED = _POOL_DB_API_UPDATE.connect();

const api___biz_update_database_htmlEncode = function (html) {
    //if (html && html.length > 0) html = html.split('<').join('&#x3C;').split('>').join('&#x3E;');
    return html;
};


const ___TOKEN_API = 'eb976d531188435ea006fce8769c53d5';
_HTTP_APP.post('/biz/:connect_string/:api_name/:store_action/:token', async (req, res) => {
    const data = req.body;
    const connect_string = req.params.connect_string.toLowerCase();
    const api_name = req.params.api_name.toUpperCase();
    const store_action = req.params.store_action;
    const token = req.params.token.toLowerCase();

    if (connect_string.length == 0
        || api_name.length == 0
        || store_action.length == 0
        || token.length == 0) {
        ___response_write(req, res, { ok: false, message: 'Uri of APIs must be: api/biz/:connect_string/:api_name/:store_action/:token ' });
        return;
    }

    if (___TOKEN_API != token) {
        ___response_write(req, res, { ok: false, message: 'TOKEN invalid: ' + token });
        return;
    }

    if (connect_string != 'amz' && connect_string != '123') {
        ___response_write(req, res, { ok: false, message: 'CONNECT_STRING invalid, they are (amz|123)' });
        return;
    }

    if (___cache[api_name] == null) {
        let a = [];
        for (let key in ___cache) a.push(key);
        ___response_write(req, res, { ok: false, message: 'API_NAME invalid, they are (' + a.join('|') + ')' });
        return;
    }

    const store = ('mobile.' + api_name + '_' + store_action).toLowerCase();
    //console.log(store, data);

    db___execute_callback(res, null, store, data,
        function (r_, m_) {
            //___response_write(req, r_, m_);
            if (data.___exe_callback && typeof ___exe_callback[data.___exe_callback] == 'function') {
                setTimeout(function () { ___exe_callback[data.___exe_callback](data, m_); }, 1);
            }
            r_.json(m_);
        },
        function (r_, m_) {
            //___response_write(req, r_, m_);
            r_.json(m_);
        }
    );
});

//--------------------------------------------------------------------------

_HTTP_APP.get('/api/:api_name/all', (req, res) => {
    const api_name = req.params.api_name;
    if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
        let a = [];
        for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

        ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
        return;
    }

    const key = api_name.toLocaleUpperCase();

    let total_items = ___cache[key].length;

    const page_number = 1;
    const page_size = Number.MAX_SAFE_INTEGER;
    const m = ___response_ok(null, ___cache[key], total_items, page_number, page_size);
    ___response_write(req, res, m);
});

_HTTP_APP.get('/api/:api_name/:page_number/:page_size', (req, res) => {
    const api_name = req.params.api_name;

    let page_number = Number(req.params.page_number);
    let page_size = Number(req.params.page_size);
    if (page_number == null) page_number = 1;
    if (page_size == null) page_size = ___page_size;

    if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
        let a = [];
        for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

        ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
        return;
    }
    const key = api_name.toLocaleUpperCase();

    let total_items = ___cache[key].length;
    var a = [], it, min = (page_number - 1) * page_size, max = page_number * page_size;

    //if (max >= total_items) max = total_items - 1;

    if (max >= total_items) max = total_items;

    if (total_items > 0) {
        //////var cols_join = [];
        //////for (let co in ___cache[key][0]) if (co[0] == '_') cols_join.push(co);
        //////console.log(1, cols_join);

        for (var k = min; k < max; k++) {
            it = ___cache[key][k];
            it.index___ = k + 1;

            //////cols_join.forEach(function (col) {
            //////    it = ___join_index_update(it, key, col);
            //////});

            a.push(it);
        }
    }

    const m = ___response_ok(null, a, total_items, page_number, page_size);
    ___response_write(req, res, m);
});

_HTTP_APP.get('/api/fulltextsearch/:api_name/:page_number/:page_size/:keyword', (req, res) => {
    const api_name = req.params.api_name;
    const keyword = req.params.keyword;

    if (keyword == null || keyword.length == 0) {
        ___response_write(req, res, ___response_fail(req, '/api/fulltextsearch/:api_name/:page_number/:page_size/:keyword must be keyword not empty'));
        return;
    }

    let page_number = Number(req.params.page_number);
    let page_size = Number(req.params.page_size);
    if (page_number == null) page_number = 1;
    if (page_size == null) page_size = ___page_size;

    if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
        let a = [];
        for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

        ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
        return;
    }

    const key = api_name.toLocaleUpperCase();

    //console.log('FULL_TEXT_SEARCH: ', key, keyword);

    let total_items = ___cache[key].length;

    const a = [];

    if (total_items > 0) {
        let it, cols_name = [], val;
        for (let col in ___cache[key][0]) cols_name.push(col);

        for (let k = 0; k < total_items; k++) {
            it = ___cache[key][k];

            if (it['#'] && it['#'].indexOf(keyword) != -1) {
                a.push(it);
                continue;
            }
        }
    }

    const m = ___response_ok(null, a, total_items, page_number, page_size);
    ___response_write(req, res, m);
});

_HTTP_APP.get('/api/groupby/:api_name/:group_col/:page_number/:page_size', (req, res) => {
    const api_name = req.params.api_name;
    const group_col = req.params.group_col;

    if (group_col == null || group_col.length == 0) {
        ___response_write(req, res, ___response_fail(req, '/api/groupby/:api_name/:group_col/:page_number/:page_size must be group_col not empty'));
        return;
    }

    let page_number = Number(req.params.page_number);
    let page_size = Number(req.params.page_size);
    if (page_number == null) page_number = 1;
    if (page_size == null) page_size = ___page_size;

    if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
        let a = [];
        for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

        ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
        return;
    }

    const key = api_name.toLocaleUpperCase();

    //console.log('GROUP_BY: ', key, group_col);

    let total_items = ___cache[key].length;

    let a = [];
    if (total_items > 0) {
        const ag1 = _.groupBy(___cache[key], function (o) { return o[group_col]; });
        //console.log('1111=', JSON.stringify(ag1));
        a = _.map(ag1, function (vals, name) { return { key: name, item: vals[0], counter: vals.length }; });
        //console.log('22222222=', JSON.stringify(a));
    }

    const m = ___response_ok(null, a, total_items, page_number, page_size);
    ___response_write(req, res, m);
});

//--------------------------------------------------------------------------

_HTTP_APP.get('/users/state', function (req, res) { res.json(___users_online); });

_HTTP_SERVER.listen(___PORT_API);

const ___users_online = {};
const ___users_socketio = {};

_IO.on('connection', client => {
    if (___CACHE_DONE == false) return;

    //const c = client.handshake.headers.cookie;
    //let uid = '';
    //if (c && c.indexOf('user_id=') != -1) {
    //    const pos = c.indexOf('user_id=') + 8;
    //    uid = c.substr(pos, c.length - pos).split(';')[0].trim();
    //}
    //console.log(uid);

    let user_id;

    //old 

    //client.on('push', data => {
    //    console.log('11111111111111', data);

    //    if (user_id == null) ___users_socketio[data] = client;

    //    //console.log('IO.MSG: ', data);
    //    user_id = data;

    //    if (___users_online[user_id] == null || ___users_online[user_id] == 0) {
    //        ___users_online[user_id] = 1;

    //        db___execute_callback(null, null, 'mobile.user_biz_update_user', {
    //            user_id: user_id,
    //            int_type: 1,
    //            int_pol_status: 1,
    //            int_pol_region: 0,
    //            int_user_create: user_id
    //        }, function (m_) {
    //            //console.log('OK=', m_);
    //        }, function (m_) {
    //            //console.log('FAIL=', m_);
    //        });
    //    }
    //});

    // new _fix bug f5 load lại trạng thái user

    client.on('push', data => {
        if (___CACHE_DONE == false) return;

        if (user_id == null) ___users_socketio[data.id] = client;
        user_id = data.id;

        if (___users_online[user_id] == null || ___users_online[user_id] == 0) {
            ___users_online[user_id] = 1;

            db___execute_callback(null, null, 'mobile.user_biz_update_user', {
                user_id: user_id,
                int_type: 1,
                int_pol_status: data.status,
                int_pol_region: 0,
                int_user_create: user_id
            }, function (m_) {
            }, function (m_) {
            });
        }
    });

    client.on('disconnect', (data) => {
        if (___CACHE_DONE == false) return;

        if (user_id != null && ___users_online[user_id] != null) {
            //console.log('IO.CLOSE: ...11111111111111111111111111111111111', user_id, data);

            ___users_online[user_id] = 0;

            db___execute_callback(null, null, 'mobile.user_biz_update_user', {
                user_id: user_id,
                int_type: 1,
                int_pol_status: 0,
                int_pol_region: 0,
                int_user_create: user_id
            }, function (m_) {
                //console.log('OK=', m_);
            }, function (m_) {
                //console.log('FAIL=', m_);
            });

        }
        if (___users_socketio[user_id]) ___users_socketio[user_id] == null;
    });
});

//#endregion

//#region [ JOB J1: SHARED PAWNS FOR CALLER ONLINE ]

// start chia don
let J1_EXECUTING = false;
let J1_COUNTER_RESET = 5;//Khoảng thời gian ngắt sau mỗi lần chia đơn
let J1_COUNTER = 0;
var J1_SIZE = 0;
let J1_TIME_CHECK = '0 */1 * * * *'; // 1 minu

let J1_CONFIG = {
    '1': [3, 3],
    '2': [3, 10],
    '3': [3, 10],
    '4': [3, 3]
};

new _JOB(J1_TIME_CHECK, function () {
    if (!___CACHE_DONE) return;
    if (J1_EXECUTING) return;
    //------------------------------------------------------------------------------------

    const d_ = new Date(), m_ = d_.getMinutes(), h_ = d_.getHours();
    var now = parseInt(d_.getHours() + (m_ < 10 ? '0' : '') + m_ + '00');
    if (now >= 83000 && now < 103000)//lấy 120 đơn để chia
    {
        J1_SIZE = 3;
        J1_COUNTER_RESET = 3; //3 minus

        J1_SIZE = J1_CONFIG['1'][0];
        J1_COUNTER_RESET = J1_CONFIG['1'][1];

        //J1_SIZE = 15;
        //J1_COUNTER_RESET = 1; //3 minus
    } else if (now >= 103000 && now < 120000)//lấy 180 đơn để chia
    {
        J1_SIZE = 3;
        J1_COUNTER_RESET = 10; //10 minus

        J1_SIZE = J1_CONFIG['2'][0];
        J1_COUNTER_RESET = J1_CONFIG['2'][1];

        //J1_SIZE = 15;
        //J1_COUNTER_RESET = 1; //3 minus
    } else if (now >= 133000 && now < 173000)//lấy 480 đơn để chia
    {
        J1_SIZE = 3;
        J1_COUNTER_RESET = 10; //10 minus 

        J1_SIZE = J1_CONFIG['3'][0];
        J1_COUNTER_RESET = J1_CONFIG['3'][1];

        //J1_SIZE = 15;
        //J1_COUNTER_RESET = 1; //3 minus
    } else if (now >= 173000 && now < 193000)//lấy 80 đơn để chia
    {
        J1_SIZE = 3;
        J1_COUNTER_RESET = 3; //3 minus 

        J1_SIZE = J1_CONFIG['4'][0];
        J1_COUNTER_RESET = J1_CONFIG['4'][1];

        //J1_SIZE = 15;
        //J1_COUNTER_RESET = 1; //3 minus
    }

    if (J1_COUNTER == 0) {
        //------------------------------------------------------------------------------------

        J1_EXECUTING = true;

        const call_chiadon = 696;  // id tai khoan call_chiadon

        let rs = [], _users = [], _pawns = [];
        const lsg = _.groupBy(___cache['USER'], function (o) { return o.id; });
        const grs = _.map(lsg, function (vals_) { return vals_[0]; });
        // _users = _.filter(grs, function (o) { return o.group_id == 44 && o.int_pol_status == 1; }); //Get all users of group call online and online on site
        _users = _.filter(grs, function (o) { return o.group_id == 44 && o.int_pol_status == 1 && (o.id != 617 && o.id != call_chiadon); }); //danh sach call user bo tk chintn va call_chiadon
        // _pawns = _.filter(___cache['POL_PAWN'], function (o) { return o.group_id == 44 && o.int_queued != -1; }); //Get all pawns do not share for call online and shops

        if (_users.length > 0) {   // neu co nhan vien online
            _pawns = _.filter(___cache['POL_PAWN'], function (o) { return o.group_id == 44 && (o.int_queued != -1 || (o.caller_online_id == call_chiadon && (o.int_status != 0 && o.int_status != 4))); });
            //lấy các đơn chưa chia tại call o.int_queued != -1 hoặc các đơn dc chia cho tk call_chiadon và trạng thái khác 0: huy,4:nhận cầm cố

            if (_pawns.length > 0) {

                let us_sort = [], us = [], ps = [], k = 0, p1 = [], p2 = [], min = 0, max = 0;

                const _users_bac = _.filter(_users, function (o) { return o.int_pol_region == 0 || o.int_pol_region == -1; });
                // hiện tại để mặc định user tất cả(-1 sẽ ở cả miền bắc)
                const _users_nam = _.filter(_users, function (o) { return o.int_pol_region == 1; });
                const _users_other = _.filter(_users, function (o) { return o.int_pol_region != 0 && o.int_pol_region != 1; });

                // Lấy về các đơn đã chia cho call và đang chờ tư vấn
                const _sort_pawns_users = _.filter(___cache['POL_PAWN'],
                    function (o) { return o.int_queued == -1 && o.caller_online_id > 0 && o.int_status == 1; });
                const _group_pawns_users = _.groupBy(_sort_pawns_users, function (o) { return o.caller_online_id; });


                let _group_users = _.map(_group_pawns_users,
                    function (vals_, key_name) { return { user_id: Number(key_name), counter: vals_.length }; });
                _group_users = _.sortBy(_group_users, function (o) { return o.counter; });

                const _pawns_bac = _.filter(_pawns, function (o) { return o.area_id == 0; });
                const _pawns_nam = _.filter(_pawns, function (o) { return o.area_id == 1; });
                const _pawns_other = _.filter(_pawns, function (o) { return o.area_id != 0 && o.area_id != 1; });

                let _scope = '';

                //--------------------------------------------------------------------------------

                _scope = 'BAC';
                us = _users_bac;

                if (us.length > 0) { // nếu có user online thì chia cho user

                    // nếu có user thì load cả all đơn bao gồm đơn dc chia cho call_chiadon và đơn mới
                    if (_pawns_bac.length > 0 && _pawns_bac.length > J1_SIZE) {
                        ps = _.filter(_pawns_bac, function (o, ix) { return ix >= 0 && ix < J1_SIZE; });
                    } else {
                        ps = _pawns_bac;
                    }

                    if (ps.length > 0) {
                        //---------------------------------------------
                        //clone + sort
                        us_sort = JSON.parse(JSON.stringify(us));
                        us_sort.forEach(u1 => {
                            const u3 = _.find(_group_users, function (u2) { return u2.user_id == u1.id; });
                            if (u3) u1.counter = u3.counter;
                            else u1.counter = 0;
                        });
                        us_sort = _.sortBy(us_sort, function (o) { return o.counter; });
                        us = us_sort;

                        //--------------------------------------------

                        for (i = 0; i < ps.length; i++) {

                            us_sort = _.sortBy(us_sort, function (o) { return o.counter; });
                            us = us_sort;
                            rs.push({ u: us[0].id, p: ps[i].id });
                            us[0].counter += 1;
                        }
                    }
                }
                else { // không có user online thì chia hết cho tài khoản call_chiadon

                    // chỉ lấy các đơn chưa dc chia (tranh tình trạng chia lại cho call_chiadon)
                    if (_pawns_bac.length > 0 && _pawns_bac.length > J1_SIZE) {
                        ps = _.filter(_pawns_bac, function (o, ix) { return ix >= 0 && ix < J1_SIZE && o.int_queued != -1; });
                    } else {
                        ps = _.filter(_pawns_bac, function (o) { return o.int_queued != -1; });
                    }

                    if (ps.length > 0) {
                        for (i = 0; i < ps.length; i++) {
                            rs.push({ u: call_chiadon, p: ps[i].id });
                        }
                    }
                }

                //--------------------------------------------------------------------------------

                _scope = 'NAM';
                us = _users_nam;

                if (us.length > 0) { // nếu có user online thì chia cho user

                    // nếu có user thì load cả all đơn bao gồm đơn dc chia cho call_chiadon và đơn mới
                    if (_pawns_nam.length > 0 && _pawns_nam.length > J1_SIZE) {
                        ps = _.filter(_pawns_nam, function (o, ix) { return ix >= 0 && ix < J1_SIZE; });
                    } else {
                        ps = _pawns_nam;
                    }

                    if (ps.length > 0) {
                        //---------------------------------------------
                        //clone + sort
                        us_sort = JSON.parse(JSON.stringify(us));
                        us_sort.forEach(u1 => {
                            const u3 = _.find(_group_users, function (u2) { return u2.user_id == u1.id; });
                            if (u3) u1.counter = u3.counter;
                            else u1.counter = 0;
                        });
                        us_sort = _.sortBy(us_sort, function (o) { return o.counter; });
                        us = us_sort;

                        //--------------------------------------------

                        for (i = 0; i < ps.length; i++) {

                            us_sort = _.sortBy(us_sort, function (o) { return o.counter; });
                            us = us_sort;
                            rs.push({ u: us[0].id, p: ps[i].id });
                            us[0].counter += 1;
                        }
                    }
                }
                else { // không có user online thì chia hết cho tài khoản call_chiadon

                    // chỉ lấy các đơn chưa dc chia (tranh tình trạng chia lại cho call_chiadon)
                    if (_pawns_nam.length > 0 && _pawns_nam.length > J1_SIZE) {
                        ps = _.filter(_pawns_nam, function (o, ix) { return ix >= 0 && ix < J1_SIZE && o.int_queued != -1; });
                    } else {
                        ps = _.filter(_pawns_nam, function (o) { return o.int_queued != -1; });
                    }

                    if (ps.length > 0) {
                        for (i = 0; i < ps.length; i++) {
                            rs.push({ u: call_chiadon, p: ps[i].id });
                        }
                    }
                }

                //--------------------------------------------------------------------------------

                _scope = 'OTHER';
                us = _users_other;

                if (us.length > 0) { // nếu có user online thì chia cho user

                    // nếu có user thì load cả all đơn bao gồm đơn dc chia cho call_chiadon và đơn mới
                    if (_pawns_other.length > 0 && _pawns_other.length > J1_SIZE) {
                        ps = _.filter(_pawns_other, function (o, ix) { return ix >= 0 && ix < J1_SIZE; });
                    } else {
                        ps = _pawns_other;
                    }

                    if (ps.length > 0) {
                        //---------------------------------------------
                        //clone + sort
                        us_sort = JSON.parse(JSON.stringify(us));
                        us_sort.forEach(u1 => {
                            const u3 = _.find(_group_users, function (u2) { return u2.user_id == u1.id; });
                            if (u3) u1.counter = u3.counter;
                            else u1.counter = 0;
                        });
                        us_sort = _.sortBy(us_sort, function (o) { return o.counter; });
                        us = us_sort;

                        //--------------------------------------------

                        for (i = 0; i < ps.length; i++) {

                            us_sort = _.sortBy(us_sort, function (o) { return o.counter; });
                            us = us_sort;
                            rs.push({ u: us[0].id, p: ps[i].id });
                            us[0].counter += 1;
                        }
                    }
                }
                else { // không có user online thì chia hết cho tài khoản call_chiadon

                    // chỉ lấy các đơn chưa dc chia (tranh tình trạng chia lại cho call_chiadon)
                    if (_pawns_other.length > 0 && _pawns_other.length > J1_SIZE) {
                        ps = _.filter(_pawns_other, function (o, ix) { return ix >= 0 && ix < J1_SIZE && o.int_queued != -1; });
                    } else {
                        ps = _.filter(_pawns_other, function (o) { return o.int_queued != -1; });
                    }

                    if (ps.length > 0) {
                        for (i = 0; i < ps.length; i++) {
                            rs.push({ u: call_chiadon, p: ps[i].id });
                        }
                    }
                }

                //--------------------------------------------------------------------------------

            } //end shared
        }
        else {   // khong co nhan vien online thi chia cho tk call_chiadon

            _pawns = _.filter(___cache['POL_PAWN'], function (o) { return o.group_id == 44 && o.int_queued != -1; }); //Get all pawns do not share for call online and shops
            if (_pawns.length > 0) {
                //--------------------------------------------------------------------------------

                //#region [ chia don call_online moi ]

                let ps = [];

                let pawn_sort = [];
                J1_SIZE = J1_SIZE * 3;  // 3 mien
                pawn_sort = _.sortBy(_pawns, function (o) { return o.int_created_date && o.int_created_time; });
                if (pawn_sort.length > 0 && pawn_sort.length > J1_SIZE) {
                    ps = _.filter(pawn_sort, function (o, ix) { return ix >= 0 && ix < J1_SIZE; });
                }
                else {
                    ps = pawn_sort;
                }
                if (ps.length > 0) {
                    for (i = 0; i < ps.length; i++) {
                        rs.push({ u: call_chiadon, p: ps[i].id });
                    }
                }
                //#endregion

                //--------------------------------------------------------------------------------

                //#region [ chia don call_online cu ]

                //let us_sort = [], us = [], ps = [], k = 0, p1 = [], p2 = [], min = 0, max = 0;

                //const _pawns_bac = _.filter(_pawns, function (o) { return o.int_queued != -1 && o.area_id == 0; });
                //const _pawns_nam = _.filter(_pawns, function (o) { return o.int_queued != -1 && o.area_id == 1; });
                //const _pawns_other = _.filter(_pawns, function (o) { return o.int_queued != -1 && o.area_id != 0 && o.area_id != 1; });

                //let _scope = '';


                //--------------------------------------------------------------------------------
                //_scope = 'BAC';

                //if (_pawns_bac.length > 0 && _pawns_bac.length > J1_SIZE) {
                //    ps = _.filter(_pawns_bac, function (o, ix) { return ix >= 0 && ix < J1_SIZE; });
                //} else {
                //    ps = _pawns_bac;
                //}

                //if (ps.length > 0) {
                //    for (i = 0; i < ps.length; i++) {
                //        rs.push({ u: call_chiadon, p: ps[i].id });
                //    }
                //}
                //--------------------------------------------------------------------------------

                //_scope = 'NAM';

                //if (_pawns_nam.length > 0 && _pawns_nam.length > J1_SIZE) {
                //    ps = _.filter(_pawns_nam, function (o, ix) { return ix >= 0 && ix < J1_SIZE; });
                //} else {
                //    ps = _pawns_nam;
                //}

                //if (ps.length > 0) {
                //    for (i = 0; i < ps.length; i++) {
                //        rs.push({ u: call_chiadon, p: ps[i].id });
                //    }
                //}

                //--------------------------------------------------------------------------------

                //_scope = 'OTHER';
                //if (_pawns_other.length > 0 && _pawns_other.length > J1_SIZE) {
                //    ps = _.filter(_pawns_other, function (o, ix) { return ix >= 0 && ix < J1_SIZE; });
                //} else {
                //    ps = _pawns_other;
                //}

                //if (ps.length > 0) {
                //    for (i = 0; i < ps.length; i++) {
                //        rs.push({ u: call_chiadon, p: ps[i].id });
                //    }
                //}

                //#endregion

                //--------------------------------------------------------------------------------

            } //end shared
        }

        if (rs.length > 0) {
            db___execute_callback(null, null, 'mobile.pol_pawn_biz_job_SET_PAWNS_FOR_CALLER_ONLINE', { ups: JSON.stringify(rs) },
                function (r_, m_) {
                    J1_EXECUTING = false;
                    rs = [];

                    //console.log('11111111111', r_);
                    //console.log('2222222222', m_);
                },
                function (r_, m_) {
                    J1_EXECUTING = false;
                    rs = [];
                }
            );
        } else {
            J1_EXECUTING = false;
            J1_COUNTER = J1_COUNTER_RESET;
        }
    }

    if (J1_COUNTER >= J1_COUNTER_RESET) J1_COUNTER = 0;
    else J1_COUNTER++;
}).start();
// end chia don

// start send sms ------------------------------------------------------
let TIME_JOB_SMS = '0 */5 * * * *'; // 1 minu
var SIZE_SEND = 10;
let SMS_EXECUTING = false;
let SMS_COUNTER_RESET = 5;//Khoảng thời gian ngắt sau mỗi lần gửi
let SMS_COUNTER = 0;

//TIME_JOB_SMS = '* * * * * *';

new _JOB(TIME_JOB_SMS, function () {
    if (!___CACHE_DONE) return;
    if (SMS_EXECUTING) return;
    const { execFile } = require('child_process');

    if (SMS_COUNTER == 0) {

        SMS_EXECUTING = true;
        //console.log('gogogogog');

        let _sys_sms = [], _sys_sms_sort = [], lst = [];
        _sys_sms = _.filter(___cache['POL_SYS_SMS'], function (o) { return o.int_status == 0; });  // lấy các tin chưa gửi 

        if (_sys_sms && _sys_sms.length > 0) {
            _sys_sms_sort = _.sortBy(_sys_sms, function (o) { return o.id; });
            _sys_sms_sort = _sys_sms_sort.reverse();

            lst = _.filter(_sys_sms_sort, function (o, ix) { return ix >= 0 && ix < SIZE_SEND; });  // gửi 10 tin nhăn 1 lần

            for (i = 0; i < lst.length; i++) {

                let _phone = lst[i].str_phones;
                let _message = lst[i].str_message;
                let _id = lst[i].id;

                //db___execute_callback(null, null, 'mobile.pol_sys_sms_update_send', { id: _id, int_status: 1 },
                //    function (r_, m_) {
                //        if (m_.ok) {
                //            const child = execFile('SendSMS.exe', [_phone, _message, _id], (error, stdout, stderr) => {
                //                if (error) {
                //                    throw error;
                //                }
                //                SMS_EXECUTING = false;
                //            });
                //        }
                //    },
                //    function (r_, m_) {
                //        SMS_EXECUTING = false;
                //        console.log('error send sms', r_);
                //    }
                //);
            }
        }
    }

    if (SMS_COUNTER >= SMS_COUNTER_RESET) SMS_COUNTER = 0;
    else SMS_COUNTER++;
}).start();
// end send sms


// start send email ------------------------------------------------------
let TIME_JOB_EMAIL = '0 */5 * * * *'; // 1 minu
var SIZE_SEND_EMAIL = 10;
let EMAIL_EXECUTING = false;
let EMAIL_COUNTER_RESET = 5;//Khoảng thời gian ngắt sau mỗi lần gửi
let EMAIL_COUNTER = 0;

//TIME_JOB_EMAIL = '* * * * * *'; 

new _JOB(TIME_JOB_EMAIL, function () {
    if (!___CACHE_DONE) return;
    if (EMAIL_EXECUTING) return;
    const { execFile } = require('child_process');

    if (EMAIL_COUNTER == 0) {

        EMAIL_EXECUTING = true;
        // console.log('gogogogog EMAIL');

        let _sys_email = [], _sys_email_sort = [], lst = [];
        _sys_email = _.filter(___cache['POL_SYS_EMAIL'], function (o) { return o.int_status == 0; });  // lấy các tin chưa gửi 

        if (_sys_email && _sys_email.length > 0) {
            _sys_email_sort = _.sortBy(_sys_email, function (o) { return o.id; });
            _sys_email_sort = _sys_email_sort.reverse();

            lst = _.filter(_sys_email_sort, function (o, ix) { return ix >= 0 && ix < SIZE_SEND_EMAIL; });  // gửi 10 tin nhăn 1 lần

            for (i = 0; i < lst.length; i++) {

                let _email = lst[i].str_emails;
                let _message = lst[i].str_message;
                let _id = lst[i].id;
                let _id_pawn = lst[i].ref_ids;

                //db___execute_callback(null, null, 'mobile.POL_SYS_EMAIL_UPDATE_SEND', { id: _id, int_status: 1 },
                //    function (r_, m_) {
                //        if (m_.ok) {
                //            const child = execFile('SendEmail.exe', [_email, _message, _id, _id_pawn], (error, stdout, stderr) => {
                //                if (error) {
                //                    throw error;
                //                }
                //                EMAIL_EXECUTING = false;
                //            });
                //        }
                //    },
                //    function (r_, m_) {
                //        EMAIL_EXECUTING = false;
                //        console.log('error send emaillllll', r_);
                //    }
                //);
            }
        }
    }

    if (EMAIL_COUNTER >= EMAIL_COUNTER_RESET) EMAIL_COUNTER = 0;
    else EMAIL_COUNTER++;
}).start();
// end send email

//#endregion

//#region [ THREAD ]

const _threads = [];
let _thread_blob_size = require('os').cpus().length;
let _thread_record_total = 0;
let _thread_page_total = 0;

let _threads_queues = [];
let _threads_counter = 0;
let _threads_max = 0;

const ___thread_cacheIndexs_CompleteAll = () => {
    ___log('-> CACHE INDEXS OK ...');
    ___CACHE_DONE = true;
    console.log('\n' + new Date().toLocaleString() + '\n');
};

const ___thread_initOnMain = () => {

    ___log('\nIndexing ...');

    _thread_record_total = ___cache[_CACHE_NAME_MAIN].length;
    _thread_page_total = Number((_thread_record_total / _thread_page_size).toString().split('.')[0]);
    if (_thread_record_total % _thread_page_size != 0) _thread_page_total++;

    _thread_blob_total = Number((_thread_page_total / _thread_blob_size).toString().split('.')[0]);
    if (_thread_page_total % _thread_blob_size != 0) _thread_blob_total++;

    ___log('\n-> blob_total = ' + _thread_blob_total + '; blob_size = ' + _thread_blob_size + '; page_total = ' + _thread_page_total + '; page_size = ' + _thread_page_size);

    let min = 0, max = 0;
    for (let b = 0; b < _thread_blob_total; b++) {
        for (let p = _thread_blob_size * b; p < _thread_blob_size * (b + 1); p++) {
            min = _thread_page_size * p;
            max = _thread_page_size * (p + 1);
            if (max > _thread_record_total) max = _thread_record_total;

            if (p >= _thread_page_total) break;
            //___log('\nB_' + b + '_P_' + p+ ': start = ' + min + '; end = ' + max);
            _threads_queues.push({ blob_index: b, page_index: p, min: min, max: max });
        }
    }

    //___log(_threads_queues);
    ___thread_start();
};

const ___thread_start = () => {
    if (_threads_queues.length > 0) {
        _threads_counter = 0;

        const a = _.filter(_threads_queues, function (x, i_) { return i_ < _thread_blob_size; });
        _threads_queues = _.filter(_threads_queues, function (x, i_) { return i_ >= _thread_blob_size; });
        _threads_max = a.length;

        a.forEach((it_) => {
            //___log(it_);

            const worker = new Worker('./index.js', { workerData: it_ });
            worker.on('message', (message) => { ___thread_onMessage_cacheObject(message); });
            const cacheChannel = new MessageChannel();
            worker.postMessage({ cache_port: cacheChannel.port1 }, [cacheChannel.port1]);
            cacheChannel.port2.on('message', (m_) => { ___thread_cacheRequest(m_); });
            _threads.push({ worker: worker, cache_channel: cacheChannel });
        });
    } else {
        ___thread_cacheIndexs_CompleteAll();
    }
};

const ___thread_onMessage_cacheObject = (p) => {
    if (Number.isInteger(p.___customer)) p.___customer = ___cache['POL_CUSTOMER'][p.___customer];
    if (Number.isInteger(p.___caller_shop)) p.___caller_shop = ___cache['USER'][p.___caller_shop];
    if (Number.isInteger(p.___caller_online)) p.___caller_online = ___cache['USER'][p.___caller_online];
    if (Number.isInteger(p.___group)) p.___group = ___cache['GROUP'][p.___group];

    //p.___list_support_schedule = _.filter(___cache['POL_SUPPORT_SCHEDULE'], function (x) { return x.int_pawn_online_id == p.id; });
    //p.___list_online_process = _.filter(___cache['POL_PROCESS'], function (x) { return x.int_pol_pawn_id == p.id; });

    p.___list_support_schedule = _.map(___list_support_schedule[p.id], function (x) { return ___cache['POL_SUPPORT_SCHEDULE'][x]; });
    p.___list_online_process = _.map(___list_online_process[p.id], function (x) { return ___cache['POL_PROCESS'][x]; });

    ___cache[_CACHE_NAME_MAIN][p.ix___] = p;

    //if (___list_online_process[p.id] && ___list_online_process[p.id].length > 0) ___log(p.id);
};

const ___thread_cacheRequest = (m) => {
    if (m && m.command) {
        m.ok = false;
        const t = _threads[m.page_index];
        if (t) {
            let indexs = m.indexs, datas = [], a = [];
            switch (m.command) {
                case 'M1_GET_PAWN_BY_MIN_MAX':
                    const min = m.min;
                    const max = m.max;
                    a = _.filter(___cache[_CACHE_NAME_MAIN], function (o, index_) { return index_ >= min && index_ < max; });
                    //___log('\nM1_' + m.page_index + ': min = ' + min + '; max = ' + max + '; pawns = ' + a.length);
                    m.data = a;
                    m.ok = true;
                    t.worker.postMessage(m);
                    break;
                case 'M2_GET_INDEX11_DATA':
                    //___log('M2: ' + JSON.stringify(indexs));
                    for (const col in indexs) {
                        const cache_name = indexs[col][0];
                        const ids = indexs[col][1];
                        a = _.map(ids, function (id_) {
                            if (id_ == -1) return null;
                            let it = ___cache[cache_name][___index[cache_name][id_]];
                            if (it) return it;
                            it = _.find(___cache[cache_name], function (o_) { return o_.id == id_; });
                            if (it) return it;
                            return null;
                        });
                        //___log(cache_name, a);
                        indexs[col].push(a);
                    }
                    m.ok = true;
                    t.worker.postMessage(m);
                    break;
                case 'M3_OK':
                    const blob_index = m.blob_index;
                    const page_index = m.page_index;
                    ___log(page_index);

                    _threads[page_index].cache_channel.port1.close();
                    _threads[page_index].cache_channel.port2.close();
                    _threads[page_index].worker.terminate();

                    _threads_counter++;
                    if (_threads_counter == _threads_max) {
                        ___log('->' + blob_index + '\n\n');
                        ___thread_start();
                    }
                    break;
            }
        }
    }
};

//#endregion
