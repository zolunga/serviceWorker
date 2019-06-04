
let idb = undefined;
DB();
function DB () {
    if (!window.indexedDB) {
        window.alert("Su navegador no soporta una versión estable de indexedDB.");
    } else {
        console.log("instalando DB");
        idb = new Database('Test4', 1);
        let promise = new Promise((resolve, reject) => {
            let status = idb.getInstanceDB();
            setTimeout(() => {
                if (status) {
                    resolve(status);
                } else {
                    reject(false)
                }
            }, 500);
        });
        console.log(promise);
        promise
            .then(() => {idb.checkDay()})
            .catch((problem) => console.log(problem));
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