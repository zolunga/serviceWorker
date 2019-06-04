let day = new Date();
function startDB() {
    day.setHours(0,0,0,0);
    let request = window.indexedDB.open("TestDay2", 1);
    request.onerror = function(event) {
        console.log('error DB');
    };
    request.onupgradeneeded = function(event) {
        let db = event.target.result;
        // Se crea un almacén para contener la información de nuestros cliente
        let objectStore = db.createObjectStore("dayaccess", {keyPath: "index"});
        objectStore.createIndex("date", "date", {unique: false});
        objectStore.createIndex("status", "status", {unique: false});
        console.log("....");
    };
    read();
    //modifyReg();
    //getAllStore();
    //AddOther();
}

function read() {
    let request = window.indexedDB.open("TestDay2", 1);
    request.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction(["dayaccess"]);
        let ObjectStore = transaction.objectStore('dayaccess');
        console.log(ObjectStore);
        let res = ObjectStore.get(1);
        res.onsuccess = () => {
            if(res.result === undefined){
                console.log(res.result);
                //installSW();
                AddDate();
            } else {
                console.log("fecha existente!");
                console.log(res.result);
                let dateCompare = (new Date());
                dateCompare.setHours(0,0,0,0);
                if (dateCompare.getTime() === res.result.date) {
                    console.log("No es necesario actualizar")
                } else {
                    console.log("Actualizando...");
                    modifyReg();
                    //installSW();
                }
            }
        };
        res.onerror = () => console.log("No se pudo exraer");
    };
}

function AddDate() {
    let request = window.indexedDB.open("TestDay2", 1);
    request.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction(["dayaccess"], 'readwrite');
        let ObjectStore = transaction.objectStore('dayaccess');
        let value = {index: 1, date: new Date().setHours(0,0,0,0), status: true};
        let Add = ObjectStore.add(value);
        Add.onerror = () => console.log('Agregado');
        Add.onsuccess = () => console.log('Error Agregando!');
    };
}


function modifyReg() {
    let request = window.indexedDB.open("TestDay2", 1);
    request.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction(["dayaccess"], 'readwrite');
        let ObjectStore = transaction.objectStore('dayaccess');
        let res = ObjectStore.get(1);
        res.onsuccess = () => {
            let value = res.result;
            value.date = new Date().setHours(0,0,0,0);
            let update = ObjectStore.put(value);
            update.onerror = () => console.log('ErrorActulizando');
            update.onsuccess = () => console.log('Actualizado!');
        };
        res.onerror = () => console.log("No se pudo exraer");
    };
}

function getAllStore() {
    let request = window.indexedDB.open("Test4", 5);
    request.onsuccess = function(event) {
        let db = event.target.result;
        let objectStore = db.transaction("customers").objectStore("customers");
        objectStore.openCursor().onsuccess = function(event) {
            let cursor = event.target.result;
            if (cursor) {
                alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
                cursor.continue();
            } else {
                alert("No more entries!");
            }
        };
    }
}

function AddOther() {
    let request = window.indexedDB.open("Test", 1);
    request.onupgradeneeded = function (event) {
        let db = event.target.result;
        // Create another object store called "names" with the autoIncrement flag set as true.
        let objStore = db.createObjectStore("names", {autoIncrement: true});
        for (let i in customerData) {
            objStore.add(customerData[i].name);
            console.log('Agregado' + customerData[i].name);
        }
    }
}