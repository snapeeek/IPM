//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction ||
    window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange ||
    window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

const clientData = [
    {name: "gopal", surname: "gogo", email: "gopal@tutorialspoint.com"},
    {name: "prasad", surname: "tudu", email: "prasad@tutorialspoint.com"}
];
var db;
var request = window.indexedDB.open("newDatabase", 1);

request.onerror = function (event) {
    console.error("Database error: " + event.target.errorCode);
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("success: " + db);
};

request.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("client", {autoIncrement: true});

    for (var i in clientData) {
        objectStore.add(clientData[i]);
    }
}

function read() {
    var transaction = db.transaction(["client"]);
    var objectStore = transaction.objectStore("client");
    var request = objectStore.get("00-03");

    request.onerror = function (event) {
        alert("Unable to retrieve daa from database!");
    };

    request.onsuccess = function (event) {
        // Do something with the request.result!
        if (request.result) {
            alert("Name: " + request.result.name + ", Email: " + request.result.email);
        } else {
            alert("Kenny couldn't be found in your database!");
        }
    };
}

function readAll() {
    // generateTableHead();
    // var objectStore = db.transaction("client").objectStore("client");
    //
    // objectStore.openCursor().onsuccess = function (event) {
    //     var cursor = event.target.result;
    //     console.log(cursor);
    //     const table = document.getElementById('dblist');
    //     while (true) {
    //         if (cursor) {
    //             var row = table.insertRow();
    //             var cell = row.insertCell();
    //             var text = document.createTextNode(cursor.key);
    //             cell.appendChild(text);
    //
    //             cell = row.insertCell();
    //             text = document.createTextNode(cursor.value.name);
    //             cell.appendChild(text);
    //
    //             cell = row.insertCell();
    //             text = document.createTextNode(cursor.value.surname);
    //             cell.appendChild(text);
    //
    //             cell = row.insertCell();
    //             text = document.createTextNode(cursor.value.email);
    //             cell.appendChild(text);
    //             cursor.continue();
    //         } else
    //             break;
    //     }
    // };
    var objectStore = db.transaction("client").objectStore("client");

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Surname: " + cursor.value.surname + ", Email:  " + cursor.value.email);
            cursor.continue();
        } else {
            alert("No more entries!");
        }
    };
}

function add() {

    var request = db.transaction(["client"], "readwrite")
        .objectStore("client")
        .add({
            name: document.getElementById('name').value, surname: document.getElementById('surname').value,
            email: document.getElementById('email').value
        });

    request.onsuccess = function (event) {
        alert("Kenny has been added to your database.");
    };

    request.onerror = function (event) {
        alert("Unable to add data\r\nKenny is aready exist in your database! ");
    }
}

function remove() {
    var request = db.transaction(["client"], "readwrite")
        .objectStore("client")
        .delete("3");

    request.onsuccess = function (event) {
        alert("Kenny's entry has been removed from your database.");
    };
}


// ----------------------- Creating table --------------------------
function generateTableHead() {
    const data = ["ID", "NAME", "SURNAME", "EMAIL"];
    const table = document.getElementById('dblist');
    console.log("plz tell me u work")
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(cursor) {

}




