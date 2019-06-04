
let idb = undefined;
DB();
function DB () {
    if (!window.indexedDB) {
        window.alert("Su navegador no soporta una versión estable de indexedDB.");
    } else {
        console.log("instalando DB");
        let tem_idb = new Database('TestDBJ', 1);
        let promise = new Promise((resolve, reject) => {
            let status = tem_idb.getInstanceDB();
            if (status) {
                resolve(tem_idb);
            } else {
                reject(false)
            }
        });
        console.log(promise);
        promise
            .then((tem_idb) => {
                idb = tem_idb;
                setTimeout(() => idb.checkDay(), 500)
            })
            .catch(
                (problem) => console.log(problem)
            );
    }
}

function updateData() {
    if (idb.need_update) {
        // solicitar datos y actualizar BD
    }
}

navigator.serviceWorker.register('../worker.js').then(reg => {
    reg.installing; // the installing worker, or undefined
    reg.waiting; // the waiting worker, or undefined
    reg.active; // the active worker, or undefined

    reg.addEventListener('updatefound', () => {
        // A wild service worker has appeared in reg.installing!
        const newWorker = reg.installing;

        console.log(newWorker.state);
        // "installing" - the install event has fired, but not yet complete
        // "installed"  - install complete
        // "activating" - the activate event has fired, but not yet complete
        // "activated"  - fully active
        // "redundant"  - discarded. Either failed install, or it's been
        //                replaced by a newer version

        newWorker.addEventListener('statechange', () => {
            // newWorker.state has changed
        });
    });
});

