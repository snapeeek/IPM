//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction ||
    window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange ||
    window.msIDBKeyRange
isTableHeadGenerated = false

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
    if (isTableHeadGenerated === false)
        generateTableHead();
    generateTableContents();
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

function remove(key) {
    var request = db.transaction(["client"], "readwrite")
        .objectStore("client")
        .delete(key);

    request.onsuccess = function (event) {
        alert("Entry with id" + key + " has been deleted from the database");
    };

    generateTableContents()
}


// ----------------------- Creating table --------------------------
function generateTableHead() {
    const data = ["ID", "NAME", "SURNAME", "EMAIL", "OPTIONS"];
    const table = document.getElementById('dblist');
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
        isTableHeadGenerated = true
    }
}

function generateTableContents() {
    var objectStore = db.transaction("client").objectStore("client");

    removeAllChildNodes(document.getElementById('dblist').getElementsByTagName('tbody')[0])

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        var table = document.getElementById('dblist');


        if (cursor) {
            // console.log(cursor.key)
            var row = table.getElementsByTagName('tbody')[0].insertRow();
            var cell = row.insertCell();
            var text = document.createTextNode(cursor.key);
            cell.appendChild(text);

            cell = row.insertCell();
            text = document.createTextNode(cursor.value.name);
            cell.appendChild(text);

            cell = row.insertCell();
            text = document.createTextNode(cursor.value.surname);
            cell.appendChild(text);

            cell = row.insertCell();
            text = document.createTextNode(cursor.value.email);
            cell.appendChild(text);

            cell = row.insertCell()
            var button = document.createElement('button')
            button.innerHTML = "Delete"
            cell.appendChild(button)
            button.onclick = function () {
                remove(cursor.key)
            }

            cursor.continue()
        }
    };
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}




