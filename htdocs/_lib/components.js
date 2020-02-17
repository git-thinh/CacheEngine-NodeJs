
Vue.component('kit-check', {
    mixins: [_MIXIN_COMS],
    template: '<div class="ui checkbox"><input type="checkbox" v-model="innerModel"/><label>{{caption}}</label></div>',
    props: ['field', 'value', 'showcaption'],
    data: function () {
        var data = {
            _name: 'kit-check',
            caption: '',
            innerModel: null
        };
        return data;
    },
    mounted: function () {
        var _self = this;
        if (_self.showcaption)
            _self.caption = _self.field.Title;
    },
    watch: {
        innerModel: function (value) {
            var _self = this;
            _self.value[_self.field.Name] = value == true ? 1 : 0;
        }
    }
});

Vue.component('kit-switch', {
    mixins: [_MIXIN_COMS],
    template: '<div class="ui toggle checkbox"><input type="checkbox" v-model="innerModel"><label>{{caption}}</label></div>',
    props: ['field', 'value', 'showcaption'],
    data: function () {
        var data = {
            _name: 'kit-switch',
            caption: '',
            innerModel: null
        };
        return data;
    },
    mounted: function () {
        var _self = this;
        if (_self.showcaption)
            _self.caption = _self.field.Title;
    },
    watch: {
        innerModel: function (value) {
            var _self = this;
            _self.value[_self.field.Name] = value == true ? 1 : 0;
        }
    }
});

Vue.component('kit-text', {
    mixins: [_MIXIN_COMS],
    template: '<input type="text" v-model="innerModel">',
    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-text',
            innerModel: null
        };
        return data;
    },
    watch: {
        innerModel: function (value) {
            var _self = this;
            _self.value[_self.field.Name] = value;
        }
    }
});

Vue.component('kit-datetime', {
    //https://fomantic-ui.com/modules/calendar.html#/examples

    mixins: [_MIXIN_COMS],
    template:
        '<div class="ui calendar four wide field">' +
        '  <div class="ui input left icon">' +
        '    <i class="calendar icon"></i>' +
        //'    <input type="text" placeholder="Date" v-model="innerModel">' +
        '    <input type="hidden" v-model="innerModel">' +
        '    <input type="text" placeholder="Date">' +
        '  </div>' +
        '</div>',
    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-datetime',
            innerModel: null
        };
        return data;
    },
    watch: {
        innerModel: function (value) {
            var _self = this;
            _self.value[_self.field.Name] = value;
            console.log('KIT-DATETIME watch = ', value);
        }
    },
    mounted: function () {
        var _self = this;

        setTimeout(function () {

            console.log('KIT-DATETIME MOUNTED = ', _self.innerModel);

            $('#' + _self._elID).calendar({
                //initialDate: new Date(),
                ampm: false,
                formatter: {
                    date: function (date, settings) {
                        return _self.fn_date_format(date);
                    }
                },
                text: {
                    days: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                    months: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                    monthsShort: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
                    today: 'Today',
                    now: 'Now',
                    am: 'AM',
                    pm: 'PM'
                },
                //minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
                //maxDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()),
                onSelect: function (value, mode) {
                    // Save values changed
                    var date = _self.fn_date_to_long(value);
                    //_self.value[_self.field.Name] = date;
                    _self.innerModel = date;
                    console.log('KIT-DATETIME SELECTED = ', date, mode);
                }
            });
        }, 300);
    },
    methods: {
        _onVisibledCallback: function (elemID, data) {
            var _self = this;
            var value = _self.innerModel;
            //console.log('KIT-DATETIME _onVisibledCallback = ', value, elemID, data);
            if (value == null || value == 0 || value == '0' || value.length == 0) {
                // Set default values  
                $('#' + _self._elID).calendar("set date", new Date());
                _self.innerModel = _self.fn_date_to_long(new Date());
            } else {
                var date = _self.fn_long_to_data(value);
                $('#' + _self._elID).calendar("set date", date);
                _self.innerModel = value;
                //console.log('KIT-DATETIME _onVisibledCallback = ', date, value);
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

Vue.component('kit-date', {
    //https://fomantic-ui.com/modules/calendar.html#/examples

    mixins: [_MIXIN_COMS],
    template:
        '<div class="ui calendar four wide field">' +
        '  <div class="ui input left icon">' +
        '    <i class="calendar icon"></i>' +
        //'    <input type="text" placeholder="Date" v-model="innerModel">' +
        '    <input type="hidden" v-model="innerModel">' +
        '    <input type="text" placeholder="Date">' +
        '  </div>' +
        '</div>',
    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-date',
            innerModel: null
        };
        return data;
    },
    watch: {
        innerModel: function (value) {
            var _self = this;
            _self.value[_self.field.Name] = value;
            console.log('KIT-DATETIME watch = ', value);
        }
    },
    mounted: function () {
        var _self = this;

        setTimeout(function () {

            console.log('KIT-DATETIME MOUNTED = ', _self.innerModel);

            $('#' + _self._elID).calendar({
                //initialDate: new Date(),
                type: 'date',
                ampm: false,
                formatter: {
                    date: function (date, settings) {
                        return _self.fn_date_format(date);
                    }
                },
                text: {
                    days: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                    months: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                    monthsShort: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
                    today: 'Today',
                    now: 'Now',
                    am: 'AM',
                    pm: 'PM'
                },
                //minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
                //maxDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()),
                onSelect: function (value, mode) {
                    // Save values changed
                    var date = _self.fn_date_to_long(value);
                    //_self.value[_self.field.Name] = date;
                    _self.innerModel = date;
                    console.log('KIT-DATETIME SELECTED = ', date, mode);
                }
            });
        }, 300);
    },
    methods: {
        _onVisibledCallback: function (elemID, data) {
            var _self = this;
            var value = _self.innerModel;
            //console.log('KIT-DATETIME _onVisibledCallback = ', value, elemID, data);
            if (value == null || value == 0 || value == '0' || value.length == 0) {
                // Set default values  
                $('#' + _self._elID).calendar("set date", new Date());
                _self.innerModel = _self.fn_date_to_long(new Date());
            } else {
                var date = _self.fn_long_to_data(value);
                $('#' + _self._elID).calendar("set date", date);
                _self.innerModel = value;
                //console.log('KIT-DATETIME _onVisibledCallback = ', date, value);
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
                dd = date.substring(6, 8);

            var val = new Date(yyyy, MM, dd, 0, 0, 0);
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

            return Number(year + '' + month + '' + day);
        }
    }
});

Vue.component('kit-filecloud', {
    mixins: [_MIXIN_COMS],
    template:
        '<div class= "ui action input" @click="fn_Click">' +
        '   <input type="text" placeholder="Select file" readonly v-model="innerModel" style="cursor: pointer;">' +
        '   <div class="ui icon button">' +
        '       <i class="attach icon"></i>' +
        '   </div>' +
        '</div>',
    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-filecloud',
            innerModel: null
        };
        return data;
    },
    watch: {
        innerModel: function (value) {
            var _self = this;
            _self.value[_self.field.Name] = value;
        }
    },
    methods: {
        fn_Click: function () {
            var _self = this;
            _MAIN.fn_fileCloud_Open('file', function (url) {
                _self.innerModel = url;
            });
        }
    }
});

Vue.component('kit-imagecloud', {
    mixins: [_MIXIN_COMS],
    template: '<img class="ui small image" v-bind:src="innerModel" @click="fn_Click">',
    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-imagecloud',
            innerModel: null
        };
        return data;
    },
    watch: {
        innerModel: function (value) {
            var _self = this;
            _self.value[_self.field.Name] = value;
        }
    },
    methods: {
        fn_Click: function () {
            var _self = this;
            _MAIN.fn_fileCloud_Open('image', function (url) {
                if (url && url.length > 0) {
                    _self.innerModel = url;
                }

            });
        },
        _onVisibledCallback: function (elemID, data) {
            var _self = this;
            var value = _self.innerModel;
            //console.log('kit-imagecloud = ', value);
            if (value == null || value.length == 0) {
                // Set default values    
                _self.innerModel = '/assets/images/square-image.png';
            }
        }
    }
});

Vue.component('kit-textarea', {
    mixins: [_MIXIN_COMS],
    template: '<textarea v-model="innerModel"></textarea>',
    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-textarea',
            innerModel: null
        };
        return data;
    },
    watch: {
        innerModel: function (value) {
            var _self = this;
            _self.value[_self.field.Name] = value;
        }
    }
});

Vue.component('kit-htmleditor', {
    mixins: [_MIXIN_COMS],
    template: '<textarea :name="field.Name" v-html="innerModel"></textarea>',
    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-htmleditor',
            innerModel: ''
        };
        return data;
    },
    mounted: function () {
        var _self = this;
        var id = _self._elID + '_Editor';

        Vue.nextTick(function () {
           
            var el = document.querySelector('textarea[name="' + _self.field.Name + '"]');
            if (el) {
                el.setAttribute('id', id);

                tinymce.init({
                    selector: 'textarea#' + id,
                    plugins: 'print preview fullpage powerpaste searchreplace autolink directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount tinymcespellchecker a11ychecker imagetools textpattern help formatpainter permanentpen pageembed tinycomments mentions linkchecker',
                    toolbar: 'formatselect | bold italic strikethrough forecolor backcolor permanentpen formatpainter | link image media pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | removeformat | addcomment | customTestButton',
                    image_advtab: true,
                    //content_css: [ '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i', '//www.tiny.cloud/css/codepen.min.css'],
                    link_list: [
                        { title: 'My page 1', value: 'http://www.tinymce.com' },
                        { title: 'My page 2', value: 'http://www.moxiecode.com' }
                    ],
                    image_list: [
                        { title: 'My page 1', value: 'http://www.tinymce.com' },
                        { title: 'My page 2', value: 'http://www.moxiecode.com' }
                    ],
                    image_class_list: [
                        { title: 'None', value: '' },
                        { title: 'Some class', value: 'class-name' }
                    ],
                    importcss_append: true,
                    height: 400,
                    file_picker_callback: function (callback, value, meta) {
                        /* Provide file and text for the link dialog */
                        if (meta.filetype === 'file') {
                            //callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
                            _MAIN.fn_fileCloud_Open('file', function () {
                                var url = sessionStorage['PATH_KIT_FILE_CLOUD'];
                                if (url && url.length > 0) {
                                    callback(url, { alt: '' });
                                }
                            });
                        }

                        /* Provide image and alt text for the image dialog */
                        if (meta.filetype === 'image') {
                            //callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });

                            _MAIN.fn_fileCloud_Open('image', function () {
                                var url = sessionStorage['PATH_KIT_FILE_CLOUD'];
                                if (url && url.length > 0) {
                                    callback(url, { alt: '' });
                                }
                            });
                        }

                        /* Provide alternative source and posted for the media dialog */
                        if (meta.filetype === 'media') {
                            //callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
                            _MAIN.fn_fileCloud_Open('image', function () {
                                var url = sessionStorage['PATH_KIT_FILE_CLOUD'];
                                if (url && url.length > 0) {
                                    callback(url, { alt: '' });
                                }
                            });
                        }
                    },
                    templates: [
                        { title: 'Some title 1', description: 'Some desc 1', content: 'My content' },
                        { title: 'Some title 2', description: 'Some desc 2', content: '<div class="mceTmpl"><span class="cdate">cdate</span><span class="mdate">mdate</span>My content2</div>' }
                    ],
                    template_cdate_format: '[CDATE: %m/%d/%Y : %H:%M:%S]',
                    template_mdate_format: '[MDATE: %m/%d/%Y : %H:%M:%S]',
                    image_caption: true,
                    spellchecker_dialog: true,
                    spellchecker_whitelist: ['Ephox', 'Moxiecode'],
                    tinycomments_mode: 'embedded',
                    //mentions_fetch: mentionsFetchFunction,
                    content_style: '.mce-annotation { background: #fff0b7; } .tc-active-annotation {background: #ffe168; color: black; }',  ////////    setup: function (editor) {
                    setup: function (editor) {
                        console.log("????????????????????????????", editor);
                        editor.ui.registry.addButton('customTestButton', {
                            text: 'Test',
                            onAction: function (_) {
                            }
                        });

                        editor.on('NodeChange', function (eventApi) {
                            var html = tinymce.activeEditor.getContent();
                            html = html.split('<body>')[1].split('</body>')[0].trim();
                            _self.innerModel = html;
                        });
                    }
                });
            }
        });
    },
    watch: {
        innerModel: function (value) {
            var _self = this;
            _self.value[_self.field.Name] = value;
            console.log('1111111111111 innerModel')
        }
    },
    methods: {
        _onVisibledCallback: function (elemID, data) {
            var _self = this;
            var id = _self._elID + '_Editor';

            var value = _self.innerModel;
            console.log('KIT-HTMLEDITOR _onVisibledCallback = ', value, elemID, data);

            if (value == null || value == 0 || value == '0' || value.length == 0) {
                // Set default values  
                //$('#' + _self._elID).calendar("set date", new Date());
                //_self.innerModel = _self.fn_date_to_long(new Date());
                console.log('1111111111111 set default values')

                tinymce.get(id).setContent('');
                _self.innerModel = '';
            } else {
                //console.log('2222222222222222 ')

                //var date = _self.fn_long_to_data(value);
                //$('#' + _self._elID).calendar("set date", date);

                // Sets the HTML contents of the activeEditor editor
                //tinymce.activeEditor.setContent('<span>some</span> html');
                // Sets the raw contents of the activeEditor editor
                //tinymce.activeEditor.setContent(value, { format: 'raw' });
                // Sets the content of a specific editor (my_editor in this example)
               
                tinymce.get(id).setContent(value);

                _self.innerModel = value;
                //console.log('KIT-DATETIME _onVisibledCallback = ', date, value);
            }
        }
    }
});

Vue.component('kit-select2', {
    mixins: [_MIXIN_COMS],
    template:
        '<div>' +
        '   <div class= "ui selection dropdown">' +
        '   <input type="hidden" v-model="innerModel">' +
        '   <i class="dropdown icon"></i>' +
        '   <div class="default text">{{field.Title}}</div>' +
        '   <div class="menu">' +
        '   </div>' +
        '</div>',
    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-select2',
            innerModel: null
        };
        return data;
    },
    watch: {
        innerModel: function (value) {
            var _self = this;
            _self.value[_self.field.Name] = value;
        }
    },
    mounted: function () {
        var _self = this;

        var $sui = $('#' + _self._elID + ' .ui.dropdown').dropdown({
            onChange: function (value, text, $choice) {
                // Save values changed
                var val = parseInt(value);
                _self.innerModel = val;
                _self.value[_self.field.Name] = val;
            }
        });

        var _arrData = [];
        var selectSetting = _APP._getViewSetting(_self.field.LookupName);

        if (selectSetting && selectSetting.api && selectSetting.api.get_lookup) {
            var res = _API.request_getUrl(selectSetting.api.get_lookup, 'json', null);
            //console.log(selectSetting.api.get_lookup, res);
            if (res && res.Ok == true && res.ResultItems && res.ResultItems.length > 0) {
                var items = res.ResultItems;
                for (var i = 0; i < items.length; i++) {
                    _arrData.push({
                        value: items[i].id,
                        text: items[i].name,
                        name: items[i].name
                    });
                }
            }
        } else {
            console.error('You must setting at file json [' + _self.field.LookupName + '] for property: [api.get_lookup:"..."]');
        }

        $sui.dropdown('setup menu', { values: _arrData });

        // Set default value is first item
        if (_arrData.length > 0) {
            var val = _arrData[0].value;
            $sui.dropdown('set selected', val);
            _self.innerModel = parseInt(val);
        }
    }
});

Vue.component('kit-select', {
    mixins: [_MIXIN_COMS],
    template:
        //'<div>' +
        //'   <div class="ui dropdown selection">' +
        //'       <div class="text"></div>' +
        //'       <i class="dropdown icon"></i>' +
        //'   </div>' +
        //'</div>',

        '<div>' +
        '   <div class= "ui selection dropdown">' +
        '   <input type="hidden" v-model="innerModel">' +
        '   <i class="dropdown icon"></i>' +
        '   <div class="default text">{{field.Title}}</div>' +
        '   <div class="menu transition hidden">' +
        '       <div class="item" v-for="item in items" :data-value="item.id">{{item.name}}</div>' +
        '   </div>' +
        '</div>',
    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-select',
            items: [],
            innerModel: null
        };
        return data;
    },
    mounted: function () {
        var _self = this;

        ////$('#' + _self._elID + ' .ui.dropdown').dropdown({
        ////    placeholder: 'Show images and icons',
        ////    values: [{
        ////        "name": "Avatar",
        ////        "value": "jenny",
        ////        "image": "https://fomantic-ui.com/images/avatar/small/jenny.jpg",
        ////        "imageClass": "ui avatar image"
        ////    },
        ////    {
        ////        "name": "Image",
        ////        "value": "elliot",
        ////        "image": "https://fomantic-ui.com/images/avatar/small/elliot.jpg"
        ////    },
        ////    {
        ////        "name": "Flag",
        ////        "value": "uk",
        ////        "icon": "uk",
        ////        "iconClass": "flag"
        ////    },
        ////    {
        ////        "name": "Icon",
        ////        "value": "female",
        ////        "icon": "female"
        ////    },
        ////    {
        ////        "name": "Colored Icon",
        ////        "value": "coloredfemale",
        ////        "icon": "pink female"
        ////    },
        ////    {
        ////        "name": "Image and Icon",
        ////        "value": "completefemale",
        ////        "image": "https://fomantic-ui.com/images/avatar/small/jenny.jpg",
        ////        "icon": "pink female"
        ////    }]
        ////});

        //var selectSetting = _APP._getViewSetting(_self.field.LookupName);
        var selectSetting = _APP._viewSetting;
        if (selectSetting && selectSetting.api && selectSetting.api.get_lookup) {

            var url = selectSetting.api.get_lookup;
            if (_self.field.Name == 'temp_name')
                url = '/api/site/get_RequestTempFiles?_Path=test.f88.vn\\_temp\\details';

            var res = _API.request_getUrl(url, 'json', null);

            //var res = _API.request_getUrl(selectSetting.api.get_lookup, 'json', null);
            //console.log(selectSetting.api.get_lookup, res);
            if (res && res.Ok == true && res.ResultItems && res.ResultItems.length > 0) {
                _self.items = res.ResultItems;

                Vue.nextTick(function () {

                    $('#' + _self._elID + ' .ui.dropdown').dropdown({
                        onChange: function (value, text, $choice) {
                            // Save values changed
                            _self.value[_self.field.Name] = value;
                        }
                    });

                });
            }
        } else {
            console.error('You must setting at file json [' + _self.field.LookupName + '] for property: [api.get_lookup:"..."]');
        }

        //console.log("SELECT SETTING??????????????????", _APP._getViewSetting);
        // Set default value is first item     
        if (_self.items.length > 0) {
            var val = _self.items[0].id;

            console.log(val);

            $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', val);
            _self.innerModel = val;
            _self.value[_self.field.Name] = val;
        }
    },
    methods: {
        _onVisibledCallback: function (elemID, data) {
            var _self = this;
            var value = _self.innerModel;
            if (value == null || value == 0 || value == '0' || value.length == 0) {
                //Clear items selected
                $('#' + _self._elID + ' .ui.dropdown').dropdown('clear');
            } else {
                //Set default values  
                $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', [value]);
            }

            setTimeout(function () {
                $('#' + _self._elID + ' .ui.dropdown .menu').addClass('hidden').removeClass('visible');
                $('#' + _self._elID + ' .ui.dropdown').removeClass('active').removeClass('visible');
            }, 500);
        }
    }
});

Vue.component('kit-selects', {
    mixins: [_MIXIN_COMS],
    template:
        '<div>' +
        '   <div class= "ui multiple dropdown">' +
        '   <input type="hidden" v-model="innerModel">' +
        '   <i class="tags icon"></i>' +
        '   <div class="default text">{{field.Title}}</div>' +
        '   <div class="menu">' +
        '       <div class="item" v-for="item in items" :data-value="item.id">{{item.name}}</div>' +
        '   </div>' +
        '</div>',
    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-selects',
            items: [],
            innerModel: null
        };
        return data;
    },
    //watch: {
    //    innerModel: function (value) {
    //        var _self = this;
    //        if (value != null && value.length > 0) {
    //            // Set default values 
    //            var a = value.split(',');
    //            $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', a);
    //        } else {
    //            // Clear items selected
    //            $('#' + _self._elID + ' .ui.dropdown').dropdown('clear');
    //        }
    //    }
    //},
    mounted: function () {
        var _self = this;
        $('#' + _self._elID + ' .ui.dropdown').dropdown({
            onChange: function (value, text, $choice) {
                // Save values changed
                _self.value[_self.field.Name] = value;
            }
        });

        var selectSetting = _APP._viewSetting;
        if (selectSetting && selectSetting.api && selectSetting.api.get_lookup) {
            var url = selectSetting.api.get_lookup;
            if (_self.field.Name == 'tags')
                url = '/api/category/get_lookup?fieldName=name';
            var res = _API.request_getUrl(url, 'json', null);

            //var res = _API.request_getUrl(selectSetting.api.get_lookup, 'json', null);
            if (res && res.Ok == true && res.ResultItems && res.ResultItems.length > 0) {
                _self.items = res.ResultItems;
            }
        } else {
            console.error('You must setting at file json  [' + _self.field.LookupName + '] for property: [api.get_lookup:"..."]');
        }

        // Set default value is first item     
        if (_self.items.length > 0) {
            var val = parseInt(_self.items[0].id);
            console.log(val);
            $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', [val]);
            _self.innerModel = val;
            _self.value[_self.field.Name] = val;
        }
    },
    methods: {
        _onVisibledCallback: function (elemID, data) {
            var _self = this;
            var value = _self.innerModel;
            if (value != null && value.length > 0) {
                // Set default values  
                var a = value.split(',');
                $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', a);
            } else {
                // Clear items selected
                $('#' + _self._elID + ' .ui.dropdown').dropdown('clear');
            }
        }
    }

});

Vue.component('kit-popup', {
    template: _API.request_getTemplateShared('kit-popup'),
});

//====================================== for notify

Vue.component('kit-notify-select', {
    mixins: [_MIXIN_COMS],
    template:
        '<div>' +
        '   <div class= "ui selection dropdown">' +
        '   <input type="hidden" v-model="innerModel">' +
        '   <i class="dropdown icon"></i>' +
        '   <div class="default text">{{field.Title}}</div>' +
        '   <div class="menu">' +
        '       <div class="item" v-for="item in items" :data-value="item.id">{{item.name}}</div>' +
        '   </div>' +
        '</div>',
    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-notify-select',
            items: [],
            innerModel: null
        };
        return data;
    },
    mounted: function () {
        var _self = this;
        $('#' + _self._elID + ' .ui.dropdown').dropdown({
            onChange: function (value, text, $choice) {
                // Save values changed
                _self.value[_self.field.Name] = value;
            }
        });
        var res;
        if (_self.field.Name == 'code') {
            var _url = '/api/notify_ext/get_items';
            res = _API.request_getUrl(_url, 'json', null);

            console.log("SELECTSETTING.API.GET_LOOKUP", res);
            if (res && res.Ok == true && res.ResultItems && res.ResultItems.length > 0) {
                _self.items = res.ResultItems;
            }

        } else {
            selectSetting = _APP._viewSetting;
            if (selectSetting && selectSetting.api && selectSetting.api.get_lookup) {
                res = _API.request_getUrl(selectSetting.api.get_lookup, 'json', null);
                if (res && res.Ok == true && res.ResultItems && res.ResultItems.length > 0) {
                    _self.items = res.ResultItems;
                }
            } else {
                console.error('You must setting at file json [' + _self.field.LookupName + '] for property: [api.get_lookup:"..."]');
            }
        }

        // Set default value is first item     
        if (_self.items.length > 0) {
            var val = _self.items[0].id;
            $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', val);
            _self.innerModel = val;
            _self.value[_self.field.Name] = val;
        }
    },
    methods: {
        _onVisibledCallback: function (elemID, data) {
            var _self = this;
            var value = _self.innerModel;
            if (value == null || value == 0 || value == '0' || value.length == 0) {
                // Clear items selected
                $('#' + _self._elID + ' .ui.dropdown').dropdown('clear');
            } else {
                // Set default values  
                $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', [value]);
            }
        }
    }
});

Vue.component('kit-user-online-selects', {
    mixins: [_MIXIN_COMS],
    template:
        '<div>' +
        '   <div class= "ui multiple dropdown">' +
        '   <input type="hidden" class="select-items" v-model="innerModel">' +
        '   <i class="tags icon"></i>' +
        '   <div class="default text">{{field.Title}}</div>' +
        '   <div class="menu">' +
        '       <div class="item" data-value="-1" >Gửi cho tất cả</div>' +
        '       <div class="item" v-for="item in items" :data-value="item.id">{{item.name}}</div>' +
        '   </div>' +
        '</div>',
    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-user-online-selects',
            items: [],
            innerModel: null
        };
        return data;
    },
    mounted: function () {
        var _self = this;
        $('#' + _self._elID + ' .ui.dropdown').dropdown({
            onChange: function (value, text, $choice) {
                var allOk = value.search("-1");
                if (allOk == -1) {
                    _self.value[_self.field.Name] = value;
                } else {
                    $('.select-items').val('-1');
                    $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', ['-1']);
                    _self.value[_self.field.Name] = '-1';
                }
            }
        });
        var res;
        if (_self.field.Name == 'user_receiver') {
            var api_get_lookup_url = "/api/user_online/get_lookup?fieldName=full_name";
            res = _API.request_getUrl(api_get_lookup_url, 'json', null);
            if (res && res.Ok == true && res.ResultItems && res.ResultItems.length > 0) {
                _self.items = res.ResultItems;
            }
        } else {
            var selectSetting = _APP._getViewSetting(_self.field.LookupName);
            if (selectSetting && selectSetting.api && selectSetting.api.get_lookup) {
                res = _API.request_getUrl(selectSetting.api.get_lookup, 'json', null);
                console.log("selectSetting.api.get_lookup", res);
                if (res && res.Ok == true && res.ResultItems && res.ResultItems.length > 0) {
                    _self.items = res.ResultItems;
                }
            } else {
                console.error('You must setting at file json [' + _self.field.LookupName + '] for property: [api.get_lookup:"..."]');
            }
        }
        //console.log("[100] SELECTSETTING.API.GET_LOOKUP", res);
        // Set default value is first item
        if (_self.items.length > 0) {
            var val = parseInt(_self.items[0].id);
            //console.log(val);

            $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', [val]);
            _self.innerModel = val;
            _self.value[_self.field.Name] = val;
        }
    },
    methods: {
        _onVisibledCallback: function (elemID, data) {
            var _self = this;
            var value = _self.innerModel;
            if (value != null && value.length > 0) {
                // Set default values  
                var a = value.split(',');
                $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', a);
            } else {
                // Clear items selected
                $('#' + _self._elID + ' .ui.dropdown').dropdown('clear');
            }
        }
    }
});


Vue.component('kit-popup-selects', {
    mixins: [_MIXIN_COMS],
    template: _API.request_getTemplateShared('kit-popup-selects'),
    props: ['field', 'value'],
    data: function () {
        return {
            _name: 'kit-popup-selects',
            showModal: false,
            innerModel: null,
            items: [],
            PageNumber: 1,
            TotalPage: 1,
            selectItems: []
        };
    },
    mounted: function () {
        var _self = this;
        $('#' + _self._elID + ' showModal').show({
            onChange: function (value, text, $choice) {
                alert(11111);
                _self.value[_self.field.Name] = value;
            }
        });
        var res;
        var _url = '/api/profile/get_items';
        //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        res = _API.request_getUrl(_url, 'json', null);
        if (res && res.Ok == true && res.ResultItems && res.ResultItems.length > 0) {
            _self.items = res.ResultItems;
            _self.TotalPage = Math.ceil(res.TotalItems / 10);
        }
      
    },
    watch: {
        innerModel: function (value) {
            this._update_ValueChanged(value);
        }
    },
    methods: {
        _update_ValueChanged: function (value) {
            var _self = this;
            //_self.selectItems = value;
            _self.value[_self.field.Name] = value;
        },
        fn_Click: function () {
            // OPEN POPUP CUSTOMER LIST....
            var _self = this;
            _self.fn_popup_setSelected();
            this.showModal = true;
        },
        fn_popup_itemSelected: function (item) {
            var check = $('#' + item.id).val();
        },
        fn_popup_itemChecked: function (item) {
            var _self = this;
            _self.value[_self.field.Name] = item.id;
            var value = _self.innerModel;

            //var it = _.find(_self.selectItems, function (o) { return o.id == item.id; });
            //if (it == null) {
            //    _self.selectItems.push(item);
            //} else {
            //    var arr = _.filter(_self.selectItems, function(o){ return o.id != item.id; });
            //    _self.selectItems = arr;
            //}
            //console.log('_self.selectItems === ', _self.selectItems);

            var it = _.find(_self.selectItems, function (o) { return o.id == item.id; });
            if (it == null) {
                _self.selectItems.push(item);
            } else {
                var arr = _.filter(_self.selectItems, function (o) { return o.id != item.id; });
                _self.selectItems = arr;
            }
            console.log('_self.selectItems === ', _self.selectItems);
        },
        fn_popup_onSubmit: function () {
            var _self = this;
            this.showModal = false;
            var value = '-1';
           
            if (_self.selectItems.length == 0) {
                value = '-1';
            } else {
                var user_ids = _.map(_self.selectItems, function (o) { return o.id; });
                value = user_ids.toString();
            }
            setTimeout(function () { _self.innerModel = value; }, 100)
            this._update_ValueChanged(value);
        },
        fn_popup_onPagerGoPrev: function () {
            var _self = this;
            if (_self.PageNumber > 1) {
                _self.PageNumber = _self.PageNumber - 1;
                _self.fn_popup_onChangePaper();
            }
        },
        fn_popup_onPagerGoNext: function () {
            var _self = this;
            if (_self.PageNumber < _self.TotalPage) {
                _self.PageNumber = _self.PageNumber + 1;
                _self.fn_popup_onChangePaper();
            }
        },
        fn_popup_onClose: function () {
            this.showModal = false;
        },
        fn_popup_onChangePaper: function () {
            var _self = this;
            var _keyword = $('#popup_search').val();
            var _url = '/api/profile/get_items?pageNumber=' + _self.PageNumber + '&pageSize=10';
            if (_keyword && _keyword.length > 0) {
                var condition = 'condition=(phone != null and phone.ToLower().Contains(\"' + _keyword + '\")) or (customer != null and customer.ToLower().Contains(\"' + _keyword + '\")) or (address != null and address.ToLower().Contains(\"' + _keyword + '\"))';
                _url = _url + "&" + condition;
            }
            var res;
            res = _API.request_getUrl(_url, 'json', null);
            if (res && res.Ok == true && res.ResultItems && res.ResultItems.length > 0) {
                _self.items = res.ResultItems;
               
                _self.TotalPage = Math.ceil(res.TotalItems / 10);
            }
            _self.fn_popup_setSelected();
            console.log("1. _SELF.ITEMS:?????????????????????", _self.items);
        },
        fn_popup_setSelected: function () {
            var _self = this;
            for (var i = 0; i < _self.items.length; i++) {
                var it = _.find(_self.selectItems, function (o) { return o.id == _self.items[i].id; });
                console.log("ITEM SELECTED??????????????????", it);
                if (it)
                    _self.items[i].item_check = 1;
                else
                    _self.items[i].item_check = 0;
            }
            console.log("FN_POPUP_SETSELECTED _SELF.ITEMS", _self.items);
        },
        fn_popup_onSearch: function () {
            var _self = this;
            _self.PageNumber = 1;
            _self.fn_popup_onChangePaper();
        },
        fn_popup_onDelete: function () {

        }
    }
});

Vue.component('kit-popup-selects-backup', {
    mixins: [_MIXIN_COMS],
    template:
        '<div class= "ui action input" @click="fn_Click">' +
        '   <input type="text" placeholder="Selects" readonly v-model="innerModel" style="cursor: pointer;">' +
        '   <div class="ui icon button">' +
        '       <i class="external alternate icon"></i>' +
        '   </div>' +
        '</div>',
    props: ['field', 'value'],
    data: function () {
        var _idPopup = 'popup_' + new Date().getTime() + '_';

        var data = {
            _name: 'kit-popup-selects',
            innerModel: null,
            options_Popup: {
                idPopup: _idPopup,
                pageNumber: 1,
                layout: {
                    name: _idPopup + 'layout',
                    padding: 0,
                    panels: [
                        { type: 'preview', size: '100%', resizable: true, minSize: 120 }
                    ]
                },
                grid: {
                    name: _idPopup + 'grid',
                    style: 'border: 0px; border-left: 1px solid silver',
                    header: 'Danh sách người sử dụng ',
                    show: {
                        selectColumn: false,
                        toolbar: true,
                        footer: true
                    },
                    multiSelect: true,
                    toolbar: {
                        items: [
                            { type: 'spacer' },
                            {
                                type: 'html', id: 'pageidx',
                                html: ' <div class="ui right floated pagination menu tiny">'
                                    + '<a class="icon item"  onclick=' + _idPopup + '("onPagePrevClick")>'
                                    + '     <i class="left chevron icon"></i>'
                                    + '</a >'
                                    + '<a class="item current-page" >{{}}</a>'
                                    + ' <a class="icon item">'
                                    + '    <i class="right chevron icon" onclick=' + _idPopup + '("onPageNextClick")></i>'
                                    + ' </a >'
                                    + ' </div >'
                            },
                            { id: 'save_select', type: 'button', caption: 'Chọn', size: '120px', img: 'fa-chevron-right' } //<i class="far fa-check-circle"></i>
                        ]
                    },
                    columns: [
                        { field: 'id', caption: 'id', size: '90px', resizable: true, sortable: true },
                        { field: 'phone', caption: 'Mã đăng nhập', size: '150px', resizable: true, sortable: true },
                        { field: 'Customer', caption: 'Họ và tên', size: '80%', resizable: true, sortable: true }
                    ],

                    records: [],
                    //onClick: function (event) {
                    //    var grid = this;
                    //    event.onComplete = function () {
                    //        //var _userID = grid.records[event.recid].id;
                    //    };
                    //}
                }
            },
        };
        return data;
    },
    watch: {
        innerModel: function (value) {
            var _self = this;
            _self.value[_self.field.Name] = value;
        }
    },
    methods: {
        onPagerChange: function (pageNumber, _idPopup) {

            var url = '/api/profile/get_items?pageNumber=' + pageNumber + '&pageSize=30';
            res = request_getUrl(url, 'json', []);
            if (res) {
                res = res.ResultItems;
                for (var i = 0; i < res.length; i++) res[i].recid = res[i].id;
                w2ui[_idPopup + 'grid'].clear();
                w2ui[_idPopup + 'grid'].add(res);
            }
        },
        onPagePrevClick: function (options) {
            this.options_Popup = options;
            alert('prev');
            console.log(options);
        },
        onPageNextClick: function (options) {
            var _self = this;
            this.options_Popup = options;
            this.options_Popup.pageNumber = this.options_Popup.pageNumber + 1;

            _self.onPagerChange(this.options_Popup.pageNumber, this.options_Popup.idPopup);
            console.log(options);
        },
        fn_Click: function () {
            var _self = this;
            _VUE_POPUP = _self;
            var value = _self.innerModel;
            //_MAIN.fn_multiSelects_Open(_self, value, function (users_selected) {
            //    _self.innerModel = users_selected;
            //});

            console.log('!!!!!!!!!!!!!!!!===', _self.options_Popup);

            _MAIN.fn_popup_OpenFromVueComponent(_self);
        },
        _onVisibledCallback: function (elemID, data) {
            var _self = this;
            var value = _self.innerModel;
            if (value == null || value.length == 0) {
                // Set default values    
                _self.innerModel = '';
            }
        }
    }
});


Vue.component('cell', {
    mixins: [_MIXIN_COMS],
    data: function () {
        return {
            _name: 'td-cell'
        };
    },
    template: '<td v-if="cindex == \'state\'" style="text-align:center;"><div class="ui checkbox" style="opacity:0.5;"><input type="checkbox" :checked="value > 0" onclick="return false;"><label></label></div></td><td v-else>{{value}}</td>',
    props: ['value', 'cindex', 'rindex']
});

//===============================================

Vue.component('kit-seourl', {
    mixins: [_MIXIN_COMS],
    template: '<div class="ui transparent input"><input type="text" readonly v-model="innerModel"></div>',
    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-seourl',
            innerModel: null
        };
        return data;
    },
    watch: {
        innerModel: function (value) {
            var _self = this;
            _self.value[_self.field.Name] = value;
        }
    },
    methods: {
        _onVisibledCallback: function (elemID, data) {
            var _self = this;
            var value = _self.innerModel;

            console.log('??????????????? value = ', value);

            //if (value == null || value == 0 || value == '0' || value.length == 0) {
            //    // Clear items selected
            //    $('#' + _self._elID + ' .ui.dropdown').dropdown('clear');
            //} else {
            //    // Set default values  
            //    $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', [value]);
            //}
        }
    }
});

//===============================================

Vue.component('message', {
    mixins: [_MIXIN_COMS],
    data: function () {
        var data = {
            _name: 'message'
        };
        return data;
    },
    template: _API.request_getTemplateShared('message'),
    methods: {
        _onInited: function () {
            var _self = this;
        },
        fn_alertClose: function (event, index, item) {
            var _self = this;

            var a = _.filter(_self.objMessage.messageArray, function (o) { return o.id != item.id; });
            setTimeout(function () {
                _self.objMessage.messageArray = a;
            }, 500);

            //$(this).closest('.message').transition('fade');
            $(event.target).closest('.ui.message').transition('fade');
            if (typeof item.callback == 'function') {
                if (item.data == null)
                    item.callback();
                else
                    item.callback(item.data);
            }
        }
    }
});
Vue.component('breadcrumb', {
    mixins: [_MIXIN_COMS],
    data: function () {
        var data = {
            _name: 'breadcrumb'
        };
        return data;
    },
    template: _API.request_getTemplateShared('breadcrumb'),
    methods: {
        _onInited: function () {
            //console.log('component.breadcrumb alert === ', this.objMessage);
        }
    }
});
Vue.component('nav-header', {
    mixins: [_MIXIN_COMS],
    data: function () {
        var data = {
            _name: 'nav-header',
            search_keyword: ''
        };
        return data;
    },
    template: _API.request_getTemplateShared('nav-header'),
    methods: {
        _onInited: function () {
            var _self = this;
            //console.log('component.nav-header _self._appCurrent === ', _self._appCurrent);
            //console.log('component.nav-header objApp.appArray === ', this._data.objApp.appArray);
            //$('#' + _self._eleID + ' .dropdown').dropdown();
            $('.ui.dropdown').dropdown({ on: 'click' });
        },
        fn_search_keyupEvent: function (e) {
            var _self = this;
            if (e.keyCode === 13) {
                //console.log('search_keyword === ', _self.search_keyword);

                _MAIN.fn_itemSearch(_self.search_keyword);

                ////if (_ROUTER.history.current.matched && _ROUTER.history.current.matched.length > 0) {
                ////    var _viewCurrent = _ROUTER.history.current.matched[0].instances.default;
                ////    if (_viewCurrent && _viewCurrent._onSearchBoxForwardEvent
                ////        && typeof _viewCurrent._onSearchBoxForwardEvent == 'function') {

                ////        $('#' + _self._elID + ' .ui.search_box').addClass('disabled');

                ////        _viewCurrent._onSearchBoxForwardEvent(_self.search_keyword, function () {

                ////            $('#' + _self._elID + ' .ui.search_box').removeClass('disabled');
                ////        });
                ////    }
                ////}
            }
        },
        fn_userLogout: function () {
            _API.alertConfirm('User Logout', 'Are you sure want logout?', function () {
                _MAIN.go_Logout();
            });
        },
        on_clickOpenApp: function (item) {
            _MAIN.go(item.name);
        }
    }
});


//=============================================== PawnOnline ========================================

Vue.component('kit-pawn', {
    mixins: [_MIXIN_COMS],
    template:
        '<div>' +
        '   <div class= "ui dropdown">' +
        '<i class="cog icon" data-search-terms="gear, mechanical, settings, sprocket, wheel"></i>' +
        '<i class="dropdown icon"></i>' +
        '<div class="menu">' +
        '   <div class="menu transition hidden">' +
        '   <div class="item" v-for="item in items" :data-value="item.id">{{item.name}}</div>' +
        '</div>' +
        '   </div>' +
        '</div>',

    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-pawn',
            items: [],
            innerModel: null
        };
        return data;
    },
    mounted: function () {
        var _self = this;

        $('#' + _self._elID + ' .ui.dropdown').dropdown({
            placeholder: 'Show images and icons',
            values: [{
                "name": "Chi tiết đơn",
                "value": "1",
                "icon": "eye outline"
            },
            {
                "name": "Sửa thông tin",
                "value": "2",
                "icon": "edit outline"
            },
            {
                "name": "Trả đơn không nhận xử lý",
                "value": "3",
                "icon": "undo"
            },
            {
                "name": "Xóa đơn",
                "value": "4",
                "icon": "trash alternate outline"
            },
            {
                "name": "Hẹn giờ gọi lại",
                "value": "5",
                "icon": "bell outline"
            }
            ]
        });

        //var selectSetting = _APP._getViewSetting(_self.field.LookupName);
        //var selectSetting = _APP._viewSetting;
        //if (selectSetting && selectSetting.api && selectSetting.api.get_lookup) {

        //    var url = selectSetting.api.get_lookup;
        //    if (_self.field.Name == 'temp_name')
        //        url = '/api/site/get_RequestTempFiles?_Path=test.f88.vn\\_temp\\details';

        //    var res = _API.request_getUrl(url, 'json', null);

        //    //var res = _API.request_getUrl(selectSetting.api.get_lookup, 'json', null);
        //    //console.log(selectSetting.api.get_lookup, res);
        //    if (res && res.Ok == true && res.ResultItems && res.ResultItems.length > 0) {
        //        _self.items = res.ResultItems;

        //        Vue.nextTick(function () {

        //            $('#' + _self._elID + ' .ui.dropdown').dropdown({
        //                onChange: function (value, text, $choice) {
        //                    // Save values changed
        //                    _self.value[_self.field.Name] = value;
        //                }
        //            });

        //        });
        //    }
        //} else {
        //    console.error('You must setting at file json [' + _self.field.LookupName + '] for property: [api.get_lookup:"..."]');
        //}
        
        // Set default value is first item     
        if (_self.items.length > 0) {
            var val = _self.items[0].id;

            console.log(val);

            $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', val);
            _self.innerModel = val;
            _self.value[_self.field.Name] = val;
        }
    },
    methods: {
        _onVisibledCallback: function (elemID, data) {
            var _self = this;
            var value = _self.innerModel;
            if (value == null || value == 0 || value == '0' || value.length == 0) {
                //Clear items selected
                $('#' + _self._elID + ' .ui.dropdown').dropdown('clear');
            } else {
                //Set default values  
                $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', [value]);
            }

            setTimeout(function () {
                $('#' + _self._elID + ' .ui.dropdown .menu').addClass('hidden').removeClass('visible');
                $('#' + _self._elID + ' .ui.dropdown').removeClass('active').removeClass('visible');
            }, 500);
        }
    }
});
Vue.component('kit-menu', {
    mixins: [_MIXIN_COMS],
    template:
                '<div class="ui secondary pointing menu" id="myDIV">'+
                '<a v-on:click="_onClick" data-status="0" class="item item-mn active-menu">Tất cả </a>' +
                '<a v-on:click="_onClick" data-status="1" class="item item-mn">Cần xử lý</a>' +
                '<a v-on:click="_onClick" data-status="2" class="item item-mn">Hủy đăng ký</a>' +
                '<a v-on:click="_onClick" data-status="3" class="item item-mn">Chưa tư vấn </a>' +
                '<a v-on:click="_onClick" data-status="4" class="item item-mn">Chưa tư vấn(chưa chia)</a>' +
                '<a v-on:click="_onClick" data-status="5" class="item item-mn">Đang chăm sóc</a>' +
                '<a v-on:click="_onClick" data-status="6" class="item item-mn">Nhận cầm cố</a>' +
                '<a v-on:click="_onClick" data-status="7" class="item item-mn">Không liên lạc được</a>' +
                '</div>',

    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-menu',
            items: [],
            innerModel: null
        };
        return data;
    },
    mounted: function () {
        var _self = this;
       
    },
    methods: {
        _onClick: function (item) {
            $('#myDIV .item').removeClass('active-menu');
            $(item.srcElement).addClass('active-menu');


        }
    }
});
Vue.component('kit-select-search', {
    mixins: [_MIXIN_COMS],
    template:
        '<select name="skills" class="ui fluid search dropdown drop-max">'+
         '   <option  v-for="item in items" : data-value="item.id" > {{item.name}}</option>'+
        '</select>',

    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-select-search',
            items: [],
            innerModel: null
        };
        return data;
    },
    mounted: function () {
        var _self = this;
        var selectSetting = _APP._viewSetting;
        if (selectSetting && selectSetting.api && selectSetting.api.get_lookup) {

            var url = selectSetting.api.get_lookup;
            if (_self.field.Name == 'temp_name')
                url = '/api/site/get_RequestTempFiles?_Path=test.f88.vn\\_temp\\details';

            var res = _API.request_getUrl(url, 'json', null);
            
            if (res && res.Ok == true && res.ResultItems && res.ResultItems.length > 0) {
                _self.items = res.ResultItems;

                Vue.nextTick(function () {

                    $('#' + _self._elID + ' .ui.dropdown').dropdown({
                        onChange: function (value, text, $choice) {
                            // Save values changed
                            _self.value[_self.field.Name] = value;
                        }
                    });

                });
            }
        } else {
            console.error('You must setting at file json [' + _self.field.LookupName + '] for property: [api.get_lookup:"..."]');
        }
        // Set default value is first item     
        if (_self.items.length > 0) {
            var val = _self.items[0].id;

            $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', val);
            _self.innerModel = val;
            _self.value[_self.field.Name] = val;
        }   
        $('.tag.example .ui.dropdown')
            .dropdown({
                allowAdditions: true
            });
    },
    methods: {
        _onVisibledCallback: function (elemID, data) {
            var _self = this;
            var value = _self.innerModel;
            if (value == null || value == 0 || value == '0' || value.length == 0) {
                //Clear items selected
                $('#' + _self._elID + ' .ui.dropdown').dropdown('clear');
            } else {
                //Set default values  
                $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', [value]);
            }

            setTimeout(function () {
                $('#' + _self._elID + ' .ui.dropdown .menu').addClass('hidden').removeClass('visible');
                $('#' + _self._elID + ' .ui.dropdown').removeClass('active').removeClass('visible');
            }, 500);
        }
    }
});


Vue.component('kit-select-checkbox', {
    mixins: [_MIXIN_COMS],
    template:
        '<div class="ui  selection dropdown  right labeled  icon  drop-max">' +
        '<i class="dropdown icon"></i>' +
        '<span class="ui tiny ">Lựa chọn</span>' +
        '<div class="menu">' +
        '<div class="ui icon search input">' +
        '<i class="search icon"></i>' +
        '<input type="text" name="Search" placeholder="Search">' +
        '</div>' +
        '<div class="scrolling menu cus-scroll">' +

        '<div class="ui item checkbox"  v-for="item in items" :data-value="item.id"    >' +
            '<input type="checkbox" :name="item.id">' +
            '<label>{{item.name}}</label>' +
        '</div>' +
        
        '</div>' +
        '</div>' +
        '</div>',

    props: ['field', 'value'],
    data: function () {
        var data = {
            _name: 'kit-select-checkbox',
            items: [],
            innerModel: null
        };
        return data;
    },
    mounted: function () {
        var _self = this;
        var selectSetting = _APP._viewSetting;
        if (selectSetting && selectSetting.api && selectSetting.api.get_lookup) {

            var url = selectSetting.api.get_lookup;
            if (_self.field.Name == 'temp_name')
                url = '/api/site/get_RequestTempFiles?_Path=test.f88.vn\\_temp\\details';

            var res = _API.request_getUrl(url, 'json', null);

            if (res && res.Ok == true && res.ResultItems && res.ResultItems.length > 0) {
                _self.items = res.ResultItems;

                Vue.nextTick(function () {

                    $('#' + _self._elID + ' .ui.dropdown').dropdown({
                        onChange: function (value, text, $choice) {
                            // Save values changed
                            _self.value[_self.field.Name] = value;
                        }
                    });

                });
            }
        } else {
            console.error('You must setting at file json [' + _self.field.LookupName + '] for property: [api.get_lookup:"..."]');
        }
        // Set default value is first item     
        if (_self.items.length > 0) {
            var val = _self.items[0].id;

            $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', val);
            _self.innerModel = val;
             _self.value[_self.field.Name] = val;
        }

        $('.ui.dropdown').dropdown({
            action: 'nothing'
        });
        $('.ui.checkbox').checkbox();

    },
    methods: {
        _onVisibledCallback: function (elemID, data) {
            var _self = this;
            var value = _self.innerModel;
            if (value == null || value == 0 || value == '0' || value.length == 0) {
                //Clear items selected
                $('#' + _self._elID + ' .ui.dropdown').dropdown('clear');
            } else {
                //Set default values  
                $('#' + _self._elID + ' .ui.dropdown').dropdown('set selected', [value]);
            }

            setTimeout(function () {
                $('#' + _self._elID + ' .ui.dropdown .menu').addClass('hidden').removeClass('visible');
                $('#' + _self._elID + ' .ui.dropdown').removeClass('active').removeClass('visible');
            }, 500);
        }
    }
});


//=============================================== PawnOnline ========================================

