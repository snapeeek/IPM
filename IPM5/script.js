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
    {id: "00-01", name: "gopal", surname: "gogo", email: "gopal@tutorialspoint.com"},
    {id: "00-02", name: "prasad", surname:"tudu", email: "prasad@tutorialspoint.com"}
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
    var objectStore = db.createObjectStore("client", {keyPath: "id"});

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
    var objectStore = db.transaction("client").objectStore("client");

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            alert("Name for id " + cursor.key + " is " + cursor.value.name + " " + cursor.value.surname + ", Email: " + cursor.value.email);
            cursor.continue();
        } else {
            alert("No more entries!");
        }
    };
}

function add() {

    var request = db.transaction(["client"], "readwrite")
        .objectStore("client")
        .add({id: "00-03", name: document.getElementById('name').value, surname: document.getElementById('surname').value,
            email: document.getElementById('email').value});

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
        .delete("00-03");

    request.onsuccess = function (event) {
        alert("Kenny's entry has been removed from your database.");
    };
}