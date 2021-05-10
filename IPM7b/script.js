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

}

const clientData = [
    {name: "gopal", surname: "gogo", phone:'505-666-130', email: "gopal@tutorialspoint.com"},
    {name: "prasad", surname: "tudu", phone:'505-666-135',email: "prasad@tutorialspoint.com"}
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

    objectStore.createIndex('email', 'email', {unique: true})

    for (var i in clientData) {
        objectStore.add(clientData[i]);
    }
}

function edit() {
    var transaction = db.transaction(["client"], "readwrite");
    var objectStore = transaction.objectStore("client");
    var children = this.parentNode.children
    console.log(children[0].innerHTML)
    var request = objectStore.get(parseInt(children[0].innerHTML));

    var cell = this
    console.log(this.innerHTML);


    request.onsuccess = function (event)  {
        var data = event.target.result
        data.name = cell.innerHTML

        var objRequest = objectStore.put(data, +parseInt(children[0].innerHTML));

    }
}

function readAll() {
    if (isTableHeadGenerated === false)
        generateTableHead();
    generateTableContents();
}

function add() {
    addRecord([document.getElementById('name').value, document.getElementById('surname').value],
        document.getElementById('phone').value,
        document.getElementById('email').value);

}

function addRandom() {
    var name = generateName();
    var phone = generatePhone();
    var domens = ["@abc.com", "@example.com", "@gmail.com", "@onet.pl", "@interia.pl", "@o2.pl"]
    var email = name[0].toLowerCase() + name[1].toLowerCase() + getRandomInt(40, 99).toString() + domens[getRandomInt(0, domens.length)];


    addRecord(name, phone, email);
}

function addRecord(name, phone, email) {
    var request = db.transaction(["client"], "readwrite")
        .objectStore("client")
        .add({
            name: name[0],
            surname: name[1],
            phone: phone,
            email: email
        });
}



function remove(key) {
    var request = db.transaction(["client"], "readwrite")
        .objectStore("client")
        .delete(key);



    generateTableContents()
}


// ----------------------- Creating table --------------------------
function generateTableHead() {
    const data = ["ID", "NAME", "SURNAME", "PHONE", "EMAIL", "OPTIONS"];
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

function generateTableContents(email = null) {
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
            cell.contentEditable = true;
            cell.appendChild(text);
            cell.addEventListener('input', edit)

            cell = row.insertCell();
            text = document.createTextNode(cursor.value.surname);
            cell.contentEditable = true;
            cell.appendChild(text);
            cell.addEventListener('input', edit)

            cell = row.insertCell();
            text = document.createTextNode(cursor.value.phone);
            cell.contentEditable = true;
            cell.appendChild(text);
            cell.addEventListener('input', edit)

            cell = row.insertCell();
            text = document.createTextNode(cursor.value.email);
            cell.contentEditable = true;
            cell.appendChild(text);
            cell.addEventListener('input', edit)

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

function filtering() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("filter");
    filter = input.value.toUpperCase();
    console.log(filter)
    table = document.getElementById("dblist").getElementsByTagName("tbody")[0];
    tr = table.getElementsByTagName("tr");
    for (j = 0; j < tr.length; j++) {
        td = tr[j].getElementsByTagName("td");
        for (i = 0; i < td.length; i++) {
            if (td[i]) {
                if (td[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                    console.log(td[i].innerHTML.toUpperCase())
                    tr[j].style.display = "";
                    break;
                } else {
                    tr[j].style.display = "none";
                }
            }
        }
    }
}

function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
  	return Math.floor(Math.random() * (max - min)) + min;
}

function generateName(){
	var name1 = ["Maciej","Waciej","Bartosz","Kartosz","Andrzej","Adam","Abam","Piotr", "Krzysztof", "Tomasz", "Paweł", "Jakub", "Marcin"];

	var name2 = ["Woźniak","Kowalczyk","Mowalczyk","Bilant","Wojtczak","Nowak","Kowal","Warzocha","Smith","Dickinson","Doker","Psikuta","Huk"];

	var name = [capFirst(name1[getRandomInt(0, name1.length + 1)]), capFirst(name2[getRandomInt(0, name2.length + 1)])];
	return name;

}

function generatePhone() {
    var phone = getRandomInt(100, 999).toString() + '-' + getRandomInt(100, 999).toString() + '-' + getRandomInt(100, 999).toString();
    return phone;
}

function getDbObjects(filter = (object) => true) {
    let ret = new Promise((res, rej) => {
        let objects = [];
        if (db) {
            var store = db.transaction('client', 'readonly').objectStore('client');
            store.openCursor().onsuccess = (e) => {
                var c = e.target.result;
                if (c) {
                    if (filter(c.value)) {
                        objects.push(c.value);
                    }
                    c.continue();
                } else {
                    res(objects);
                }
            };
        }
    });
    return ret;
}
window.onload = () => {
    worker = new Worker('worker.js');
    worker.onmessage = e => {
        var json = JSON.parse(e.data)
        console.log(json[2]["name"])
        document.getElementById("name").value = json[2]["name"];
        document.getElementById("surname").value = json[2]["surname"];
        document.getElementById("phone").value = json[2]["phone"];
        document.getElementById("email").value = json[2]["email"];
    }
    const triggerWorkerButton = document.getElementById('TriggerWorker');
    triggerWorkerButton.addEventListener('click', (e) => {
        getDbObjects().then((value) => {
            worker.postMessage(JSON.stringify(value))
        });
    });


    colorworker = new Worker('colorworker.js')
    const colorButton = document.getElementById('colorButton')
    colorButton.addEventListener('click', (e) => {
        var dict = {
            name: document.getElementById("name").value,
            surname: document.getElementById("surname").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            link: document.getElementById("photo").value
        }
        colorworker.postMessage(JSON.stringify(dict))

    });

    colorworker.addEventListener("message", colorworkerfunction)

}

function colorworkerfunction(e)
{
    let data = JSON.parse(e.data);
    let img = document.getElementById("imageDest");
    img.src = data['link']
    document.getElementById("backgroundDest").style.backgroundColor = "rgba("+data["R"]+","+data["G"]+","+data["B"]+",0.5)";
}




