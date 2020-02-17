
class DbStore {

    constructor(name) {
        //this.db = new PouchDB(name); 
    }

    //getAll() {
    //    return this.db.allDocs({ include_docs: true })
    //        .then(db => {
    //            return db.rows.map(row => {
    //                return row.doc;
    //            });
    //        });
    //}

    get(id) {
        return new Promise((resolve, reject) => {
            const s = localStorage.getItem(id);
            if (s && s.length > 0)
                resolve(JSON.parse(s));
            else
                resolve(null);
            //reject({ ok: false, message: '' });
        });

        //const _self = this;
        ////return this.db.get(id);
        //return new Promise(async function (resolve, reject) {
        //    //resolve({}) or reject({});
        //    _self.db.get(id)
        //        .then(function (doc) {
        //            //console.log('SW.DB > get ok = ', id, doc);
        //            resolve(doc.data);
        //        })
        //        .catch(function (err) {
        //            //console.log('SW.DB > get fail = ', id);
        //            resolve(null);
        //        });
        //});
    }

    add(id, data, _callback) {
        return new Promise((resolve, reject) => {
            localStorage.setItem(id, JSON.stringify(data));
            if (typeof _callback == 'function') _callback();
            resolve({ ok: true });
            //reject({ ok: false, message: '' });
        });

        //const item = { _id: id, data: data }; 
        //return this.db.put(item, function callback(err, result) {
        //    if (!err) {
        //        //console.log('Successfully posted a todo!');
        //        if (typeof _callback == 'function') {
        //            _callback();
        //        }
        //    }
        //});
    }

    remove(id) {
        return new Promise((resolve, reject) => {
            localStorage.removeItem(id);
            resolve({ ok: true });
            //reject({ ok: false, message: '' });
        });

        //return this.db.get(id)
        //    .then(item => {
        //        if (item) {
        //            this.db.remove(item);
        //            return true;
        //        }
        //        return false;
        //    }); 
    }
}

self.DbStore = DbStore;