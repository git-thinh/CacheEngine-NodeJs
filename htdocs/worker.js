importScripts('./_sw/lib/localforage.min.js');
localforage.config({ driver: localforage.INDEXEDDB });
importScripts('./_sw/lib/lodash.min.js');

//const _URI_BASE = 'https://test.f88.vn/';
const _URI_BASE = location.protocol + '//' + location.host + '/';
console.log('SW > URI_BASE = ', _URI_BASE);

///////////////////////////////////////////////////////////////////////////////////

importScripts('./_sw/lib/pouchdb/pouchdb-7.1.1.min.js');
importScripts('./_sw/lib/pouchdb/pouchdb.memory.min.js');
importScripts('./_sw/lib/pouchdb/db-store.js');

const _STORE_USER = new DbStore('user');
const _STORE_NOTIFY = new DbStore('notify');

///////////////////////////////////////////////////////////////////////////////////

//#region [ MSG ]

const MSG_REG_WEB_PUSH = new BroadcastChannel('MSG_REG_WEB_PUSH');
MSG_REG_WEB_PUSH.onmessage = e => {
    var data = e.data;

    console.log('MSG_REG_WEB_PUSH === ', JSON.parse(data));
    //___reg_web_push(data);
};

const msg___on_message = function (e) {
    var data = e.data;
    console.log('SW > MESSAGE: data = ', data);
};
//self.addEventListener('message', (e) => msg___on_message(e));

const msg___broadcast = function (data) {
    console.log('SW > BROADCAST: data = ', data);
    var m = new BroadcastChannel('MSG_ALL_CLIENT');
    m.postMessage(data);
    m.close();
};

//#endregion

///////////////////////////////////////////////////////////////////////////////////

//#region [ ___guid, ___convert_unicode_to_ascii ]

const ___guid = function () {
    return 'id-xxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const ___convert_unicode_to_ascii = function (str) {
    if (str == null || str.length == 0) return '';
    str = str.trim();
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

//#endregion

///////////////////////////////////////////////////////////////////////////////////


//#region [ PUSH, INSTALL, ACTIVATE ]

const ___sw_on_push = async function (e) {
    if (e.data) {
        const data = await e.data.text();
        console.log('SW -> PUSH = ', data);
    }

    //self.registration.showNotification(data.title, { body: 'Yay it works!' });
};
self.addEventListener('push', (e) => ___sw_on_push(e));

const ___sw_on_install = function (e) {
    console.log('SW > INSTALL ...');
};

const ___sw_on_activate = function (e) {
    console.log('SW > ACTIVE ...');
};

const _WEB_PUSH_PUBLIC_VAPID_KEY = 'BMHYaPEnL1SiYgRQHt7cDz_kuFTY7DrPTQCv3q-SuK2BcOPz4EJG5CWO4ss72nYvcRnjaGuxE-OySrZv9oJmDnI';

const webpush___urlbase64_to_uint8array = function (base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const ___sw_on_load_init = async function (e) {

    ////self.registration.pushManager.subscribe({
    ////    userVisibleOnly: true,
    ////    applicationServerKey: webpush___urlbase64_to_uint8array(_WEB_PUSH_PUBLIC_VAPID_KEY)
    ////}).then(subscription => {
    ////    console.log('SW > LOAD_INIT_JS: subscription = ', subscription);
    ////    return fetch('/subscribe', {
    ////        method: 'POST',
    ////        body: JSON.stringify(subscription),
    ////        headers: {
    ////            'Content-Type': 'application/json'
    ////        }
    ////    });
    ////}).then(res => res.json()).then(j => {
    ////    console.log('post -> subscrib: ok = ', j);
    ////}).catch((err) => {
    ////    console.log('post -> subscrib: error = ', err);
    ////});

    console.log('SW > LOAD_INIT_JS ... ');



    _STORE_USER.get('PROFILE').then(user => {
        console.log('SW > LOAD_INIT_JS: user = ', user);
        msg___broadcast({ command: 'SW_LOAD_INIT_JS_DONE', data: user });
    });



    //await _STORE_USER.getAll().then(items => {
    //    console.log('SW > LOAD_INIT_JS > POUCHDB: items = ', items);
    //});


};

//#endregion

///////////////////////////////////////////////////////////////////////////////////

//#region [ FETCH - API ]


const fetch___post = function (url, data) {
    console.log('SW > FETCH___POST: ', url, data);

    const option = {
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
    return fetch(url, option);
};

importScripts('./_sw/lib/ServiceWorkerWare.js');

//By using Mozilla's ServiceWorkerWare we can quickly setup some routes
var ___API = new ServiceWorkerWare();

importScripts('./_sw/fetch/user.js');
//importScripts('./_sw/fetch/quote.js');

// Start the service worker.
___API.init();

//#endregion
