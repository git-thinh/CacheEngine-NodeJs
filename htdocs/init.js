
var HOST_POS_BASE_URI = 'https://192.168.10.54:4309/';

if (location.host == 'test-pol.f88.vn') HOST_POS_BASE_URI = 'https://test-pos-mobi.f88.vn/';   // release -DEV-TEST
//if (location.host == 'test.f88.vn') HOST_POS_BASE_URI = 'https://192.168.10.54:4437/';     // test-dev
if (location.host == 'test.f88.vn') HOST_POS_BASE_URI = 'http://localhost:8001/';     // test-local
if (location.host == '192.168.10.54:4439') HOST_POS_BASE_URI = 'https://192.168.10.54:4437/';   // test local
//if (location.host == 'apimobi.f88.vn:4439') HOST_POS_BASE_URI = 'https://192.168.10.54:4309/';   //  release thật với POS test trên 54
if (location.host == 'apimobi.f88.vn:4439') HOST_POS_BASE_URI = 'https://test-pos-mobi.f88.vn/';   //  release thật với POS test trên 54
//if (location.host == 'apimobi.f88.vn') HOST_POS_BASE_URI = 'https://testpos.f88.vn/';   //  //  release thật với Testpos.f88.vn
if (location.host == 'apimobi.f88.vn') HOST_POS_BASE_URI = 'https://pos.f88.vn/';   //  //  release thật với POS thật pos.f88.vn    --- CHẠY THẬT NHỚ MỞ CÁI NÀY NHÉ

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

var _DATA = {}, _PROFILE, _APP = {}, _MIXIN_APP = {},
    _MIXIN_COMS = {}, _VPOP = {}, _VPOP_DATA = {}, _DTN_TABLE_MAIN, _VUE_FUNCTIONS = {}, _V_POPUP_CURRENT_ID, _V_POPUP_CURRENT_NAME;
var _SCOPE = location.pathname.substring(1, location.pathname.length).split('/')[0].toLowerCase();
const _STORE_USER = new DbStore('user');
const ___PAGE_SIZE_MAX = Number.MAX_SAFE_INTEGER;
var ___PAGE_SIZE = 20;

console.log('UI > _SCOPE = ', _SCOPE);

let app___on_resize = function (width, height) { if (typeof _APP.___on_resize == 'function') _APP.___on_resize(width, height); };

///////////////////////////////////////////////////////////////////////////
//var _URI_API_BASE = 'http://127.0.0.1:3500/'; // offline
//var _URI_API_BASE = 'https://apimobi.f88.vn/pol/'; // online
//var _URI_API_BASE = 'https://test.f88.vn/pol/'; // online
var _URI_API_BASE = location.protocol + '//' + location.host + '/pol/'; // online

const ___html_encode = function (html) {
    if (html && html.length > 0) html = html.split('<').join('&#x3C;').split('>').join('&#x3E;');
    return html;
};

const fetch___get = function (url) {
    if (url.indexOf('http') != 0) url = _URI_API_BASE + url;
    //console.log('GET: ', url);
    return fetch(url).then(res => res.json());
};

const fetch___post = function (url, data) {
    //console.log('FETCH___POST: url = ' + url, data);

    //if (url.indexOf('http') != 0) url = _URI_API_BASE + url;
    //console.log('POST: ', url, data);

    if (url == null || url.length == 0) {
        return new Promise((resolve, reject) => {
            reject({ ok: false, message: 'Url not null or emtpy' });
        }); 
    }

    if (url[0] == '/') url = url.substr(1);

    if (url.split('/')[0] == 'api') url = 'mssql/' + url;

    const uri = '/pol/api-execute?api=' + url;

    const option = {
        url: uri,
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    };
    return fetch(option.url, option).then(async res => {
        const j = await res.json();
        //console.log('FETCH___POST= ', url, data, j);
        const err_msg = j.error != null ? j.error.message : '';
        const req = j.header && j.header.request ? j.header.request : null;
        const result = j.body && j.body.data ? j.body.data : null;
        const is_v1 = j.v1 == true;
        if (is_v1) {
            return j.body;
        } else {
            const total = j.body && j.body.total ? j.body.total : 0;
            const m = { ok: j.ok, message: err_msg, request: req, data: result, total: total };
            console.log('FETCH___POST= ', url, j);
            return m;
        }
    });

    //return new Promise((resolve, reject) => {
    //    setTimeout(function () {
    //        //resolve({});
    //        resolve({ ok: false, message: 'Đăng nhập không thành công' });
    //    }, 1000);
    //});


    ////////if (url.indexOf('http') != 0) url = _URI_API_BASE + url;
    //////////console.log('POST: ', url, data);
    ////////const option = {
    ////////    url: url,
    ////////    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    ////////    mode: 'cors', // no-cors, *cors, same-origin
    ////////    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    ////////    credentials: 'same-origin', // include, *same-origin, omit
    ////////    headers: {
    ////////        'Content-Type': 'application/json'
    ////////        // 'Content-Type': 'application/x-www-form-urlencoded',
    ////////    },
    ////////    redirect: 'follow', // manual, *follow, error
    ////////    referrer: 'no-referrer', // no-referrer, *client
    ////////    body: JSON.stringify(data) // body data type must match "Content-Type" header
    ////////};
    ////////return fetch(option.url, option).then(async res => {
    ////////    const j = await res.json();
    ////////   // console.log('POST: ', url, data, j);
    ////////    return j;
    ////////});
};


var ___post_action = function (apiName, actionName, data) {

    if (typeof data == 'string' || data == null
        || actionName == null || actionName.length == 0
        || apiName == null || apiName.length == 0) {
        return new Promise((resolve, reject) => {
            reject({ ok: false, message: 'Error: apiName, actionName, data not null' });
        });
    }

    const url = 'api/' + apiName + '/' + actionName;

    return fetch___post(url, data);

    ////if (typeof data == 'string' && data.length > 3) data = data.substr(3);

    ////var token = 'EB976D531188435EA006FCE8769C53D5';
    ////var connectString = '123';


    //////var url = 'http://127.0.0.1:3500/api/biz/' + connectString + '/' + apiName + '/' + actionName + '/' + token;
    ////var url = _URI_API_BASE + 'biz/' + connectString + '/' + apiName + '/' + actionName + '/' + token;

    ////url = url.toLowerCase();

    ////const option = {
    ////    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    ////    mode: 'cors', // no-cors, *cors, same-origin
    ////    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    ////    credentials: 'same-origin', // include, *same-origin, omit
    ////    headers: {
    ////        'Content-Type': 'application/json'
    ////        //'Content-Type': 'text/plain'
    ////        // 'Content-Type': 'application/x-www-form-urlencoded',
    ////    },
    ////    redirect: 'follow', // manual, *follow, error
    ////    referrer: 'no-referrer', // no-referrer, *client
    ////    body: (typeof data == 'string' ? data : JSON.stringify(data)) // body data type must match "Content-Type" header
    ////};

    ////return fetch(url, option).then(res => res.json()).then(j => {

    ////    if (j && j.ok) {
    ////        if (j.message.length == 0) {
    ////            j.message = "Thao tác thành công";
    ////        }
    ////    }
    ////    if (j && j.ok == false) {
    ////        if (j.message.length == 0) {
    ////            j.message = "Thao tác thất bại...";
    ////        }
    ////    }

    ////    var m_ = { Ok: j.ok, Message: j.message };
    ////    for (var col in j) {
    ////        if (col != 'ok' && col != 'message') {
    ////            m_[col] = j[col];
    ////        }
    ////    }
    ////    return m_;
    ////});
};


var ___reload = function () { if (typeof _APP.___reload == 'function') _APP.___reload(); };

const ___guid = function () {
    return 'aa-xxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const ___alert = function (msg) {
    swal(msg);
};

const ___alert_type = function (msg, type) {
    if (type) {
        type = "success";
    } else {
        type = "error";
    }
    swal("Thông báo", msg, type);
};

const ___go_login = function (msg) {

    if (location.host == 'test-pol.f88.vn') {
        location.href = HOST_POS_BASE_URI;
    } else if (location.host == 'test.f88.vn' || location.host == '192.168.10.54:4439') {
        location.href = HOST_POS_BASE_URI;
    }
    else if (location.host == 'apimobi.f88.vn:4439') {
        location.href = HOST_POS_BASE_URI;
    }
    else if (location.host == 'apimobi.f88.vn') {
        location.href = HOST_POS_BASE_URI;
    }
    else {
        if (msg && msg.length > 0)
            location.href = location.protocol + '//' + location.host + '/login?message=' + msg;
        else
            location.href = location.protocol + '//' + location.host + '/login';
    }
};

const ___logout = function () {
    if (typeof _APP.___logout == 'function') _APP.___logout();
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

    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");

    str = str
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");

    str = str.toLowerCase();

    return str;
};

var ___get_url = function (url, type, _valueDefaultIfFail) {
    if (url == null) return _valueDefaultIfFail;
    if (url.indexOf('?') == -1)
        url = url + '?_is_admin=true';
    else
        url = url + '&_is_admin=true';

    //console.log('REQUEST_URL === ', url);

    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);

    if (request.status == 200) {
        if (type == 'json') {
            var text = request.responseText;
            if (text && text.length > 3 && text[3] == '{') text = text.substr(3, text.length);
            return JSON.parse(text);
        }
        return request.responseText;
    }
    if (type == 'json') return _valueDefaultIfFail;

    return _valueDefaultIfFail;
};

var ___get_template = function (tempName) {
    return ___get_url('/_app/' + _SCOPE + '/_temp/' + tempName + '.html', '');
};
var ___getTemplate = ___get_template;

///JWT Encode - Start
var jwtEncode = function (calloutId, ipphone, number) {
    // Defining our token parts
    var header = {
        "alg": "HS256",
        "typ": "JWT"
    };

    var data = {
        "callout_id": calloutId,
        "ipphone": ipphone,
        "number": number
    };

    //var data = {
    //    "callout_id": 200113,
    //    "ipphone": 224,
    //    "number": "02473090388"
    //};

    var secret = "FeB2nTAy";

    function base64url(source) {
        // Encode in classical base64
        encodedSource = CryptoJS.enc.Base64.stringify(source);

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '');

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        return encodedSource;
    }

    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    var encodedHeader = base64url(stringifiedHeader);
    //document.getElementById("header").innerText = encodedHeader;

    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    var encodedData = base64url(stringifiedData);
    //document.getElementById("payload").innerText = encodedData;

    var signature = encodedHeader + "." + encodedData;
    signature = CryptoJS.HmacSHA256(signature, secret);
    signature = base64url(signature);

    var lastToken = encodedHeader + '.' + encodedData + '.' + signature;
    return lastToken;
    //document.getElementById("signature").innerText = signature;
};
///JWT Encode - End

//////////////////////////////////////////////////////////////////////////////

//////var ___post_action = function (apiName, actionName, data) {

//////    if (typeof data == 'string' && data.length > 3) data = data.substr(3);

//////    var token = 'EB976D531188435EA006FCE8769C53D5';
//////    var connectString = '123';


//////    //var url = 'http://127.0.0.1:3500/api/biz/' + connectString + '/' + apiName + '/' + actionName + '/' + token;
//////    var url = _URI_API_BASE + 'biz/' + connectString + '/' + apiName + '/' + actionName + '/' + token;

//////    url = url.toLowerCase();

//////    const option = {
//////        method: 'POST', // *GET, POST, PUT, DELETE, etc.
//////        mode: 'cors', // no-cors, *cors, same-origin
//////        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//////        credentials: 'same-origin', // include, *same-origin, omit
//////        headers: {
//////            'Content-Type': 'application/json'
//////            //'Content-Type': 'text/plain'
//////            // 'Content-Type': 'application/x-www-form-urlencoded',
//////        },
//////        redirect: 'follow', // manual, *follow, error
//////        referrer: 'no-referrer', // no-referrer, *client
//////        body: (typeof data == 'string' ? data : JSON.stringify(data)) // body data type must match "Content-Type" header
//////    };

//////    return fetch(url, option).then(res => res.json()).then(j => {

//////        if (j && j.ok) {
//////            if (j.message.length == 0) {
//////                j.message = "Thao tác thành công";
//////            }
//////        }
//////        if (j && j.ok == false) {
//////            if (j.message.length == 0) {
//////                j.message = "Thao tác thất bại...";
//////            }
//////        }

//////        var m_ = { Ok: j.ok, Message: j.message };
//////        for (var col in j) {
//////            if (col != 'ok' && col != 'message') {
//////                m_[col] = j[col];
//////            }
//////        }
//////        return m_;
//////    });
//////};

var ___getCurentDate = function (option) {
    var today = new Date();
    var date = '';

    var mondth = '', day = '', hours = '', minutes = '', seconds = '';

    mondth = (today.getMonth() + 1).toString();
    if (mondth.length === 1) mondth = '0' + mondth;

    day = today.getDate().toString();
    if (day.length === 1) day = '0' + day;

    hours = today.getHours().toString();
    if (hours.length === 1) hours = '0' + hours;

    minutes = today.getMinutes().toString();
    if (minutes.length === 1) minutes = '0' + minutes;

    seconds = today.getSeconds().toString();

    if (seconds.length === 1) seconds = '0' + seconds;

    if (option) {
        date = today.getFullYear() + '' + mondth + '' + day + '' + hours + "" + minutes + "" + seconds;
    } else {
        date = today.getFullYear() + '' + mondth + '' + day;
    }
    return date;
};
var ___parseCurentDate = function (val) {
    var date = '';
    date = val.substr(0, 4) +
        '-' +
        val.substr(4, 2) +
        '-' +
        val.substr(6, 2) +
        ' ' +
        val.substr(8, 2) +
        ':' +
        val.substr(10, 2) +
        ':' +
        val.substr(12, 2);
    return date;
};
var ___reset_form = function (item) {
    $.each(item._self.$children,
        function (i, v) {
            $('#' + v.___id).dropdown('set selected', '-1');
        });

    document.getElementById('frm_popup').reset();
};




//////////////////////////////////////////////////////////////////////////////

var ___plugin = function (api, item, key) {
    if (item) {
        var fun = 'plugin___' + api + '___' + key;
        if (typeof window[fun] == 'function') {
            var v = window[fun](item, key);
            //  console.log(fun, v);
            return v;
        }
        return item[key];
    }
    return null;
};

//////////////////////////////////////////////////////////////////////////////
/* WINDOW EVENTS */

var RESIZE_RTIME_;
var RESIZE_TIMEOUT_ = false;
var RESIZE_DELTA_ = 200;
var RESIZE_WIDTH_ = 0;
var RESIZE_HEIGHT_ = 0;

const resize___resizeend = function () {
    if (new Date() - RESIZE_RTIME_ < RESIZE_DELTA_) {
        setTimeout(resize___resizeend, RESIZE_DELTA_);
    } else {
        RESIZE_TIMEOUT_ = false;
        app___on_resize(RESIZE_WIDTH_, RESIZE_HEIGHT_);
    }
};

//https://googlechrome.github.io/samples/resizeobserver/index.html
const resize___reg_event_window = function () {
    //window.addEventListener('DOMContentLoaded', (event) => {
    if (document.body == null) {

        setTimeout(location.reload, 300);

        //window.onresize = function (event) {
        //    RESIZE_RTIME_ = new Date();
        //    if (RESIZE_TIMEOUT_ === false) {
        //        RESIZE_TIMEOUT_ = true;
        //        RESIZE_WIDTH_ = jQuery(window).width();
        //        RESIZE_HEIGHT_ = jQuery(window).height();
        //        setTimeout(resize___resizeend, RESIZE_DELTA_);
        //    }
        //};

    } else {

        new ResizeObserver(entries => {
            for (let entry of entries) {
                RESIZE_RTIME_ = new Date();
                if (RESIZE_TIMEOUT_ === false) {
                    RESIZE_TIMEOUT_ = true;
                    RESIZE_WIDTH_ = entry.contentRect.width;
                    RESIZE_HEIGHT_ = entry.contentRect.height;
                    setTimeout(resize___resizeend, RESIZE_DELTA_);
                }
            }
        }).observe(document.body);
    }
    //});
};

var dom___on_click = function (e) { };
document.addEventListener("click", e => dom___on_click(e));





//////////////////////////////////////////////////////////////////////////////
/* MIXIN */

_MIXIN_APP = {
    computed: {
        ___para: function () { return null; },
        ___is_main: function () { return true; },
        ___is_popup: function () { return false; },
        ___is_lookup: function () { return false; }
    }
};

_MIXIN_COMS = {
    props: [
        'no-distinct',
        'click-out-it-self-to-close',
        'visible-on-top',
        'kit-dropdown-bool-visible-text-search',
        'bit-full-text-search',
        'pop-header-visible',
        'str-icon-item',
        'str-input-type',
        'str-submit-text',
        'str-submit-icon',
        'str-class',
        'str-style',
        'str-width',
        'str-height',
        'str-title',
        'str-align',
        'str-min-width',
        'str-action',
        'str-icon-textbox',
        'str-placeholder',
        'str-name-field-value',

        'event-change',

        'vue-ref',
        'vue-ref-callback',

        'data-store-type',
        'data-store-value',
        'data-store-text',

        'is-auto-save',
        'is-dissable',

        'obj-error-key',
        'obj-value',
        'obj-value-default',

        'api-name',
        'api-condition',
        'api-send-setting',
        'api-result-filter',
        'api-bind-id',
        'api-bind-name',

        'ref-id',
        'ref-item',
        'ref-parent-id',


    ],
    computed: {
        ___para: function () { return this.$root.___para; },
        ___is_main: function () { return this.$root.___is_main; },
        ___is_popup: function () { return this.$root.___is_popup; },
        ___is_lookup: function () { return this.$root.___is_lookup; }
    },
    mounted: function () {
        var _self = this;
        if (_self.$vnode) {
            var _class = '';
            var tag = _self.$vnode.tag;
            if (tag && tag.indexOf('-kit-') != -1) _class = 'kit-' + tag.split('-kit-')[1];

            _self.___name = _class;
            _self.___id = '___vc' + _self._uid;

            //console.log(_self.vueRef + ': is_main = ' + _self.___is_main + '; is_popup = ' + _self.___is_popup + '; is_lookup = ' + _self.___is_lookup);

            if (_self.$el) {
                Vue.nextTick(function () {

                    _self.$el.setAttribute('id', _self.___id);

                    classie.add(_self.$el, 'ui-component');
                    if (_class.length > 0) classie.add(_self.$el, _class);

                    if (_self.strClass) $('#' + _self.___id).addClass(_self.strClass);
                    if (_self.strStyle) {
                        var style = '';
                        if (_self.$el.hasAttribute('style')) style = _self.$el.getAttribute('style');
                        if (style.length == 0)
                            style = _self.strStyle;
                        else
                            style += ';' + _self.strStyle;
                        _self.$el.setAttribute('style', style);
                    }


                    ////$('.ui.progress').progress({
                    ////    duration: 200,
                    ////    total: 200,
                    ////    text: {
                    ////        active: '{value} of {total} done'
                    ////    }
                    ////});
                });
            }


            Vue.nextTick(function () {
                if (_self.$children) {
                    if (_self.$children.length == 0 && tag && tag.indexOf('-kit-popup-') != -1) {
                        // popup
                        //setTimeout(function () {
                        console.log('????????????????', tag, _self.$children.length);
                        //}, 1000);

                    } else if (_self.$children.length == 0) {
                        if (_self.$parent && _self.$parent.$refs && _self.$parent.$refs[_self.vueRef] == null) {
                            console.log('????????????????', tag, _self.$parent.$refs[_self.vueRef]);
                            _self.$parent.$refs[_self.vueRef] = _self;
                        }
                    } else {
                        _self.$children.map(v => {
                            if (v.vueRef) {
                                console.log(v.vueRef);
                                _self.$parent.$refs[v.vueRef] = v;
                            }
                        });
                    }
                }
            });
        }
    },
    methods: {
        ___pop_coms_valid: function (val_set_) {
            const _self = this;

            if (_self.dataStoreValue && _self.objErrorKey) {
                if (_self.dataStoreValue.indexOf('_APP') == -1 && _self.dataStoreValue.indexOf('_DATA') == -1) {
                    var dt_ = _self.$parent.$data;

                    var col_ = _self.objErrorKey,
                        objErrorValue = dt_.objErrorValue,
                        objErrorLabel = dt_.objErrorLabel,
                        objErrorMsg = dt_.objErrorMsg;

                    if (col_ && objErrorValue && objErrorLabel && objErrorMsg) {

                        //console.log(_self.vueRef + ': value = ' + val_set_ + '; expect_val = ' + objErrorValue[col_]);

                        if (val_set_ == objErrorValue[col_]) {
                            objErrorLabel[col_] = objErrorMsg[col_];
                        } else {
                            objErrorLabel[col_] = '';
                        }
                    } else {
                        console.error('VUE_POPUP: Must be set: $data = { objErrorValue: {...}, objErrorLabel: {...}, objErrorMsg: {...} } ');
                    }
                }
            }
        },
        ___pop_valid: function (objVals) {
            console.log('222222222222', objVals);
            var a = [];

            if (objVals == null) return false;

            if (objVals && _VPOP.$children && _VPOP.$children.length > 0) {
                const objErrorLabel = _VPOP.$children[0].objErrorLabel;
                const objErrorValue = _VPOP.$children[0].objErrorValue;
                const objErrorMsg = _VPOP.$children[0].objErrorMsg;

                //console.log('??????????  objErrorLabel = ', objErrorLabel);

                if (objErrorLabel && objErrorValue && objErrorMsg) {

                    for (var col in objErrorLabel) {
                        if ((objErrorLabel[col] != null && objErrorLabel[col].length > 0)
                            || objVals[col] == objErrorValue[col]) {
                            a.push(objErrorMsg[col]);
                            objErrorLabel[col] = objErrorMsg[col];
                        }
                    }
                }
            }

            return a;
        },
        ___save_value_changed: function (value, text) {
            const _self = this;
            var val_set_ = value;
            if (text == null || text == undefined) text = '';

            if (_self.dataStoreValue) {
                var i_ = 1;

                //_self.___mainGrid_setOptionSearchByKey(_self.dataStoreValue, value);
                var a = _self.dataStoreValue.split('.');
                //console.log(a);

                var it = window[a[0]];
                if (a[0] != '_APP' && a[0] != '_DATA') {
                    i_ = 0;
                    it = _self.$parent.$data;
                    //console.log('???????????????', JSON.stringify(it));
                }

                if (it) {
                    for (var i = i_; i < a.length; i++) {
                        //console.log(i, a[i], it.hasOwnProperty(a[i]));

                        if (it.hasOwnProperty(a[i]) == false) it[a[i]] = {};
                        if (i == a.length - 1) {
                            var key = a[i];
                            val_set_ = value;
                            if (key.endsWith('_id') || key.startsWith('int_') || key.startsWith('bit_')) val_set_ = parseInt(value);
                            it[key] = val_set_;
                        }
                        it = it[a[i]];
                    }
                    it = value;
                }
                //console.log(_self.vueRef + ': ' + _self.dataStoreValue + ' = ' + it, val_set_);
            }

            if (_self.dataStoreText) {
                var i_ = 1;

                //_self.___mainGrid_setOptionSearchByKey(_self.dataStoreText, value);
                var a = _self.dataStoreText.split('.');
                //console.log(a);

                var it = window[a[0]];
                if (a[0] != '_APP' && a[0] != '_DATA') {
                    i_ = 0;
                    it = _self.$parent.$data;
                    //console.log('???????????????', JSON.stringify(it));
                }

                if (it) {
                    for (var i = i_; i < a.length; i++) {
                        //console.log(i, a[i], it.hasOwnProperty(a[i]));

                        if (it.hasOwnProperty(a[i]) == false) it[a[i]] = {};
                        if (i == a.length - 1) {
                            var keyn = a[i];
                            it[keyn] = text;
                        }
                        it = it[a[i]];
                    }
                    it = value;
                }
                //console.log(_self.vueRef + ': ' + _self.dataStoreText + ' = ' + it, val_set_);
            }
        },
        ___set_value: function (refName, value, hasTrigerEvent) {
            const _self = this;
            var val;

            //console.log(refName + ' [0] > SET_VALUE ....', _self.$parent, _self);

            if (refName && _self.$parent && _self.$parent.$refs) {
                var v = _self.$parent.$refs[refName], el, ls, it, f_condition;

                // In case, if v is null, find vueRef on screen popup
                if (v == null && _self.$refs[refName]) {
                    v = _self.$refs[refName];
                    // v_list = _self.$refs[refName].list;
                    setTimeout(function () {
                        var v_list = _self.$refs[refName].list;
                        //  console.log(refName + ' [2] set value: list ', v, v_list);
                    }, 300);

                }

                //console.log(refName + ' [1] > SET_VALUE: vueObj = ', v);
                if (v) {
                    //console.log(refName + ' > SET_VALUE:  ', v.___name, value);
                    switch (v.___name) {
                        case 'kit-dropdown-simple':
                            //v.hasTrigerEventWhenSetValue = hasTrigerEvent;
                            f_condition = value;

                            ls = v.list;
                            //console.log(refName + ' [2] set value: list ', ls);
                            if (ls && ls.length > 0 && typeof f_condition == 'function') {
                                it = _.find(ls, f_condition);
                                //  console.log(refName + ' [3] set value: it ', ls.length, it);
                                if (it) {
                                    v.___set_value_dropdown(hasTrigerEvent, it.id);

                                    ////console.log(refName + ' > SET_VALUE:  ', v.___name, JSON.stringify(it));
                                    //v.___clear_selection();
                                    //$('#' + v.___id).dropdown('set selected', it.id);
                                    ////setTimeout(function () {
                                    ////    v.hasTrigerEventWhenSetValue = null;
                                    ////}, 300);
                                    //console.log('0.', v.vueRef, hasTrigerEvent, value.toString());
                                }
                            }
                            break;
                        case 'kit-text':
                        case 'kit-textarea':
                            el = document.getElementById(v.___id);
                            if (el) {
                                el.value = value;
                                v.f_keyup({ key: 'Enter' });
                            }
                            break;
                        case 'kit-check':
                            val = value == 1 ? 'on' : 'off';
                            v.key = val;
                            if (typeof v.setValueChanged == 'function')
                                v.setValueChanged(val);
                            break;
                        case 'kit-radio':
                            if (typeof v.setValueChanged == 'function')
                                v.setValueChanged(value);
                            break;
                    }
                }
            }
        },
        ___set_list: function (refName, list) {
            const _self = this;
            if (refName && _self.$parent && _self.$parent.$refs) {
                $.each(_self.$children,
                    function (i, v) {
                        switch (v.vueRef) {
                            case refName:
                                switch (v.___name) {
                                    case 'kit-dropdown-simple':
                                    case 'kit-dropdown-check':
                                        v.list = list;
                                        break;
                                }
                                break;
                            default:

                        }
                    });

                //var v = _self.$parent.$refs[refName];
                //if (v) {
                //    console.log(refName + ' > SET_VALUE: 222222222222222222222222 ', v.___name);
                //    switch (v.___name) {
                //    case 'kit-dropdown-simple':
                //    case 'kit-dropdown-check':
                //        v.list = list;
                //        break;
                //    }
                //}
            }
        },
        ___parse_value: function (val) {
            const _self = this;
            var v = val;
            if (v && _self.dataStoreType && _self.dataStoreType == 'int') v = parseInt(v);
            return v;
        },
        ___pop_valid_multi: function (objVals, objErrorValue) {
            var a = [];

            if (objVals == null) return false;

            if (objVals && _VPOP.$children && _VPOP.$children.length > 0) {

                const objErrorLabel = _VPOP.$children[0].objErrorLabel;
                const objErrorMsg = _VPOP.$children[0].objErrorMsg;

                if (objErrorLabel && objErrorValue && objErrorMsg) {
                    for (var objVal in objErrorValue) {
                        for (var col in objErrorLabel) {
                            if (objVal == col && objErrorLabel[col] != "" || objVals[col] == objErrorValue[objVal]) {
                                a.push(objErrorMsg[col]);
                                objErrorLabel[col] = objErrorMsg[col];
                            }
                        }

                    }
                }

                if (a.length > 0) {

                    for (var err_v in objErrorValue) {
                        for (var err_l in objErrorLabel) {
                            if (err_v != err_l) {
                                objErrorLabel[err_l] = "";
                            }
                        }
                    }
                }
            }
            return a;
        },
        ___set_dissabled: function (refName, value, hasTrigerEvent) {
            const _self = this;
            var val;

            if (refName && _self.$parent && _self.$parent.$refs) {
                var v = _self.$parent.$refs[refName], el, ls, it, f_condition;

                if (v) {
                    switch (v.___name) {
                        case 'kit-dropdown-simple':
                            $('#' + v.___id).addClass("disabled");
                            break;
                        case 'kit-text':
                            $('#' + v.___id).prop('disabled', true);
                            break;
                        case 'kit-textarea':
                            $('#' + v.___id).prop('disabled', true);
                            break;
                        case 'kit-check':
                            break;
                        case 'kit-radio':
                            break;
                    }
                }
            }
        }
    }
};

//////////////////////////////////////////////////////////////////////////////
/* COMPONENTS */

Vue.component('kit-text', {
    mixins: [_MIXIN_COMS],
    template: '<input type="text" :placeholder="strPlaceholder" v-on:keyup="f_keyup">',
    data: function () {
        return {
            str_type: 'text'
        };
    },
    mounted: function () {
        var _self = this;
        Vue.nextTick(_self.f_ready);
        if (_self.strInputType) {
            _self.str_type = _self.strInputType;
        }
    },
    methods: {
        f_keyup: function (ev) {
            var _self = this;

            var el = document.getElementById(_self.___id);
            var v = '';
            if (el) v = el.value.trim();

            if (_self.dataStoreType === "int") {
                if (el) {
                    v = v.replace(/[^\d]/, '');
                    v = v.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                }
                el.value = v;
            }



            //keyCode === 37 Arrow left subtract one day
            //keyCode === 39 Arrow right add one day
            //keyCode === 13 Enter will commit selected date

            //console.log('KEYPRESS = ', ev);
            const key_ = ev.key;
            //var v = $('#' + _self.___id).val().trim();
            ////////////////////var el = document.getElementById(_self.___id);
            ////////////////////var v = '';
            ////////////////////if (el) {
            ////////////////////    v = el.value.trim();
            ////////////////////    //if (_self.str_type == 'number') {
            ////////////////////    //    v = v.replace(/[^\d]/, '');
            ////////////////////    //    //v = v.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
            ////////////////////    //}
            ////////////////////    //el.value = v;
            ////////////////////}
            v = _self.___parse_value(v);

            //console.log(_self.vueRef + ': isAutoSave = ' + _self.isAutoSave);
            console.log(_self.vueRef + ': value = ', v);

            //if (key_ == 'Backspace' || key_ == 'Delete') {
            if (key_ == 'Backspace' || key_ == 'Delete' ||
                key_ == 'Enter' || _self.isAutoSave) {
                //console.log(_self.vueRef, v); 

                var val = v;
                var name = v;

                _self.___save_value_changed(v);

                if (key_ == 'Enter' || _self.isAutoSave) {
                    if (_self.eventChange) {
                        _self.eventChange(_self.vueRef, val, name);
                    }
                }
            }

            _self.___pop_coms_valid(v);
        },
        f_ready: function () {
            var _self = this;
            if (_self.isDissable) {
                $('#' + _self.___id).prop('disabled', true);
            }
        }
    }
});

Vue.component('kit-textarea', {
    mixins: [_MIXIN_COMS],
    template: '<textarea :placeholder="strPlaceholder" v-on:keyup="f_keyup"></textarea>',
    data: function () {
        return {
        };
    },
    mounted: function () {
        var _self = this;
    },
    methods: {
        f_keyup: function (ev) {
            var _self = this;

            //keyCode === 37 Arrow left subtract one day
            //keyCode === 39 Arrow right add one day
            //keyCode === 13 Enter will commit selected date

            //console.log('KEYPRESS = ', ev);
            const key_ = ev.key;
            var el = document.getElementById(_self.___id);
            var v = '';
            if (el) {
                v = el.value.trim();
                //el.value = v;
            }
            v = _self.___parse_value(v);

            //console.log(_self.vueRef + ': isAutoSave = ' + _self.isAutoSave);

            //if (key_ == 'Backspace' || key_ == 'Delete') {
            //if (key_ == 'Enter' || _self.isAutoSave) {
            if (_self.isAutoSave) {
                //console.log(_self.vueRef, v); 

                _self.___save_value_changed(v);

                if (_self.eventChange) {
                    _self.eventChange(_self.vueRef, v, v);
                }
            }

            _self.___pop_coms_valid(v);
        }
    }
});

Vue.component('kit-check', {
    mixins: [_MIXIN_COMS],
    template: '<div class="ui checkbox no-select-text" @click="handleChange"><input type="checkbox"><label></label></div>',
    data: function () {
        return {
            key: "1",
            items: {
                1: { id: 1, name: 'On' },
                0: { id: 0, name: 'Off' }
            }
        };
    },
    mounted: function () {
        var _self = this;

        $('#' + _self.___id + '.ui.checkbox').checkbox();

        _self.items = _self.objValue;

        if ((_self.objValueDefault == "1" || _self.objValueDefault == "0")) {
            _self.key = _self.objValueDefault;
        }
        //   console.log('11111111111111111111', _self.key, _self.objValueDefault, _self.objValue);

        if (_self.objValue) {
            _self.items = _self.objValue;
        }

        Vue.nextTick(function () {
            var el = document.querySelector('#' + _self.___id + ' input');
            var label = document.querySelector('#' + _self.___id + ' label');
            if (el) {

                if (_self.key == '1') {
                    el.setAttribute('checked', 'checked');
                } else {
                    if (el.hasAttribute('checked')) el.removeAttribute('checked');
                }
            }
            var val = _self.items[_self.key].id;
            val = _self.___parse_value(val);
            const name = _self.items[_self.key].name;

            if (label) {
                label.innerHTML = name;
            }
        });
    },
    methods: {
        handleChange: function (ev) {
            var _self = this;

            if (_self.key == '1') {
                _self.key = '0';
            } else {
                _self.key = '1';
            }
            _self.setValueChanged(_self.key);
        },
        setValueChanged: function (key) {
            var _self = this;

            if (key == "on" || key == '1') {
                key = 1;
            } else {
                key = 0;
            }

            var el = document.querySelector('#' + _self.___id + ' input');
            var label = document.querySelector('#' + _self.___id + ' label');


            if (el) {
                if (key == '1') {
                    el.setAttribute('checked', 'checked');


                } else {
                    if (el.hasAttribute('checked')) el.removeAttribute('checked');
                }
            }


            var val = _self.items[key].id;
            val = _self.___parse_value(val);
            const name = _self.items[key].name;
            //console.log('key====', key, _self.items[key], _self);

            //console.log('2222222222222', _self.vueRef + ': value = ' + val + '; name = ' + name);

            if (label) {
                label.innerHTML = name;
            }


            if (typeof _self.eventChange == 'function')
                _self.eventChange(_self.vueRef, val, name);

            _self.___save_value_changed(val);
        }
    }
});


Vue.component('kit-radio', {
    mixins: [_MIXIN_COMS],
    template: ' \
<div class="ui form no-select-text"> \
    <div class="inline fields"> \
        <label>{{strTitle}}</label> \
        <div class="field" v-for="(item,index) in objValue"> \
            <div class="ui radio checkbox" @click="handleChange(item,$event)" style="cursor: pointer;"> \
                <input type="radio" :name="name_field" onclick="this.checked = false;" :class="[\'radio\' + item.id, indexValueDefault == index ? \'checked\':\'\']"> \
                <label style="cursor: pointer;">{{item.name}}</label> \
            </div> \
        </div> \
    </div> \
</div>',
    data: function () {
        return {
            name_field: '',
            indexValueDefault: -1,
            selected: null,
            list: []
        };
    },
    mounted: function () {
        var _self = this;
        _self.name_field = 'radio' + _self.___id;

        $('#' + _self.___id + '.ui.checkbox').checkbox();
        if (_self.objValue) _self.list = _self.objValue;
        if (_self.objValueDefault && _self.objValue && _self.objValue[_self.objValueDefault]) _self.indexValueDefault = _self.objValueDefault;

        Vue.nextTick(function () {
            var el = document.querySelector('#' + _self.___id + ' input.checked');
            if (el) {
                el.setAttribute('checked', 'checked');
                classie.remove(el, 'checked');
            }
        });
    },
    methods: {
        setValueChanged: function (id) {
            const _self = this;
            var changed = false;
            var item = _.find(_self.list, function (o) { return o.id == id; });
            if (item) {
                document.querySelectorAll('#' + _self.___id + ' input').forEach(ip => { if (ip.hasAttribute('checked')) ip.removeAttribute('checked'); });
                _self.selected = item;
                changed = true;
                var el = document.querySelector('#' + _self.___id + ' input.radio' + id);
                //console.log('????????????????????????1=', el, item);
                if (el) {
                    el.setAttribute('checked', 'checked');
                    $(el)[0].checked = true;
                }
            }

            if (changed) {
                var val = item.id, name = item.name;

                //console.log(_self.vueRef + ': value = ' + val + '; name = ' + name);

                if (typeof _self.eventChange == 'function')
                    _self.eventChange(_self.vueRef, val, name);

                _self.___save_value_changed(val);
            }
        },
        handleChange: function (item, ev) {
            if (item == null) return;
            this.setValueChanged(item.id);

            ////const _self = this;
            //////console.log('UI.KIT_RADIO > choose: ', JSON.stringify(item));

            ////var changed = false;
            ////var pa = ev.target.closest('.checkbox');
            ////if (pa) {
            ////    var el = pa.querySelector('input');
            ////    if (el) {
            ////        if (_self.selected && _self.selected.id == item.id) {
            ////            //if (el.hasAttribute('checked')) el.removeAttribute('checked');
            ////        } else {
            ////            document.querySelectorAll('#' + _self.___id + ' input').forEach(ip => { if (ip.hasAttribute('checked')) ip.removeAttribute('checked'); });
            ////            _self.selected = item;
            ////            el.setAttribute('checked', 'checked');
            ////            changed = true;
            ////        }
            ////    }
            ////}

            ////if (changed) {
            ////    var val = item.id, name = item.name;

            ////    //console.log(_self.vueRef + ': value = ' + val + '; name = ' + name);

            ////    if (typeof _self.eventChange == 'function')
            ////        _self.eventChange(_self.vueRef, val, name);

            ////    _self.___save_value_changed(val);
            ////}
        }

    }
});

var ___f_search_response_condition = function () { return true; };
Vue.component('kit-dropdown-simple', {
    mixins: [_MIXIN_COMS],
    template:
        '<div class="ui floating dropdown labeled icon button" \
                style="float: left;border: 1px solid rgba(34,36,38,.15);background: #ffff;" \
                v-bind:style="[{\'min-width\' : (strMinWidth == null ? \'auto\' : strMinWidth)}, {\'width\': (strWidth == null ? \'100%\' : strWidth)}]"> \
            <i :class="[strIconTextbox,\'icon\']"></i> \
            <span class="text" value="0">{{strPlaceholder}}</span> \
            <div class="menu"> \
                <div v-show="kitDropdownBoolVisibleTextSearch != false" class="ui icon search input"> \
                    <i class="search icon"></i> \
                    <input type="text" :placeholder="strPlaceholder" v-on:keyup="f_keyup"> \
                </div> \
                <div v-show="kitDropdownBoolVisibleTextSearch != false" class="divider"></div> \
                <div class="scrolling menu"> \
                    <div class="item" data-value="-1"> \
                        <!--<div class="ui red empty circular label"></div>--> \
                        {{strPlaceholder}} \
                    </div> \
                    <div class="item" v-for="item in list" :data-value="item[strNameFieldValue]" :data-id="item.id" :data-name="item.name"> \
                        <div class="" :class="[strIconItem]"></div> \
                        {{item.name}} \
                        <span style="display:none">{{item.name_ascii}}</span> \
                    </div> \
                </div> \
            </div> \
        </div>',
    data: function () {
        return {
            xhr_search: null,
            bit_searching: false,
            str_keyword: '',
            list: [],
            list_ids: ''
        };
    },
    created: function () {
        var _self = this;
        setTimeout(_self.___bind_data, 1);

        if (_self.objValueDefault && Array.isArray(_self.objValueDefault)) {
            _self.list = _self.objValueDefault;
            console.log('_self.objValueDefault =', _self.objValueDefault);
        }
    },
    mounted: function () {
        var _self = this;
        Vue.nextTick(_self.f_ready);
    },
    methods: {
        ___clear_selection: function () {
            var _self = this;

            //_self.list = [];
            //_self.list_ids = '';

            _self.___save_value_changed(-1, '');

            $('#' + _self.___id).dropdown('set selected', -1);
            //$('#' + _self.___id).dropdown('clear');
        },
        ___bind_data: function () {
            const _self = this;
            //console.log(_self.vueRef, ' apiName = ', _self.apiName);
            //console.log(_self.vueRef, ' apiCondition = ', _self.apiCondition);

            if (_self.apiName) {
                var fet = null;

                if (_self.apiCondition && _self.apiCondition.length > 0) {
                    fet = fetch___post('api/' + _self.apiName + '/search',
                        { conditons: _self.apiCondition, page_number: 1, page_size: Number.MAX_SAFE_INTEGER });
                } else {
                    fet = fetch___get('api/' + _self.apiName + '/all');
                }

                fet.then(rs_ => {
                    //console.log(_self.vueRef, _self.apiName, rs_);
                    if (rs_ && rs_.ok && rs_.result_items) {
                        const a = _.map(rs_.result_items, function (o) {
                            //console.log('_self', _self);
                            //console.log('1', o);
                            //console.log('2222', o[_self.apiBindId]);
                            //console.log('2222',o[_self.apiBindName]);
                            return {
                                id: o[_self.apiBindId],
                                name: o[_self.apiBindName],
                                //name_ascii: ___convert_unicode_to_ascii(o[_self.apiBindName])
                                name_ascii: o['#']
                            };
                        });
                        if (_self.noDistinct) {
                            _self.list = a;
                        } else {
                            const lsg = _.groupBy(a, function (o) { return o.id; });
                            const grs = _.map(lsg, function (vals_, name) { return vals_[0]; });
                            _self.list = grs;
                        }
                    } else {
                        _self.list = [];
                    }
                });
            }
        },
        ___reload: function () {
            const _self = this;
            ___apiSendSetting(_self.apiSendSetting).then((val) => {
                //     console.log('11111111111111111111111111');
                var a = [];
                a = val.result_items;
                //console.log('apiResultFilter', _self.apiResultFilter);

                //  console.log('___apiResultFilter=', _self.apiResultFilter);

                if (_self.apiResultFilter !== undefined) {
                    eval('___apiResultFilter = ' + _self.apiResultFilter);

                    a = _.filter(a, ___apiResultFilter);

                    // a = _.filter(a, _self.apiResultFilter);
                }
                //console.log('aaaaaaaa111', a);

                //a = _.filter(a, item => item.pid === "0");

                //console.log('aaaaaaaa', a );


                a = _.map(a, function (o) {
                    //console.log('_self', _self);
                    //console.log('1', o);
                    //console.log('2222', o[_self.apiBindId]);
                    //console.log('2222',o[_self.apiBindName]);
                    return {
                        id: o[_self.apiBindId],
                        name: o[_self.apiBindName],
                        name_ascii: ___convert_unicode_to_ascii(o[_self.apiBindName])
                    };
                });
                _self.list = a;

                //console.log('apiSendSetting: a = ', a);
                //console.log(' _self.list _self.list:  = ', _self.list);

            });
        },
        ___set_value_dropdown: function (hasTrigerEvent, id) {
            var _self = this;
            //_self.___clear_selection();
            //  console.log('0.', _self.vueRef, hasTrigerEvent, id);
            _self.hasTrigerEvent = hasTrigerEvent;
            $('#' + _self.___id).dropdown('set selected', id);
        },
        f_ready: function () {
            var _self = this;
            $('#' + _self.___id).dropdown({
                action: _self.strAction,
                //fullTextSearch: _self.bitFullTextSearch,
                //fullTextSearch: true,
                //sortSelect: false,
                //match: 'text',
                //ignoreSearchCase: true,
                onChange: function (value, text, $selected) {
                    var val, id, name;
                    if ($selected && $selected.length > 0) {
                        var el = $selected[0], data_ = null;
                        if (el.hasAttribute('data-value')) val = el.getAttribute('data-value');
                        if (el.hasAttribute('data-id')) id = el.getAttribute('data-id');
                        if (el.hasAttribute('data-name')) name = el.getAttribute('data-name');
                    }
                    _self.f_change_value(id, val, name, $selected);
                },
                onShow: function () {
                    //console.log('DROPDOWN_MENU: visiable = ', _self.str_keyword);
                    //if (_self.str_keyword && _self.str_keyword.length > 0)
                    //    $('#' + _self.___id + ' .ui.search.input input').val(_self.str_keyword);
                    //else
                    //    _self.___bind_data();

                    _self.str_keyword = '';
                    $('#' + _self.___id + ' .ui.search.input input').val('');
                    _self.___bind_data();
                }
            });

            if (_self.isDissable) {
                $('#' + _self.___id).addClass("disabled");
            }
        },
        f_search_response: function (s) {
            var _self = this;
            console.log('SEARCH_RESPONSE = ' + _self.str_keyword);

            if (s && s.length > 1 && s[0] == '[' && s[s.length - 1] == ']') {
                var arr = JSON.parse(s);
                var id = _self.apiBindId;
                var name = _self.apiBindName;
                var condition = _self.apiCondition;
                if (condition && condition.length > 0) {
                    eval(' ___f_search_response_condition = ' + condition);
                    console.log('SEARCH1.11 = ' + _self.str_keyword, arr.length);
                    arr = _.filter(arr, ___f_search_response_condition);
                    console.log('SEARCH1.22 = ' + _self.str_keyword, arr.length);
                }

                _self.bit_searching = true;

                if (arr && Array.isArray(arr)) {
                    var a = _.map(arr, function (o) { return { id: o[id], name: o[name], name_ascii: '' }; });
                    console.log('SEARCH.OK = ' + _self.str_keyword, a);
                    _self.list = a;
                }
            }
        },
        f_keyup: function (event) {
            var _self = this;

            var val = event.target.value.trim().toLowerCase();
            val = val.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
            val = val.replace(/ + /g, " ");

            console.log('SEARCH.BEGIN ... ', _self.str_keyword, val);

            if (val != _self.str_keyword || val.length == 0) {

                if (_self.xhr_search != null) {
                    _self.xhr_search.abort();
                    _self.xhr_search = null;
                }

                var condition = ' function (o) { return true; }; ';
                var fix_ = '';

                if (val.length > 0) {
                    if (val.length > 2) fix_ = ' ';
                    var s_val = fix_ + val + fix_;

                    var is_ascii = encodeURIComponent(escape(val)).length == val.length;
                    if (isNaN(Number(val)) == false) {
                        condition = ' function (o) { return o["#ids"] != null && o["#ids"].indexOf(" ' + val + ' ") != -1; }; ';
                    } else if (is_ascii) {
                        condition = ' function (o) { return o["#ascii"] != null && o["#ascii"].indexOf("' + s_val + '") != -1; }; ';
                    } else {
                        condition = ' function (o) { return o["#utf8"] != null && o["#utf8"].indexOf("' + s_val + '") != -1; }; ';
                    }
                }

                var obj = { conditons: condition };

                var url = '/pol/api/dropdown/search/eb976d531188435ea006fce8769c53d5/' + _self.apiName;
                var xhr = new XMLHttpRequest();
                xhr.open('POST', url, true);
                xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                xhr.onload = function () {
                    if (xhr.readyState == 4 && xhr.status == '200') {
                        _self.f_search_response(xhr.responseText);
                    } else {
                        _self.f_search_response({ ok: false, message: '' });
                    }
                };
                xhr.send(JSON.stringify(obj));
                _self.xhr_search = xhr;

                _self.str_keyword = val;
                _self.bit_searching = true;

                _self.list = [];
                _self.list_ids = '';
            }
        },
        f_change_value: function (id, value, name, $selected) {
            var _self = this;
            if (name == null || name == undefined) name = '';

            var val = value == undefined ? '' : value, val_set_ = value;

            if (val.indexOf('</div>') != -1) val = val.split('</div>')[1].trim();

            //if (text && text.indexOf('</div>') != -1) text = text.split('</div>')[1].trim();

            val = _self.___parse_value(val);
            //console.log(_self.vueRef + ': value = ' + val + '; text = ' + name);

            _self.___save_value_changed(val, name);

            if (_self.eventChange) {
                // console.log('1.', _self.vueRef, val, name, _self.hasTrigerEvent);
                //if (_self.hasTrigerEventWhenSetValue != false) {

                if (_self.hasTrigerEvent != false) {
                    _self.eventChange(_self.vueRef, val, name, _self.objValue, _self.___id);
                }
                _self.hasTrigerEvent = null;

                //}
                //if (_self.hasTrigerEventWhenSetValue == false) _self.hasTrigerEventWhenSetValue = null;
            }

            if (_self.vueRefCallback) {
                //console.log('111111111111111', _self);
                //var vcall = null;
                //if (_self.$parent && _self.$parent.$refs && _self.$parent.$refs[_self.vueRefCallback]) {
                //    vcall = _self.$parent.$refs[_self.vueRefCallback];
                //    //console.log(_self.vueRefCallback, vcall);
                //    if (typeof vcall.___bind_data == 'function') vcall.___bind_data();
                //}

                _self.$parent.$children.forEach(v => {
                    if (v.vueRef == _self.vueRefCallback && typeof v.___bind_data == 'function') {

                        if (typeof v.___clear_selection == 'function') v.___clear_selection();

                        setTimeout(function () {
                            v.___bind_data();
                        }, 100);
                    }
                });
            }

            _self.___pop_coms_valid(val_set_);

        }
    }
});






Vue.component('kit-datetime', {
    mixins: [_MIXIN_COMS],
    template:
        '<div class="ui calendar"   style="float: left;background: rgb(255, 255, 255);min-width: 244px;    width: 100%; " >' +
        '   <div class= "ui input left icon" style="width:100%">' +
        '       <i class="calendar icon"></i>' +
        //  '       <input type="hidden">' +
        //'       <input :data-value="value" type="text" :placeholder="strPlaceholder">' +
        '       <input type="text" :placeholder="strPlaceholder" v-on:keyup="f_keyup">' +
        '   </div>' +
        '</div>',
    mounted: function () {
        var _self = this;
        Vue.nextTick(_self.f_ready);
    },
    methods: {
        f_ready: function () {
            var _self = this;

            $('#' + _self.___id + '.ui.calendar').calendar({
                monthFirst: false,
                type: 'date',
                text: {
                    days: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                    months: ['Tháng 1 -', 'Tháng 2 -', 'Tháng 3 -', 'Tháng 4 -', 'Tháng 5 -', 'Tháng 6 -', 'Tháng 7 -', 'Tháng 8 -', 'Tháng 9 -', 'Tháng 10 -', 'Tháng 11 -', 'Tháng 12 -'],
                    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    today: 'Today',
                    now: 'Now',
                    am: 'AM',
                    pm: 'PM'
                },
                //formatter: {
                //    date: function (date, settings) {
                //        if (!date) return '';
                //        var day = date.getDate();
                //        var month = date.getMonth() + 1;
                //        var year = date.getFullYear();
                //        return day + '/' + month + '/' + year;
                //    }
                //},
                ampm: false,
                formatter: {
                    date: function (date, settings) {
                        return _self.fn_date_format(date);
                    }
                },
                onSelect: function (value, mode) {
                    // Save values changed
                    var date = _self.fn_date_to_long(value);
                    var val = parseInt(date.toString().substr(0, 8));

                    //_self.value[_self.field.Name] = date;
                    //_self.innerModel = date;
                    console.log('KIT-DATETIME SELECTED = ', value, val, mode);

                    //console.log(_self.dataStoreValue, value);
                    if (_self.dataStoreValue) {
                        //_self.___mainGrid_setOptionSearchByKey(_self.dataStoreValue, val);
                        var a = _self.dataStoreValue.split('.');
                        var it = window[a[0]];
                        if (it) {
                            for (var i = 1; i < a.length; i++) {
                                //console.log(a[i]);
                                if (it.hasOwnProperty(a[i]) == false) it[a[i]] = {};
                                if (i == a.length - 1) {
                                    var key = a[i], ov = val;
                                    if (key.endsWith('_id') || key.startsWith('int_') || key.startsWith('bit_')) ov = parseInt(val);
                                    it[key] = ov;
                                }
                                it = it[a[i]];
                            }
                            it = val;
                        }
                    }

                    if (_self.eventChange) {
                        _self.eventChange(_self.vueRef, val, name);
                    }
                }
            });
        },
        f_close_calendar: function () {
            var _self = this;
            $('#' + _self.___id + '.ui.calendar').calendar("set date", new Date());
        },
        f_keyup: function (ev) {
            var _self = this;

            //keyCode === 37 Arrow left subtract one day
            //keyCode === 39 Arrow right add one day
            //keyCode === 13 Enter will commit selected date

            //console.log('KEYPRESS = ', ev);
            const key_ = ev.key;
            if (key_ == 'Backspace' || key_ == 'Delete') {
                var v = $('#' + _self.___id + ' input[type="text"]').val();
                //console.log(_self.vueRef, v);
                if (v.length == 0) {

                    var val = null;
                    var name = null;

                    //console.log(_self.dataStoreValue, value);
                    if (_self.dataStoreValue) {
                        //_self.___mainGrid_setOptionSearchByKey(_self.dataStoreValue, val);
                        var a = _self.dataStoreValue.split('.');
                        var it = window[a[0]];
                        if (it) {
                            for (var i = 1; i < a.length; i++) {
                                //console.log(a[i]);
                                if (it.hasOwnProperty(a[i]) == false) it[a[i]] = {};
                                if (i == a.length - 1) {
                                    var key = a[i], ov = val;

                                    if (key.endsWith('_id') || key.startsWith('int_') || key.startsWith('bit_'))
                                        ov = val == null ? 0 : parseInt(val);

                                    it[key] = ov;
                                }
                                it = it[a[i]];
                            }
                            it = val;
                        }
                    }

                    if (_self.eventChange) {
                        _self.eventChange(_self.vueRef, val, name);
                    }

                    const pop_ = $('#' + _self.___id + ' .ui.popup.calendar');
                    if (pop_.hasClass('visible')) pop_.removeClass('visible').addClass('hidden');
                    //$('#' + _self.___id + ' .ui.popup.calendar').popup('hide');
                }
            }
        },
        //format date: yyyy/MM/dd
        fn_date_format: function (date) {
            if (!date) return '';
            var day = date.getDate() + '';
            if (day.length < 2) {
                day = '0' + day;
            }
            var month = (date.getMonth() + 1) + '';
            if (month.length < 2) {
                month = '0' + month;
            }
            var year = date.getFullYear();
            return day + '/' + month + '/' + year;
        },
        fn_long_to_data: function (idate) {
            var date = idate.toString();

            var yyyy = date.substring(0, 4),
                MM = parseInt(date.substring(4, 6)) - 1,
                dd = date.substring(6, 8),
                HH = date.substring(8, 10),
                mm = date.substring(10, 12),
                ss = date.substring(12, 14);

            var val = new Date(yyyy, MM, dd, HH, mm, ss);
            return val;
        },
        fn_date_to_long: function (date) {
            if (!date) return '';

            var day = date.getDate() + '';
            if (day.length < 2) {
                day = '0' + day;
            }
            var month = (date.getMonth() + 1) + '';
            if (month.length < 2) {
                month = '0' + month;
            }
            var year = date.getFullYear();

            var h = (date.getHours()) + '';
            if (h.length < 2) {
                h = '0' + h;
            }
            var m = (date.getMinutes()) + '';
            if (m.length < 2) {
                m = '0' + m;
            }
            var now = new Date();
            var s = (now.getSeconds()) + '';
            if (s.length < 2) {
                s = '0' + s;
            }
            var f = (now.getMilliseconds()) + '';

            if (f.length < 2) {
                f = '00' + f;
            } else if (f.length === 2) {
                f = '0' + f;
            } else {
                //
            }

            return Number(year + '' + month + '' + day + '' + h + '' + m + '00');
        },
        fn_date_to_string: function (date) {
            if (!date) return '';

            var day = date.getDate() + '';
            if (day.length < 2) {
                day = '0' + day;
            }
            var month = (date.getMonth() + 1) + '';
            if (month.length < 2) {
                month = '0' + month;
            }
            var year = date.getFullYear();

            var h = (date.getHours()) + '';
            if (h.length < 2) {
                h = '0' + h;
            }
            var m = (date.getMinutes()) + '';
            if (m.length < 2) {
                m = '0' + m;
            }
            var now = new Date();
            var s = (now.getSeconds()) + '';
            if (s.length < 2) {
                s = '0' + s;
            }
            var f = (now.getMilliseconds()) + '';

            if (f.length < 2) {
                f = '00' + f;
            } else if (f.length === 2) {
                f = '0' + f;
            } else {
                //
            }

            return year + '' + month + '' + day + ' ' + h + ':' + m + ':' + 's';
        }
    }
});

Vue.component('kit-dropdown-check', {
    mixins: [_MIXIN_COMS],
    template:
        '<div class="ui floating dropdown labeled icon button" \
             style="float: left;border: 1px solid rgba(34,36,38,.15);background: #ffff;" \
             v-bind:style="[{\'min-width\' : (strMinWidth == null ? \'auto\' : strMinWidth)}, {\'width\': (strWidth == null ? \'100%\' : strWidth)}]"> \
            <i :class="[strIconTextbox,\'icon\']"></i> \
            <span class="text showme" value="0">{{strPlaceholder}}</span> \
            <div class="menu"> \
                <div class="ui icon search input"> \
                    <i class="search icon"></i> \
                    <input type="text" :placeholder="strPlaceholder"> \
                </div> \
                <div class="divider"></div> \
                <div class="scrolling menu"> \
                    <div class="item" data-value="-1"> \
                        <div class="ui red empty circular label"></div> \
                        <span @click="f_chose_all"> Tất cả ({{list.length}}) </span> \
                    </div> \
                    <div class="ui item checkbox" v-for="item in list" :data-value="item[strNameFieldValue]" :data-id="item.id" :data-name="item.name"> \
                        <input style="width: 100%;height: 100%;" type="checkbox" :value="item[strNameFieldValue]" @change="f_check_change(item,$event)"> \
                        <label>{{ item.name == "" ? "Không xác định" : item.name }}</label> <span style="display:none">{{item.name_ascii}}</span> \
                    </div> \
                </div> \
            </div> \
        </div>',
    data: function () {
        return {
            list: [],
            list_ids: ''
        };
    },
    created: function () {
        var _self = this;
        setTimeout(_self.___bind_data, 1);
    },
    mounted: function () {
        var _self = this;
        Vue.nextTick(_self.f_ready);
    },
    methods: {
        ___bind_data: function () {
            const _self = this;
            //console.log(_self.vueRef, ' apiName = ', _self.apiName);
            //console.log(_self.vueRef, ' apiCondition = ', _self.apiCondition);

            if (_self.apiName) {
                var fet = null;

                if (_self.apiCondition && _self.apiCondition.length > 0) {
                    fet = fetch___post('api/' + _self.apiName + '/search', { conditons: _self.apiCondition, page_number: 1, page_size: 1000000 });
                } else {
                    fet = fetch___get('api/' + _self.apiName + '/all');
                }

                fet.then(rs_ => {
                    //console.log(_self.vueRef, _self.apiName, rs_);
                    if (rs_ && rs_.ok && rs_.result_items) {
                        const a = _.map(rs_.result_items, function (o) {
                            //console.log('_self', _self);
                            //console.log('1', o);
                            //console.log('2222', o[_self.apiBindId]);
                            //console.log('2222',o[_self.apiBindName]);

                            return {
                                id: o[_self.apiBindId],
                                name: o[_self.apiBindName],
                                //name_ascii: ___convert_unicode_to_ascii(o[_self.apiBindName])
                                name_ascii: o['#']
                            };
                        });

                        const lsg = _.groupBy(a, function (o) { return o.id; });
                        const grs = _.map(lsg, function (vals_, name) { return vals_[0]; });
                        _self.list = grs;
                    } else {
                        _self.list = [];
                    }
                });
            }
        },
        ___reload: function () {
            var _self = this;
            //console.log('apiSendSetting', _self.apiSendSetting);
            ___apiSendSetting(_self.apiSendSetting).then((val) => {
                var a = [];
                a = val.result_items;
                //console.log('apiResultFilter', _self.apiResultFilter);
                if (_self.apiResultFilter) {
                    eval('___apiResultFilter = ' + _self.apiResultFilter);
                    a = _.filter(a, ___apiResultFilter);
                }
                a = _.map(a, function (o) {
                    return {
                        id: o[_self.apiBindId],
                        name: o[_self.apiBindName],
                        name_ascii: ___convert_unicode_to_ascii(o[_self.apiBindName])
                    };
                });
                _self.list = a;
                //console.log('apiSendSetting: a = ', a);
            });
        },
        f_ready: function () {
            var _self = this;
            //console.log('___id = ', _self.___id);
            $('#' + _self.___id).dropdown({
                action: _self.strAction,
                fullTextSearch: _self.bitFullTextSearch,
                sortSelect: true,
                match: 'text'
                //onChange: function (value, text, $selected) {
                //    console.log(value, text, $selected);
                //    //if (value == '-1' || value == -1) _self.f_chose_all();
                //}
                //onChange: function (value, text, $selected) {
                //    var val, id, name;
                //    if ($selected && $selected.length > 0) {
                //        var el = $selected[0], data_ = null;
                //        if (el.hasAttribute('data-value')) val = el.getAttribute('data-value');
                //        if (el.hasAttribute('data-id')) id = el.getAttribute('data-id');
                //        if (el.hasAttribute('data-name')) name = el.getAttribute('data-name');
                //    }
                //    _self.f_change_value(id, val, name, $selected);
                //}
            });

            $('#' + _self.___id + ' .checkbox').checkbox();
        },
        f_chose_all: function () {
            var _self = this;
            _self.list_ids = '';
            _self.list = [];

            $('#' + _self.___id + ' .ui.search.input input').val('');
            $('#' + _self.___id + ' .showme').text('');

            _self.f_check_change();

            _self.___bind_data();
        },
        f_change_value: function (id, value, name) {
            var _self = this;
            var val = value.toString();

            if (val.indexOf('</div>') != -1) val = val.split('</div>')[1].trim();

            //if (text && text.indexOf('</div>') != -1) text = text.split('</div>')[1].trim();

            //console.log('dataStoreValue = ', _self.dataStoreValue);
            //console.log('id = ', id);
            //console.log('value = ', value);
            //console.log('name = ', name);


            if (_self.dataStoreValue) {

                //_self.___mainGrid_setOptionSearchByKey(_self.dataStoreValue, val);
                var a = _self.dataStoreValue.split('.');
                //console.log(a);
                var it = window[a[0]];
                if (it) {
                    for (var i = 1; i < a.length; i++) {
                        //console.log(i, a[i], it.hasOwnProperty(a[i]));

                        if (it.hasOwnProperty(a[i]) == false) it[a[i]] = {};
                        if (i == a.length - 1) {
                            var key = a[i], ov = val;
                            if (key.endsWith('_id') || key.startsWith('int_') || key.startsWith('bit_')) ov = parseInt(val);
                            it[key] = ov;
                        }
                        it = it[a[i]];
                    }
                    it = val;
                }
                console.log(_self.vueRef + ': ' + _self.dataStoreValue + ' = ' + it);
            }

            if (_self.eventChange) {
                _self.eventChange(_self.vueRef, val, name);
            }

            if (_self.vueRefCallback) {
                //console.log('111111111111111', _self);
                //var vcall = null;
                //if (_self.$parent && _self.$parent.$refs && _self.$parent.$refs[_self.vueRefCallback]) {
                //    vcall = _self.$parent.$refs[_self.vueRefCallback];
                //    //console.log(_self.vueRefCallback, vcall);
                //    if (typeof vcall.___bind_data == 'function') vcall.___bind_data();
                //}

                _self.$parent.$children.forEach(v => {
                    if (v.vueRef == _self.vueRefCallback && typeof v.___bind_data == 'function') {
                        setTimeout(function () {
                            v.___bind_data();
                        }, 100);
                    }
                })
            }
        },
        f_change_value111: function (value, text) {
            var _self = this;
            var val = value.toString();
            if (val.indexOf('</div>') != -1) val = val.split('</div>')[1].trim();

            if (text && text.indexOf('</div>') != -1) text = text.split('</div>')[1].trim();

            //console.log(_self.dataStoreValue, value);
            if (_self.dataStoreValue) {
                //_self.___mainGrid_setOptionSearchByKey(_self.dataStoreValue, val);
                var a = _self.dataStoreValue.split('.');
                var it = window[a[0]];
                if (it) {
                    for (var i = 1; i < a.length; i++) {
                        //console.log(a[i]);
                        if (it.hasOwnProperty(a[i]) == false) it[a[i]] = {};
                        if (i == a.length - 1) {
                            var key = a[i], ov = val;
                            if (key.endsWith('_id') || key.startsWith('int_') || key.startsWith('bit_')) ov = parseInt(val);
                            it[key] = ov;
                        }
                        it = it[a[i]];
                    }
                    it = val;
                }
            }

            if (_self.eventChange) {
                _self.eventChange(_self.vueRef, val, text);
            }

            if (_self.vueRefCallback) {
                var vcall = null;
                if (_self.$parent && _self.$parent.$refs && _self.$parent.$refs[_self.vueRefCallback]) {
                    vcall = _self.$parent.$refs[_self.vueRefCallback];
                    //console.log(_self.vueRefCallback, vcall);
                    if (typeof vcall.___reload == 'function') vcall.___reload();
                }
            }
        },
        f_check_change: function (item) {
            var _self = this, id = null;
            if (item && item.id) id = item.id;

            //if (_self.list_ids && _self.list_ids.length > 0 && id && _self.list_ids.indexOf(',' + id + ',') == -1) {
            if (id && _self.list_ids.indexOf(',' + id + ',') == -1) {
                //add new
                console.log('111111111111111111');
                if (_self.list_ids.length == 0)
                    _self.list_ids = ',' + id + ',';
                else
                    _self.list_ids = _self.list_ids + id + ',';
            } else {
                console.log('2222222222222222222');

                //   $('#' + _self.___id + ' .ui.search.input input').val('');
                $('#' + _self.___id).dropdown('clear');
                //remove
                if (_self.list_ids.length > 0) {
                    _self.list_ids = _self.list_ids.split(',' + id + ',').join(',');
                    if (_self.list_ids == ',') _self.list_ids = '';
                }
            }

            console.log('f_check_change: list_ids = ', _self.list_ids);

            var names = [];
            var size = (_.filter(_self.list_ids.split(','), function (o) { return o.trim().length > 0; })).length;
            if (size > 0) {
                $('#' + _self.___id + ' .ui.search.input input').val('Bạn đã chọn (' + size + ')');
                $('#' + _self.___id + ' .showme').text(_self.strPlaceholder + ' (' + size + ')');

                names = _.map(_.filter(_self.list, function (o) { return _self.list_ids.indexOf(',' + o.id + ',') != -1; }), function (t) { return t.name });
            } else {
                $('#' + _self.___id + ' .ui.search.input input').val('');
                $('#' + _self.___id + ' .showme').text(_self.strPlaceholder);
            }

            _self.f_change_value(_self.list_ids, _self.list_ids, names.join('|'));
        }
    }
});

Vue.component('kit-dropdown-year', {
    mixins: [_MIXIN_COMS],
    template: ___get_template('kit-dropdown-year'),
    data: function () {
        return {
            ui_label_title: 'Tất cả năm',
        };
    },
    props: ['items'],
    created: function () {
        var _self = this;
    },
    mounted: function () {
        var _self = this;

    },
    methods: {
    }
});

Vue.component('kit-full-date-time', {
    mixins: [_MIXIN_COMS],
    template:
        '<div class="ui calendar">' +
        '   <div class= "ui input left icon" style="width:100%">' +
        '       <i class="calendar icon"></i>' +
        // '       <input  type="hidden">' +
        //'       <input :data-value="value" type="text" :placeholder="strPlaceholder">' +
        '       <input type="text" :placeholder="strPlaceholder" v-on:keyup="f_keyup">' +
        '   </div>' +
        '</div>',
    mounted: function () {
        var _self = this;
        Vue.nextTick(_self.f_ready);
    },
    methods: {
        f_ready: function () {
            var _self = this;

            $('#' + _self.___id + '.ui.calendar').calendar({
                monthFirst: false,
                //  type: 'date',
                text: {
                    days: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                    months: ['Tháng 1 -', 'Tháng 2 -', 'Tháng 3 -', 'Tháng 4 -', 'Tháng 5 -', 'Tháng 6 -', 'Tháng 7 -', 'Tháng 8 -', 'Tháng 9 -', 'Tháng 10 -', 'Tháng 11 -', 'Tháng 12 -'],
                    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    today: 'Today',
                    now: 'Now',
                    am: 'AM',
                    pm: 'PM'
                },
                formatter: {
                    date: function (date, settings) {
                        if (!date) return '';
                        var day = date.getDate();
                        var month = date.getMonth() + 1;
                        var year = date.getFullYear();
                        return day + '/' + month + '/' + year;
                    }
                },
                onSelect: function (value, mode) {
                    // Save values changed
                    var date = _self.fn_date_to_long(value);
                    var val = parseInt(date.toString().substr(0, 8));

                    //_self.value[_self.field.Name] = date;
                    //_self.innerModel = date;
                    // console.log('KIT-DATETIME SELECTED = ', value, val, mode, date);

                    if (mode != "day") {
                        $('#' + _self.___id).attr('date-val', date);
                    }

                    //console.log(_self.dataStoreValue, value);
                    if (_self.dataStoreValue) {
                        //_self.___mainGrid_setOptionSearchByKey(_self.dataStoreValue, val);
                        var a = _self.dataStoreValue.split('.');
                        var it = window[a[0]];
                        if (it) {
                            for (var i = 1; i < a.length; i++) {
                                //console.log(a[i]);
                                if (it.hasOwnProperty(a[i]) == false) it[a[i]] = {};
                                if (i == a.length - 1) {
                                    var key = a[i], ov = val;
                                    if (key.endsWith('_id') || key.startsWith('int_') || key.startsWith('bit_')) ov = parseInt(val);
                                    it[key] = ov;
                                }
                                it = it[a[i]];
                            }
                            it = val;
                        }
                    }
                }
            });
        },
        f_keyup: function (ev) {
            var _self = this;
            const key_ = ev.key;

            if (key_ == 'Backspace' || key_ == 'Delete') {
                var v1 = $('#' + _self.___id + ' input[type="text"]').val('');
                var v = $('#' + _self.___id + ' input[type="hidden"]').val('');
                var c = $('#' + _self.___id).removeAttr('date-val');
            }
        },
        //format date: yyyy/MM/dd 
        fn_date_format: function (date) {
            if (!date) return '';
            var day = date.getDate() + '';
            if (day.length < 2) {
                day = '0' + day;
            }
            var month = (date.getMonth() + 1) + '';
            if (month.length < 2) {
                month = '0' + month;
            }
            var year = date.getFullYear();
            return day + '/' + month + '/' + year;
        },
        fn_long_to_data: function (idate) {
            var date = idate.toString();

            var yyyy = date.substring(0, 4),
                MM = parseInt(date.substring(4, 6)) - 1,
                dd = date.substring(6, 8),
                HH = date.substring(8, 10),
                mm = date.substring(10, 12),
                ss = date.substring(12, 14);

            var val = new Date(yyyy, MM, dd, HH, mm, ss);
            return val;
        },
        fn_date_to_long: function (date) {
            if (!date) return '';

            var day = date.getDate() + '';
            if (day.length < 2) {
                day = '0' + day;
            }
            var month = (date.getMonth() + 1) + '';
            if (month.length < 2) {
                month = '0' + month;
            }
            var year = date.getFullYear();

            var h = (date.getHours()) + '';
            if (h.length < 2) {
                h = '0' + h;
            }
            var m = (date.getMinutes()) + '';
            if (m.length < 2) {
                m = '0' + m;
            }
            var now = new Date();
            var s = (now.getSeconds()) + '';
            if (s.length < 2) {
                s = '0' + s;
            }
            var f = (now.getMilliseconds()) + '';

            if (f.length < 2) {
                f = '00' + f;
            } else if (f.length === 2) {
                f = '0' + f;
            } else {
                //
            }

            return Number(year + '' + month + '' + day + '' + h + '' + m + '00');
        },
        fn_date_to_string: function (date) {
            if (!date) return '';

            var day = date.getDate() + '';
            if (day.length < 2) {
                day = '0' + day;
            }
            var month = (date.getMonth() + 1) + '';
            if (month.length < 2) {
                month = '0' + month;
            }
            var year = date.getFullYear();

            var h = (date.getHours()) + '';
            if (h.length < 2) {
                h = '0' + h;
            }
            var m = (date.getMinutes()) + '';
            if (m.length < 2) {
                m = '0' + m;
            }
            var now = new Date();
            var s = (now.getSeconds()) + '';
            if (s.length < 2) {
                s = '0' + s;
            }
            var f = (now.getMilliseconds()) + '';

            if (f.length < 2) {
                f = '00' + f;
            } else if (f.length === 2) {
                f = '0' + f;
            } else {
                //
            }

            return year + '' + month + '' + day + ' ' + h + ':' + m + ':' + 's';
        }
    }
});

//////////////////////////////////////////////////////////////////////////////
/* POPUP */

var ___popup_buttons_disable = function (functions) {
    if (typeof _VPOP.___popup_buttons_disable == 'function') _VPOP.___popup_buttons_disable(functions);
};

var ___popup = function (name, para, _props) {
    if (para && typeof para == 'object') para = JSON.stringify(para);
    if (para) para = para.split('`').join('"');
    console.log('>>>>> UI.OPEN_POPUP -> ' + name, para);

    //-------------------------------------------------------------------------
    if (_props && typeof _props == 'string') _props = JSON.parse(_props.split('`').join('"'));
    if (_props == null) _props = {};

    var _data = {
        loading: false,
        strHtmlFooter: '',
        strSubmitText: 'Cập nhật',
        strSubmitIcon: 'chevron down',
        buttons: { disables: [] },
        objStyle: {
            header: {
                height: '45px'
            },
            footer: {
                height: '45px'
            },
            bgcolor: '#fff',
            width: jQuery(window).width() < 1281 ? '45%' : '50%',
            height: '100vh',
            left: 'auto',
            right: 'auto',
            top: '0px'
        }
    };
    for (var i = 0; i < 10; i++) _data.buttons.disables.push(true);

    if (_props.strSubmitText) _data.strSubmitText = _props.strSubmitText;
    if (_props.strSubmitIcon) _data.strSubmitIcon = _props.strSubmitIcon;
    if (_props.popHeaderVisible == false) _data.objStyle.header.height = '0px';

    if (_props.strWidth) _data.objStyle.width = _props.strWidth;
    if (_props.strHeight) {
        _data.objStyle.height = _props.strHeight;
    }
    if (_props.strAlign && _props.strAlign == 'right') {
        _data.objStyle.right = '0px';
    } else if (_props.strAlign && _props.strAlign == 'left') {
        _data.objStyle.left = '0px';
    } else {
        _data.objStyle.left = 'calc( (100% - ' + _data.objStyle.width + ') / 2 )';
        _data.objStyle.right = 'auto';
    }
    _data.objStyle.top = 'calc( (100vh - ' + _data.objStyle.height + ') / 2 )';

    for (var ki in _MIXIN_COMS.props)
        if (!_data.hasOwnProperty(ki)) _data[ki] = _props[ki];

    //-------------------------------------------------------------------------

    var htm = ___get_template(name);
    if (htm.indexOf('<div for="___footer"') > 0) {
        var af = htm.split('<div for="___footer"');
        _data.strHtmlFooter = '<div><div for="___footer"' + af[af.length - 1];
    }

    var temp = ___get_template('popup').split('[POPUP_BODY]').join('<' + name + ' ref="' + name + '"></' + name + '>');
    if (_data.strHtmlFooter.length > 0) temp = temp.split('<!--[POPUP_FOOTER]-->').join(_data.strHtmlFooter);

    //console.log(temp);

    var id = ___guid();
    _V_POPUP_CURRENT_ID = id;
    _V_POPUP_CURRENT_NAME = name;
    var div = document.createElement('div');
    div.innerHTML = temp;
    div.id = id;
    //  div.style.zIndex = 999999999;
    div.style.zIndex = 99999;
    div.style.position = 'relative';

    document.body.append(div);

    _VPOP = new Vue({
        mixins: [_VUE_FUNCTIONS],
        computed: {
            ___para: function () {
                if (para && para.length > 0) {
                    var p = JSON.parse(para);
                    //console.log('UI.POPUP > ___para = ', para);
                    return p;
                }
                return null;
            },
            ___is_main: function () { return false; },
            ___is_popup: function () { return true; },
            ___is_lookup: function () { return false; }
        },
        data: function () {
            return _data;
        },
        el: '#' + id,
        mounted: function () {
            const _self = this, v = _self.$refs[name];
            if (v) {
                v.visible = true;

                _VPOP_DATA = v.$data;

                Vue.nextTick(function () {
                    if (typeof v.___visible == 'function') {
                        v.___visible(true);
                    }
                });
            }
        },
        methods: {
            ___popup_buttons_disable: function (functions) {
                var disable = false, el;
                if (functions) {
                    for (var i = 0; i < functions.length; i++) {
                        el = document.querySelector('div[for="FOOTER"] div[for="___footer"] *[tabindex="' + i + '"]');
                        if (el) {
                            disable = functions[i]();

                            // ẩn thi dùng cái này
                            if (disable) {
                                $(el).css('display', 'none')
                            } else {
                                $(el).css('display', 'block')
                            }

                            // disable thi dùng cái này
                            //if (disable) {
                            //    if (classie.has(el, 'disabled') == false) classie.add(el, 'disabled');
                            //} else {
                            //    if (classie.has(el, 'disabled')) classie.remove(el, 'disabled');
                            //}
                        }
                    }
                }
            },
            ___submit: function (vueRef, para_) {
                const _self = this;
                const v = _self.$refs[name];
                if (v && typeof v.___submit == 'function') {
                    v.___submit(vueRef, para_, para, _props);
                }
            },
            popup_close: function () {
                ___popup_close(id);
            }
        }
    });
};

var ___popup_close = function (id) {
    if (id == null || id == undefined) id = _V_POPUP_CURRENT_ID;
    if (id) {
        var el = document.getElementById(id);
        if (el && el.__vue__) {
            el.__vue__.$destroy();
            el.remove();
            //if (_V_POPUP_CURRENT_NAME == 'kit-popup-hien-thi-mess') _APP.objNotify = [];
            _V_POPUP_CURRENT_NAME = null;
        }
    }
};

var ___para_decode = function (para) { return JSON.parse(para.split('`').join('"')); };

//////////////////////////////////////////////////////////////////////////////
/* APP */

var app___install = function () { };
head.load([{ css_app: '/_app/' + _SCOPE + '/app.css' }, { app_js: '/_app/' + _SCOPE + '/app.js?v=' + new Date().getHours() }], app___install);

//head.load([{ css_app: '/_app/' + _SCOPE + '/app.css' }, { app_js: '/_app/' + _SCOPE + '/app.js' }], app___install);

//////////////////////////////////////////////////////////////////////////////
/* NOTIFY */
