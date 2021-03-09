//Checking for IndexedDB support
export function dbBrowserCheck(window){
    if (!window.indexedDB) {
        return false;
    }else{
        return true;
    }
}

//Opening a Database
export function openDb(db_name){
    // Open the database
    //parameters - database name and version number. - integer
    var db
    var request = indexedDB.open(db_name, 1);
    db = this.result
    //Generating handlers
    //Error handlers
    request.onerror = function(event) {
        console.log("openDB Error: ", event);
    };
    //OnSuccess Handler
    request.onsuccess = function(event) {
        console.log("openDB Success: ")
        db = event.target.result;
        var objectStore = db.createObjectStore("dom_measurements", {keyPath: 'timestamp'});
        return db;
    };

    //OnUpgradeNeeded Handler
    request.onupgradeneeded = function(event) {
        console.log("openDB: On Upgrade Needed")

        db = event.target.result; //db = request.result;
        // Create an objectStore for this database
        //Provide the ObjectStore name and provide the keyPath which acts as a primary key
        var objectStore = db.createObjectStore("dom_measurements", {keyPath: 'timestamp'});
        return db;
    };

}

//Simple function to get the ObjectStore
//Provide the ObjectStore name and the mode ('readwrite')
// export function getObjectStore(db,store_name, mode='readwrite') {
//     var tx = db.transaction(store_name, mode);
//     return tx.objectStore(store_name);
// }



//Adding to the Database
export function addMeasurement(db,store_name="dom_measurements",json_record) {
    // var obj = { fname:"Test", lname: "Test", age: 30, email: "test@company.com" };
    var tx = db.transaction(store_name, mode);
    var store = tx.objectStore(store_name); //getObjectStore(db,store_name, 'readwrite');
    var req;
    try {
        req = store.add(json_record);
    } catch (e) {
        throw e;
    }
    req.onsuccess = function (evt) {
        // alert("Insertion in DB successful");
        console.log("DB Insertion Successful");
    };
    req.onerror = function() {
        // alert("Insertion in DB Failed ", this.error);
        console.log("Insertion in DB failed:" +req.error);
    };
}

export function bulkInsertMeasurements(db,json_arr,store_name="dom_measurements") {
    // var obj = { fname:"Test", lname: "Test", age: 30, email: "test@company.com" };
    const tx = db.transaction([store_name], "readwrite");
    var store = tx.objectStore(store_name); //getObjectStore(db,store_name, 'readwrite');
    var req;
    var count = 0;
    json_arr.forEach( json_record => {
        try {
            req = store.add(json_record);
            count++;
            req.onerror = function(event) {
                // ConstraintError occurs when an object with the same id already exists
                if (req.error.name == "ConstraintError") {
                    console.log("Record with such id already exists"); // handle the error
                    event.preventDefault(); // don't abort the transaction
                    // use another key for the book?
                    while(store.get(json_record.nodes)){
                        json_record.nodes += 1;
                    }


                } else {
                    // unexpected error, can't handle it
                    // the transaction will abort
                }
            };
        } catch (e) {
            throw e;
        }
    })

    tx.oncomplete =function (event){
        console.log("Inserted " + count.toString() + "records");
    }


}