
setTimeout(function () {
    //___popup('kit-popup-them-dang-ky');
    ___popup('kit-popup-them-dang-ky', null, { strAlign: 'right', strTitle: 'Thêm mới đăng ký cầm đồ', strSubmitText: 'Tạo đăng ký mới' });
    //  ___popup('kit-popup-edit-dang-ky', { id: 276 }, { strAlign: 'right', strTitle: 'Sửa thông tin', strSubmitText: 'Cập nhật' });
    //___popup('kit-popup-thong-tin-chi-tiet', { id: 35 }, { strTitle: 'Thêm mới đăng ký cầm đồ', strAlign: 'center', strWidth: jQuery(window).width() < 1366 ? '80%' : '50%' , strHeight: '80%' });

    //___post_action('pol_pawn', 'biz_posCreateSuccessCallback', {
    //    int_pawnonline_id: 1,
    //    int_pawn_id: 1285610,
    //    int_customer_id: 1149042,
    //    int_create_date: 20191120,
    //    int_loan_money: 0,
    //    int_loan_days: 0,
    //    int_from_date: 20191120,
    //    str_codeno: 'HĐCC/DR/1909/30',
    //    str_category_code: '00000017',
    //    int_status: 12
    //}).then(res => {
    //    console.log('??????????????????? === ', res);
    //});


}, 2000);

/*popup: thêm đăng ký mới*/
Vue.component('kit-popup-them-dang-ky',
    {
        mixins: [_MIXIN_COMS],
        template: ___get_template('kit-popup-them-dang-ky'),
        data: function () {
            return {
                visible: false,
                loading: false,

                objUpdate: {
                    shop_id: parseInt(_PROFILE.shop_id),
                    group_id: parseInt(_PROFILE.group_id),
                    bit_car_in_bank: 0,
                    user_created_id: _PROFILE.user_id,
                    cus_created_id: -1,
                    area_id: parseInt(_PROFILE.int_pol_region),
                    str_channel_name: '',
                    channel_id: -1,
                    str_cus_name: '',
                    str_url: '',
                    int_cus_gender: 1,
                    city_id: -1,
                    district_id: -1,
                    str_city_name: '',
                    str_district_name: '',
                    str_cus_address: '',
                    str_cus_phone: '',
                    str_cus_email: '',
                    int_days: 0,
                    lng_money: 0,
                    str_trademark: '',
                    asset_type_id: -1,
                    str_asset_type_name: '',
                    str_product_year: '',
                    str_description: ''
                },
                objErrorValue: {
                    channel_id: -1,
                    str_url: '',
                    str_cus_name: '',
                    city_id: -1,
                    district_id: -1,
                    str_cus_phone: '',
                    int_days: 0,
                    lng_money: 0,
                    asset_type_id: -1,
                    str_description: '',
                    //str_cus_email: ''
                },
                objErrorLabel: {
                    //channel_id: '',
                    //str_url: '',
                    str_cus_name: '',
                    district_id: '',
                    city_id: '',
                    str_cus_phone: '',
                    int_days: '',
                    lng_money: '',
                    asset_type_id: '',
                    str_cus_email: ''
                },
                objErrorMsg: {
                    //channel_id: 'Chọn kênh',
                    //str_url: 'Nhập URL',
                    str_cus_name: 'Nhập tên khách hàng',
                    city_id: 'Chọn thành phố|tỉnh',
                    district_id: 'Chọn quận|huyện',
                    str_cus_phone: 'Nhập số điện thoại khách hàng',
                    int_days: 'Nhập số ngày vay',
                    lng_money: 'Nhập số tiền vay',
                    asset_type_id: 'Chon tài sản',
                    str_cus_email: 'Địa chỉ email không đúng định dạng'
                }
            };
        },
        mounted: function () { },
        methods: {
            ___submit: function () {
                const _self = this;
                var col;

                _APP.$data.loading = true;

                const isVNPhoneMobile =
                    /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
                const isEmail =
                    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

                if (isVNPhoneMobile.test(_self.objUpdate.str_cus_phone) == false) {
                    _self.objErrorLabel.str_cus_phone = "Số điện thoại không đúng định dạng";
                }
                if (_self.objUpdate.str_cus_email.length > 0) {
                    if (isEmail.test(_self.objUpdate.str_cus_email) == false) {
                        _self.objErrorLabel.str_cus_email = "Địa chỉ email không đúng định dạng";
                    } else {
                        _self.objErrorLabel.str_cus_email = "";
                    }
                }

                var arr_errors = _self.___pop_valid(_self.objUpdate);
                const data = _self.objUpdate;
                console.log(data);


                if (arr_errors.length > 0) {
                    _APP.$data.loading = false;
                } else {
                    
                    ___post_action('pol_pawn', 'biz_themdangky', data).then(res => {
                        
                        if (res.Ok) {
                            ___alert_type("Thêm mới thông tin thành công", true);
                          //  setTimeout(___reload, 2000);
                            ___popup_close();
                        } else {
                            ___alert_type("Thêm mới thông tin thất bại", false);
                        }
                        _APP.$data.loading = false;
                    }).catch(() => {
                        ___alert_type("Thêm mới thông tin thất bại", false);
                        _APP.$data.loading = false;
                    });
                }
                
            }
        }
    });

/*popup: Sửa thông tin câm cố*/
Vue.component('kit-popup-edit-dang-ky', {
    mixins: [_MIXIN_COMS],
    template: ___get_template('kit-popup-edit-dang-ky'),
    data: function () {
        return {
            visible: false,
            loading: false,
            objUpdate: {
                id: -1,
                customer_id: -1,
                bit_car_in_bank: 0,
                str_channel_name: '',
                channel_id: -1,
                str_cus_name: '',
                str_url: '',
                int_cus_gender: 1,
                city_id: -1,
                district_id: -1,
                str_city_name: '',
                str_district_name: '',
                str_cus_address: '',
                str_cus_phone: '',
                str_cus_email: '',
                int_days: 0,
                lng_money: 0,
                str_trademark: '',
                asset_type_id: -1,
                str_asset_type_name: '',
                str_product_year: '',
                str_description: '',
                int_create:_PROFILE.user_id
            },
            objErrorValue: {
                //channel_id: -1,
                //str_url: '',
                str_cus_name: '',
                city_id: -1,
                district_id: -1,
                str_cus_phone: '',
                int_days: 0,
                lng_money: 0,
                asset_type_id: -1,
                str_description: ''
            },
            objErrorLabel: {
                //channel_id: '',
                //str_url: '',
                str_cus_name: '',
                district_id: '',
                city_id: '',
                str_cus_phone: '',
                int_days: '',
                lng_money: '',
                asset_type_id: ''
            },
            objErrorMsg: {
                channel_id: 'Chọn kênh',
                str_url: 'Nhập URL',
                str_cus_name: 'Nhập tên khách hàng',
                city_id: 'Chọn thành phố|tỉnh',
                district_id: 'Chọn quận|huyện',
                str_cus_phone: 'Nhập số điện thoại khách hàng',
                int_days: 'Nhập số ngày vay',
                lng_money: 'Nhập số tiền vay',
                asset_type_id: 'Chon tài sản'
            }
        };
    },
    mounted: function () {
        const _self = this;
        const para = _self.___para;
        var it = _.find(_APP.objModel.result_items, function (o) { return o.id == para.id; });
        if (it) {
            _DATA.objPopup = it;
        }
        setTimeout(_self.f_set_value_by_para, 350);
    },
    methods: {
        f_set_value_by_para: function () {
            const _self = this;
            const para = _self.___para;
            if (para) {
                var it = _.find(_APP.objModel.result_items, function (o) { return o.id == para.id; });
                console.log('UI.POPUP > mounted: ' + _self.___name, para, it);

                if (it) {
                  
                    if (it.id) _self.objUpdate.id = it.id;

                    if (it.channel_id) _self.objUpdate.channel_id = it.channel_id;
                    if (it.str_channel_name) _self.objUpdate.str_channel_name = it.str_channel_name;
                    if (it.str_url) _self.objUpdate.str_url = it.str_url;

                    const cus = it.___customer;
                    if (cus) {
                        if (cus.id) _self.objUpdate.customer_id = cus.id;
                        if (cus.str_name) _self.objUpdate.str_cus_name = cus.str_name;
                        if (cus.int_gender) _self.objUpdate.int_cus_gender = cus.int_gender;
                        if (cus.str_address) _self.objUpdate.str_cus_address = cus.str_address;
                        if (cus.str_phone) _self.objUpdate.str_cus_phone = cus.str_phone;
                        if (cus.str_email) _self.objUpdate.str_cus_email = cus.str_email;
                    }

                    if (it.city_id) _self.objUpdate.city_id = it.city_id;
                    if (it.district_id) _self.objUpdate.district_id = it.district_id;
                    if (it.str_city_name) _self.objUpdate.str_city_name = it.str_city_name;
                    if (it.str_district_name) _self.objUpdate.str_district_name = it.str_district_name;

                    if (it.asset_type_id) _self.objUpdate.asset_type_id = it.asset_type_id;
                    if (it.str_asset_type_name) _self.objUpdate.str_asset_type_name = it.str_asset_type_name;
                    if (it.bit_car_in_bank) _self.objUpdate.bit_car_in_bank = it.bit_car_in_bank;

                    if (it.int_days) _self.objUpdate.int_days = it.int_days;
                    if (it.lng_money) _self.objUpdate.lng_money = it.lng_money;
                    if (it.str_trademark) _self.objUpdate.str_trademark = it.str_trademark;
                    if (it.str_product_year) _self.objUpdate.str_product_year = it.str_product_year;
                    if (it.str_description) _self.objUpdate.str_description = it.str_description;

                    //---------------------------------------------------------------------------------------------------------------------------------------

                    if (it.str_city_name) _self.___set_value('FORM_PAWN_EDIT___REGION_CITY', function (o) { return o.name == it.str_city_name; });
                    if (it.asset_type_id) _self.objUpdate.asset_type_id = it.asset_type_id;

                    if (it.str_url) _self.___set_value('FORM_PAWN_EDIT___URL', it.str_url);
                    if (it.bit_car_in_bank) _self.___set_value('FORM_PAWN_EDIT___BIT_CAR_IN_BANK', it.bit_car_in_bank);

                    if (it.___customer) {
                        if (it.___customer.int_gender)
                            _self.___set_value('FORM_PAWN_EDIT___CUS_GENDER', it.___customer.int_gender);

                        _self.___set_value('FORM_PAWN_EDIT___CUS_NAME', it.___customer.str_name);
                        _self.___set_value('FORM_PAWN_EDIT___CUS_ADDRESS', it.___customer.str_address);
                        _self.___set_value('FORM_PAWN_EDIT___CUS_PHONE', it.___customer.str_phone);
                        _self.___set_value('FORM_PAWN_EDIT___CUS_EMAIL', it.___customer.str_email);
                    }

                    if (it.str_trademark) _self.___set_value('FORM_PAWN_EDIT___STR_TRADEMARK', it.str_trademark);
                    if (it.str_product_year) _self.___set_value('FORM_PAWN_EDIT___STR_PRODUCT_YEAR', it.str_product_year);

                    if (it.int_days) _self.___set_value('FORM_PAWN_EDIT___INT_DAYS', it.int_days);
                    if (it.lng_money) _self.___set_value('FORM_PAWN_EDIT___LNG_MONEY', it.lng_money);

                    if (it.str_description) _self.___set_value('FORM_PAWN_EDIT___STR_DESCRIPTION', it.str_description);

                    if (it.str_channel_name) _self.___set_value('FORM_PAWN_EDIT___CHANNEL', function (o) { return o.name == it.str_channel_name; });
                    if (it.str_asset_type_name) _self.___set_value('FORM_PAWN_EDIT___ASSET_NAME', function (o) { return o.name == it.str_asset_type_name; });

                    if (it.str_district_name) {
                        setTimeout(function () {
                            _self.___set_value('FORM_PAWN_EDIT___REGION_DISTRICT', function (o) { return o.name == it.str_district_name; });
                        }, 300);
                    }

                    if (it.user_created_id == -1) {
                        _self.___set_dissabled('FORM_PAWN_EDIT___CHANNEL', true);
                        _self.___set_dissabled('FORM_PAWN_EDIT___URL', true);
                        
                    }
                }
            }
        },
        ___submit: function () {

            const _self = this;

            _APP.$data.loading = true;

            var col;
            var arr_errors = _self.___pop_valid(_self.objUpdate);
            const data = _self.objUpdate;
            
            if (arr_errors.length > 0) {
                _APP.$data.loading = false;
            } else {
                ___post_action('pol_pawn', 'biz_suadangky', data).then(res => {
                    
                    if (res.Ok) {
                        ___alert_type("Sửa thông tin thành công", true);
                      //  setTimeout(___reload, 2000);
                        ___popup_close();
                    } else {
                        ___alert_type("Sửa thông tin thất bại", false);
                    }
                    
                    _APP.$data.loading = false;
                }).catch(() => {
                    ___alert_type("Sửa thông tin thất bại", false);
                    _APP.$data.loading = false;
                });

            }
        }
    }
});



/*popup: Xuất excel*/
Vue.component('kit-popup-xuat-excel', {
    mixins: [_MIXIN_COMS],
    template: ___getTemplate('kit-popup-xuat-excel'),
    data: function () {
        return {
            visible: false,
            objexcel: {
                todate: 0,
                fromdate: 0
            }
        };
    },
    mounted: function () {
        $('#rangestart').calendar({
            type: 'date',
            endCalendar: $('#rangeend')
        });
        $('#rangeend').calendar({
            type: 'date',
            startCalendar: $('#rangestart')
        });



    },
    methods: {
        ___submit: function () {
            this.__excel();
        },
        exportToCsv: function (filename, rows) {
            var processRow = function (row) {
                var finalVal = '';
                for (var j = 0; j < row.length; j++) {
                    var innerValue = row[j] === null ? '' : row[j].toString();
                    if (row[j] instanceof Date) {
                        innerValue = row[j].toLocaleString();
                    }
                    var result = innerValue.replace(/"/g, '""');
                    if (result.search(/("|,|\n)/g) >= 0)
                        result = '"' + result + '"';
                    if (j > 0)
                        finalVal += ',';
                    finalVal += result;
                }
                return finalVal + '\n';
            };

            var csvFile = '';
            for (var i = 0; i < rows.length; i++) {
                csvFile += processRow(rows[i]);
            }

            var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        },
        export_to_csv: function (filename, m_) {
            if (m_.ok == false) {
                ___alert_type(m_.message);
                return;
            }

            //var headers = 'Số ĐT,Tên khách hàng,Địa chỉ,Quận/Huyện,Tỉnh/TP,Mã đơn OL,URL,Nguồn,Mã hợp đồng,Ngày tạo HĐ,Giờ tạo HĐ,Loại TS,Tên TS,TSHĐ,Giá trị khoản vay,Ngày tạo, Giờ tạo,Ngày tạo KPI,Giờ tạo KPI,Ngày CS đầu,Giờ CS đầu,TGian xử lý, Trạng thái,Ngày vay,Tên nhân viên,Nơi xử lý,Ngày xử lý đơn lần 1 tại CH,Giờ xử lý đơn lần 1 tại CH,Ngày hủy đơn tại CH,Giờ hủy đơn tại CH,Lý do thất bại,Nội dung thất bại,Thế chấp NH,CH giao dịch,TGian đóng băng'.split(',');
            var headers = 'Số ĐT,Tên khách hàng,Địa chỉ,Quận/Huyện,Tỉnh/TP,Mã đơn OL,URL,Nguồn,Mã hợp đồng,Ngày tạo HĐ,Giờ tạo HĐ,Loại TS,Tên TS,TSHĐ,Giá trị khoản vay,Ngày tạo, Giờ tạo,Ngày tạo KPI,Giờ tạo KPI,Ngày CS đầu,Giờ CS đầu,TGian xử lý, Trạng thái,Ngày vay,Tên nhân viên,Nơi xử lý,Ngày xử lý đơn lần 1 tại CH,Giờ xử lý đơn lần 1 tại CH,Ngày hủy đơn tại CH,Giờ hủy đơn tại CH,Lý do thất bại,Nội dung thất bại,Thế chấp NH,CH giao dịch'.split(',');

            var f_HHmmss_format_get_HH = function (HHmmss) {
                if (HHmmss == null) return '';
                if (HHmmss == -1) return '';
                var s_HHmmss = HHmmss + '';
                if (s_HHmmss.length < 5) return HHmmss;
                if (s_HHmmss.length == 5) s_HHmmss = '0' + HHmmss;
                return s_HHmmss.substr(0, 2);
            };

            var f_yyyyMMddHHmmss_format_get_HH = function (yyyyMMddHHmmss) {
                if (yyyyMMddHHmmss == null) return '';
                if (yyyyMMddHHmmss == -1) return '';
                var s_yyyyMMddHHmmss = yyyyMMddHHmmss + '';
                if (s_yyyyMMddHHmmss.length < 10) return yyyyMMddHHmmss;
                return s_yyyyMMddHHmmss.substr(8, 2);
            };

            var f_yyyyMMdd_format_dd_MM_yyyy = function (yyyyMMdd) {
                if (yyyyMMdd == null) return '';
                if (yyyyMMdd == -1) return '';
                var s_yyyyMMdd = yyyyMMdd + '';
                if (s_yyyyMMdd.length < 8) return yyyyMMdd;

                return s_yyyyMMdd.substr(6, 2) + '/' + s_yyyyMMdd.substr(4, 2) + '/' + s_yyyyMMdd.substr(0, 4);
            };

            var f_get_int_status = function (int_status) {
                //0 : Huy đăng ký
                //1 : Chưa tư vấn
                //2 : Đang chăm sóc
                //4 : Nhận cầm cố 
                switch (int_status) {
                    case 0: return 'Hủy đăng ký';
                    case 1: return 'Chưa tư vấn';
                    case 2: return 'Đang chăm sóc';
                    case 4: return 'Nhận cầm cố';
                    default: return '';
                }
            };

            var csvFile = '';
            csvFile += headers.join(',') + '\r\n';

            if (m_.data && m_.data.size && m_.data.size > 0 && m_.data.results && Array.isArray(m_.data.results)) {

                var items_ = _.sortBy(m_.data.results, [function (o) { return o.id; }]);
                //items_.reverse();

                //#region [ cell variable ]

                var r = [], o;
                var _so_dien_thoai,
                    _ten_khach_hang,
                    _dia_chi,
                    _quan_huyen,
                    _tinh_tp,
                    _ma_don_pol,
                    _url,
                    _nguon,
                    _ma_hop_dong,
                    _ngay_tao_hd,
                    _gio_tao_hd,
                    _loai_tai_san,
                    _ten_tai_san,
                    _tai_san_hd,
                    _gia_tri_khoan_vay,
                    _ngay_tao,
                    _gio_tao,
                    _ngay_tao_kpi,
                    _gio_tao_kpi,
                    _ngay_cham_soc_dau,
                    _gio_cham_soc_dau,
                    _thoi_gian_xy_ly,
                    _trang_thai,
                    _ngay_vay,
                    _ten_nhan_vien, //dang xu ly do nay
                    _noi_xu_ly,
                    _ngay_xu_ly_don_lan_1_tai_cua_hang,
                    _gio_xu_ly_don_lan_1_tai_cua_hang,
                    _ngay_huy_don_tai_cua_hang,
                    _gio_huy_don_tai_cua_hang,
                    _ly_do_that_bai,
                    _noi_dung_that_bai,
                    _the_chap_ngan_hang,
                    _cua_hang_giao_dich,
                    _thoi_gian_dong_bang;

                //#endregion

                var c;
                for (var i = 0; i < items_.length; i++) {
                    //#region [ init values cells is empty ]

                    _so_dien_thoai = '';
                    _ten_khach_hang = '';
                    _dia_chi = '';
                    _quan_huyen = '';
                    _tinh_tp = '';
                    _ma_don_pol = '';
                    _url = '';
                    _nguon = '';
                    _ma_hop_dong = '';
                    _ngay_tao_hd = '';
                    _gio_tao_hd = '';
                    _loai_tai_san = '';
                    _ten_tai_san = '';
                    _tai_san_hd = '';
                    _gia_tri_khoan_vay = '';
                    _ngay_tao = '';
                    _gio_tao = '';
                    _ngay_tao_kpi = '';
                    _gio_tao_kpi = '';
                    _ngay_cham_soc_dau = '';
                    _gio_cham_soc_dau = '';
                    _thoi_gian_xy_ly = '';
                    _trang_thai = '';
                    _ngay_vay = '';
                    _ten_nhan_vien = ''; //dang xu ly do nay
                    _noi_xu_ly = '';
                    _ngay_xu_ly_don_lan_1_tai_cua_hang = '';
                    _gio_xu_ly_don_lan_1_tai_cua_hang = '';
                    _ngay_huy_don_tai_cua_hang = '';
                    _gio_huy_don_tai_cua_hang = '';
                    _ly_do_that_bai = '';
                    _noi_dung_that_bai = '';
                    _the_chap_ngan_hang = '';
                    _cua_hang_giao_dich = '';
                    _thoi_gian_dong_bang = '';

                    //#endregion

                    o = items_[i];

                    //#region [ bind value of cell ]

                    c = o.___customer;
                    if (c) {
                        _so_dien_thoai = c.str_phone ? c.str_phone + '' : '';
                        _ten_khach_hang = c.str_name ? c.str_name : '';
                        _dia_chi = c.str_address ? c.str_address : '';
                    }

                    _quan_huyen = o.str_district_name ? o.str_district_name : '';
                    _tinh_tp = o.str_city_name ? o.str_city_name : '';
                    _ma_don_pol = 'POL-' + o.id;
                    _url = o.str_url ? o.str_url : '';
                    _nguon = o.str_channel_name ? o.str_channel_name : '';

                    _ma_hop_dong = o.str_codeno_pos ? o.str_codeno_pos : '';

                    _ngay_tao_hd = f_yyyyMMdd_format_dd_MM_yyyy(o.int_create_date_pos);
                    //_gio_tao_hd = '';

                    _loai_tai_san = o.str_asset_type_name ? o.str_asset_type_name : '';
                    _ten_tai_san = o.str_trademark ? o.str_trademark : '';

                    //_tai_san_hd = '';
                    if (o.lng_money && o.lng_money > 0)
                        _gia_tri_khoan_vay = o.lng_money + '';

                    //_ngay_tao = '';
                    //_gio_tao = '';
                    _ngay_tao = f_yyyyMMdd_format_dd_MM_yyyy(o.int_created_date);
                    _gio_tao = f_HHmmss_format_get_HH(o.int_created_time);

                    _ngay_tao_kpi = f_yyyyMMdd_format_dd_MM_yyyy(o.int_set_caller_online_date);
                    _gio_tao_kpi = f_HHmmss_format_get_HH(o.int_set_caller_online_time);

                    //_ngay_cham_soc_dau = '';
                    //_gio_cham_soc_dau = '';
                    if (o.___list_online_process && Array.isArray(o.___list_online_process) && o.___list_online_process.length > 0) {
                        var care1 = _.find(o.___list_online_process, function (o) { return o.int_action == 1; });
                        if (care1) {
                            _ngay_cham_soc_dau = f_yyyyMMdd_format_dd_MM_yyyy(care1.lng_created_at);
                            _gio_cham_soc_dau = f_yyyyMMddHHmmss_format_get_HH(care1.lng_created_at);
                        }
                    }

                    //_thoi_gian_xy_ly = '';

                    _trang_thai = f_get_int_status(o.int_status);
                    _ngay_vay = f_yyyyMMdd_format_dd_MM_yyyy(o.int_create_date_pos);

                    //_ten_nhan_vien = ''; //dang xu ly do nay
                    if (o.___caller_online && o.___caller_online.str_full_name)
                        _ten_nhan_vien = o.___caller_online.str_full_name;
                    else if (o.___caller_shop && o.___caller_shop.str_full_name)
                        _ten_nhan_vien = o.___caller_shop.str_full_name;

                    //console.log('sddddddddddd===', ___group.str_name);
                    
                    if (o.___caller_online && o.___caller_online.str_full_name)
                        _noi_xu_ly = o.___group.str_name;
                    else if (o.___caller_shop && o.___caller_shop.str_full_name)
                        _noi_xu_ly = o.o.___group.str_name;

                    //_ngay_xu_ly_don_lan_1_tai_cua_hang = '';
                    //_gio_xu_ly_don_lan_1_tai_cua_hang = '';

                    //_ngay_huy_don_tai_cua_hang = '';
                    //_gio_huy_don_tai_cua_hang = '';
                    if (o.___list_online_process && Array.isArray(o.___list_online_process) && o.___list_online_process.length > 0) {
                        var huy1 = _.find(o.___list_online_process, function (o) { return o.int_action == 3 && o.int_created_group_id != 44; });
                        if (huy1) {
                            _ngay_huy_don_tai_cua_hang = f_yyyyMMdd_format_dd_MM_yyyy(huy1.lng_created_at);
                        }
                    }

                    //_ly_do_that_bai = '';
                    //_noi_dung_that_bai = '';
                    if (o.___list_online_process && Array.isArray(o.___list_online_process) && o.___list_online_process.length > 0) {
                        var huy2 = _.find(o.___list_online_process, function (o) { return o.int_action == 3; });
                        if (huy2) {
                            _ly_do_that_bai = huy2.str_canceled_reason;
                            _noi_dung_that_bai = huy2.str_content;
                        }
                    }

                    _the_chap_ngan_hang = o.bit_car_in_bank == 1 ? 'Có' : '';

                    //_cua_hang_giao_dich = '';
                    if (o.___caller_online && o.___caller_online.str_full_name)
                        _cua_hang_giao_dich = o.___caller_online.str_shop_name;

                    //_thoi_gian_dong_bang = ''; //remove

                    //#endregion

                    r = [
                        _so_dien_thoai,
                        _ten_khach_hang,
                        _dia_chi,
                        _quan_huyen,
                        _tinh_tp,
                        _ma_don_pol,
                        _url,
                        _nguon,
                        _ma_hop_dong,
                        _ngay_tao_hd,
                        _gio_tao_hd,
                        _loai_tai_san,
                        _ten_tai_san,
                        _tai_san_hd,
                        _gia_tri_khoan_vay,
                        _ngay_tao,
                        _gio_tao,
                        _ngay_tao_kpi,
                        _gio_tao_kpi,
                        _ngay_cham_soc_dau,
                        _gio_cham_soc_dau,
                        _thoi_gian_xy_ly,
                        _trang_thai,
                        _ngay_vay,
                        _ten_nhan_vien, //dang xu ly do nay
                        _noi_xu_ly,
                        _ngay_xu_ly_don_lan_1_tai_cua_hang,
                        _gio_xu_ly_don_lan_1_tai_cua_hang,
                        _ngay_huy_don_tai_cua_hang,
                        _gio_huy_don_tai_cua_hang,
                        _ly_do_that_bai,
                        _noi_dung_that_bai,
                        _the_chap_ngan_hang,
                        _cua_hang_giao_dich
                        //_thoi_gian_dong_bang
                    ];

                    csvFile += r.join(',') + '\r\n';
                }
            }

            //var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
            var blob = new Blob(["\uFEFF" + csvFile], { type: 'text/csv; charset=utf-8' });

            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);

                    console.log(filename, url);

                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        },
        __excel: function () {
            const _self = this;

            $.each(_self.$children, function (i, v) {
                switch (v.vueRef) {
                    case "FORM_EXCEL___TIME1":
                        if ($('#' + v.___id).attr('date-val') != undefined) {
                            _self.objexcel.fromdate = parseInt($('#' + v.___id).attr('date-val'));
                        }
                        break;
                    case "FORM_EXCEL___TIME2":
                        if ($('#' + v.___id).attr('date-val') != undefined) {
                            _self.objexcel.todate = parseInt($('#' + v.___id).attr('date-val'));
                        }
                        break;
                    default:
                }
            });

            //_self.objexcel.fromdate = 20191205235500;
            //_self.objexcel.todate = 20191231235500;

            if (_self.objexcel.todate < _self.objexcel.fromdate) {
                ___alert_type("Vui lòng kiểm tra lại thời gian");
            }
            else {
                //https://test.f88.vn/pol//job/pol_pawn/EXCEL_STATUS_YEAR_REMAIN/20191130030000/20191130230000/csv.csv
                //https://test.f88.vn/job/pol_pawn/EXCEL_STATUS_YEAR_REMAIN/20191130235500/20191130235500/csv.csv
                //var __name_excel = 'Don_vay_online';
                //var _fromdate = _self.objexcel.fromdate.toString().substr(0, 8);
                //var _todate = _self.objexcel.todate.toString().substr(0, 8);
                //var url = '/pol/job/pol_pawn/EXCEL_STATUS_YEAR_REMAIN/' + _fromdate + '/' + _todate + '/' + __name_excel + '';
                ////fetch(url);
                //var a = document.createElement('a');
                //a.setAttribute('target', '_blank');
                //a.id = ___guid();
                //a.setAttribute('href', url);
                //document.body.appendChild(a);
                //a.click();


                var __name_excel = 'Don_vay_online';
                var _fromdate = _self.objexcel.fromdate.toString().substr(0, 8);
                var _todate = _self.objexcel.todate.toString().substr(0, 8);

                //a.remove();
                //fetch___get('job/pol_pawn/EXCEL_STATUS_YEAR_REMAIN/' + _fromdate + '/' + _todate + '/' + __name_excel + '', { page_number: 1, page_size: Number.MAX_SAFE_INTEGER }).then(res => {

                //console.log('1111111111111111', res);

                //////for (var i = 0; i < res.length; i++) {
                //////    console.log('sadsadsaxccccc====', res[i].author_full_name);
                //////    res[i].ma_don = 'POL-' + res[i].ma_don;
                //////    if (res[i].int_create_date_pos < 1) {
                //////        res[i].int_create_date_pos = '';
                //////        res[i].int_create_date_time_pos = '';
                //////        res[i].first_proc_shop = '';


                //////    }
                //////    else {
                //////        res[i].int_create_date_pos = res[i].int_create_date_pos.toString().substr(6, 2) + '/' + res[i].int_create_date_pos.toString().substr(4, 2) + '/' + res[i].int_create_date_pos.toString().substr(0, 4);
                //////        res[i].int_create_date_time_pos = res[i].int_create_date_pos.toString().substr(8, 2) + ':' + res[i].int_create_date_pos.toString().substr(10, 2);
                //////        res[i].first_proc_shop = res[i].first_proc_shop.toString().substr(6, 2) + '/' + res[i].first_proc_shop.toString().substr(4, 2) + '/' + res[i].first_proc_shop.toString().substr(0, 4);
                //////        res[i].first_proc_shop_date = res[i].first_proc_shop_date.toString().substr(8, 2) + ':' + res[i].first_proc_shop_date.toString().substr(10, 2);
                //////    }
                //////    if (res[i].int_loan_money_pos < 0) {
                //////        res[i].int_loan_money_pos = '';
                //////    }
                //////    if (res[i].int_created_date < 0) {
                //////        res[i].int_created_date = '';
                //////        res[i].kpi_created = '';
                //////    }
                //////    else {
                //////        res[i].int_created_date = res[i].int_created_date.toString().substr(6, 2) + '/' + res[i].int_created_date.toString().substr(4, 2) + '/' + res[i].int_created_date.toString().substr(0, 4);
                //////        res[i].kpi_created = res[i].kpi_created.toString().substr(6, 2) + '/' + res[i].kpi_created.toString().substr(4, 2) + '/' + res[i].kpi_created.toString().substr(0, 4);
                //////    }
                //////    if (res[i].int_created_date_time < 10000) {
                //////        res[i].int_created_date_time = '';
                //////        res[i].kpi_created_time = '';
                //////    }
                //////    else {
                //////        // console.log('sadsadsadsa====',)
                //////        res[i].int_created_date_time = res[i].int_created_date_time.toString().substr(0, 2) + ':' + res[i].int_created_date_time.toString().substr(2, 2) + ':' + res[i].int_created_date_time.toString().substr(4, 2);
                //////        res[i].kpi_created_time = res[i].kpi_created_time.toString().substr(0, 2) + ':' + res[i].kpi_created_time.toString().substr(2, 2) + ':' + res[i].kpi_created_time.toString().substr(4, 2);
                //////    }
                //////    if (res[i].int_create_date_pos1 < 0) {
                //////        res[i].int_create_date_pos1 = '';
                //////    }
                //////    else {
                //////        res[i].int_create_date_pos1 = res[i].int_create_date_pos1.toString().substr(6, 2) + '/' + res[i].int_create_date_pos1.toString().substr(4, 2) + '/' + res[i].int_create_date_pos1.toString().substr(0, 4);
                //////    }


                //////}
                //////var myJsonString = JSON.stringify(res);

                //////this.___excel_1(myJsonString, "Đơn Cầm Cố", true);
                ////});

                fetch('/pol/api/report/report_pawn_export_csv_by_from_date_to_date/eb976d531188435ea006fce8769c53d5?date_from=' + _fromdate + '&date_to=' + _todate)
                    .then(res => res.json())
                    .then(m_ => {

                        console.log('????????? m_ === ', m_);

                        _self.export_to_csv('pawn_' + _fromdate + '_to_' + _todate + '.csv', m_);

                        //_self.export_to_csv('export.csv', [
                        //    ['name', 'description'],
                        //    ['david', '123'],
                        //    ['jona', '""'],
                        //    ['a', 'b']
                        //]);

                    })
                    .catch(err => {

                    });
            }
            _APP.$data.loading = false;
            console.log('fromdate,todate====', _self.objexcel.fromdate, _self.objexcel.todate);
        },
        ___excel_1: function (JSONData, ReportTitle, ShowLabel) {
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';
            //Set Report title in first row or line

            CSV += ReportTitle + '\r\n\n';
            console.log('arrData[0]', arrData);
            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {


                    //Now convert each value to string and comma-seprated
                    //row += index + ',';
                    //console.log('indexx=====', index, row);
                    //row = 'Số ĐT', 'Tên Khách hàng';

                }
                row = 'Số ĐT,Tên khách hàng,Địa chỉ,Quận/Huyện,Tỉnh/TP,Mã đơn OL,URL,Nguồn,Mã hợp đồng,Ngày tạo HĐ,Giờ tạo HĐ,Loại TS,Tên TS,TSHĐ,Giá trị khoản vay,Ngày tạo, Giờ tạo,Ngày tạo KPI,Giờ tạo KPI,Ngày CS đầu,Giờ CS đầu,TGian xử lý, Trạng thái,Ngày vay,Tên nhân viên,Nơi xử lý,Ngày xử lý đơn lần 1 tại CH,Giờ xử lý đơn lần 1 tại CH,Ngày hủy đơn tại CH,Giờ hủy đơn tại CH,Lý do thất bại,Nội dung thất bại,Thế chấp NH,CH giao dịch,TGian đóng băng';
                console.log('indexx=====', index, row);
                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '\r\n';
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                row = "";

                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index1 in arrData[i]) {
                    row += '"' + arrData[i][index1] + '",';
                }

                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {
                alert("Invalid data");
                return;
            }

            //Generate a file name
            var fileName = "Don_vay_online";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g, "_");
            var encodedUri = encodeURI(CSV);

            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-18,\uFEFF' + encodedUri;

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension    

            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
});


/*popup: BÁo cáo*/
Vue.component('kit-popup-bao-cao', {
    mixins: [_MIXIN_COMS],
    template: ___getTemplate('kit-popup-bao-cao'),
    data: function () {
        return {
            visible: false,
            str_table_body: '',
            totalall: 0,
            mag: [],
            str_date_created: ''
        };
    },
    mounted: function () {
        var _self = this;

        //console.log('lua chon===========', $('.year .ui.kit-dropdown-year').dropdown('get value'));
        var d = new Date();
        var d_year = '' + d.getFullYear();

        _self.get_baocao(d_year);

        $('.year .floating.ui.dropdown').dropdown({
            fullTextSearch: true, sortSelect: true, match: 'text',
            onChange: function (value, text, $selected, item) {
                _self.get_baocao($($selected[0]).attr('data-value'));
            }
        });

        //$('.year .ui.kit-dropdown-year').dropdown({
        //    onChange: function (value, text, $selected, item) {
        //        _self.get_data_report($($selected[0]).attr('data-value'));
        //        _self.get_baocao();
        //    }
        //});

        //___sendApi('pawn/all').then(val => {
        //  //  _self.list = val.result_items;
        //    console.log('///valvalvalvalvalval////=========', val);
        //});
    },
    methods: {
        get_baocao: function (year) {
            var _self = this;
            console.log('???????? year = ', year);

            var type = '';
            if (_PROFILE.bit_admin_caller == 1) type = 'CALL_ADMIN';
            else if (_PROFILE.group_id == 44 && _PROFILE.bit_admin_caller != 1) type = 'CALL_EMPLOYER';
            else if (_PROFILE.int_approve_level == 1 && _PROFILE.str_user_position == '3') type = 'SHOP_ADMIN';
            else if (_PROFILE.int_approve_level == 1 && _PROFILE.str_user_position == '4') type = 'SHOP_EMPLOYER';

            fetch('/pol/api/report/report_pawn_by_year_group_by_status/eb976d531188435ea006fce8769c53d5?type=' + type + '&user_id=' + _PROFILE.user_id + '&group_id=' + _PROFILE.group_id + '&year=' + year)
                .then(res => res.json())
                .then(m_ => {
                    console.log('???????? year = ', year, m_);

                    if (m_.ok && m_.data && m_.data.results && Array.isArray(m_.data.results)) {
                        var trs = '';
                        var so_dang_ky,
                            cho_xu_ly, //1
                            da_xu_ly, //!=1
                            da_thanh_cong,//=4 
                            tong_don = 0;

                        var a = [], it, mi=[];

                        for (var m = 0; m < 12; m++) {
                            so_dang_ky = 0;
                            cho_xu_ly = 0;
                            da_xu_ly = 0;
                            da_thanh_cong = 0;
                            ti_le_thanh_cong = '0';
                            var n = m + 1;
                            if (n < 10) {
                                n = '0' + n;
                            }
                            else
                                n = '' + n;

                         
                         // console.log('it -> it it it',m_);
                            for (var i = 0; i < 12; i++) {
                                it = null;
                                it = _.find(m_.data.results, function (o) { return o.int_status == 0; }); // Hủy -> Đã xử lý
                                if (it) {
                                    if (it.months && it.months.length > 0 && it.months && it.months_.length > 0) {
                                        //  console.log('Hủy -> Đã xử lý', it.months, m);
                                        //mi = _.find(it.months, function (o) {
                                        //    //console.log('o[ o.c] o.c[mmi o.cmimi o.cm]miomi[m]==', o.c);
                                        //    //console.log('o[miv] o.c[mmi]mimi[m]miomi[m]==', o.t);
                                        //    return o.t.toString() == m.toString();
                                        //});

                                        if (it.months[i] == undefined && it.months_[i] == undefined) {
                                            // console.log('it.months.t==============');
                                            so_dang_ky += 0;
                                            da_xu_ly += 0;
                                        }
                                        else {
                                            if (it.months_[i].t == n) {
                                                so_dang_ky += it.months_[i].c;
                                                da_xu_ly += it.months_[i].c;
                                            }
                                            else {
                                                so_dang_ky += 0;
                                                da_xu_ly += 0;
                                            }
                                            if (it.months[i].t == n) {
                                                // console.log('o[miv]mi[mmi]mimi[m]miomi[m]==', it.months[m].c);  
                                               
                                            }
                                            else {
                                                // console.log('o[miv]mi[mmi]mimi[m]miomi[m]==', it.months[m].c);  
                                            }
                                        }



                                    }
                                }
                                it = null;
                                it = _.find(m_.data.results, function (o) { return o.int_status == 1; }); // Chưa tư vấn -> Chờ xử lý
                                if (it) {
                                    // console.log('it.months.t==============', it.months.length);


                                    if (it.months && it.months.length > 0 && it.months && it.months_.length > 0) {

                                        if (it.months[i] == undefined && it.months_[i] == undefined) {
                                            //console.log('it.months.t==============');
                                            so_dang_ky += 0;
                                            cho_xu_ly += 0;
                                        }
                                        else {

                                            if (it.months_[i].t == n) {
                                                so_dang_ky += it.months_[i].c;
                                                cho_xu_ly = it.months_[i].c;
                                            }
                                            else {
                                                so_dang_ky += 0;
                                            }
                                            //if (it.months[i].t == n) {
                                            //    // console.log('o[miv]mi[mmi]mimi[m]miomi[m]==', it.months[m].c);

                                               
                                            //    //}

                                            //}
                                            //else {
                                            //    //console.log('kkkkkkkkkkkkkkk====', m);

                                            //    cho_xu_ly += 0;

                                            //}
                                        }
                                    }
                                }

                                it = null;
                                it = _.find(m_.data.results, function (o) { return o.int_status == 2; }); // Đang chăm sóc -> Đã xử lý
                                if (it) {
                                    if (it.months && it.months.length > 0 && it.months && it.months_.length > 0) {
                                        if (it.months[i] == undefined && it.months_[i] == undefined) {
                                            //console.log('it.months.t==============');
                                            so_dang_ky += 0;
                                            da_xu_ly += 0;
                                        }
                                        else {
                                            if (it.months_[i].t == n) {
                                                so_dang_ky += it.months_[i].c;
                                                da_xu_ly += it.months_[i].c;
                                            }
                                            else {
                                                so_dang_ky += 0;
                                                da_xu_ly += 0;
                                            }
                                            if (it.months[i].t == n) {
                                                //  console.log('o[miv]mi[mmi]mimi[m]miomi[m]==', it.months[m].c);

                                                
                                                //}

                                            }
                                            else {
                                                //console.log('kkkkkkkkkkkkkkk====', m);

                                               // da_xu_ly += 0;

                                            }
                                        }
                                    }
                                }
                                it = null;
                                it = _.find(m_.data.results, function (o) { return o.int_status == 4; }); // Đơn đang cầm cố -> Đã xử lý + Đơn thành công
                                if (it) {
                                    if (it.months && it.months.length > 0 && it.months && it.months_.length > 0) {
                                        if (it.months[i] == undefined && it.months_[i] == undefined) {
                                            //console.log('it.months.t==============');
                                            so_dang_ky += 0;
                                            da_xu_ly += 0;
                                            da_thanh_cong += 0;
                                        }
                                        else {
                                            if (it.months_[i].t == n) {
                                                so_dang_ky += it.months_[i].c;
                                                da_thanh_cong = it.months_[i].c;
                                                da_xu_ly += it.months_[i].c;
                                            }
                                            else {
                                                so_dang_ky += 0;
                                                da_thanh_cong += 0;
                                                da_xu_ly += 0;
                                            }
                                            if (it.months[i].t == n) {

                                               
                                                //da_thanh_cong = it.months[i].c;
                                                //}

                                            }
                                            else {
                                                //console.log('kkkkkkkkkkkkkkk====', m);

                                               
                                               // da_thanh_cong += 0;

                                            }
                                        }
                                    }

                                }
                            }
                         //  console.log('Hủy -> Đã xử lý', so_dang_ky, cho_xu_ly, da_xu_ly, da_thanh_cong, m);
                            var k = m + 1;

                            trs += '<tr>';
                            trs += ' <td style="text-align: center">' + k + '</td>';
                            trs += ' <td style="text-align: right">' + so_dang_ky + '</td>';
                            trs += ' <td style="text-align: right">' + cho_xu_ly + '</td>';
                            trs += ' <td style="text-align: right">' + da_xu_ly + '</td>';
                            trs += ' <td style="text-align: right">' + da_thanh_cong + '/' + so_dang_ky + '</td>';
                            trs += '</tr>';
                            tong_don += so_dang_ky;
                        }
                        trs += '<tr> \
                            <td style="text-align: center"></td> \
                            <td style="text-align: right">Tổng số: <span style="font-weight: bold">'+ tong_don + '</span></td> \
                            <td style="text-align: right"></td> \
                            <td style="text-align: right"></td> \
                            <td style="text-align: right"></td> \
                        </tr>';

                        console.log('???????? year = ', year, m_.data.results);
                        _self.str_table_body = trs;
                    }
                })
                .catch(err_ => {

                });
        },
        get_baocao_mr_khoa: function (date) {
            var _self = this;
            var dt = new Date();
            var job_name = '';
            if (date == dt.getFullYear()) {
                job_name = 'REPORT_STATUS_YEAR_CURRENT';
            }
            else {
                job_name = 'REPORT_STATUS_YEAR_REMAIN';
            }

            fetch___get('job/pol_pawn/' + job_name + '/' + _PROFILE.group_id.toString() + '/' + date.toString() + '', { page_number: 1, page_size: 5000 }).then(res => {
                _self.mag = [];
                _self.totalall = 0;

                if (res) {
                    for (var i = 0; i < res.arr_data.length; i++) {
                        var item = {

                            totalDaDangKy: '',
                            totalDaXuLy: '',
                            totalDaChuyenThanhHopDong: '',
                            totalChoXuLy: ''

                        };
                        item.totalChoXuLy = res.arr_data[i].totalChoXuLy;
                        item.totalDaXuLy = res.arr_data[i].totalDaXuLy;
                        item.totalDaChuyenThanhHopDong = res.arr_data[i].totalDaChuyenThanhHopDong;
                        item.totalDaDangKy = res.arr_data[i].totalDaDangKy;
                        _self.totalall = _self.totalall + item.totalDaDangKy;

                        _self.mag.push(item);
                    }

                    _self.str_date_created = res.str_date_created;


                }
            });
        }
    }
});
