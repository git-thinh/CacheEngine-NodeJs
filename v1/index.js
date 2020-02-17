const ___log = (...agrs) => console.log(...agrs);

const _ = require('lodash');
const { Worker, MessageChannel, receiveMessageOnPort, parentPort, workerData } = require('worker_threads');

//#region [ MESSAGE HANDLE ]

let cache_channel = null;
parentPort.on('message', (message) => {
    if (message && message.cache_port) {
        cache_channel = message.cache_port;
        //message.cache_port.postMessage('the worker is sending this');
        //cache_channel.postMessage('the worker is sending this');
        //message.cache_port.close();
        cache___Start();
    } else {
        //___log('Thread received = ', message);
        cache___onMessage(message);
    }
});

//parentPort.postMessage({ hello: 'world' });
//parentPort.on('message', (message) => {

//    if (message && message.cache_port) {
//        cache_channel = message.cache_port;
//        //message.cache_port.postMessage('the worker is sending this');
//        cache_channel.postMessage('the worker is sending this');
//        //message.cache_port.close();
//    } else {
//        ___log('Thread received = ', message);
//    }
//});

//setInterval(function () {
//    if (cache_channel) {
//        cache_channel.postMessage({ thread: new Date().toLocaleString() });
//    }
//}, 3000);

//#endregion

//#region [ CACHE CONFIG ] 

const _CACHE_NAME_MAIN = 'POL_PAWN';

const ___cache = { TEST: [] }; // ___cache['CHANNEL'] = [{...},...]
const ___cache_config = {
    POL_PAWN: {
        //user_created_id: 'USER',
        //cus_created_id: 'POL_CUSTOMER',
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

const cf = ___cache_config[_CACHE_NAME_MAIN];
const hasJoin = cf ? true : false;
let cf_cols = ___cache_cols_config[_CACHE_NAME_MAIN];

//#endregion

//#region [ CACHE EXECUTE ] 

const blob_index = workerData.blob_index;
const page_index = workerData.page_index;
const min = workerData.min;
const max = workerData.max;

//___log(JSON.stringify(workerData));

let a_pawns = [], a_pawn_ixs = [], a_customer_id = [], a_caller_shop_id = [], a_caller_online_id = [], a_group_id = [];
let indexs_11 = {};
let a_customer = [], a_caller_shop = [], a_caller_online = [], a_group = [];

//---------------------------------------------------------------------------------------

const cache___Start = () => {
    cache___pawn_GetData();
};

const cache___pawn_GetData = () => {
    if (cache_channel) {
        cache_channel.postMessage({
            page_index: page_index, command: 'M1_GET_PAWN_BY_MIN_MAX',
            min: min, max: max
        });
    }
};

const cache___index11_GetData = () => {
    if (cache_channel) {
        cache_channel.postMessage({
            page_index: page_index, command: 'M2_GET_INDEX11_DATA',
            indexs: indexs_11
        });
    }
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

const cache___execute_Indexs = () => {
    a_pawns.forEach((item, index) => {
        item['#ids'] = '';
        item['#ascii'] = '';
        item['#utf8'] = '';
        item['#org'] = '';

        const arr_ids = [], arr_ascii = [], arr_utf8 = [], arr_org = [];

        const cus = a_customer[index];
        const ushop = a_caller_shop[index];
        const caller = a_caller_online[index];
        const group = a_group[index];

        item.___customer = cus ? cus.ix___ : {};
        item.___caller_shop = ushop ? ushop.ix___ : {};
        item.___caller_online = caller ? caller.ix___ : {};
        item.___group = group ? group.ix___ : {};

        const a = [];
        if (cus) a.push(cus);
        if (ushop) a.push(ushop);
        if (caller) a.push(caller);
        if (group) a.push(group);

        a.forEach((obj_joined) => {
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
        });

        for (const col in item) {
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
        }

        if (arr_ids.length > 0)
            item['#ids'] = ' ' + arr_ids.join(' ') + ' ';

        if (arr_ascii.length > 0)
            item['#ascii'] = ' ' + ___convert_unicode_to_ascii(arr_ascii.join(' ')) + ' ';

        if (arr_utf8.length > 0)
            item['#utf8'] = ' ' + arr_utf8.join(' ').toLowerCase().replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ").replace(/ + /g, " ") + ' ';

        if (arr_org.length > 0)
            item['#org'] = arr_org.join(' ');

        parentPort.postMessage(item);
    });

    if (cache_channel) {
        cache_channel.postMessage({
            command: 'M3_OK',
            blob_index: blob_index,
            page_index: page_index, 
            min: min,
            max: max
        });
    }
};

const cache___onMessage = (m) => {
    //___log('T_' + page_index, m);
    if (m && m.ok && m.command) {
        switch (m.command) {
            case 'M1_GET_PAWN_BY_MIN_MAX':
                a_pawns = m.data;

                a_pawn_ixs = _.map(a_pawns, function (x) { return Number(x.ix___); });
                a_customer_id = _.map(a_pawns, function (x) { return Number(x['customer_id']); });
                a_caller_shop_id = _.map(a_pawns, function (x) { return Number(x['caller_shop_id']); });
                a_caller_online_id = _.map(a_pawns, function (x) { return Number(x['caller_online_id']); });
                a_group_id = _.map(a_pawns, function (x) { return Number(x['group_id']); });

                indexs_11 = {
                    //'indexs___': ['POL_PAWN', a_pawn_ixs],
                    'customer_id': ['POL_CUSTOMER', a_customer_id],
                    'caller_shop_id': ['USER', a_caller_shop_id],
                    'caller_online_id': ['USER', a_caller_online_id],
                    'group_id': ['GROUP', a_group_id]
                };

                cache___index11_GetData();

                break;
            case 'M2_GET_INDEX11_DATA':
                //___log(m.indexs);
                indexs_11 = m.indexs;

                a_customer = indexs_11['customer_id'][2];
                a_caller_shop = indexs_11['caller_shop_id'][2];
                a_caller_online = indexs_11['caller_online_id'][2];
                a_group = indexs_11['group_id'][2];

                cache___execute_Indexs();

                break;
        }
    }
};

//#endregion


