
_DATA = {
    messages: [],
    login: {
        str_user_name: 'chintn',
        str_pass_word: '12345@abc'
        //str_user_name: '',
        // call: chintn
        // call_bac:  yennh thuyntt1 haivt
        // call_nam: tamntm trangct nhungnt
        //ch: hoant thuytt2 kiennt thuyhtm
        //drs: ninhht

        //str_pass_word: '12345'  // set pass defaulf
        //str_pass_word: ''  // no set pass
    }
};

app___install = function () {
    _APP = new Vue({
        data: function () { return _DATA; },
        el: '#app',
        mounted: function () {
            const _self = this;
            _self.f_ready();
        },
        methods: {
            f_ready: function () {
                const _self = this;

                // stop the form from submitting normally
                $('.ui.form').submit(function (e) {
                    //e.preventDefault(); usually use this, but below works best here.
                    //alert('login');

                    if ($('.ui.form').form('is valid')) {
                        //alert('submit');
                        console.log('UI > LOGIN = ', _self.login);

                        _self.messages = [];

                        _STORE_USER.remove('PROFILE');

                        fetch___post('mssql/api/user/login', _self.login).then(user_ => {
                            console.log('USER = ', user_);
                            if (user_ && user_.ok) {

                                _STORE_USER.add('PROFILE', user_);

                                setTimeout(function (u) {
                                    console.log('UI > LOGIN: SAVE u = ', u);

                                    location.href = '/pawn-online';

                                }, 1000, user_);

                            } else if (user_ && user_.message) {
                                _self.messages = [user_.message];
                            } else {
                                _self.messages = ['Vui lòng nhập chính xác tài khoản'];
                            }
                        });
                    }
                    return false;
                });

                $('.ui.form').form({
                    fields: {
                        //////str_user_name: {
                        //////    identifier: 'str_user_name',
                        //////    rules: [
                        //////        {
                        //////            type: 'empty',
                        //////            prompt: 'Vui lòng nhập tài khoản'
                        //////        }
                        //////    ]
                        //////},
                        //////str_pass_word: {
                        //////    identifier: 'str_pass_word',
                        //////    rules: [
                        //////        {
                        //////            type: 'empty',
                        //////            prompt: 'Vui lòng nhập mật khẩu'
                        //////        },
                        //////        {
                        //////            type: 'length[5]',
                        //////            prompt: 'Mật khẩu tối thiểu phải là 5 ký tự'
                        //////        }
                        //////    ]
                        //////}
                    },
                    //onInvalid: function (formErrors) {
                    //    console.log('onInvalid=', formErrors);
                    //},
                    onFailure: function (formErrors, fields) {
                        //console.log('onFailure=', formErrors, fields);
                        _self.messages = formErrors;
                    }
                });
            }
        },
        watch: {
            'objSearch.optionsRuntime': {
                handler: function (after, before) {
                    var _self = this;
                    //console.log('APP.watch -> objSearch.optionsRuntime = ', JSON.stringify(_APP.$data.objSearch.optionsRuntime));
                },
                deep: true
            }
        }
    });
};

$(document).ready(function () {
    app___install();
}); 