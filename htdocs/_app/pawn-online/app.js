
window.addEventListener("beforeunload", function (event) {

    if (typeof (Storage) !== 'undefined') {
        // Khởi tạo sesionStorage
        sessionStorage.setItem('isF5Broser', true);
        // get sessionStorage
        //  sessionStorage.getItem('name');
        // lấy ra số lượng session đã lưu trữ
        //  sessionStorage.length;
        // xóa 1 item localStorage
        //  sessionStorage.removeItem('name');
        // xóa tất cả item trong sessionStorage
        //  sessionStorage.clear();
    } else {
        alert('Trình duyệt của bạn không hỗ trợ!');
    }
});


___PAGE_SIZE = 15;
const _MAIN_TOOLBAR_FILTER_HEIGHT_MAX = 170;
const _MAIN_TOOLBAR_FILTER_HEIGHT_MIN = 40;
const _MAIN_TOOLBAR_FILTER_HEIGHT = _MAIN_TOOLBAR_FILTER_HEIGHT_MAX;

// config url test-dev - release - local

if (location.host == 'test-pol.f88.vn') HOST_POS_BASE_URI = 'https://test-pos-mobi.f88.vn/';   // release -DEV-TEST
//if (location.host == 'test.f88.vn') HOST_POS_BASE_URI = 'https://192.168.10.54:4437/';     // test-dev
if (location.host == 'test.f88.vn') HOST_POS_BASE_URI = 'http://localhost:8001/';     // test-local
if (location.host == '192.168.10.54:4439') HOST_POS_BASE_URI = 'https://192.168.10.54:4437/';   // test local

//if (location.host == 'apimobi.f88.vn:4439') HOST_POS_BASE_URI = 'https://192.168.10.54:4309/';   //  release thật với POS test trên 54
if (location.host == 'apimobi.f88.vn:4439') HOST_POS_BASE_URI = 'https://test-pos-mobi.f88.vn/';   //  release thật với POS test trên 54

//if (location.host == 'apimobi.f88.vn') HOST_POS_BASE_URI = 'https://testpos.f88.vn/';   //  //  release thật với Testpos.f88.vn
if (location.host == 'apimobi.f88.vn') HOST_POS_BASE_URI = 'https://pos.f88.vn/';   //  //  release thật với POS thật pos.f88.vn    --- CHẠY THẬT NHỚ MỞ CÁI NÀY NHÉ


_DATA = {
    messages: [],
    loading: false,
    objPopup: {
    },
    objApp: {
        header: { height: 45 },
        breadcrumb: { height: 0 },
        toolbar: {
            height: _MAIN_TOOLBAR_FILTER_HEIGHT
        },
        grid: {
            header: { height: 45 },
            page_number: 1,
            page_size: ___PAGE_SIZE,
            page_total: 0
        },
        pager: { height: 35 },
        footer: { height: 20 }
    },
    objMainGrid: {
        loading: true,
        inited: false,
        menu: {
            visible: false
        }
    },
    objSearch: {
        optionsCurrent: {},
        optionsRuntime: {
            int_status: null,
            int_state_menu: 10
        }
    },
    objModel: {
        ok: true,
        result_items: [],
        request: {},
        total_items: 0,
        count_result: 1,
        page_total: 0,
        page_number: 1,
        page_size: 20
    },
    objItemsSelected: {
        items: []
    },
    objItemsChecked: {
        visible: false,
        checkAll: false,
        ids_: [],
        ids: []
    },
    objNotify: [],
    objCountTotalPawnCall: {
        call_tatca: {
            count: 0,
            int_status: null,
            int_state_menu: 10
        },
        call_canxuly: {
            count: 0,
            int_status: 2,
            int_state_menu: 9
        },
        call_huydangky: {
            count: 0,
            int_status: 0,
            int_state_menu: 13
        },
        call_chuatuvan: {
            count: 0,
            int_status: 1,
            int_state_menu: 10
        },
        call_chuachia: {
            count: 0,
            int_status: 1,
            int_state_menu: 12
        },
        call_dangchamsoc: {
            count: 0,
            int_status: 2,
            int_state_menu: 10
        },
        call_nhancamco: {
            count: 0,
            int_status: 4,
            int_state_menu: 10
        },
        call_khongllduoc: {
            count: 0,
            int_status: 2,
            int_state_menu: 11
        }
    },
    objCountTotalPawnShop: {
        shop_tatca: {
            count: 0,
            int_status: null,
            int_state_menu: 10
        },
        shop_choxuly: {
            count: 0,
            int_status: null,
            int_state_menu: 0
        },
        shop_dangxuly: {
            count: 0,
            int_status: null,
            int_state_menu: 1
        },
        shop_nhancamco: {
            count: 0,
            int_status: 4,
            int_state_menu: 10
        },
        shop_dahuy: {
            count: 0,
            int_status: null,
            int_state_menu: 4
        },
        shop_dkoto: {
            count: 0,
            int_status: null,
            int_state_menu: 9
        }
    }
};

///////////////////////////////////////////////////////////////////////////
function ___notify_update_readed() {
    if (_DATA.objNotify.length > 0) {
        fetch___post('api/notify/update/' + _PROFILE.user_id + '/' + _DATA.objNotify[0].id + '/eb976d531188435ea006fce8769c53d5').then(rs_ => {
            console.log('NOTIFY_UPADTE = ', rs_);
        });
    }
}

function ___notification(title, body) {
    var n = new Notification(title, {
        icon: location.protocol + '//' + location.host + '/_lib/images/f88.png',
        body: body
       // display: standalone
    });
    n.onclick = function () {
        ___popup_close();

        setTimeout(function () {
            ___popup('kit-popup-hien-thi-mess', null, { strAlign: 'right', strTitle: 'Thông báo' });
        }, 100);

        //___notify_update_readed(); 
    };
}

function ___notify_show(type, title, body) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        //var notification = new Notification(text);
        ___notification(title, body);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                //var notification = new Notification(text);
                ___notification(title, body);
            }
        });
    }

    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
}

const ___process_notify_backup = function (arr) {
    //  console.log('NOTIFY = ', arr);
    if (arr.length > 0) {
        var max_len = 99;
        var hasReloadAll = _.find(arr, function (o) { return o.int_status == 0 && o.str_actions && o.str_actions.indexOf('PAGE_RELOAD_ALL') != -1; }) != null;
        var hasReload = _.find(arr, function (o) { return o.int_status == 0 && o.str_actions && o.str_actions.indexOf('PAGE_RELOAD') != -1; }) != null;
        var hasReloadUser = _.find(arr, function (o) { return o.int_status == 0 && o.str_actions && o.str_actions.indexOf('USER_RELOAD') != -1; }) != null;

        //console.log(hasReload, hasReloadUser, hasReloadAll);

        if (hasReloadAll) {
            if (_APP && _APP.objModel && _APP.objModel.page_number) page_number = _APP.objModel.page_number;
            if (_APP && typeof _APP.f_pager_go == 'function') _APP.f_pager_go(page_number);
            else setTimeout(function () { if (_APP) _APP.f_pager_go(page_number); }, 2000);
        } else if (hasReload) {

            var ref_id = arr[0].ref_ids;
            var arrModel = _DATA.objModel.result_items;
            var page_number = 1;

            if (_PROFILE.user_id == 617 && ref_id && arrModel.length > 0) {
                var hasPage = _.find(arrModel, function (o) { return o.id == ref_id; }) != null;
                if (hasPage) {

                    if (_APP && _APP.objModel && _APP.objModel.page_number) page_number = _APP.objModel.page_number;
                    if (_APP && typeof _APP.f_pager_go == 'function') _APP.f_pager_go(page_number);
                    else setTimeout(function () { if (_APP) _APP.f_pager_go(page_number); }, 2000);
                }
            } else {
                if (_APP && _APP.objModel && _APP.objModel.page_number) page_number = _APP.objModel.page_number;
                if (_APP && typeof _APP.f_pager_go == 'function') _APP.f_pager_go(page_number);
                else setTimeout(function () { if (_APP) _APP.f_pager_go(page_number); }, 2000);
            }
        }

        if (hasReloadUser) {

            var pro = 'function(i) { return i.id ==' + _PROFILE.user_id + '; }';
            fetch___post('api/user/search', { conditons: pro, page_number: 1, page_size: 100000 }).then(rs_ => {

                _PROFILE.int_pol_status = rs_.result_items[0].int_pol_status;
                _STORE_USER.remove('PROFILE');

                setTimeout(function () {
                    _STORE_USER.add('PROFILE', _PROFILE);
                }, 2000);
            });

        }

        var len = arr.length;
        if (len > max_len) len = max_len;

        var msg = 'Bạn có ' + len + ' thông báo mới';
        var a = arr;

        _DATA.objNotify.forEach(ai => {
            ai.int_status = 1;
            a.push(ai);
        });

        a = _.filter(a, function (o, index) { return index <= max_len; });

        _DATA.objNotify = a;
        ___notify_show(0, 'PAWN ONLINE', msg);
    }
};


const ___process_notify = function (arr) {
    //  console.log('NOTIFY = ', arr);
    if (arr.length > 0) {
        var max_len = 99;

        var hasReloadUser = _.find(arr, function (o) { return o.int_status == 0 && o.str_actions && o.str_actions.indexOf('USER_RELOAD') != -1; }) != null;

        if (hasReloadUser) {

            var pro = 'function(i) { return i.id ==' + _PROFILE.user_id + '; }';
            fetch___post('api/user/search', { conditons: pro, page_number: 1, page_size: 100000 }).then(rs_ => {
                if (rs_ && rs_.result_items && rs_.result_items.length > 0) {

                    //  console.log('@@@@@@@@@@@@ int_pol_status 1 === ', _PROFILE.int_pol_status);

                    _PROFILE.int_pol_status = rs_.result_items[0].int_pol_status;
                    _STORE_USER.add('PROFILE', _PROFILE);

                    //_STORE_USER.remove('PROFILE');

                    setTimeout(function () {
                        //_STORE_USER.add('PROFILE', _PROFILE);

                        _STORE_USER.get('PROFILE').then(o => {
                            //       console.log('@@@@@@@@@@@@ int_pol_status 2 === ', o.int_pol_status);
                        });

                    }, 500);
                }
            });

        }

        if (hasReloadUser && (arr[0].int_type == 1 || arr[0].int_type == 0) && arr[0].str_actions == "USER_RELOAD") {

            $.each(_APP.$children,
                function (i, v) {
                    switch (v.vueRef) {
                        case "MENU_USER___ONLINE_ON_OFF":
                            v.objValueDefault = arr[0].int_type;

                            var input = $('#' + v.___id).find('input');
                            var label = $('#' + v.___id).find('label');

                            if (arr[0].int_type == 0) {

                                input[0].checked = false;
                                label[0].innerText = "Offline";
                            } else {
                                input[0].checked = true;
                                label[0].innerText = "Online";
                            }
                            v.$forceUpdate();
                            break;
                        default:

                    }
                });
        }

        var len = arr.length;
        if (len > max_len) len = max_len;

        var msg = 'Bạn có ' + len + ' thông báo mới';
        var a = arr;

        _DATA.objNotify.forEach(ai => {
            ai.int_status = 1;
            a.push(ai);
        });

        a = _.filter(a, function (o, index) { return index <= max_len; });

        _DATA.objNotify = a;
        ___notify_show(0, 'PAWN ONLINE', msg);
    }
};


const ___notify_sse_setup = function () {

    var source = new EventSource('/get-notify/' + _PROFILE.user_id);
    source.onerror = function (err) {
        //console.log("EventSource failed.", err);
        ___notify_sse_setup();
    };
    source.onmessage = (e) => {
        ___notify_sse_socketio_on_message(e.data);
        //  console.log("@############## SSE = ", e.data);
    };
};

const ___notify_sse_socketio_on_message = function (data) {
    try {
        var o = JSON.parse(data);
        var it;
        // console.log("@############## IOOOO 12121212 = ", data);
        switch (o.command) {
            case 'PAWN_RELOAD_ALL':
                //   console.log("@############## IOOOO = ", o.data);
                ___reload();
                ___fetch_notify();
                break;
            case 'PAWN_RELOAD_ID':
                //  console.log("@############## IOOOO = ", o.data);
                if (o.id) {
                    it = _.find(_DATA.objModel.result_items, function (x) { return x.id == o.id; });
                    if (it) {
                        ___reload();
                        ___fetch_notify();
                    }
                }
                break;
            case 'NOTIFY_RELOAD_ALL':
                // console.log("@############## IOOOO = ", o.data);
                ___fetch_notify();
                break;
            default:
                //  console.log("@############## IOOOO = ", data);
                break;
        }
    } catch (er) {
        ;
    }
};

const ___fetch_notify = function () {
    if (_PROFILE && _PROFILE.user_id) {
        var url = '/pol/api/notify/' + _PROFILE.user_id;
        if (_DATA.objNotify.length > 0)
            url = '/pol/api/notify/limit/' + _PROFILE.user_id + '/' + _DATA.objNotify[0].id;

        fetch(url).then(res => res.json()).then(arr => {
            //  console.log('NOTI_CHECK: ' + url, JSON.stringify(arr));
            ___process_notify(arr);
        });
    }
};
const ___notify_init = function () {
    ///___notify_sse_setup();



    //////////___fetch_notify();
    //////////setInterval(___fetch_notify, 20000);

    var _SOCKET = io.connect(location.protocol + '//' + location.host);

    // old
    //_SOCKET.on('connect', function (data_) {
    //    _SOCKET.emit('push', _PROFILE.id);
    //    setInterval(function () { _SOCKET.emit('push', _PROFILE.id); }, 3000);
    //});

    //new - fix bug f5 trinh duyet tu on tai khoan



    _SOCKET.on('connect', function (data_) {

        if (typeof (Storage) !== 'undefined') {

            var checkF5 = sessionStorage.getItem('isF5Broser');
            if (checkF5 && checkF5 == "true") {
                //  sessionStorage.removeItem('isF5Broser');
            } else {
                _SOCKET.emit('push', { id: _PROFILE.id, status: _PROFILE.int_pol_status });
                setInterval(function () { _SOCKET.emit('push', { id: _PROFILE.id, status: _PROFILE.int_pol_status }); }, 3000);
            }
            sessionStorage.removeItem('isF5Broser');
        } else {
            alert('Trình duyệt của bạn không hỗ trợ!');
        }


        _SOCKET.emit('push', { id: _PROFILE.id, status: _PROFILE.int_pol_status });
        setInterval(function () { _SOCKET.emit('push', { id: _PROFILE.id, status: _PROFILE.int_pol_status }); }, 3000);
    });

    _SOCKET.on('broadcast', function (data) {
        //console.log("@############## IOOOO = ", data);
        ___notify_sse_socketio_on_message(data);
    });
};

var url = new URL(location.href);
var token___ = url.searchParams.get('token');
if (token___ && token___.length > 0) {
    
    fetch('/pol/api/valid/token/' + token___).then(res => res.json()).then(user_ => {
        if (user_.ok) {

            _STORE_USER.remove('PROFILE');

            setTimeout(function (u) {
                _STORE_USER.add('PROFILE', u);
              
                console.log('UI > LOGIN: SAVE u = ', u);

              //  setTimeout(location.href = '/pawn-online', 200);
                
                location.href = '/pawn-online';

            }, 1000, user_);

        } else {
            location.href = location.protocol + '//' + location.host + '/login';
        }
    });
} else {
    _STORE_USER.get('PROFILE').then(user_ => {
        _PROFILE = user_;
        console.log('UI > CHECK_LOGIN: _PROFILE = ', _PROFILE);
        if (_PROFILE == null && _SCOPE != 'login') {
            location.href = location.protocol + '//' + location.host + '/login';
        } else {
            ___notify_init();

            _DATA.objSearch.optionsRuntime.bit_admin_caller = _PROFILE.bit_admin_caller;
            _DATA.objSearch.optionsRuntime.group_id = _PROFILE.group_id;
            _DATA.objSearch.optionsRuntime.shop_id = _PROFILE.shop_id;

            app___install();
        }
    });
}

///////////////////////////////////////////////////////////////////////////

let _TBL_MAIN_MENU_ACTIONS = [
    { id: 1, code: 'MNA_CHI_TIET_DON', name: 'Chi tiết đơn', icon: 'eye outline icon', color: '', command: 'OPEN_POPUP', function: 'kit-popup-thong-tin-chi-tiet', para: {}, config: { strTitle: 'THÔNG TIN CHI TIẾT', strAlign: 'center', strWidth: jQuery(window).width() < 1366 ? '80%' : '50%', strHeight: '80%' } },
    { id: 2, code: 'MNA_SUA_THONG_TIN', name: 'Sửa thông tin', icon: 'edit outline icon', color: '', command: 'OPEN_POPUP', function: 'kit-popup-edit-dang-ky', para: {}, config: { strAlign: 'right' } },
    { id: 3, code: 'MNA_TRA_DON_KHONG_NHAN_XU_LY', name: 'Trả đơn, không nhận xử lý', icon: 'undo alternate icon', color: '', command: '', function: '_APP.f_pol_pawn_MNA_TRA_DON_KHONG_NHAN_XU_LY', para: {}, config: { strAlign: 'right' } },
    { id: 4, code: 'MNA_XOA_DON', name: 'Hủy đơn', icon: 'trash alternate icon', color: '#d26a5c', command: 'OPEN_POPUP', function: 'kit-popup-ly-do-that-bai', para: {}, config: { popHeaderVisible: false, strAlign: 'center', strWidth: '600px', strHeight: '580px' } },
    { id: 5, code: 'MNA_DAT_LICH_TU_VAN', name: 'Đặt lịch tư vấn', icon: 'clipboard outline icon', color: '#d26a5c', command: 'OPEN_POPUP', function: 'kit-popup-dat-lich-tu-van', para: {}, config: { popHeaderVisible: false, strAlign: 'center', strWidth: '600px', strHeight: '480px' } },
    { id: 6, code: 'MNA_LICH_SU_DAT_LICH_TU_VAN', name: 'Lịch sử đặt lịch tư vấn', icon: 'history icon', color: '#d26a5c', command: 'OPEN_POPUP', function: 'kit-popup-lich-su-dat-lich-tu-van', para: {}, config: { strTitle: 'LỊCH SỬ ĐẶT LỊCH TƯ VẤN', strAlign: 'center', strWidth: '800px', strHeight: '600px' } }
];

_VUE_FUNCTIONS = {
    computed: {
        DIV_DOM_TEMP_ID: function () { return 'dom_temp___'; }
    },
    methods: {
        ___on_resize: function (width, height) {
            console.log('UI.app-grid-main > ___on_resize() ...');
            const _self = this;

            if (_self.objMainGrid.inited == false) {
                // At first time open browser
                _self.objMainGrid.inited = true;

                _self.f_table_init();
                _self.f_pager_go(1);
                //_self.f_pager_go(11369);
                //_self.f_pager_go(11370);
                //_self.f_table_draw_rows_test();
            }

            _self.f_table_resize();
        },
        ___reload: function () {
            this.f_pager_go(1);
        },
        //----------------------------------------------------------------
        f_app_ready: function () {
            const _self = this;

            var eltem = document.getElementById(_self.DIV_DOM_TEMP_ID);
            if (eltem) {
                for (var i = 0; i < ___PAGE_SIZE; i++) {
                    var eitem = document.createElement('div');
                    eitem.className = 'pop-mna-action-' + i + ' mn-action';
                    eltem.appendChild(eitem);
                }
            }

            console.log('UI > APP: READY ...');
            resize___reg_event_window();
            $('.ui-menu-user').dropdown();
            $('.box-chose-action-pawn .dropdown-list-action').dropdown();

            $('.button-user').popup({
                inline: true,
                //hoverable: true,
                on: 'click',
                popup: $('.control-panel-user'),
                //target: '.ui.custom.button.button-user',
                position: 'bottom left',
                onShow: function () {
                    //setTimeout(function () {
                    //    const el_ = btn_.get(0);
                    //    if (el_) {
                    //        const rec_ = el_.getBoundingClientRect();
                    //        const l_ = Math.round(rec_.left - 30, 0);
                    //        //console.log(l_);
                    //        $('.control-panel-user').css({ left: l_ + 'px' }).removeClass('hide_').addClass('visible');
                    //    }
                    //}, 50);
                },
                onHide: function () {
                    //$('.control-panel-user').addClass('hide_');
                }
            });

            //this.f_table_init();
        },
        ___logout: function () {
            swal({
                title: "Logout",
                text: "Bạn chắc chắn muốn thoát tài khoản?",
                icon: "warning",
                buttons: true,
                dangerMode: true
            }).then((_ok) => {
                if (_ok) {
                    if (location.host == 'test.f88.vn') {   /// nếu là local thì  xóa session để test
                        _STORE_USER.remove('PROFILE').then(ok => {
                            console.log('UI.CACHE: remove profile = ', ok);
                            ___go_login();
                        });
                    } else {   // nếu là release thì không xóa session mà response thẳng qua pos
                        ___go_login();
                    }
                }
            });
        },
        //----------------------------------------------------------------
        /* Check chọn đơn trên table để chuyển đơn hoặc chuyển vùng miền của đơn */
        ___items_checked___on_init: function () {
            const _self = this;
            const ids = _self.objItemsChecked.ids;
            const ids_ = _self.objItemsChecked.ids_;
        },
        ___items_checked___on_check_all: function () {
            const _self = this;
            const ids = _self.objItemsChecked.ids;
            const ids_ = _self.objItemsChecked.ids_;
            const is_check_all = _self.objItemsChecked.checkAll;

            console.log('### UI.WATCH > ON_CHECK_ALL -> check_all = ', ids.length, is_check_all, JSON.stringify(ids));

            var chk_all = document.querySelector('.DTFC_LeftHeadWrapper .checkbox-all input');
            if (chk_all) {
                if (is_check_all) {
                    if (chk_all.hasAttribute('checked') == false) {
                        chk_all.setAttribute('checked', 'checked');
                    }
                } else {
                    if (chk_all.hasAttribute('checked')) {
                        chk_all.removeAttribute('checked');
                    }
                }
            }

            //console.log('### UI.WATCH > ON_CHECK_ALL -> check_all = ', ids_remain.length, JSON.stringify(ids_remain));
            var chks = [], rows = [];

            const ids_false = _.filter(ids_, function (o) { return ids.indexOf(o) == -1; });
            if (ids_false.length > 0) {
                chks = _.map(ids_false, function (o) { return '.DTFC_LeftBodyLiner .chk-' + o + ' input'; });
                document.querySelectorAll(chks).forEach(chk => {
                    if (chk.hasAttribute('checked')) {
                        chk.removeAttribute('checked');
                    }
                });
                rows = _.map(ids_false, function (o) { return '.dtr-row.dtr-' + o; });
                document.querySelectorAll(rows).forEach(chk => {
                    if (classie.has(chk, 'dt-row-checked') == true) {
                        classie.remove(chk, 'dt-row-checked');
                    }
                });
            }

            const ids_true = _.filter(ids_, function (o) { return ids.indexOf(o) != -1; });
            if (ids_true.length > 0) {
                chks = _.map(ids_true, function (o) { return '.DTFC_LeftBodyLiner .chk-' + o + ' input'; });
                document.querySelectorAll(chks).forEach(chk => {
                    if (chk.hasAttribute('checked') == false) {
                        chk.setAttribute('checked', 'checked');
                    }
                });
                rows = _.map(ids_true, function (o) { return '.dtr-row.dtr-' + o; });
                document.querySelectorAll(rows).forEach(chk => {
                    if (classie.has(chk, 'dt-row-checked') == false) {
                        classie.add(chk, 'dt-row-checked');
                    }
                });
            }
            _self.objItemsChecked.visible = ids_true.length > 0;

            ////const selector_checks = _.map(ids_, function (o) { return '.DTFC_LeftBodyLiner .chk-' + o + ' input'; });
            ////document.querySelectorAll(selector_checks).forEach(chk => {
            ////    if (is_check_all) {
            ////        if (chk.hasAttribute('checked') == false) {
            ////            chk.setAttribute('checked', 'checked');
            ////        }
            ////    } else {
            ////        if (chk.hasAttribute('checked')) {
            ////            chk.removeAttribute('checked');
            ////        }
            ////    }
            ////});

            ////const selector_rows = _.map(ids_, function (o) { return '.dtr-row.dtr-' + o; });
            ////document.querySelectorAll(selector_rows).forEach(chk => {
            ////    if (is_check_all) {
            ////        if (classie.has(chk, 'dt-row-checked') == false) {
            ////            classie.add(chk, 'dt-row-checked');
            ////        }
            ////    } else {
            ////        if (classie.has(chk, 'dt-row-checked') == true) {
            ////            classie.remove(chk, 'dt-row-checked');
            ////        }
            ////    }
            ////});
        },
        ___items_checked___on_check_row: function () {
            const _self = this;
            const ids = _self.objItemsChecked.ids;
            const ids_ = _self.objItemsChecked.ids_;
            //// lấy về item trong ids_ không nằm trong ids
            var check_all = (_.filter(ids_, function (o) { return ids.indexOf(o) == -1; })).length == 0;
            _self.objItemsChecked.checkAll = check_all;
            //_self.objItemsChecked.checkAll = checkAll == max;
            console.log('### UI.WATCH > ON_CHECK_ROW -> check_all = ', check_all, JSON.stringify(ids));

            _self.___items_checked___on_check_all();
        },
        //----------------------------------------------------------------
        f_pawn_list_checkall___on_click: function (e) {
            const _self = this;

            const ids = _self.objItemsChecked.ids;
            const ids_ = _self.objItemsChecked.ids_;

            var check_all = !_self.objItemsChecked.checkAll;

            var a = [], i = 0, rs = [];
            if (check_all) {
                // Check_All
                a = _.filter(ids_, function (o) { return ids.indexOf(o) == -1; });
                rs = JSON.parse(JSON.stringify(ids));
                for (i = 0; i < a.length; i++) rs.push(a[i]);
                console.log('Check_All === ', rs.length, JSON.stringify(rs));
                _self.objItemsChecked.ids = rs;
            } else {
                // Un_Check_All
                a = _.filter(ids, function (o) { return ids_.indexOf(o) == -1; });
                console.log('Un_Check_All === ', a.length, JSON.stringify(a));
                _self.objItemsChecked.ids = a;
            }

            _self.objItemsChecked.checkAll = check_all;
        },
        f_pawn_list_check___on_click: function (index_, id, e) {
            const _self = this;
            const ids = _self.objItemsChecked.ids;
            const ids_ = _self.objItemsChecked.ids_;

            var index = ids.indexOf(id);
            if (index == -1) {
                _self.objItemsChecked.ids.push(id);
            } else {
                _self.objItemsChecked.ids.splice(index, 1);
            }



            console.log('f_pawn_list_check___on_click: index = ' + index + ', id = ' + id, JSON.stringify(ids));

            var el = e.target.closest('.checkbox').querySelector('input');
            if (el.hasAttribute('checked')) {
                //remove check
                el.removeAttribute('checked');
                $('.dtr-row.dtr-' + id).removeClass('dt-row-checked');
            } else {
                //add check
                el.setAttribute('checked', 'checked');
                $('.dtr-row.dtr-' + id).addClass('dt-row-checked');
            }

            _self.___items_checked___on_check_row();

            //var row_check_style = function (r, index) {
            //    if (index_ == index) {
            //        //console.log(index, r);
            //        if (check) {
            //            classie.add(r, 'dt-row-checked');
            //        } else {
            //            if (classie.has(r, 'dt-row-checked')) {
            //                classie.remove(r, 'dt-row-checked');
            //            }
            //        }
            //    }
            //};

            //document.querySelectorAll('.dataTables_scroll tbody tr').forEach((r, index) => row_check_style(r, index));
            //document.querySelectorAll('.DTFC_LeftBodyLiner tbody tr').forEach((r, index) => row_check_style(r, index));
            //document.querySelectorAll('.DTFC_RightBodyLiner tbody tr').forEach((r, index) => row_check_style(r, index));

            //////////_self.objItemsSelected.items.push(id);

            ////////var index = _self.objItemsChecked.ids.indexOf(id);
            ////////if (check == true && index == -1) {
            ////////    _self.objItemsChecked.ids.push(id);
            ////////} else if (check == false && index != -1 && _self.objItemsChecked.ids.length > 0) {
            ////////    _self.objItemsChecked.ids.splice(index, 1);
            ////////}

            //////////if (_self.objItemsChecked.ids.length == 0) _self.f_pawn_list___set_checkall(true);

            ////////console.log('f_pawn_list_check___on_click: index = ' + index + ', id = ' + id, check, JSON.stringify(_self.objItemsChecked.ids));
        },
        //----------------------------------------------------------------
        f_pawn_list___set_checkall: function (check) {
            var all_chk = document.querySelector('.DTFC_LeftHeadWrapper .checkbox-all input');
            if (all_chk) {
                if (check) {
                    if (all_chk.hasAttribute('checked') == false) {
                        all_chk.setAttribute('checked', 'checked');
                    }
                } else {
                    if (all_chk.hasAttribute('checked')) {
                        all_chk.removeAttribute('checked');
                    }
                }
            }
        },
        f_pawn_list_checkall___set_style: function () {
            const _self = this;
            if (_self.objItemsChecked.ids.length > 0) {
                var ck, tr, tr_index = -1;
                _self.objItemsChecked.ids.forEach(id_ => {
                    tr_index = -1;
                    ck = document.querySelector('.DTFC_LeftBodyLiner .ui.checkbox.chk-' + id_ + ' input');
                    if (ck) {
                        ck.setAttribute('checked', 'checked');
                        tr = ck.closest('tr');
                        if (tr) {
                            tr_index = Array.prototype.indexOf.call(tr.parentNode.childNodes, tr);
                            classie.add(tr, 'dt-row-checked');
                            if (tr_index != -1) {
                                jQuery('.dataTables_scrollBody tr:eq(' + (tr_index + 1) + ')').addClass('dt-row-checked');
                                jQuery('.DTFC_RightBodyLiner tr:eq(' + (tr_index + 1) + ')').addClass('dt-row-checked');
                            }
                        }
                    }
                });
            }

            _self.f_pawn_list___set_checkall(_self.objItemsChecked.checkAll);
        },
        f_pawn_list_checked_menu_action_open: function () {

        },
        //----------------------------------------------------------------   
        /* Điều kiện để load danh sách đơn */
        f_user_online_state_changed: function (vueRef, val, name) {
            const _self = this;

            _APP.$data.loading = true;

            var _int_pol_status = _PROFILE.int_pol_status == 0 ? 1 : 0;

            var obj_item = {
                user_id: _PROFILE.user_id,
                int_type: 1,
                int_pol_region: 0,
                int_pol_status: parseInt(_int_pol_status),
                int_user_create: _PROFILE.user_id
            };
            var data = '111' + JSON.stringify(obj_item);

            var msg = 'Online';
            if (obj_item.int_pol_status == "0") {
                msg = 'Offline';
            }

            ___post_action('user', 'biz_update_user', data).then(res => {
                if (res.Ok) {
                    _PROFILE.int_pol_status = obj_item.int_pol_status;

                    _STORE_USER.remove('PROFILE');

                    setTimeout(function () {
                        _STORE_USER.add('PROFILE', _PROFILE);
                    }, 2000);

                    $.each(_APP.$children,
                        function (i, v) {
                            switch (v.vueRef) {
                                case "MENU_USER___ONLINE_ON_OFF":
                                    v.objValueDefault = obj_item.int_pol_status;

                                    var input = $('#' + v.___id).find('input');
                                    var label = $('#' + v.___id).find('label');

                                    if (obj_item.int_pol_status == 0) {

                                        input[0].checked = false;
                                        label[0].innerText = "Offline";
                                    } else {
                                        input[0].checked = true;
                                        label[0].innerText = "Online";
                                    }
                                    v.$forceUpdate();
                                    break;
                                default:

                            }
                        });



                    ___alert_type("Đổi trạng thái " + msg + " thành công", "success");
                } else {
                    ___alert_type("Đổi trạng thái " + msg + " thất bại", "error");
                }

                _APP.$data.loading = false;
            }).catch(() => {
                _APP.$data.loading = false;
            });
        },
        f_form_search_menu_state_changed: function (index, int_status, int_state_menu) {
            const _self = this;
            console.log('FORM_SEARCH: menu changed -> index = ' + index, '; int_status = ' + int_status, '; int_state_menu =' + int_state_menu);

            _self.objSearch.optionsRuntime.int_status = int_status;
            _self.objSearch.optionsRuntime.int_state_menu = int_state_menu;
            //delete _self.objSearch.optionsRuntime.int_status;
            //delete _self.objSearch.optionsRuntime.int_state_menu; 

            $('.ui.menu .item.item-mn').removeClass('active');
            $('.ui.menu .item.item-mn[tabindex="' + index + '"]').addClass('active');

            _self.f_pager_go(1);
        },
        f_form_search_conditions_build: function () {
            const _self = this;

            var a = [], o = _self.objSearch.optionsRuntime, v;

            var is_call_online = _PROFILE.bit_admin_caller == 1;
            var is_call_online_employer = _PROFILE.group_id == 44 && _PROFILE.bit_admin_caller != 1;
            var is_shop_admin = _PROFILE.int_approve_level == 1 && _PROFILE.str_user_position == '3';
            var is_shop_employer = _PROFILE.int_approve_level == 1 && _PROFILE.str_user_position == '4';
            var is_qlkv = _PROFILE.int_approve_level == 2 && _PROFILE.str_possition == 'QLKV';

            for (var key in o) {
                v = o[key];
                if (v != null && v != '-1') {

                    switch (key) {
                        case 'str_channel_name':
                        case 'str_city_name':
                            a.push(' o.' + key + ' && o.' + key + '.toLowerCase() == "' + v.toLowerCase() + '" ');
                            break;
                        case 'group_ids':
                            if (v.length > 1) a.push(' "' + v + '".indexOf("," + o.group_id + ",") != -1 ');
                            break;
                        case 'area_id':
                        case 'district_id':
                            a.push(' o.' + key + ' == ' + v + ' ');
                            break;
                        case 'caller_ids':
                            if (_PROFILE.group_id == 44) {
                                if (v.length > 1) a.push(' "' + v + '".indexOf("," + o.caller_online_id + ",") != -1 ');


                            } else {
                                if (v.length > 1) a.push(' "' + v + '".indexOf("," + o.caller_shop_id + ",") != -1 ');
                            }
                            break;
                    }
                }
            }

            const int_status = o.int_status;
            const int_state_menu = o.int_state_menu;

            // For call online
            if (is_call_online || is_call_online_employer) {
                // Chọn menu: Cần xử lý
                if (int_state_menu == 9 && int_status == 2) {
                    //Is call online admin
                    if (is_call_online) {
                        a.push(' o.int_status == ' + int_status + ' &&  o.group_id == ' + _PROFILE.group_id + ' && o.int_sms == -1');
                    } else if (is_call_online_employer) {
                        // Is call online employer
                        a.push('  o.int_status == ' + int_status + ' && ( o.group_id == ' + _PROFILE.group_id + ' && o.caller_online_id == ' + _PROFILE.user_id + ' ) && o.int_sms == -1 ');
                    }
                }

                // Chọn menu: Hủy đăng ký
                if (int_state_menu == 13 && int_status == 0) {
                    //Is call online admin
                    if (is_call_online) {
                        //  a.push('( o.int_status == ' + int_status + ' ) && ( (o.str_group_ids_reveiced.indexOf(53) == -1) ||  (o.str_group_ids_reveiced.indexOf(53) != -1 && o.str_group_ids_reveiced.length > 2) )'); // bổ xung thêm

                        a.push('( o.int_status == ' + int_status + ') && o.str_group_ids_reveiced  != 53 '); // bổ xung thêm 53 is group of DRS


                        //   a.push('( o.int_status == ' + int_status + ' ) && (( ("," +o.str_group_ids_reveiced +",").indexOf(",53,") == -1) || ( ("," +o.str_group_ids_reveiced +",").indexOf(",53,") != -1 && o.str_group_ids_reveiced.length > 2)) '); // bổ xung thêm

                    } else if (is_call_online_employer) {
                        // Is call online employer
                        a.push(' o.int_status == ' + int_status + ' && ( o.group_id == ' + _PROFILE.group_id + ' && o.caller_online_id == ' + _PROFILE.user_id + ' ) ');
                    }
                }

                // Chọn menu: Chưa tư vấn - da dc gan caller_online_id
                else if (int_state_menu == 10 && int_status == 1) {
                    //Is call online admin
                    if (is_call_online) {
                        a.push('  o.int_status == ' + int_status + ' && o.caller_online_id != -1 &&  o.group_id == ' + _PROFILE.group_id + ' ');
                    } else if (is_call_online_employer) {
                        // Is call online employer
                        a.push('  o.int_status == ' + int_status + ' && o.caller_online_id ==  ' + _PROFILE.user_id + ' &&  o.group_id == ' + _PROFILE.group_id + ' ');
                    }
                }

                // Chọn menu: Chưa tư vấn (chưa chia)- chua dc gan caller_online_id
                else if (int_state_menu == 12 && int_status == 1) {
                    //Is call online admin
                    if (is_call_online) {
                        a.push('  o.int_status == ' + int_status + ' && o.caller_online_id == -1  &&  o.group_id == ' + _PROFILE.group_id + ' ');
                    } else if (is_call_online_employer) {
                        // Is call online employer  --  không hiển thị
                        // a.push('  o.int_status == ' + int_status + ' && o.caller_online_id == -1  &&  o.group_id == ' + _PROFILE.group_id + ' ');
                    }
                }

                // Chọn menu: Đang chăm sóc
                else if (int_state_menu == 10 && int_status == 2) {
                    //Is call online admin
                    if (is_call_online) {
                        //  a.push('( o.int_status == ' + int_status + ' ) && ( (o.str_group_ids_reveiced.indexOf(53) == -1) ||  (o.str_group_ids_reveiced.indexOf(53) != -1 && o.str_group_ids_reveiced.length > 2) )'); // bổ xung thêm

                        a.push('( o.int_status == ' + int_status + ') && o.str_group_ids_reveiced  != 53 '); // bổ xung thêm 53 is group of DRS


                        //   a.push('( o.int_status == ' + int_status + ' ) && (( ("," +o.str_group_ids_reveiced +",").indexOf(",53,") == -1) || ( ("," +o.str_group_ids_reveiced +",").indexOf(",53,") != -1 && o.str_group_ids_reveiced.length > 2)) '); // bổ xung thêm
                    } else if (is_call_online_employer) {
                        // Is call online employer
                        a.push('  o.int_status == ' + int_status + ' && o.caller_online_id ==  ' + _PROFILE.user_id + ' &&  o.group_id != 44 ');
                    }
                }

                // Chọn menu: Nhận cầm cố
                else if (int_state_menu == 10 && int_status == 4) {
                    //Is call online admin
                    if (is_call_online) {
                        //  a.push('( o.int_status == ' + int_status + ' ) && ( (o.str_group_ids_reveiced.indexOf(53) == -1) ||  (o.str_group_ids_reveiced.indexOf(53) != -1 && o.str_group_ids_reveiced.length > 2) )'); // bổ xung thêm

                        a.push('( o.int_status == ' + int_status + ') && o.str_group_ids_reveiced  != 53 '); // bổ xung thêm 53 is group of DRS


                        // a.push('( o.int_status == ' + int_status + ' ) && (( ("," +o.str_group_ids_reveiced +",").indexOf(",53,") == -1) || ( ("," +o.str_group_ids_reveiced +",").indexOf(",53,") != -1 && o.str_group_ids_reveiced.length > 2)) '); // bổ xung thêm
                    } else if (is_call_online_employer) {
                        // Is call online employer
                        a.push('  o.int_status == ' + int_status + ' && o.caller_online_id ==  ' + _PROFILE.user_id + ' ');
                    }
                }

                // Chọn menu: Không liên lạc được
                else if (int_state_menu == 11 && int_status == 2) {
                    //Is call online admin
                    if (is_call_online) {
                        //  a.push('( o.int_status == ' + int_status + ' && o.int_sms != -1 ) && ( (o.str_group_ids_reveiced.indexOf(53) == -1) ||  (o.str_group_ids_reveiced.indexOf(53) != -1 && o.str_group_ids_reveiced.length > 2) )'); // bổ xung thêm

                        a.push('( o.int_status == ' + int_status + ' && o.int_sms != -1 ) && o.str_group_ids_reveiced  != 53 '); // bổ xung thêm 53 is group of DRS

                        //    a.push('( o.int_status == ' + int_status + ' && o.int_sms != -1 ) && (( ("," +o.str_group_ids_reveiced +",").indexOf(",53,") == -1) || ( ("," +o.str_group_ids_reveiced +",").indexOf(",53,") != -1 && o.str_group_ids_reveiced.length > 2)) '); // bổ xung thêm
                    } else if (is_call_online_employer) {
                        // Is call online employer
                        a.push('  o.int_status == ' + int_status + ' && o.int_sms != -1 && o.caller_online_id ==  ' + _PROFILE.user_id + ' ');
                    }
                }

                // Chon menu khac   (Tất cả)
                else if (int_status == null && int_state_menu == 10) {
                    //Is call online admin
                    if (is_call_online) {

                        //a.push(' (o.str_group_ids_reveiced.indexOf(53) == -1) ||  (o.str_group_ids_reveiced.indexOf(53) != -1 && o.str_group_ids_reveiced.length > 2) '); // bổ xung thêm
                        //a.push('(   ("," +o.str_group_ids_reveiced +",").indexOf(",53,") == -1) || ( ("," +o.str_group_ids_reveiced +",").indexOf(",53,") != -1 && o.str_group_ids_reveiced.length > 2) '); // bổ xung thêm

                        a.push(' o.str_group_ids_reveiced  != 53 '); // bổ xung thêm 53 is group of DRS

                    } else if (is_call_online_employer) {
                        //a.push(' ( o.int_status == 1 && o.caller_online_id == -1  &&  o.group_id == ' + _PROFILE.group_id + ' )' +     bỏ
                        //    ' || ( o.caller_online_id ==  ' + _PROFILE.user_id + '  ) ');

                        a.push(' ( o.caller_online_id ==  ' + _PROFILE.user_id + '  ) ');
                    }
                }
            }

            // For shop: QLCH, NVCH
             if (is_shop_admin || is_shop_employer) {
                //10,0      Chờ xử ý
                if (int_state_menu == 0) {
                    if (is_shop_admin) {
                        a.push('( o.group_id == ' + _PROFILE.group_id +
                            ' && ( o.int_group_status == ' + int_state_menu + ' || o.int_group_status == -1 )' +
                            ' && ( o.int_status == 2 ||  o.int_status == 1 ) )  ');
                    } else if (is_shop_employer) {
                        a.push('( o.group_id == ' + _PROFILE.group_id +
                            ' && ( o.int_group_status == ' + int_state_menu + ' || o.int_group_status == -1 )' +
                            ' && ( o.int_status == 2 ||  o.int_status == 1 ) ) && o.caller_shop_id ==  ' + _PROFILE.user_id + '  ');
                    }
                }

                //10,1      Đang xử lý
                else if (int_state_menu == 1) {
                    if (is_shop_admin) {
                        a.push(' o.int_status == 2 && o.int_group_status == ' +
                            int_state_menu +
                            ' && o.group_id == ' +
                            _PROFILE.group_id +
                            ' ');
                    } else if (is_shop_employer) {
                        a.push(' o.int_status == 2 && o.int_group_status == ' +
                            int_state_menu +
                            ' && o.group_id == ' +
                            _PROFILE.group_id +
                            ' && o.caller_shop_id ==  ' + _PROFILE.user_id + ' ');
                    }
                }

                //10,4      Đã hủy
                else if (int_state_menu == 4) {
                    if (is_shop_admin) {
                        a.push(' o.int_status == 0 && o.group_id == ' + _PROFILE.group_id + ' ');
                    } else if (is_shop_employer) {
                        a.push(' o.int_status == 0 && o.group_id == ' +
                            _PROFILE.group_id +
                            ' && o.caller_shop_id ==  ' +
                            _PROFILE.user_id +
                            ' ');
                    }
                }

                //10,9      Đơn đăng ký Ô Tô
                else if (int_state_menu == 9) {
                    if (is_shop_admin) {
                        //  a.push(' o.group_id == ' + _PROFILE.group_id + ' && o.int_group_status == 1 && (o.asset_type_id == 1 || o.asset_type_id == 2) ');
                        a.push(' o.group_id == ' + _PROFILE.group_id + ' && (o.asset_type_id == 1 || o.asset_type_id == 2) ');
                    } else if (is_shop_employer) {
                        //a.push(' o.group_id == ' + _PROFILE.group_id + '  && o.int_group_status == 1' + ' && (o.asset_type_id == 1 || o.asset_type_id == 2) && o.caller_shop_id ==  ' + _PROFILE.user_id + ' ');
                        a.push(' o.group_id == ' + _PROFILE.group_id + ' && (o.asset_type_id == 1 || o.asset_type_id == 2) && o.caller_shop_id ==  ' + _PROFILE.user_id + ' ');
                    }
                }

                //4,10      Nhận cầm cố
                else if (int_status == 4 && int_state_menu == 10) {
                    if (is_shop_admin) {
                        a.push(' o.int_status == 4 && o.group_id == ' + _PROFILE.group_id + ' ');
                    } else if (is_shop_employer) {
                        a.push(' o.int_status == 4 && o.group_id == ' +
                            _PROFILE.group_id +
                            ' && o.caller_shop_id ==  ' +
                            _PROFILE.user_id +
                            ' ');
                    }
                }

                //null,10   Tất cả
                else if (int_status == null && int_state_menu == 10) {
                    if (is_shop_admin) {
                        a.push(' o.group_id == ' + _PROFILE.group_id + ' ');
                    } else if (is_shop_employer) {
                        a.push(' o.group_id == ' + _PROFILE.group_id + ' && o.caller_shop_id ==  ' + _PROFILE.user_id + ' ');
                    }
                }
            }

           
            // For : QLKV       --- chưa golive nên comment lại
            if (is_qlkv) {
                //10,0      Chờ xử ý   
                if (int_state_menu == 0) {
                    a.push('(\'' + _PROFILE.group_qlkv + '\'.indexOf("," + o.group_id + ",") != -1212 ' +
                        ' && ( o.int_group_status == ' + int_state_menu + ' || o.int_group_status == -1 )' +
                        ' && ( o.int_status == 2 ||  o.int_status == 1 ) )  ');
                }

                //10,1      Đang xử lý
                else if (int_state_menu == 1) {
                    a.push(' o.int_status == 2 && o.int_group_status == ' + int_state_menu + ' && (\'' + _PROFILE.group_qlkv + '\'.indexOf("," + o.group_id + ",") != -1 ) ');
                }

                //10,4      Đã hủy
                else if (int_state_menu == 4) {
                    a.push(' o.int_status == 0 &&  (\'' + _PROFILE.group_qlkv + '\'.indexOf("," + o.group_id + ",") != -1 ) ');
                }

                //10,9      Đơn đăng ký Ô Tô
                else if (int_state_menu == 9) {
                    a.push('   (\'' + _PROFILE.group_qlkv + '\'.indexOf("," + o.group_id + ",") != -1 ) && (o.asset_type_id == 1 || o.asset_type_id == 2) ');
                }

                //4,10      Nhận cầm cố
                else if (int_status == 4 && int_state_menu == 10) {
                    a.push(' o.int_status == 4 && (\'' + _PROFILE.group_qlkv + '\'.indexOf("," + o.group_id + ",") != -1 ) ');
                }

                //null,10   Tất cả
                else if (int_status == null && int_state_menu == 10) {
                    a.push(' (\'' + _PROFILE.group_qlkv + '\'.indexOf("," + o.group_id + ",") != -1 ) ');
                }
            }

             //else {
            //    a.push(' o.group_id == ' + _PROFILE.group_id + ' && o.user_created_id ==  ' + _PROFILE.user_id + ' ');
            //}

            // hien thi cac don co queued = -1
            a.push(' o.int_queued == -1 ');


            if (o['int_created_from_date'] && o['int_created_to_date']) {
                a.push(' o.int_created_date >= ' + o['int_created_from_date'] + '&& o.int_created_date <= ' + o['int_created_to_date'] + ' ');
            }
            else if (o['int_created_from_date'])   // chỉ có từ ngày
            {
                var dt_now = parseInt(___getCurentDate(false));

                a.push(' o.int_created_date >= ' + o['int_created_from_date'] + '&& o.int_created_date <= ' + dt_now + ' ');
            }
            else if (o['int_created_to_date'])  // chỉ có đến ngày
            {
                var dt_now = o['int_created_to_date'];
                dt_now = dt_now.toString().substr(0, 6) + '01';
                dt_now = parseInt(dt_now);

                a.push(' o.int_created_date >= ' + dt_now + '&& o.int_created_date <= ' + o['int_created_to_date'] + ' ');
            }


            var keyword = o['str_keyword_full_text_search'];
            if (keyword) {

                //const kw_ = ___convert_unicode_to_ascii(keyword);
                //a.push(' o["#"].indexOf("' + kw_ + '") != -1 ');
                //a.push(' o["#"].indexOf("' + keyword + '") != -1 ');

                keyword = keyword.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
                keyword = keyword.replace(/ + /g, " ").trim().toLowerCase();

                var text = keyword.split(' ').join('');

                is_ascii = encodeURIComponent(escape(text)).length == text.length;
                console.log('KEY_WORD ===== ', is_ascii, keyword);

                if (is_ascii) {
                    a.push(' ( (o["#ids"] != null && o["#ids"].indexOf(" ' + keyword + ' ") != -1) || ( o["#ascii"] != null && o["#ascii"].indexOf(" ' + keyword + ' ") != -1 ) ) ');
                } else {
                    a.push('  ( o["#utf8"] != null && o["#utf8"].indexOf(" ' + keyword + ' ") != -1 ) ');
                }
            }

            //console.log('FORM_SEARCH: optionsRuntime = ', o);
            //console.log('FORM_SEARCH: a = ', a);

            var c = a.length > 0 ? a.join(' \r\n && ') : 'true';
            if (keyword) {
                if (c == 'true')
                    c = '  \r\n  ( o["#org"] != null && o["#org"].indexOf("' + o['str_keyword_full_text_search'] + '") != -1 ) ';
                else
                    c = c + ' \r\n || ( o["#org"] != null && o["#org"].indexOf("' + o['str_keyword_full_text_search'] + '") != -1 ) ';
            }
            var s = 'function(o) { return ' + c + '; }';

            return s;
        },
        f_form_search_changed: function (vueRef, id, val, name_) {
            const _self = this;
            $.each(_self.$children,
                function (i, v) {
                    switch (v.vueRef) {
                        case "FORM_SEARCH___KEYWORD_FULL_TEXT_SEARCH":
                            _self.objSearch.optionsRuntime.str_keyword_full_text_search = $('#' + v.___id).val();
                            break;
                        default:

                    }
                });

            _self.f_pager_go(1);
        },
        //----------------------------------------------------------------
        /*Load trang 1  */
        f_pager_go: function (page_number) {
            console.log('UI.TABLE > GO_PAGER= ', page_number);

            const _self = this;
            var condition = _self.f_form_search_conditions_build();

            _self.objMainGrid.loading = true;
            fetch___post('api/pol_pawn/search', { conditons: condition, page_number: page_number, page_size: ___PAGE_SIZE }).then(rs_ => {
                console.log('FORM_SEARCH: result =', rs_);
                if (rs_ && rs_.ok) {
                    _self.objItemsChecked.checkAll = false;
                    _self.objMainGrid.loading = false;


                    if (rs_.result_items) {
                        _self.f_table_draw_rows(rs_);
                    }

                    _self.objModel = rs_;
                    //_self.f_pawn_list___set_checkall();

                    _self.f_pager_draws_html();

                } else {
                    _self.objMainGrid.loading = false;
                }
            });

            _self.f_count_pawnonline_in_menu();
        },
        //----------------------------------------------------------------
        /*Điền kiện để load Count tông số đơn trên menu */
        f_count_pawnonline_in_menu: function () {
            const _self = this;
            if (_PROFILE.group_id == 44) {  // group call

                for (const col in _DATA.objCountTotalPawnCall) {
                    var condition = _self.f_build_conditons_count_pawn(_DATA.objCountTotalPawnCall[col].int_status, _DATA.objCountTotalPawnCall[col].int_state_menu);

                    _self.objMainGrid.loading = true;
                    fetch___post('api/pol_pawn/search', { conditons: condition, page_number: 1, page_size: ___PAGE_SIZE }).then(rs_ => {
                        if (rs_ && rs_.ok) {
                            _self.objMainGrid.loading = false;
                            _DATA.objCountTotalPawnCall[col].count = rs_.count_result;

                        } else {
                            _self.objMainGrid.loading = false;
                        }
                    });

                }

            } else {

                for (const col in _DATA.objCountTotalPawnShop) {
                    var condition2 = _self.f_build_conditons_count_pawn(_DATA.objCountTotalPawnShop[col].int_status, _DATA.objCountTotalPawnShop[col].int_state_menu);

                    _self.objMainGrid.loading = true;
                    fetch___post('api/pol_pawn/search', { conditons: condition2, page_number: 1, page_size: ___PAGE_SIZE }).then(rs_ => {
                        if (rs_ && rs_.ok) {
                            _self.objMainGrid.loading = false;
                            _DATA.objCountTotalPawnShop[col].count = rs_.count_result;

                        } else {
                            _self.objMainGrid.loading = false;
                        }
                    });

                }
            }
        },
        f_build_conditons_count_pawn: function (_int_status, _int_state_menu) {
            const _self = this;

            var a = [], o = _self.objSearch.optionsRuntime, v;

            var is_call_online = _PROFILE.bit_admin_caller == 1;
            var is_call_online_employer = _PROFILE.group_id == 44 && _PROFILE.bit_admin_caller != 1;
            var is_shop_admin = _PROFILE.int_approve_level == 1 && _PROFILE.str_user_position == '3';
            var is_shop_employer = _PROFILE.int_approve_level == 1 && _PROFILE.str_user_position == '4';
            var is_qlkv = _PROFILE.int_approve_level == 2 && _PROFILE.str_possition == 'QLKV';

            for (var key in o) {
                v = o[key];
                if (v != null && v != '-1') {

                    switch (key) {
                        case 'str_channel_name':
                        case 'str_city_name':
                            a.push(' o.' + key + ' && o.' + key + '.toLowerCase() == "' + v.toLowerCase() + '" ');
                            break;
                        case 'group_ids':
                            if (v.length > 1) a.push(' "' + v + '".indexOf("," + o.group_id + ",") != -1 ');
                            break;
                        case 'area_id':
                        case 'district_id':
                            a.push(' o.' + key + ' == ' + v + ' ');
                            break;
                        case 'caller_ids':
                            if (_PROFILE.group_id == 44) {
                                if (v.length > 1) a.push(' "' + v + '".indexOf("," + o.caller_online_id + ",") != -1 ');
                            } else {
                                if (v.length > 1) a.push(' "' + v + '".indexOf("," + o.caller_shop_id + ",") != -1 ');
                            }
                            break;
                    }
                }
            }

            const int_status = _int_status;
            const int_state_menu = _int_state_menu;

            // For call online
            if (is_call_online || is_call_online_employer) {
                // Chọn menu: Cần xử lý
                if (int_state_menu == 9 && int_status == 2) {
                    //Is call online admin
                    if (is_call_online) {
                        a.push(' o.int_status == ' + int_status + ' &&  o.group_id == ' + _PROFILE.group_id + ' && o.int_sms == -1');
                    } else if (is_call_online_employer) {
                        // Is call online employer
                        a.push('  o.int_status == ' + int_status + ' && ( o.group_id == ' + _PROFILE.group_id + ' && o.caller_online_id == ' + _PROFILE.user_id + ' ) && o.int_sms == -1 ');
                    }
                }

                // Chọn menu: Hủy đăng ký
                if (int_state_menu == 13 && int_status == 0) {
                    //Is call online admin
                    if (is_call_online) {
                        a.push('( o.int_status == ' + int_status + ') && o.str_group_ids_reveiced  != 53 '); // bổ xung thêm 53 is group of DRS

                    } else if (is_call_online_employer) {
                        // Is call online employer
                        a.push(' o.int_status == ' + int_status + ' && ( o.group_id == ' + _PROFILE.group_id + ' && o.caller_online_id == ' + _PROFILE.user_id + ' ) ');
                    }
                }

                // Chọn menu: Chưa tư vấn - da dc gan caller_online_id
                else if (int_state_menu == 10 && int_status == 1) {
                    //Is call online admin
                    if (is_call_online) {
                        a.push('  o.int_status == ' + int_status + ' && o.caller_online_id != -1 &&  o.group_id == ' + _PROFILE.group_id + ' ');
                    } else if (is_call_online_employer) {
                        // Is call online employer
                        a.push('  o.int_status == ' + int_status + ' && o.caller_online_id ==  ' + _PROFILE.user_id + ' &&  o.group_id == ' + _PROFILE.group_id + ' ');
                    }
                }

                // Chọn menu: Chưa tư vấn (chưa chia)- chua dc gan caller_online_id
                else if (int_state_menu == 12 && int_status == 1) {
                    //Is call online admin
                    if (is_call_online) {
                        a.push('  o.int_status == ' + int_status + ' && o.caller_online_id == -1  &&  o.group_id == ' + _PROFILE.group_id + ' ');
                    } else if (is_call_online_employer) {
                        // Is call online employer  --  không hiển thị
                    }
                }

                // Chọn menu: Đang chăm sóc
                else if (int_state_menu == 10 && int_status == 2) {
                    //Is call online admin
                    if (is_call_online) {
                        a.push('( o.int_status == ' + int_status + ') && o.str_group_ids_reveiced  != 53 '); // bổ xung thêm 53 is group of DRS

                    } else if (is_call_online_employer) {
                        // Is call online employer
                        a.push('  o.int_status == ' + int_status + ' && o.caller_online_id ==  ' + _PROFILE.user_id + ' &&  o.group_id != 44 ');
                    }
                }

                // Chọn menu: Nhận cầm cố
                else if (int_state_menu == 10 && int_status == 4) {
                    //Is call online admin
                    if (is_call_online) {
                        a.push('( o.int_status == ' + int_status + ') && o.str_group_ids_reveiced  != 53 '); // bổ xung thêm 53 is group of DRS

                    } else if (is_call_online_employer) {
                        // Is call online employer
                        a.push('  o.int_status == ' + int_status + ' && o.caller_online_id ==  ' + _PROFILE.user_id + ' ');
                    }
                }

                // Chọn menu: Không liên lạc được
                else if (int_state_menu == 11 && int_status == 2) {
                    //Is call online admin
                    if (is_call_online) {
                        a.push('( o.int_status == ' + int_status + ' && o.int_sms != -1 ) && o.str_group_ids_reveiced  != 53 '); // bổ xung thêm 53 is group of DRS

                    } else if (is_call_online_employer) {
                        // Is call online employer
                        a.push('  o.int_status == ' + int_status + ' && o.int_sms != -1 && o.caller_online_id ==  ' + _PROFILE.user_id + ' ');
                    }
                }

                // Chon menu khac   (Tất cả)
                else if (int_status == null && int_state_menu == 10) {
                    //Is call online admin
                    if (is_call_online) {
                        a.push(' o.str_group_ids_reveiced  != 53 '); // bổ xung thêm 53 is group of DRS

                    } else if (is_call_online_employer) {
                        a.push(' ( o.caller_online_id ==  ' + _PROFILE.user_id + '  ) ');
                    }
                }
            }

            // For shop: QLCH, NVCH
            if (is_shop_admin || is_shop_employer) {
                //10,0      Chờ xử ý
                if (int_state_menu == 0) {
                    if (is_shop_admin) {
                        a.push('( o.group_id == ' + _PROFILE.group_id +
                            ' && ( o.int_group_status == ' + int_state_menu + ' || o.int_group_status == -1 )' +
                            ' && ( o.int_status == 2 ||  o.int_status == 1 ) )  ');
                    } else if (is_shop_employer) {
                        a.push('( o.group_id == ' + _PROFILE.group_id +
                            ' && ( o.int_group_status == ' + int_state_menu + ' || o.int_group_status == -1 )' +
                            ' && ( o.int_status == 2 ||  o.int_status == 1 ) ) && o.caller_shop_id ==  ' + _PROFILE.user_id + '  ');
                    }
                }

                //10,1      Đang xử lý
                else if (int_state_menu == 1) {
                    if (is_shop_admin) {
                        a.push(' o.int_status == 2 && o.int_group_status == ' +
                            int_state_menu +
                            ' && o.group_id == ' +
                            _PROFILE.group_id +
                            ' ');
                    } else if (is_shop_employer) {
                        a.push(' o.int_status == 2 && o.int_group_status == ' +
                            int_state_menu +
                            ' && o.group_id == ' +
                            _PROFILE.group_id +
                            ' && o.caller_shop_id ==  ' + _PROFILE.user_id + ' ');
                    }
                }

                //10,4      Đã hủy
                else if (int_state_menu == 4) {
                    if (is_shop_admin) {
                        a.push(' o.int_status == 0 && o.group_id == ' + _PROFILE.group_id + ' ');
                    } else if (is_shop_employer) {
                        a.push(' o.int_status == 0 && o.group_id == ' +
                            _PROFILE.group_id +
                            ' && o.caller_shop_id ==  ' +
                            _PROFILE.user_id +
                            ' ');
                    }
                }

                //10,9      Đơn đăng ký Ô Tô
                else if (int_state_menu == 9) {
                    if (is_shop_admin) {
                        a.push(' o.group_id == ' + _PROFILE.group_id + ' && (o.asset_type_id == 1 || o.asset_type_id == 2) ');
                    } else if (is_shop_employer) {
                        a.push(' o.group_id == ' + _PROFILE.group_id + ' && (o.asset_type_id == 1 || o.asset_type_id == 2) && o.caller_shop_id ==  ' + _PROFILE.user_id + ' ');
                    }
                }

                //4,10      Nhận cầm cố
                else if (int_status == 4 && int_state_menu == 10) {
                    if (is_shop_admin) {
                        a.push(' o.int_status == 4 && o.group_id == ' + _PROFILE.group_id + ' ');
                    } else if (is_shop_employer) {
                        a.push(' o.int_status == 4 && o.group_id == ' +
                            _PROFILE.group_id +
                            ' && o.caller_shop_id ==  ' +
                            _PROFILE.user_id +
                            ' ');
                    }
                }

                //null,10   Tất cả
                else if (int_status == null && int_state_menu == 10) {
                    if (is_shop_admin) {
                        a.push(' o.group_id == ' + _PROFILE.group_id + ' ');
                    } else if (is_shop_employer) {
                        a.push(' o.group_id == ' + _PROFILE.group_id + ' && o.caller_shop_id ==  ' + _PROFILE.user_id + ' ');
                    }
                }
            }

            // For : QLKV    --- chưa golive nên comment lại
            if (is_qlkv) {
                //10,0      Chờ xử ý   
                if (int_state_menu == 0) {
                    a.push('(\'' + _PROFILE.group_qlkv + '\'.indexOf("," + o.group_id + ",") != -1212 ' +
                        ' && ( o.int_group_status == ' + int_state_menu + ' || o.int_group_status == -1 )' +
                        ' && ( o.int_status == 2 ||  o.int_status == 1 ) )  ');
                }
                //10,1      Đang xử lý
                else if (int_state_menu == 1) {
                    a.push(' o.int_status == 2 && o.int_group_status == ' + int_state_menu + ' && (\'' + _PROFILE.group_qlkv + '\'.indexOf("," + o.group_id + ",") != -1 ) ');
                }

                //10,4      Đã hủy
                else if (int_state_menu == 4) {
                    a.push(' o.int_status == 0 &&  (\'' + _PROFILE.group_qlkv + '\'.indexOf("," + o.group_id + ",") != -1 ) ');
                }

                //10,9      Đơn đăng ký Ô Tô
                else if (int_state_menu == 9) {
                    a.push('   (\'' + _PROFILE.group_qlkv + '\'.indexOf("," + o.group_id + ",") != -1 ) && (o.asset_type_id == 1 || o.asset_type_id == 2) ');
                }

                //4,10      Nhận cầm cố
                else if (int_status == 4 && int_state_menu == 10) {
                    a.push(' o.int_status == 4 && (\'' + _PROFILE.group_qlkv + '\'.indexOf("," + o.group_id + ",") != -1 ) ');
                }

                //null,10   Tất cả
                else if (int_status == null && int_state_menu == 10) {
                    a.push(' (\'' + _PROFILE.group_qlkv + '\'.indexOf("," + o.group_id + ",") != -1 ) ');
                }
            }

             //else {
            //    a.push(' o.group_id == ' + _PROFILE.group_id + ' && o.user_created_id ==  ' + _PROFILE.user_id + ' ');
            //}

            // hien thi cac don co queued = -1
            a.push(' o.int_queued == -1 ');

            if (o['int_created_from_date'] && o['int_created_to_date']) {
                a.push(' o.int_created_date >= ' + o['int_created_from_date'] + '&& o.int_created_date <= ' + o['int_created_to_date'] + ' ');
            }
            else if (o['int_created_from_date'])   // chỉ có từ ngày
            {
                var dt_now = parseInt(___getCurentDate(false));

                a.push(' o.int_created_date >= ' + o['int_created_from_date'] + '&& o.int_created_date <= ' + dt_now + ' ');
            }
            else if (o['int_created_to_date'])  // chỉ có đến ngày
            {
                var dt_now = o['int_created_to_date'];
                dt_now = dt_now.toString().substr(0, 6) + '01';
                dt_now = parseInt(dt_now);

                a.push(' o.int_created_date >= ' + dt_now + '&& o.int_created_date <= ' + o['int_created_to_date'] + ' ');
            }


            var keyword = o['str_keyword_full_text_search'];
            if (keyword) {

                keyword = keyword.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
                keyword = keyword.replace(/ + /g, " ").trim().toLowerCase();

                var text = keyword.split(' ').join('');

                is_ascii = encodeURIComponent(escape(text)).length == text.length;
                console.log('KEY_WORD ===== ', is_ascii, keyword);

                if (is_ascii) {
                    a.push(' ( (o["#ids"] != null && o["#ids"].indexOf(" ' + keyword + ' ") != -1) || ( o["#ascii"] != null && o["#ascii"].indexOf(" ' + keyword + ' ") != -1 ) ) ');
                } else {
                    a.push('  ( o["#utf8"] != null && o["#utf8"].indexOf(" ' + keyword + ' ") != -1 ) ');
                }
            }

            //console.log('FORM_SEARCH: optionsRuntime = ', o);
            //console.log('FORM_SEARCH: a = ', a);

            var c = a.length > 0 ? a.join(' \r\n && ') : 'true';
            if (keyword) {
                if (c == 'true')
                    c = '  \r\n  ( o["#org"] != null && o["#org"].indexOf("' + o['str_keyword_full_text_search'] + '") != -1 ) ';
                else
                    c = c + ' \r\n || ( o["#org"] != null && o["#org"].indexOf("' + o['str_keyword_full_text_search'] + '") != -1 ) ';
            }
            var s = 'function(o) { return ' + c + '; }';

            return s;
        },

        //----------------------------------------------------------------
        /*Nhảy trang  */
        f_pager_goFirst: function () {
            this.f_pager_go(1);
        },
        f_pager_goPrev: function () {
            if (this.objModel.page_number > 1)
                this.f_pager_go(this.objModel.page_number - 1);
        },
        f_pager_goNext: function () {
            if (this.objModel.page_number < this.objModel.page_total)
                this.f_pager_go(this.objModel.page_number + 1);
        },
        f_pager_goLast: function () {
            this.f_pager_go(this.objModel.page_total);
        },

        //----------------------------------------------------------------
        plugin___pawn___int_support_time: function (val) {
            var s = '';
            s = val.toString();
            if (s.length == 14)
                return s.substr(6, 2) + '/' + s.substr(4, 2) + '/' + s.substr(0, 4) + ' ' + s.substr(8, 2) + ':' + s.substr(10, 2) + ':' + s.substr(12, 2);
            return s;
        },
        plugin___pawn___int_created_date: function (val) {
            var s = '';
            s = val.toString();
            if (s.length == 8)
                return s.substr(6, 2) + '/' + s.substr(4, 2) + '/' + s.substr(0, 4);
            return s;
        },
        plugin___pawn___int_created_time: function (val) {
            var s = '';
            s = val.toString();
            if (s.length == 5) s = '0' + s;

            if (s.length == 6)
                return s.substr(0, 2) + ':' + s.substr(2, 2);

            return s;
        },
        plugin___pawn___int_status: function (val, int_priority_id, support_time) {
            //0 : Huy đăng ký
            //1 : Chưa tư vấn
            //2 : Đang chăm sóc
            //4 : Nhận cầm cố
            var s = '[' + val + ']Chưa xác định';
            var pr = '';
            var sp_time = '';
            if (support_time && support_time.length > 8) {
                sp_time = '<b class=st0></b>' + support_time;
            }
            if (int_priority_id && int_priority_id == 1) {
                pr = '<span class=td-carinbank> VIP </span>';
            }

            switch (val) {
                case 0: return '<b class=st' + val + '></b>Hủy đăng ký' + pr + '<br >' + sp_time;
                case 1: return '<b class=st' + val + '></b>Chưa tư vấn' + pr + '<br >' + sp_time;
                case 2: return '<b class=st' + val + '></b>Đang chăm sóc' + pr + '<br >' + sp_time;
                case 4: return '<b class=st' + val + '></b>Nhận cầm cố' + pr + '<br >' + sp_time;
                default: return s;
            }
        },
        plugin___pawn___lng_money: function (money) {
            if (money == null || money.length == 0 || money == -1) return '';

            var val = parseInt(money);
            if (val == 0) return '';

            return val.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,').split('.')[0];
        },
        //----------------------------------------------------------------
        f_pol_pawn_MNA_TRA_DON_KHONG_NHAN_XU_LY: function (para) {

            swal({
                title: "Bạn có muốn trả lại, không xử lý đơn này ?",
                text: "",
                icon: "warning",
                buttons: ['Hủy', true],

                showConfirmButton: false
            })
                .then((willDelete) => {
                    if (willDelete) {

                        var item = {
                            id: para.id,
                            is_shop: _PROFILE.group_id == 44 ? 0 : 1,
                            int_action: 0,
                            int_create: _PROFILE.user_id
                        };

                        _APP.$data.loading = true;
                        var data = '111' + JSON.stringify(item);

                        ___post_action('pol_pawn', 'biz_tradonkhongxuly', data).then(res => {
                            if (res.Ok) {
                                //   setTimeout(___reload, 300);
                                ___alert_type("Trả đơn thành công", res.Ok);
                            } else {
                                ___alert_type("Trả đơn thất bại", res.Ok);
                            }
                            _APP.$data.loading = false;
                        }).catch(() => {
                            _APP.$data.loading = false;
                        });

                    } else {
                        // _self.visible = false;
                    }
                });

        },
        f_table_permistion_draw_menu_item: function (mi, id, int_group_status, int_status, group_id, caller_shop_id, caller_online_id) {
            var _self = this;
            var s = '';

            // 0: Hủy đăng ký
            // 1: Chưa tư vấn
            // 2: Đang chăm sóc
            // 3: Nhận cầm cố

            // quyền chia đơn
            var ok_assign_users_id =
                _PROFILE.pos_sys_config
                && _PROFILE.pos_sys_config.assign_users_id
                && (',' + _PROFILE.pos_sys_config.assign_users_id + ',').indexOf(',' + _PROFILE.user_id + ',') != -1;

            var int_state_menu = _self.objSearch.optionsRuntime.int_state_menu;

            var is_call_online_admin = _PROFILE.bit_admin_caller == 1;
            var is_call_online_employer = _PROFILE.group_id == 44 && _PROFILE.bit_admin_caller != 1;
            var is_shop_admin = _PROFILE.int_approve_level == 1 && _PROFILE.str_user_position == '3';
            var is_shop_employer = _PROFILE.int_approve_level == 1 && _PROFILE.str_user_position == '4';
            var is_qlkv = _PROFILE.int_approve_level == 2 && _PROFILE.str_possition == 'QLKV';


            var is_show = function () {
                switch (mi.code) {
                    case 'MNA_CHI_TIET_DON':
                        return true;
                    case 'MNA_SUA_THONG_TIN':
                        if (is_call_online_admin || is_call_online_employer) {
                            return (int_status != 0 && int_status != 4 && group_id == _PROFILE.group_id);  // admin dc sửa đơn của người khác
                        } else if (is_shop_admin || is_shop_employer) {
                            return (int_status != 0 && int_status != 4 && group_id == _PROFILE.group_id);   // trưởng ch dc sửa all đơn
                        }
                    case 'MNA_TRA_DON_KHONG_NHAN_XU_LY':
                        if (is_call_online_admin || is_call_online_employer) {
                            return (caller_online_id == _PROFILE.user_id) && (int_status == 1) && group_id == 44;
                        } else {
                            return false;
                        }
                    case 'MNA_XOA_DON':
                        if (is_call_online_admin || is_call_online_employer) {
                            return (int_status != 0 && int_status != 4 && group_id == _PROFILE.group_id);
                        } else if (is_shop_admin || is_shop_employer) {
                            return (int_status != 0 && int_status != 4 && group_id == _PROFILE.group_id);
                        } else {
                            return false;
                        }
                    case 'MNA_DAT_LICH_TU_VAN':
                        if (is_shop_admin || is_shop_employer) {
                            return ((int_status == 1 || int_status == 2) && group_id != 44);
                        } else {
                            return false;
                        }
                    case 'MNA_LICH_SU_DAT_LICH_TU_VAN':
                        if (is_shop_admin || is_shop_employer || is_qlkv) {
                            return ((int_status == 1 || int_status == 2) && group_id != 44);
                        } else {
                            return false;
                        }
                    default:
                        return false;
                }
            };

            if (is_show()) {
                switch (mi.command) {
                    case 'OPEN_POPUP':
                        var _props = mi.config;
                        s = '<div class="item link" onclick="___popup(\'' + mi.function + '\',\'' + JSON.stringify({ id: id }).split('"').join('`') + '\',\'' + JSON.stringify(_props).split('"').join('`') + '\')">' +
                            '<i class="' + mi.icon + '"></i>' + mi.name + '</div>';
                        break;
                    default:
                        s = '<div class="item link" onclick="' + mi.function + '(___para_decode(\'' + JSON.stringify({ id: id }).split('"').join('`') + '\'))">' +
                            '<i class="' + mi.icon + '"></i>' + mi.name + '</div>';
                        break;
                }
            }

            return s;
        },
        f_table_action_menu_mouse_toggle: function (index, id, int_group_status, int_status, group_id, caller_shop_id, caller_online_id, e) {
            var _self = this;
            console.log(index, _self.objSearch.optionsRuntime.int_state_menu);
            var el = e.target.closest('td');
            if (el) {
                var is_open = el && el.hasAttribute('open') && el.getAttribute('open') == 'true';
                var mn = document.querySelector('.pop-mna-action-' + index);

                var table = document.getElementById('example_wrapper');

                if (mn) {
                    if (is_open) {
                        console.log('UI > TABLE MENU: open -> close ...');
                        el.setAttribute('open', 'false');
                        mn.style.display = 'none';
                    } else {
                        $('.mn-action').hide();
                        document.querySelectorAll('.dtm-cell-action').forEach(tdi => tdi.setAttribute('open', 'false'));

                        var y = e.pageY, x = e.pageX;

                        console.log('UI > TABLE MENU: close -> open ...');
                        el.setAttribute('open', 'true');


                        var str_mns = '';
                        _TBL_MAIN_MENU_ACTIONS.forEach(mi => {
                            var mni = _self.f_table_permistion_draw_menu_item(mi, id, int_group_status, int_status, group_id, caller_shop_id, caller_online_id);
                            str_mns += mni;
                        });

                        mn.innerHTML = '<div id="id_count_' + index + '" class="ui vertical menu" style="width:auto;">' + str_mns + '</div>';

                        Vue.nextTick(function () {

                            var count_item = $('#id_count_' + index).find('.item.link');

                            const tb = table.getBoundingClientRect();
                            var h1 = tb.height + 55;

                            x = x - 20;

                            if (y > h1 && count_item.length > 1) {
                                y = y - 100;
                            }

                            mn.style.width = '235px';
                            //mn.style.top = (y - hi_) + 'px';
                            mn.style.top = y + 'px';
                            mn.style.left = (x - 235) + 'px';

                            mn.style.opacity = 1;
                            mn.style.display = 'inline-block';
                        });
                    }
                }
            }
        },
        f_table_action_menu_close_all: function (e) {
            var el;
            if (e) el = e.target.closest('span.c-action');
            if (el == null) {
                $('.mn-action').hide();
                document.querySelectorAll('.dtm-cell-action').forEach(tdi => tdi.setAttribute('open', 'false'));
            }
        },
        f_table_draw_rows: function (res) {
            console.log('UI.TABLE > DRAW_ROWS ...');

            const _self = this;

            const table_ = $('#example').DataTable();
            table_.clear().draw(false);

            let it, ri, cus_info = '',
                cus_address = '', city_district = '', caller = '',
                shop_name = '', type_asset = '', td_chk, group_name_now = '';

            const max = res.result_items.length;

            var checkAll = 0, hasChecked = false, rowNode;

            var is_call_online = _PROFILE.bit_admin_caller == 1;
            var is_call_online_employer = _PROFILE.group_id == 44 && _PROFILE.bit_admin_caller != 1;
            var is_shop_admin = _PROFILE.int_approve_level == 1 && _PROFILE.str_user_position == '3';
            var is_shop_employer = _PROFILE.int_approve_level == 1 && _PROFILE.str_user_position == '4';

            var is_assign_users = false;
            if (_PROFILE && _PROFILE.pos_sys_config && _PROFILE.pos_sys_config.assign_users_id)
                is_assign_users = (',' + _PROFILE.pos_sys_config.assign_users_id + ',').indexOf(',' + _PROFILE.user_id + ',') != -1;

            var a_valid_ids_ = [];

            for (let i = 0; i < max; i++) {
                var support_time = 0;
                it = res.result_items[i];

                //if (i == 3 && it.___customer) {
                //    it.___customer.str_name = '';
                //    it.___customer.str_phone = '';
                //}

                if (it.___customer) {

                    var num = (it.___customer && it.___customer.str_phone) ?  it.___customer.str_phone.toString() : "";
                    num = num.replace(/\D/g, '');

                    cus_info = it.___customer.str_name == undefined ? '&nbsp;' : ___html_encode(it.___customer.str_name) + '&nbsp;';
                    if (cus_info.length == 0) {
                        cus_info = it.___customer.str_phone == undefined ? '&nbsp;' : ___html_encode(it.___customer.str_phone) + '&nbsp;';
                        //else cus_info += it.___customer.str_phone == undefined ? '' :  '<br><a v-if="_PROFILE.group_id != 44" style="font-weight: 700;color: #646464 !important;cursor: pointer;" onclick="_APP.f_show_call(' + it.___customer.str_phone.toString() + ')"><b>' + ___html_encode(it.___customer.str_phone) + '</b><i style="margin-left: 5px;" class="phone volume icon"></i><a>';
                    } else {
                        cus_info += it.___customer.str_phone == undefined ? ''
                            : ((_PROFILE.str_call_out_tooken && _PROFILE.str_call_out_tooken.length > 0) == true     // neu ko có call token thi ẩn
                                ? (
                                    '<br>' +
                                    '   <a style="font-weight: 700;color: #646464 !important;cursor: pointer;" onclick="_APP.f_show_call(\'' + num + '\')">' +
                                    '       <b>' + ___html_encode(it.___customer.str_phone) + '&nbsp;' + '</b>' +
                                    '       <i style="margin-left: 5px;" class="phone volume icon"></i>' +
                                    '   <a>')
                                : (
                                    '<br>' +
                                    '   <b>' + ___html_encode(it.___customer.str_phone) + '&nbsp;' + '</b>'));

                    }
                }

                if (it.str_city_name) city_district = it.str_city_name;
                if (city_district && city_district.length == 0) city_district = it.str_district_name;
                else city_district += (it.str_district_name && it.str_district_name.length > 0) ? ', ' + it.str_district_name : '';

                if (_PROFILE.group_id == 44) {
                    // is caller of online
                    if (it.___caller_online)
                        caller = it.___caller_online.str_full_name == undefined ? '' : it.___caller_online.str_full_name;
                } else {
                    // is caller of shop
                    if (it.___caller_shop)
                        caller = it.___caller_shop.str_full_name == undefined ? '' : it.___caller_shop.str_full_name;
                }

                if (it.___customer)
                    cus_address = it.___customer.str_address == undefined ? '' : ___html_encode(it.___customer.str_address);

                if (it.___caller_shop)
                    shop_name = it.___caller_shop.str_shop_name == undefined ? '' : it.___caller_shop.str_shop_name;


                if (it.___group)
                    group_name_now = it.___group.str_name == undefined ? '' : it.___group.str_name;

                type_asset = it.str_asset_type_name == undefined ? '' : ___html_encode(it.str_asset_type_name);
                if (it.bit_car_in_bank == 1 && it.asset_type_id == 1) type_asset += '<b class=td-carinbank>TCNH</b>';

                if (it.___list_support_schedule) {
                    for (var j = 0; j < it.___list_support_schedule.length; j++) {
                        if (it.___list_support_schedule[j].int_state == 1) {
                            support_time = it.___list_support_schedule[j].int_support_time == undefined ? 0 : it.___list_support_schedule[j].int_support_time;
                        }
                    }
                }

                hasChecked = _self.objItemsChecked.ids.indexOf(it.id) != -1;
                if (hasChecked) checkAll++;

                td_chk = '';

                // 1. Call online:
                //  - Là admin caller online Hoặc tài khoản chia đơn(pos_sys_config)
                //  - AND là các đơn chưa đc gán caller_online_id = -1
                //  - AND đơn đang ở group_id là group call online(44)

                // 2. Tài khoản QL cửa hàng giao dịch:
                //  - Đơn đang ở cửa hàng(group_id == _PROFILE.group_id)
                //  - Chưa được gán caller_shop_id = -1

                if (   // call_chiadon khong dc chia don tay
                    (((is_call_online || is_assign_users) && (it.caller_online_id == -1 || it.caller_online_id == 0 || it.caller_online_id.length ==0) && it.group_id == 44)
                        || (is_shop_admin && _PROFILE.group_id == it.group_id && (it.caller_shop_id == -1 || it.caller_shop_id == 0 || it.caller_shop_id.length ==0))) && (it.int_status != 0 && it.int_status != 4)

                ) {
                    td_chk = '<div class="ui read-only checkbox chk-' + it.id + '" onclick="_APP.f_pawn_list_check___on_click(' + i + ',' + it.id + ',event)"><input data-id="' + it.id + '" data-index="' + i + '" type="checkbox"></div>';
                    a_valid_ids_.push(it.id);
                }

                //if (   // call chia don  dc phep chia tay cac don
                //    (((is_call_online || is_assign_users) && (it.caller_online_id == -1 || it.caller_online_id == 696) && it.group_id == 44)
                //        || (is_shop_admin && _PROFILE.group_id == it.group_id && it.caller_shop_id == -1)) && (it.int_status != 0 && it.int_status != 4)
                //)
                //{
                //    td_chk = '<div class="ui read-only checkbox chk-' + it.id + '" onclick="_APP.f_pawn_list_check___on_click(' + i + ',' + it.id + ',event)"><input data-id="' + it.id + '" data-index="' + i + '" type="checkbox"></div>';
                //    a_valid_ids_.push(it.id);
                //}

                ri = [
                    //'<div class="ui read-only checkbox chk-' + it.id + '" onclick="_APP.f_pawn_list_check___on_click(' + i + ',' + it.id + ',event)"><input data-id="' + it.id + '" data-index="' + i + '" type="checkbox" ' + (hasChecked ? ' checked="checked" ' : '') + '></div>',
                    td_chk,
                    it.index___.toString(),
                    cus_info,
                    _self.plugin___pawn___lng_money((it.lng_money && it.lng_money.length > 0) ? it.lng_money.toString() : 0),
                    (it.int_created_date == undefined ? '' : _self.plugin___pawn___int_created_date(it.int_created_date)) + (it.int_created_time == undefined ? '' : '<br>' + _self.plugin___pawn___int_created_time(it.int_created_time)),
                    cus_address,
                    city_district,
                    'POL-' + it.id.toString(),
                    type_asset,
                    '',
                    it.str_channel_name == undefined ? '' : it.str_channel_name,
                    caller,
                    // shop_name,
                    group_name_now,
                    it.str_trademark == undefined ? '' : ___html_encode(it.str_trademark),
                    '<h3 style="width:500px;">&nbsp;</h3>',
                    _self.plugin___pawn___int_status(it.int_status, it.int_priority_id, _self.plugin___pawn___int_support_time(support_time)),
                    '<span class="c-action btn-mna-' + i + '" onclick="_APP.f_table_action_menu_mouse_toggle(' + i + ',' + it.id + ',' + it.int_group_status + ',' + it.int_status + ',' + it.group_id + ',' + it.caller_shop_id + ',' + it.caller_online_id + ',event)"><i class="cog icon"></i><i class="caret down icon"></i></span>'
                ];

                //console.log(i, ri);
                try {
                    table_.row.add(ri).draw(false);
                } catch (err_) {
                    console.log(err_.toString(), ri);
                }

                //rowNode = table_.row.add(ri).draw().node();
                //classie.add(rowNode, 'dtr-row').add(rowNode, 'dtr-' + it.id);
                //if (hasChecked) classie.add(rowNode, 'dt-row-checked'); 
            }

            const dt = res.result_items;
            document.querySelectorAll('.dataTables_scrollBody .vue-table-main tbody tr').forEach(function (r, i) {
                if (dt && dt.length > 0)
                    if (dt && dt[i].id) classie.add(r, 'dtr-row').add(r, 'dtr-' + dt[i].id);
                //if (dt && dt.id) classie.add(r, 'dtr-row').add(r, 'dtr-' + dt[i].id);
            });
            document.querySelectorAll('.DTFC_RightBodyLiner .vue-table-main tbody tr').forEach(function (r, i) {
                if (dt && dt.length > 0)
                    if (dt && dt[i].id) classie.add(r, 'dtr-row').add(r, 'dtr-' + dt[i].id);
                //if (dt && dt.id) classie.add(r, 'dtr-row').add(r, 'dtr-' + dt[i].id);
            });
            document.querySelectorAll('.DTFC_LeftBodyLiner .vue-table-main tbody tr').forEach(function (r, i) {
                if (dt && dt.length > 0)
                    if (dt && dt[i].id) classie.add(r, 'dtr-row').add(r, 'dtr-' + dt[i].id);
                //if (dt && dt.id) classie.add(r, 'dtr-row').add(r, 'dtr-' + dt[i].id);
            });

            //trs.forEach(function ($r, index) {
            //    console.log(index, $r);
            //});

            //_self.objItemsChecked.ids_ = _.map(res.result_items, function (o) { return o.id; });
            _self.objItemsChecked.ids_ = a_valid_ids_;
            _self.___items_checked___on_check_row();

            if (a_valid_ids_.length == 0)
                _self.objItemsChecked.checkAll = false;

            _self.f_table_reg_event();
        },
        f_table_draw_rows_test: function (items) {
            console.log('UI.TABLE > DRAW_ROWS_TEST ...');

            const _self = this;
            _self.objMainGrid.loading = false;

            const table_ = $('#example').DataTable();

            table_.clear();
            let stt = 0;
            for (let i = 0; i < 30; i++) {
                stt = i + 1;
                table_.row
                    .add([
                        '<div class="ui read-only checkbox" onclick="_APP.f_pawn_list_check___on_click(' + i + ',' + i + ',event)"><input type="checkbox"></div>',
                        stt,
                        'Trần Lê Tiến Mỹ <br><b>0948003456</b>',
                        '3,000,000',
                        '20190923 01:41:18',
                        '20/4c đường 904 phường hiệp phú quận 9',
                        'TP Hồ Chí Minh - Quận 9',
                        'POL-349223',
                        'laptop',
                        '',
                        'Landing Page',
                        'Nguyễn Thị Bé Tám',
                        'Nhóm PGD HCM - F88 HCM - 158 Lê Văn Việt',
                        '',                                                                                                                                                                   //Tên TS=
                        '<h3 style="width:500px;">&nbsp;</h3>',
                        'Chưa tư vấn',
                        '<span class="c-action btn-mna-' + i + '" onclick="_APP.f_table_action_menu_mouse_toggle(' + i + ',' + i + ',' + i + ',' + i + ',' + i + ',' + i + ',' + i + ',event)"><i class="cog icon"></i><i class="caret down icon"></i></span>'])
                    .draw(false);
            }

            //$('#example').DataTable().clear();
            //$('#example').DataTable().clear().draw();

            _self.f_table_reg_event();
        },
        f_table_resize: function () {
            const _self = this;
            console.log('UI.TABLE > RESIZE ...');

            var w_ = jQuery(window).width();
            document.getElementById('example_wrapper').style.width = w_ + 'px';
            $('#example').DataTable().draw();
        },
        f_table_reg_event: function () {
            const _self = this;

            console.log('UI.TABLE > REG_EVENT ...');

            $('.dtm-cell-check .ui.checkbox').checkbox();

            $('#example_wrapper .dataTables_scrollBody').on('scroll', function () {
                //console.log('scroll running ?????????');

                $('.mn-action').hide();
                document.querySelectorAll('.dtm-cell-action').forEach(tdi => tdi.setAttribute('open', 'false'));

                //if (_APP.objApp.toolbar.height == _MAIN_TOOLBAR_FILTER_HEIGHT_MAX)
                //    setTimeout(_APP.objApp.toolbar.height = _MAIN_TOOLBAR_FILTER_HEIGHT_MIN, 1000);
            });

            //_self.f_pawn_list_checkall___set_style();
        },
        f_table_init: function () {
            console.log('UI.TABLE > INIT ...');
            var _self = this;
            const hi_ = 'calc( 100vh - ' + (_APP.objApp.header.height + _APP.objApp.breadcrumb.height + _APP.objApp.toolbar.height + _APP.objApp.grid.header.height + _APP.objApp.pager.height + _APP.objApp.footer.height) + 'px )';

            $('#example').DataTable({
                destroy: true,
                //scrollY: "300px",
                scrollY: hi_,
                scrollX: true,
                scrollCollapse: true,
                fixedColumns: {
                    leftColumns: 3,
                    rightColumns: 2
                },
                paging: false,
                ordering: false,
                info: false,
                dom: 'rtip',
                columnDefs: [
                    { targets: 0, className: 'dt-body-center dtm-cell-check' },
                    { targets: 1, className: 'dt-body-center dtm-cell-stt' },
                    { targets: 2, className: 'td-table dt-body-center dtm-cell-name dt-cell-name' },
                    { targets: 3, className: 'dt-body-center dtm-cell-money' },
                    { targets: 4, className: 'dt-body-right' },
                    { targets: 5, className: 'dt-cell-address' },
                    //{ targets: 2, className: 'td-table dt-body-right' },



                    { targets: 6, className: '' },
                    { targets: 7, className: '' },
                    { targets: 8, className: '' },
                    { targets: 9, className: '' },
                    { targets: 10, className: '' },
                    { targets: 11, className: '' },
                    { targets: 12, className: '' },

                    { targets: 13, className: 'dtm-cell-last' },
                    { targets: 14, className: 'dtm-cell-free' },
                    { targets: 15, className: 'dtm-cell-status' },
                    { targets: 16, className: 'dt-body-right dtm-cell-action' }
                ]
            });
        },
        //----------------------------------------------------------------
        f_accordion: function () {
            const _self = this;
            console.log('UI > TOOLBAR_FILTER: height = ', _self.objApp.toolbar.height);

            switch (_self.objApp.toolbar.height) {
                case _MAIN_TOOLBAR_FILTER_HEIGHT_MIN:
                    _self.objApp.toolbar.height = _MAIN_TOOLBAR_FILTER_HEIGHT_MAX;
                    break;
                case _MAIN_TOOLBAR_FILTER_HEIGHT_MAX:
                    _self.objApp.toolbar.height = _MAIN_TOOLBAR_FILTER_HEIGHT_MIN;
                    break;
            }

            Vue.nextTick(function () {
                _self.f_table_init();
                _self.f_table_resize();
            });
        },
        f_onchange_action: function () {
            const _self = this;
            if ($('.dropdown.dropdown-list-action').dropdown('get item') != false) {
                var key = $('.dropdown.dropdown-list-action').dropdown('get item').attr('value');



                if (key == 1) {
                    ___popup('kit-popup-chia-don', { id: 0 }, { popHeaderVisible: false, strAlign: 'center', strWidth: '550px', strHeight: '600px' });
                } else if (_PROFILE.group_id == 44 && key == 2) {
                    ___popup('kit-popup-chuyen-mien', { id: 0 }, { popHeaderVisible: false, strAlign: 'center', strWidth: '550px', strHeight: '450px' });
                }

            }
        },
        f_show_call: function (phone_number) {
            var str_phone_number = phone_number.toString().substr(0, 1) != 0 ? ("0" + phone_number.toString()) : phone_number.toString();

            ___popup('kit-popup-call', { phone_number: str_phone_number.toString() }, { strTitle: 'THỰC HIỆN CUỘC GỌI', strSubmitText: 'Gọi ra', strAlign: 'center', strWidth: jQuery(window).width() < 1366 ? '50%' : '40%', strHeight: '530px' });

        },
        //----------------------------------------------------------------
        f_pager_draws_html: function () {
            var _self = this;
            var s = '', pager_other = '', html = '';

            var total_page = parseInt(_APP.objModel.page_total);
            var number_page = parseInt(_APP.objModel.page_number);
            var min = 1, max = total_page;

            var flagMin = false, flagMax = false;
            for (var j = 1; j <= 2; j++) {
                if (flagMin == false && (number_page - j) > 0) {
                    min = number_page - j;
                } else {
                    flagMin = true;
                }

                if (flagMax == false && (number_page + j) <= total_page) {
                    max = number_page + j;
                    if (max == total_page) flagMax = true;
                } else {
                    flagMax = true;
                }
            }

            for (var i = max; i >= min; i--) {
                if (i === number_page) {
                    html = '<b class="b-active">' + i + '</b>'
                } else {
                    html = '<b class="b-non-active" onclick="_APP.f_pager_go(' + i + ')">' + i + '</b>'
                }
                pager_other += html;
            }

            var html_min = '', html_max = '';
            if (parseInt(min) >= 2) {
                html_min = '<b class="b-non-active-min">...</b>';
            }
            if (parseInt(max) < (total_page)) {
                html_max = '<b class="b-non-active-max">...</b>';
            }

            var html_first = '', html_last = '';
            if (number_page == 1) {
                html_first = '<i class="chevron left icon i-active"></i > ' +
                    '<i class="step backward icon i-active"></i>';
            } else {
                html_first = '<i class="chevron left icon i-non-active" onclick = "_APP.f_pager_goPrev()" ></i > ' +
                    '<i class="step backward icon i-non-active" onclick="_APP.f_pager_goFirst()"></i>';
            }
            if (number_page == total_page) {
                html_last = '<i class="step forward icon i-active"></i>' +
                    '<i class="chevron right icon i-active"></i>';
            } else {
                html_last = '<i class="step forward icon i-non-active" onclick="_APP.f_pager_goLast()"></i>' +
                    '<i class="chevron right icon i-non-active" onclick="_APP.f_pager_goNext()"></i>';
            }

            s = html_last + html_max + pager_other + html_min + html_first;
            //s = '<i class="step forward icon" onclick="_APP.f_pager_goLast()"></i>' +
            //    '<i class="chevron right icon" onclick="_APP.f_pager_goNext()"></i>' + html_max + pager_other + html_min +
            //    '<i class="chevron left icon" onclick = "_APP.f_pager_goPrev()" ></i > ' +
            //    '<i class="step backward icon" onclick="_APP.f_pager_goFirst()"></i>';

            $('#pager-pawn').html(s);
        },
        f_response_pos: function () {
            // window.location = "http://localhost:8001?token=" + _PROFILE.str_token;
            //var url = HOST_POS_BASE_URI + 'home/LoginFromPOL?polTOken=' + _PROFILE.str_token;

            var url_pawn_add = '&returnUrl=' + HOST_POS_BASE_URI + 'Pawn/Add';
            var url = HOST_POS_BASE_URI + 'home/LoginFromPOL?polToken=' + _PROFILE.str_token + url_pawn_add;

            window.open(url, '_blank');
        }
    }
};

//app___install = function () {
//    head.load([
//        { plugin_js_thinh: '/_app/' + _SCOPE + '/thinh.js' },   //?v=' + ___getCurentDate(true)
//        //{ plugin_js_khoa: '/_app/' + _SCOPE + '/khoa.js' },
//        //{ plugin_js_long: '/_app/' + _SCOPE + '/long.js' },
//        //{ plugin_css_khoa: '/_app/' + _SCOPE + '/khoa.css' },
//        { plugin_css_long: '/_app/' + _SCOPE + '/long.css' },
//        { plugin_js: '/_app/' + _SCOPE + '/plugin.js' },
//        { coms_js: '/_app/' + _SCOPE + '/components.js' }
//    ], app___init);
//};


app___install = function () {
    head.load([
        { plugin_js_thinh: '/_app/' + _SCOPE + '/thinh.js?v=' + new Date().getHours() },
        { plugin_css_long: '/_app/' + _SCOPE + '/long.css' },
        { plugin_js: '/_app/' + _SCOPE + '/plugin.js?v=' + new Date().getHours() },
        { coms_js: '/_app/' + _SCOPE + '/components.js?v=' + new Date().getHours() }
    ], app___init);
};



dom___on_click = function (e) {
    _APP.f_table_action_menu_close_all(e);
};

var app___init = function () {
    _APP = new Vue({
        mixins: [_MIXIN_APP, _VUE_FUNCTIONS],
        data: function () { return _DATA; },
        el: '#app',
        mounted: function () {
            const _self = this;
            Vue.nextTick(_self.f_app_ready);
        },
        watch: {
            'objNotify': {
                handler: function (after, before) {
                    var _self = this;
                    console.log('APP.watch -> objNotify = ', JSON.stringify(_APP.$data.objNotify.length));

                    if (_V_POPUP_CURRENT_NAME == 'kit-popup-hien-thi-mess')
                        ___notify_update_readed();
                },
                deep: true
            },
            'objSearch.optionsRuntime': {
                handler: function (after, before) {
                    var _self = this;
                    //console.log('APP.watch -> objSearch.optionsRuntime = ', JSON.stringify(_APP.$data.objSearch.optionsRuntime));
                },
                deep: true
            },
            'objItemsChecked.ids_': {
                handler: function (after, before) {
                    var _self = this;
                    //console.log('### UI.WATCH -> objItemsChecked.ids_ = ', JSON.stringify(_self.objItemsChecked.ids_));
                    _self.___items_checked___on_init();
                },
                deep: true
            },
            'objItemsChecked.checkAll': {
                handler: function (after, before) {
                    var _self = this;
                    //console.log('### UI.WATCH -> objItemsChecked.ids = ', JSON.stringify(_self.objItemsChecked.ids));
                    _self.___items_checked___on_check_all();
                },
                deep: true
            },
            'objItemsChecked.ids': {
                handler: function (after, before) {
                    var _self = this;
                    //console.log('### UI.WATCH -> objItemsChecked.ids = ', JSON.stringify(_self.objItemsChecked.ids));
                    //_self.___items_checked___on_check_row();
                },
                deep: true
            }
        }
    });
};