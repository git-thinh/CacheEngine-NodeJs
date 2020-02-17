
/*popup: thông tin chi tiết*/
Vue.component('kit-popup-thong-tin-chi-tiet', {
    mixins: [_MIXIN_COMS],
    template: ___getTemplate('kit-popup-thong-tin-chi-tiet'),
    data: function () {
        return {
            para: {},
            list: {},
            list_process: [],
            pol_online_id: 0,
            arr_color: ["secondary ", "red", "orange", "yellow", "olive", "green", "teal", "violet"],


            visible: false,
            loading: false,
            objUpdate: {

                str_content: '',
                int_group_shop_id: -1,
                str_group_shop_name: '',
                int_priority_id: -1,
                str_priority_name: '',

                int_pol_pawn_id: 0,
                int_pawn_status: 2,
                int_recept_group_id: 0,
                lng_created_at: ___getCurentDate(true),
                int_created_by: _PROFILE.user_id,
                str_created_by_name: _PROFILE.str_full_name,
                current_group_id: _PROFILE.group_id,
                int_caller_id: _PROFILE.user_id,
                int_created_group_id: 44,
                str_created_group: _PROFILE.str_group_name,
                int_status: 1,
                str_action_name: 'Thêm ND chăm sóc',

                str_canceled_reason: '',
                int_action: 1,
                int_current_group_state: 4, // pawn
                lng_last_trans_dtime: '',
                int_steeped_group_id: '',
                lng_reserve_time_dtime: '',
                lng_recall_time: ''

            },
            objErrorValue: {
                str_content: '',
                int_group_shop_id: -1,
                int_priority_id: -1
            },
            objErrorLabel: {
                str_content: '',
                int_group_shop_id: '',
                int_priority_id: ''
            },
            objErrorMsg: {
                str_content: 'Nhập nội dung',
                int_group_shop_id: 'Chọn nhóm cửa hàng',
                int_priority_id: 'Chọn độ ưu tiên'
            }
        };
    },
    created: function () {
        var _self = this;
        _self.f_ready_process();

        //  thong tin kh
        var s = 'function(o) { return o.id === ' + this.___para.id + '; }';
        fetch___post('api/pol_pawn/search', { conditons: s, page_number: 1, page_size: 30 }).then(rs_ => {
            _self.list = rs_.result_items[0];
        });
    },
    watch: {
        'list': {
            handler: function (after, before) {
                var _self = this;
                _self.___visible();
            },
            deep: true
        }
    },
    mounted: function () {
        var _self = this;
        $('.ui.accordion').accordion();
        setTimeout(_self.f_set_value_by_para, 300);
    },
    methods: {
        ___visible: function (is_visible) {
            const _self = this;
            ___popup_buttons_disable([
                function () {   // huy
                    if (_self.list.int_status == 0 || _self.list.int_status == 4) return true;   // trạng thái đơn bằng 0 hoặc 4 thì ẩn button
                    if (_self.list.group_id != _PROFILE.group_id) return true;  // group của đơn khác group của user thao tác thì ẩn button

                    return false;
                },
                function () {  // comment
                    if (_self.list.int_status == 0 || _self.list.int_status == 4) return true;   // trạng thái đơn bằng 0 hoặc 4 thì ẩn button
                    if (_self.list.group_id != _PROFILE.group_id) return true;  // group của đơn khác group của user thao tác thì ẩn button

                    return false;
                },
                function () {  // chuyen 
                    if (_self.list.int_status == 0 || _self.list.int_status == 4) return true;
                    if ((_self.list.group_id != 44 && _self.list.group_id != 53) || (_self.list.group_id != _PROFILE.group_id)) return true;
                    return false;
                },
                function () { // sms
                    //if (_self.list.int_status == 0 || _self.list.int_status == 4) return true;

                    if (_self.list.int_status != 1 && _self.list.int_status != 2) return true; // khác 1 thì ẩn
                    if (_self.list.int_group_status == 0) return true;
                    if (_self.list.group_id != 44) return true;
                    if (_PROFILE.group_id != 44) return true;

                    return false;
                }
            ]);
        },
        ___submit: function (code, para) {
            const _self = this;
            switch (code) {
                case 'HUY_DON':
                    ___popup_close();
                    this.view_popup_huy_don();
                    break;
                case 'SAVE_CARE_INFO':
                    this.add_care_history();
                    break;
                case 'FORWARD_PAWN':
                    this.transfer_pawn();
                    break;
                case 'SMS_FAIL':
                    this.sms_();
                    break;
            }
        },
        add_care_history: function () {
            const _self = this;

            var objErrorValue = {
                str_content: '',
            };

            var arr_errors = _self.___pop_valid_multi(_self.objUpdate, objErrorValue);

            //   var arr_errors = _self.___pop_valid(_self.objUpdate, objErrorValue);

            if (arr_errors.length == 0) {

                _self.objUpdate.int_pol_pawn_id = this.___para.id;

                $.each(_self.$children,
                    function (i, v) {
                        switch (v.vueRef) {
                            case "FORM_INFOR___RECALL_TIME":
                                if ($('#' + v.___id).attr('date-val') != undefined) {
                                    _self.objUpdate.lng_recall_time = parseInt($('#' + v.___id).attr('date-val'));
                                }
                                break;
                            default:

                        }
                    });

                _APP.$data.loading = true;
                var data = '111' + JSON.stringify(_self.objUpdate);
                
                ___post_action('pol_process', 'biz_comment', data).then(res => {
                    if (res.Ok) {
                        ___alert_type("Thêm mới thông tin thành công", res.Ok);
                        
                        setTimeout(___popup_close, 1000);
                        setTimeout(_self.f_callback_popup, 1000);

                    } else {
                        ___alert_type("Thêm mới thông tin thất bại", res.Ok);
                       // ___alert_type(res.Message, res.Ok);
                    }

                    _APP.$data.loading = false;
                }).catch(() => {
                    _APP.$data.loading = false;
                });


            }
        },
        view_popup_huy_don: function () {
            var _self = this;
            ___popup('kit-popup-ly-do-that-bai', { id: this.___para.id }, { popHeaderVisible: false, strAlign: 'center', strWidth: '550px', strHeight: '580px' });
            _self.visible = false;
        },
        transfer_pawn: function () {
            const _self = this;
            _APP.$data.loading = true;
            var arr_errors = _self.___pop_valid(_self.objUpdate);

            if (arr_errors.length == 0) {

                _self.objUpdate.int_pol_pawn_id = this.___para.id;
                _self.objUpdate.int_action = 2;
                _self.objUpdate.str_action_name = 'Chuyển đơn';
                _self.objUpdate.lng_last_trans_dtime = ___getCurentDate(true);
                _self.objUpdate.int_current_group_state = 0;
                _self.objUpdate.int_steeped_group_id = 44 + ',' + _self.objUpdate.int_group_shop_id; // chi đúng với TH Call chuyển xuống CH

                $.each(_self.$children,
                    function (i, v) {
                        switch (v.vueRef) {
                            case "FORM_INFOR___RESEVER_TIME":
                                if ($('#' + v.___id).attr('date-val') != undefined) {
                                    _self.objUpdate.lng_reserve_time_dtime =
                                        parseInt($('#' + v.___id).attr('date-val'));
                                }
                                break;
                            case "FORM_INFOR___RECALL_TIME":
                                if ($('#' + v.___id).attr('date-val') != undefined) {
                                    _self.objUpdate.lng_recall_time = parseInt($('#' + v.___id).attr('date-val'));
                                }
                                break;
                            default:

                        }
                    });

                
                var data = '111' + JSON.stringify(_self.objUpdate);
                
                ___post_action('pol_process', 'biz_chuyendon', data).then(res => {
                    if (res.Ok) {
                        setTimeout(___popup_close, 1000);
                        ___alert_type("Chuyển đơn thành công", res.Ok);
                    } else {
                        ___alert_type("Chuyển đơn thất bại", res.Ok);
                        //___alert_type(res.Message, res.Ok);
                    }
                    _APP.$data.loading = false;
                    _self.f_ready_process();
                }).catch(() => {
                    _APP.$data.loading = false;
                });
            }
        },
        sms_: function () {
            var _self = this;
            swal({
                title: "Bạn có muốn gửi SMS đến khách hàng này?",
                text: "",
                icon: "warning",
                buttons: ['Hủy', true],

                showConfirmButton: false
            })
                .then((willDelete) => {
                    if (willDelete) {

                        const _self = this;

                        _self.objUpdate.int_priority_id = 2;
                        _self.objUpdate.int_group_shop_id = 0;
                        _self.objUpdate.str_content = 'Gửi SMS khi khách hàng không liên lạc được';

                        var arr_errors = _self.___pop_valid(_self.objUpdate);

                        if (arr_errors.length == 0) {


                            _self.objUpdate.int_action = 6;
                            _self.objUpdate.int_pol_pawn_id = this.___para.id;

                            _self.objUpdate.str_action_name = 'SMS không liên lạc được';

                            _APP.$data.loading = true;

                            var data = '111' + JSON.stringify(_self.objUpdate);
                            
                            ___post_action('pol_process', 'biz_sendsms', data).then(res => {
                                if (res.Ok) {
                                    ___alert_type("Gửi SMS thành công", res.Ok);
                                    setTimeout(___popup_close, 1000);

                                } else {
                                    ___alert_type("Có lỗi xảy ra", res.Ok);
                                   // ___alert_type(res.Message, res.Ok);
                                }
                                _APP.$data.loading = false;
                                _self.f_ready_process();
                            }).catch(() => {
                                _APP.$data.loading = false;
                            });
                        } else {
                            console.log('nooooooooooooooooo');
                        }
                    } else {
                        //_self.visible = false;
                    }
                });
        },

        f_ready_process: function () {
            var _self = this;
            // lich su cham soc

            var pro = 'function(i) { return i.int_pol_pawn_id ==' + this.___para.id + '; }';
            fetch___post('api/pol_process/search', { conditons: pro, page_number: 1, page_size: 100000 }).then(rs_ => {

                _self.list_process = rs_.result_items;   
                if (_self.list_process && _self.list_process.length > 0) {    // sắp xếp thông tin mới nhất lên đầu
                    _self.list_process = _.sortBy(_self.list_process, function (o) { return o.id; });
                    _self.list_process = _self.list_process.reverse();
                }
              

                for (var i = 0; i < _self.list_process.length; i++) {
                    if (_self.list_process[i].int_action == 1) {
                        _self.list_process[i].color = 'blue';
                    }
                    else if (_self.list_process[i].int_action == 2) {
                        _self.list_process[i].color = 'violet';
                    }
                    else if (_self.list_process[i].int_action == 3) {
                        _self.list_process[i].color = 'red';
                    }
                    else if (_self.list_process[i].int_action == 6) {
                        _self.list_process[i].color = 'yellow';
                    } else {
                        _self.list_process[i].color = 'green';
                    }
                }

            });
        },
        f_set_value_by_para: function () {
            const _self = this;
            _self.___set_value('FORM_INFOR___PRIORITY', function (o) { return o.name == 'Cao' });
        },
        f_callback_popup: function () {
            ___popup('kit-popup-thong-tin-chi-tiet',
                { id: this.___para.id },
                {
                    strTitle: 'THÔNG TIN CHI TIẾT',
                    strAlign: 'center',
                    strWidth: jQuery(window).width() < 1366 ? '80%' : '50%',
                    strHeight: '80%'
                });
        }

    }
});

Vue.component('kit-popup-hien-thi-mess', {
    mixins: [_MIXIN_COMS],
    template: ___getTemplate('kit-popup-hien-thi-mess'),
    data: function () {
        return {
            visible: false,
            user_name: _PROFILE.str_full_name
        };
    },
    created: function () {
    },
    mounted: function () {
        ___notify_update_readed();
    },
    methods: {
        f_get_icon_by_step_id: function (id) {
            var s = 'envelope outline';
            if (id >= 20 && id < 30) s = 'phone volume';
            else if (id >= 30 && id < 40) s = 'store';

            return s;
        }
    }
});



/*popup: Quản lý nhân viên*/
Vue.component('kit-popup-quan-ly-nhan-vien', {
    mixins: [_MIXIN_COMS],
    template: ___getTemplate('kit-popup-quan-ly-nhan-vien'),
    data: function () {
        return {
            visible: false,
            list: [],
            arr: [],
            id: 0,
            user_id: 0,
            group_id: 0,
            int_pol_region: 0,
            int_pol_status: 0,
            str_full_name: '',
            str_name: '',
            int_don: '',
            str_date_created: ''
        };
    },
    created: function () {
        var _self = this;

        var s = 'function(o) { return o.group_id === ' + _PROFILE.group_id + '; }';
        fetch___get('/job/pol_pawn/EMPLOYEE_MANNAGER/all/all', { page_number: 1, page_size: 5000 }).then(res1 => {
            var ___mag = [];
            ___mag = res1.data.results;

            if (___mag && ___mag.length > 0) {

                //   fetch___get('api/user/all', { conditons: s, page_number: 1, page_size: 5000 }).then(res => {

                fetch___post('api/user/allbykey', { conditons: s, page_number: 1, page_size: 5000 }).then(res => {

                    var a = _.map(res.result_items, function (o) {
                        return {
                            id: o.id,
                            group_id: o.group_id,
                            int_pol_region: o.int_pol_region,
                            str_name: '',
                            int_don: '',
                            int_pol_status: o.int_pol_status,
                            str_full_name: o.str_full_name
                        };
                    });
                    a = _.filter(a, function (o) { return o.group_id == 44 });
                    for (var i = 0; i < a.length; i++) {
                        if (a[i].int_pol_region == 0) {
                            a[i].str_name = 'Miền Bắc';

                        }
                        else if (a[i].int_pol_region == 1) {
                            a[i].str_name = 'Miền Nam';
                        }
                        else if (a[i].int_pol_region == 2) {
                            a[i].str_name = 'Miền Trung';
                        }
                        else if (a[i].int_pol_region == -1) {
                            a[i].str_name = 'Chọn khu vực';
                        }
                        a[i].int_don = ___mag[i].int_don;


                    }

                    _self.list = a;
                });
                //_self.str_date_created = res1.all.all.str_date_created;
            }
        });


        setInterval(function () {
            fetch___get('/job/pol_pawn/EMPLOYEE_MANNAGER/all/all', { page_number: 1, page_size: 5000 }).then(res1 => {
                var ___mag = [];
                ___mag = res1.data.results;
                if (___mag && ___mag.length > 0) {

                    //   fetch___get('api/user/all', { conditons: s, page_number: 1, page_size: 5000 }).then(res => {
                    fetch___post('api/user/allbykey', { conditons: s, page_number: 1, page_size: 5000 }).then(res => {
                        var a = _.map(res.result_items, function (o) {
                            return {
                                id: o.id,
                                group_id: o.group_id,
                                int_pol_region: o.int_pol_region,
                                str_name: '',
                                int_don: '',
                                int_pol_status: o.int_pol_status,
                                str_full_name: o.str_full_name
                            };
                        });
                        a = _.filter(a, function (o) { return o.group_id == 44 });
                        for (var i = 0; i < a.length; i++) {
                            if (a[i].int_pol_region == 0) {
                                a[i].str_name = 'Miền Bắc';

                            }
                            else if (a[i].int_pol_region == 1) {
                                a[i].str_name = 'Miền Nam';
                            }
                            else if (a[i].int_pol_region == 2) {
                                a[i].str_name = 'Miền Trung';
                            }
                            else if (a[i].int_pol_region == -1) {
                                a[i].str_name = 'Chọn khu vực';
                            }
                            a[i].int_don = ___mag[i].int_don;


                        }

                        _self.list = a;
                    });
                    //_self.str_date_created = res1.all.all.str_date_created;
                }
            });
        }, 10000);

    },
    mounted: function () {
        var _self = this;

        $('.test.checkbox').checkbox();

        $('.test.checkbox .btn-check').checkbox();

    },
    methods: {
        ___visible: function () {
            var _self = this;


        },
        change_pol_status_: function (item, event, user_id) {
            var _self = this;

            _APP.$data.loading = true;

            var obj_item = {
                user_id: user_id,
                int_type: 1,
                int_pol_region: 0,
                int_pol_status: event.target.checked === true ? 1 : 0,
                int_user_create: _PROFILE.user_id
            };
            var data = '111' + JSON.stringify(obj_item);


            var msg = 'Online';
            if (obj_item.int_pol_status == "0") {
                msg = 'Offline';
            }
            ___post_action('user', 'biz_update_user', data).then(res => {
                if (res.Ok) {
                    if (obj_item.user_id == _PROFILE.user_id) {
                        _PROFILE.int_pol_status = obj_item.int_pol_status;

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

                        _STORE_USER.remove('PROFILE');

                        setTimeout(function () {
                            _STORE_USER.add('PROFILE', _PROFILE);
                        }, 2000);


                    }

                    ___alert_type("Đổi trạng thái " + msg + " thành công", "success");
                } else {
                    ___alert_type("Đổi trạng thái " + msg + " thất bại", "error");
                }

                _APP.$data.loading = false;
            }).catch(() => {
                _APP.$data.loading = false;
            });



        },
        f_area_on_changed: function (vueRef, val, name, objValue, apiBindId) {


            var _self = this;

            _APP.$data.loading = true;

            var obj_item = {
                // id: _PROFILE.user_id,
                user_id: objValue.id,
                int_type: 0,
                int_pol_region: val,
                int_pol_status: 0
            };
            var data = '111' + JSON.stringify(obj_item);


            ___post_action('user', 'biz_update_user', data).then(res => {
                if (res.Ok) {
                    ___alert_type("Update thành công", "success");
                } else {
                    ___alert_type("Update thất bại", "error");
                }

                _APP.$data.loading = false;
            }).catch(() => {
                _APP.$data.loading = false;
            });
        },
    },
    watch: {
        'list': {
            handler: function (after, before) {
                var _self = this;
                //  console.log('APP.watch -> objSearch.optionsRuntime = ');


                Vue.nextTick(function () {

                    setTimeout(function (sf) {
                        //console.log(JSON.stringify(_self.list));

                        for (var i = 0; i < sf.list.length; i++) {
                            if (sf.list[i].int_pol_region != -1) {
                                var val = sf.list[i].str_name.toString();
                                // console.log(val);
                                _self.___set_value('FORM_SEARCH___AREA_' + i + '', function (o) { return o.name == val; }, false);
                            }
                        }

                    }, 1500, _self);


                });


            },
            deep: true
        }
    }
});




/*popup: lý do thất bại*/
Vue.component('kit-popup-ly-do-that-bai', {
    mixins: [_MIXIN_COMS],
    template: ___getTemplate('kit-popup-ly-do-that-bai'),
    data: function () {
        return {
            visible: false,
            loading: false,
            objUpdate: {

                int_reason_fail_id: -1,  // ly do 
                str_canceled_reason: '',

                str_content: '',

                int_group_shop_id: 0,
                int_pol_pawn_id: 0,
                int_action: 3,

                str_group_shop_name: '',
                int_priority_id: 0,
                str_priority_name: '',

                int_pawn_status: 0,
                int_recept_group_id: 0,

                lng_created_at: ___getCurentDate(true),
                int_created_by: _PROFILE.user_id,
                str_created_by_name: _PROFILE.str_full_name,
                current_group_id: _PROFILE.group_id,
                int_created_group_id: _PROFILE.group_id,
                str_created_group: _PROFILE.str_group_name,
                int_caller_id: 0,

                int_status: 1,
                str_action_name: 'Hủy đơn',

                int_current_group_state: 4, // pawn
                lng_last_trans_dtime: '',
                int_steeped_group_id: '',
                lng_reserve_time_dtime: '',
                lng_recall_time: ''
            },
            objErrorValue: {
                int_reason_fail_id: -1,
                str_content: ''
            },
            objErrorLabel: {
                int_reason_fail_id: '',
                str_content: ''
            },
            objErrorMsg: {
                int_reason_fail_id: 'Chọn lý do',
                str_content: 'Nhập nội dung'
            }
        };
    },
    mounted: function () {
    },
    methods: {
        ___submit: function () {
            this.f_huydon_submit();
        },
        f_huydon_submit: function () {
            const _self = this;
            var s = 'function(o) { return o.id === ' + this.___para.id + '; }';

            fetch___post('api/pol_pawn/search', { conditons: s, page_number: 1, page_size: 30 }).then(rs_ => {
                _self.objUpdate.int_group_shop_id = rs_.result_items[0].shop_id;
            });
            _self.objUpdate.int_pol_pawn_id = this.___para.id;


            var arr_errors = _self.___pop_valid(_self.objUpdate);

            if (arr_errors.length == 0) {

                _APP.$data.loading = true;

                var obj = JSON.parse(JSON.stringify(_self.objUpdate));

                obj.___exe_callback = 'pol_process_biz_addnew';  // gọi const ___exe_callback = {pol_process_biz_addnew}  bển file main.js chứ không phải store pol_process_biz_addnew trong sql
                var data = '111' + JSON.stringify(obj);
                
                ___post_action('pol_process', 'biz_huydon', data).then(res => {
                    if (res.Ok) {
                        ___alert_type("Hủy thành công", res.Ok);
                        ___popup_close();

                    } else {
                        ___alert_type("Hủy thất bại", res.Ok);
                       // ___alert_type(res.Message, res.Ok);
                    }

                    _APP.$data.loading = false;
                }).catch(() => {
                    _APP.$data.loading = false;
                });
                _self.visible = false;
            } else {
                console.log('nooooooooooooooooo', _self.objUpdate);
            }
        }
    }
});

Vue.component('kit-popup-dat-lich-tu-van', {
    mixins: [_MIXIN_COMS],
    template: ___getTemplate('kit-popup-dat-lich-tu-van'),
    data: function () {
        return {
            visible: false,
            loading: false,
            objUpdate: {

                int_state: 1,
                str_content: '',
                int_pol_pawn_id: 0,
                int_created_by: _PROFILE.user_id,
                int_support_time: 0,
                str_created_by_name: _PROFILE.str_full_name

            },
            objErrorValue: {
                str_content: ''
            },
            objErrorLabel: {
                str_content: ''
            },
            objErrorMsg: {
                str_content: 'Nhập nội dung'
            }
        };
    },
    mounted: function () {
    },
    methods: {
        ___submit: function () {
            this._add_new_support_schedule();
        },
        _add_new_support_schedule: function () {

            const _self = this;

            _self.objUpdate.int_pol_pawn_id = this.___para.id;

            $.each(_self.$children,
                function (i, v) {
                    switch (v.vueRef) {
                        case "FORM_SCHEDULE___TIME":
                            if ($('#' + v.___id).attr('date-val') != undefined) {
                                _self.objUpdate.int_support_time = parseInt($('#' + v.___id).attr('date-val'));
                            }
                            break;
                        default:
                    }
                });

            var arr_errors = _self.___pop_valid(_self.objUpdate);

            if (arr_errors.length == 0) {

                _APP.$data.loading = true;

                var data = '111' + JSON.stringify(_self.objUpdate);
                _APP.$data.loading = true;
                ___post_action('pol_support_schedule', 'biz_addhistory', data).then(res => {
                    if (res.Ok) {
                        setTimeout(___reload, 2000);
                        ___alert_type("Đặt lịch thành công", res.Ok);

                        ___popup_close();
                    } else {
                        ___alert_type("Đặt lịch thất bại", res.Ok);
                    }
                    _APP.$data.loading = false;
                }).catch(() => {
                    _APP.$data.loading = false;
                });
                _self.visible = false;

            }
        }
    }
});

Vue.component('kit-popup-lich-su-dat-lich-tu-van', {
    mixins: [_MIXIN_COMS],
    template: ___getTemplate('kit-popup-lich-su-dat-lich-tu-van'),
    data: function () {
        return {
            visible: false,
            list_schedule: []
        };
    },
    created: function () {
        //fetch___get('api/POL_PAWN_ONLINE_SUPPORT_SCHEDULE/all', { page_number: 1, page_size: 5000 }).then(val => {
        //    const data_fiter = _.filter(val.result_items, person => person.int_pol_pawn_id === this.___para.id);
        //    console.log('sdasadsadsadd====', data_fiter);
        //    list_schedule = data_fiter;
        //});
        var _self = this;

        _self.f_ready_schedule();
    },
    mounted: function () {
    },
    methods: {
        f_ready_schedule: function () {
            var _self = this;
            var pro = 'function(i) { return i.int_pawn_online_id ==' + this.___para.id + '; }';
            fetch___post('api/pol_support_schedule/search', { conditons: pro, page_number: 1, page_size: 100000 }).then(rs_ => {
                _self.list_schedule = rs_.result_items;
            });
        }

    }
});


Vue.component('kit-popup-chia-don', {
    mixins: [_MIXIN_COMS],
    template: ___getTemplate('kit-popup-chia-don'),
    data: function () {
        return {
            objUpdate: {
                int_caller_id: -1,
                obj_item_check: _APP.objItemsChecked.ids,
                current_group_id: _PROFILE.group_id,
                int_area_id: -1,
                id_create: _PROFILE.user_id
            },
            objErrorValue: {
                int_caller_id: -1
            },
            objErrorLabel: {
                int_caller_id: ''
            },
            objErrorMsg: {
                int_caller_id: 'Chọn nhân viên'
            },
            visible: false
        };
    },
    mounted: function () {

    },
    methods: {
        ___submit: function () {
            this.f_chiadon_submit();
        },
        f_chiadon_submit: function () {
            var _self = this;

            if (_self.objUpdate.obj_item_check.length > 0) {
                _self.objUpdate.obj_item_check = _self.objUpdate.obj_item_check.toString(); //id1,id2,id3
            }

            var arr_errors = _self.___pop_valid(_self.objUpdate);

            if (arr_errors.length == 0) {

                _APP.$data.loading = true;

                var obj = JSON.parse(JSON.stringify(_self.objUpdate));
                //   obj.___exe_callback = 'pol_process_biz_chiadon';

                var data = '111' + JSON.stringify(obj);

                ___post_action('pol_process', 'biz_chiadon', data).then(res => {

                    if (res.Ok) {

                        _APP.objItemsChecked.ids = [];
                        ___popup_close();
                        ___alert_type("Chia đơn thành công", res.Ok);
                        //  setTimeout(function () {___reload()}, 2000);
                    } else {
                        ___alert_type("Chia đơn thất bại", res.Ok);
                    }

                    _APP.$data.loading = false;
                }).catch(() => {
                    _APP.$data.loading = false;
                });
            }

        }
    }
});
Vue.component('kit-popup-chuyen-mien', {
    mixins: [_MIXIN_COMS],
    template: ___getTemplate('kit-popup-chuyen-mien'),
    data: function () {
        return {
            objUpdate: {
                int_caller_id: -1,
                obj_item_check: _APP.objItemsChecked.ids,
                current_group_id: _PROFILE.group_id,
                int_area_id: -1
            },
            objErrorValue: {
                int_area_id: -1
            },
            objErrorLabel: {
                int_area_id: ''
            },
            objErrorMsg: {
                int_area_id: 'Chọn vùng miền'
            },
            visible: false
        };
    },
    mounted: function () {
    },
    methods: {
        ___submit: function () {
            this.f_chuyenmien_submit();
        },
        f_chuyenmien_submit: function () {
            var _self = this;

            if (_self.objUpdate.obj_item_check.length > 0) {
                _self.objUpdate.obj_item_check = _self.objUpdate.obj_item_check.toString();
            }

            var arr_errors = _self.___pop_valid(_self.objUpdate);
            if (arr_errors.length == 0) {

                _APP.$data.loading = true;

                var data = '111' + JSON.stringify(_self.objUpdate);

                ___post_action('pol_process', 'biz_chiadon', data).then(res => {
                    if (res.Ok) {
                        _APP.objItemsChecked.ids = [];
                        ___popup_close();
                        ___alert_type("Chuyển vùng miền thành công", res.Ok);
                        setTimeout(___reload, 2000);
                    } else {
                        ___alert_type("Chuyển vùng miền thất bại", res.Ok);
                    }
                    _APP.$data.loading = false;
                }).catch(() => {
                    _APP.$data.loading = false;
                });
            }
        }
    }
});


/*popup: call */
Vue.component('kit-popup-call',
    {
        mixins: [_MIXIN_COMS],
        template: ___getTemplate('kit-popup-call'),
        data: function () {
            return {
                visible: false,
                lstData: [],
                loading: false,
                objUpdate: {
                    id: -1,
                },
                objErrorValue: {
                    id: -1
                },
                objErrorLabel: {
                    id: ''
                },
                objErrorMsg: {
                    id: 'Mời chọn số gọi ra'
                }
            };
        },
        mounted: function () {
            var _self = this;
            var lstData = [];
            var token = _PROFILE.str_call_out_tooken;

            if (token && token.length > 0) {
                token = token.split('#');
                if (token.length > 0) {
                    for (var i = 0; i < token.length; i++) {
                        var obj = {};
                        var b = token[i].split(';');
                        obj.phone = b[0];
                        obj.id = parseInt(b[1]);
                        obj.name = b[2];
                        obj.name_ascii = b[0] + ',' + b[1] + ',' + b[2];

                        lstData.push(obj);
                    }
                }
            } else {
                _self.objErrorLabel.id =
                    'Tài khoản của bạn chưa được cấu hình. Vui lòng liên hệ IT để được hỗ trợ nếu có nhu cầu.';
            }
            _self.lstData = lstData;
            _self.___set_list('FORM_CHOSE_NUMBER___CALL', lstData);
        },
        methods: {
            ___submit: function () {
                this.f_call_care_soft_submit();
            },
            f_call_care_soft_submit: function () {
                const _self = this;

                var num = _self.___para.phone_number.toString();

                num = num.replace(/\D/g, '');

                if (num.length < 10 || num.length > 11) {
                    _self.objErrorLabel.id = 'Số điện thoại khách hàng không hợp lệ';
                } else {
                    var arr_errors = _self.___pop_valid(_self.objUpdate);
                    if (arr_errors.length == 0) {

                        var a = _self.objUpdate.id.split(',');

                        var token = jwtEncode(a[0], a[1], _self.___para.phone_number);

                        var url = 'https://care.f88.vn/f88/c2call?token=' + token;
                        window.open(url, '_blank', 'width:200px,height:120px');

                    } else {
                        console.log('22222222222222', arr_errors);
                    }
                }
            }
        }
    });

