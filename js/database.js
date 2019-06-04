class Database {
    db = undefined;
    nameDB = '';
    versionDB = undefined;
    need_update = false;

    constructor(name, version) {
        this.nameDB = name;
        this.versionDB = version;
    }

    async getInstanceDB() {
        let request = window.indexedDB.open(this.nameDB, this.versionDB);
        let ref = this;
        request.onsuccess = async function (event) {
            ref.db = await event.target.result;
            return true;
        };
        request.onupgradeneeded = async function (event) {
            ref.db = await event.target.result;
            // Se crea un almacén para contener la información de nuestros cliente
            let objectStore1 = ref.db.createObjectStore("dayaccess", {keyPath: "index"});
            objectStore1.createIndex("date", "date", {unique: false});
            objectStore1.createIndex("status", "status", {unique: false});
            console.log("coleccion DayAccess ok");
            let objectStore2 = ref.db.createObjectStore("json", {keyPath: "pdv"});
            objectStore2.createIndex("name", "name", {unique: false});
            objectStore2.createIndex("json", "json", {unique: false});
            console.log("coleccion json ok");
            let objectStore3 = ref.db.createObjectStore("prueba", {keyPath: "id", autoIncrement: true});
            objectStore3.createIndex("datoA", "datoA", {unique: false});
            objectStore3.createIndex("datoB", "datoB", {unique: false});
            objectStore3.createIndex("datoC", "datoC", {unique: false});
            console.log("coleccion prueba ok");
            return true
        };
        request.onerror = function (event) {
            console.log('error DB');
            return false;
        };
    }

    getCollection(name) {
        let transaction = this.db.transaction([name]);
        let ObjectStore = transaction.objectStore('dayaccess');
    }

    checkDay() {
        let transaction = this.db.transaction(["dayaccess"]);
        let ObjectStore = transaction.objectStore('dayaccess');
        let res = ObjectStore.get(1);
        res.onsuccess = () => {
            if (res.result === undefined) {
                this.addJson({clave: 40, ubicacion: 'Z', lat: 2, lng: 4});
                this.addDay();
            } else {
                console.log("fecha existente!");
                console.log(res.result);
                let dateCompare = (new Date());
                dateCompare.setHours(0, 0, 0, 0);
                if (dateCompare.getTime() === res.result.date) {
                    console.log("No es necesario actualizar");
                    this.getJson();
                } else {
                    console.log("Actualizando...");
                    this.updateDay();
                    this.need_update = true;
                }
            }
        };
        res.onerror = () => console.log("No se pudo exraer");
        return this.need_update;

    }

    addDay() {
        let dateInsert = new Date(2018, 11, 24, 10, 33, 30, 0);
        let transaction = this.db.transaction(["dayaccess"], 'readwrite');
        let ObjectStore = transaction.objectStore('dayaccess');
        let value = {index: 1, date: dateInsert.getTime(), status: true};
        let Add = ObjectStore.add(value);
        Add.onerror = () => console.log('Error Fecha');
        Add.onsuccess = () => console.log('Fecha agregada');
    }

    updateDay() {
        let transaction = this.db.transaction(["dayaccess"], 'readwrite');
        let ObjectStore = transaction.objectStore('dayaccess');
        let res = ObjectStore.get(1);
        res.onsuccess = () => {
            let value = res.result;
            value.date = new Date().setHours(0, 0, 0, 0);
            let update = ObjectStore.put(value);
            update.onerror = () => console.log('Error Actulizando');
            update.onsuccess = () => {
                this.need_update = false;
                console.log('Valor Actualizado!')
            };
        };
        res.onerror = () => console.log("Error Actualizando");
    }

    addJson(JsonData) {
        let transaction = this.db.transaction(["json"], 'readwrite');
        let ObjectStore = transaction.objectStore('json');
        let value = {pdv: 3, name: 'PDVprueba', json: JsonData};
        let Add = ObjectStore.add(value);
        Add.onerror = () => console.log('Error Json');
        Add.onsuccess = () => console.log('Json Agregado');
    }

    getJson() {
        let transaction = this.db.transaction(["json"]);
        let ObjectStore = transaction.objectStore('json');
        let res = ObjectStore.get(3);
        res.onsuccess = () => {
            if (res.result !== undefined) {
                console.log("Json existente!");
                console.log(res.result);
                return res.result;
            }
        };
        res.onerror = () => console.log("No se pudo exraer");
    }

    addDataPrueba(reg) {
        let transaction = this.db.transaction(["prueba"], 'readwrite');
        let ObjectStore = transaction.objectStore('prueba');
        let Add = ObjectStore.add(reg);
        Add.onerror = () => console.log('Error Ingresando');
        Add.onsuccess = () => console.log('Dato ingresado');
    }

    getDataPrueba() {
        let transaction = this.db.transaction(["prueba"]);
        let ObjectStore = transaction.objectStore('prueba');
        let res = ObjectStore.openCursor();
        let ret = [];
        res.onsuccess = (event) => {
            let cursor = event.target.result;
            if (cursor) {
                ret.push(cursor.value);
                cursor.continue();
            }
        };
        res.onerror = () => console.log("No se pudo exraer");
        return ret
    }
}