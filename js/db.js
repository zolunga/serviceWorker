const customerData = [
    { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
    { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];
let day = new Date();
function startDB() {
    day.setHours(0,0,0,0);
    let request = window.indexedDB.open("TestDay", 1);
    request.onerror = function(event) {
        console.log('error DB');
    };
    request.onupgradeneeded = function(event) {
        let db = event.target.result;
        // Se crea un almacén para contener la información de nuestros cliente
        // Se usará "ssn" como clave ya que es garantizado que es única
        let objectStore = db.createObjectStore("dayaccess", {keyPath: "index"});

        // Se crea un índice para buscar clientes por nombre. Se podrían tener duplicados
        // por lo que no se puede usar un índice único.
        objectStore.createIndex("date", "date", {unique: false});
        objectStore.createIndex("status", "status", {unique: false});
        console.log("....");
    };
    read();
    modifyReg();
    getAllStore();
    //AddOther();
}

function read() {
    let request = window.indexedDB.open("TestDay", 1);
    request.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction(["customers"]);
        let ObjectStore = transaction.objectStore('customers');
        let res = ObjectStore.get('444-44-4444');
        res.onsuccess = () => console.log(res.result);
        res.onerror = () => console.log("No se pudo exraer");
    };
}

function modifyReg() {
    let request = window.indexedDB.open("Test4", 5);
    request.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction(["customers"], 'readwrite');
        let ObjectStore = transaction.objectStore('customers');
        let res = ObjectStore.get('444-44-4444');
        res.onsuccess = () => {
            let value = res.result;
            value.date = '20';
            console.log(value);
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

        // Because the "names" object store has the key generator, the key for the name value is generated automatically.
        // The added records would be like:
        // key : 1 => value : "Bill"
        // key : 2 => value : "Donna"
        for (let i in customerData) {
            objStore.add(customerData[i].name);
            console.log('Agregado' + customerData[i].name);
        }
    }
}