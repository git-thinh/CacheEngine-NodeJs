
var plugin___pawn___str_codeno = function (item, key) {
    if (item == null || key == null || item['id'] == null) return '';
    return 'POL-' + item['id'];
};

var plugin___pawn___int_queued = function (item, key) {
    var s = 'Chưa xác định';
    if (item == null || key == null || item[key] == null) return s;
    var val = parseInt(item[key]);
    switch (val) {
        case -1: return '';
        case 0: return '';
        case 1: return '';
        case 2: return '';
        case 3: return '';
        case 4: return '';
        case 5: return '';
        case 6: return '';
        case 7: return '';
        case 8: return '';
        case 9: return '';
    }
    return s;
};

var plugin___pawn___int_status = function (item, key) {
    var s = 'Chưa xác định';
    if (item == null || key == null || item[key] == null) return s;
    var val = parseInt(item[key]);
    switch (val) {
        case -1: return s;
        case 0: return 'Hủy đăng ký';
        case 1: return 'Chưa tư vấn';
        case 2: return 'Đang chăm sóc';
        case 3: return 'Nhận cầm cố';
    }
    return s;
};

var plugin___pawn___lng_created_dtime = function (item, key) {
    var s = '';
    if (item == null || key == null) return s;
    var val = item[key];
    if (val == null) return s;

    s = val.toString();

    if (s.length > 13) s = s.substr(0, 8) + '<br>' + s.substr(8, 2) + ':' + s.substr(10, 2) + ':' + s.substr(12, 2);
    else if (s.length > 11) s = s.substr(0, 8) + '<br>' + s.substr(8, 2) + ':' + s.substr(10, 2);
    else if (s.length > 7) s = s.substr(0, 8);

    return s;
};

var plugin___pawn___str_ciy_district = function (item, key) {
    var s = '';
    if (item == null || key == null) return s;

    var city = '', district = '';

    if (item['str_city_name_'] && item['str_city_name_'].length > 0) city = item['str_city_name_'];
    if (item['str_district_name_'] && item['str_district_name_'].length > 0) district = item['str_district_name_'];

    if (city == '0') city = '';
    if (district == '0') district = '';

    if (city.length > 0) s = city + '<br> - ';
    if (district.length > 0) s += district;

    return s;
};

var plugin___pawn___lng_money = function (item, key) {
    if (item == null || key == null || item[key] == null) return '';

    var val = parseInt(item[key]);
    if (val == 0) return '';

    return val.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,').split('.')[0];
};


var plugin___pawn___customer___pol_customer___ = function (item, key) {
    var s = '';
    s = item.customer___pol_customer.str_name_;
    return s;
};
var plugin___pawn___customer___pol_address___ = function (item, key) {
    var s = '';
    s = item.customer___pol_customer.str_address_;
    return s;
};

var plugin___pawn___str_shop_caller_name___ = function (item, key) {
    var s = '';
    s = item.caller___user.str_full_name_;
    return s;
};

var plugin___pawn___str_shop_caller_group_name___ = function (item, key) {
    var s = '';
    s = item.caller___user.str_group_name_;
    return s;
};



var plugin___pol_process___lng_created_at = function (item, key) {
    var date = '';
    var val = item[key].toString();
    if (val !== "-1") {
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
    } else {
        return "_";
    }
};


// chi tiet don
var plugin___pol_pawn___str_name_ = function (item, key) {
    var data = '';

    if (item != undefined) {
        data = item[key];
    }
    return data;
};

var plugin___pol_pawn___int_gender = function (item, key) {
    var data = '';
    if (item != undefined) {
        data = item[key];
        if (data == 1) {
            data = "Nam";
        } else {
            data = "Nữ";
        }
    }
    return data;
};

var plugin___pol_pawn___str_address_ = function (item, key) {
    var data = '';

    if (item != undefined) {
        data = item[key];
    }
    return data;
};

var plugin___pol_pawn___str_phone = function (item, key) {
    var data = '';

    if (item != undefined) {
        data = item[key];
    }
    return data;
};


var plugin___pol_pawn___str_email = function (item, key) {
    var data = '';

    if (item != undefined) {
        data = item[key];
    }
    return data;
};


var plugin___pol_pawn___lng_money = function (item, key) {

    var data = item[key];
    if (data === -1) {
        return '';
    } else {
        return data;
    }
};

var plugin___pol_pawn___int_days = function (item, key) {

    var data = item[key];
    if (data === -1) {
        return '';
    } else {
        return data;
    }
};

var plugin___pol_pawn___str_product_year = function (item, key) {

    var data = item[key];
    if (data === "-1") {
        return '';
    } else {
        return data;
    }
};


// lich su dat lich tu van


var plugin___pol_support_schedule___int_support_time = function (item, key) {
    var date = '';
    var val = item[key].toString();

    if (val.length > 5) {
        try {
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
        } catch (e) {
            return val;
        }
    } else {
        return '_';
    }
};


var plugin___pol_notify___int_date = function (item, key) {
    var date = '';
    var val = item[key].toString();

    date = val.substr(6, 2) + '-' + val.substr(4, 2) + '-' + val.substr(0, 4);
    return date;
};
