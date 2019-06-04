function addNewData() {
    console.log("-----")
    //if (idb === undefined)
    //    return;
    let datA = $('#datoA').val();
    let datB = $('#datoB').val();
    let datC = $('#datoC').val();
    //if (!datA || !datB || !datC)
    //    return;
    let format = {
        datoA: datA,
        datoB: datB,
        datoC: datC,
    };
    console.log(format);
    idb.addDataPrueba(format)
}


async function getData() {
    let dat = await idb.getDataPrueba();
    /*
    let promise = new Promise((resolve, reject) => {
        resolve(idb.getDataPrueba());
        reject(false)
    });

     */
    console.log(dat);
}