let httpBase = function logSingleton() {
    //#region [ VARIABLE ]

    const $ = this;

    const _UUID = require('uuid');
    const _ = require('lodash');
    const _PATH = require('path');
    const _FS = require('fs');

    const _HTTP_EXPRESS = require('express');
    const _HTTP_BODY_PARSER = require('body-parser');
    const _HTTP_COOKIE_PARSER = require('cookie-parser');
    const _HTTP_APP = _HTTP_EXPRESS();

    const _HTTP_SERVER = require('http').createServer(_HTTP_APP);

    //--------------------------------------------------------------------------------------------    

    //_HTTP_APP.use(_HTTP_EXPRESS.static(_PATH.join(__dirname, 'htdocs')));

    _HTTP_APP.use(_HTTP_COOKIE_PARSER());
    _HTTP_APP.use(_HTTP_BODY_PARSER.json());
    _HTTP_APP.use((error, req, res, next) => {
        if (error !== null) {
            return res.json({ ok: false, mesage: 'Invalid json ' + error.toString() });
        }
        ////if ($.CACHE_STORE.IS_BUSY) {
        ////    return res.json({ ok: false, state: $.CACHE_STORE.STATE, mesage: 'Api is caching ...' });
        ////}
        return next();
    });

    //#endregion 
};

httpBase.instance = null;
httpBase.getInstance = function () {
    if (this.instance === null) this.instance = new httpBase();
    return this.instance;
};
module.exports = httpBase.getInstance();