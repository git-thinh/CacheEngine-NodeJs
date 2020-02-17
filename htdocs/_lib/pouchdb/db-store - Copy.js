
class DbStore {

    constructor(name) {
        this.db = new PouchDB(name);
        //this.db = new PouchDB(name, { adapter: 'memory' });
    }

    getAll() {
        return this.db.allDocs({ include_docs: true })
            .then(db => {
                return db.rows.map(row => {
                    return row.doc;
                });
            });
    }

    get(id) {
        const _self = this;
        //return this.db.get(id);
        return new Promise(async function (resolve, reject) {
            //resolve({}) or reject({});
            _self.db.get(id)
                .then(function (doc) {
                    //console.log('SW.DB > get ok = ', id, doc);
                    resolve(doc.data);
                })
                .catch(function (err) {
                    //console.log('SW.DB > get fail = ', id);
                    resolve(null);
                });
        });
    }

    add(id, data, _callback) {
        const item = { _id: id, data: data };

        return this.db.put(item, function callback(err, result) {
            if (!err) {
                //console.log('Successfully posted a todo!');
                if (typeof _callback == 'function') {
                    _callback();
                }
            }
        });
    }

    remove(id) {
        return this.db.get(id)
            .then(item => {
                if (item) {
                    this.db.remove(item);
                    return true;
                }

                return false;
            }); 
    }
}

self.DbStore = DbStore;