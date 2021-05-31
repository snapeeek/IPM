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
    {name: "gopal", surname: "gogo", phone:'505-666-130', email: "gopal@tutorialspoint.com"},
    {name: "prasad", surname: "tudu", phone:'505-666-135',email: "prasad@tutorialspoint.com"}
];
var db;
var request = window.indexedDB.open("newDatabase", 1);

request.onerror = function (event) {
    console.error("Database error: " + event.target.errorCode);
};

request.onsuccess = function (event) {
    db = event.target.result;
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

function edit(cell, type) {
    console.log(cell);
    var transaction = db.transaction(["client"], "readwrite");
    var objectStore = transaction.objectStore("client");
    var children = cell.parentNode.cells;
    //console.log(children)
    //console.log(children[0].innerHTML)
    var request = objectStore.get(parseInt(children[0].innerHTML));



    request.onsuccess = function (event)  {
        var data = event.target.result
        if (type == 1)
            data.name = cell.innerText;
        else if (type == 2)
            data.surname = cell.innerText;
        else if (type == 3)
            data.phone = cell.innerText;
        else if (type == 4)
            data.email = cell.innerText;


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


    document.getElementById('name').value=name[0];
    document.getElementById('surname').value=name[1];
    document.getElementById('phone').value=phone;
    document.getElementById('email').value=email;
    //addRecord(name, phone, email);
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


    request.onsuccess = function (event) {
        console.log("Record added to database")
    };

    request.onerror = function (event) {
        console.log("Unable to add data\r");
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
            
            var nameCell;
            nameCell = row.insertCell();
            text = document.createTextNode(cursor.value.name);
            nameCell.contentEditable = true;
            nameCell.appendChild(text);
            nameCell.oninput = function() { edit(nameCell, 1)
            };

            var surnameCell;
            surnameCell = row.insertCell();
            text = document.createTextNode(cursor.value.surname);
            surnameCell.contentEditable = true;
            surnameCell.appendChild(text);
            surnameCell.oninput = function() { edit(surnameCell, 2)
            };

            var phoneCell;
            phoneCell = row.insertCell();
            text = document.createTextNode(cursor.value.phone);
            phoneCell.contentEditable = true;
            phoneCell.appendChild(text);
            phoneCell.oninput = function() { edit(phoneCell, 3)
            };

            var mailCell;
            mailCell = row.insertCell();
            text = document.createTextNode(cursor.value.email);
            mailCell.contentEditable = true;
            mailCell.appendChild(text);
            mailCell.oninput = function() { edit(mailCell, 4)
            };

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
window.onload = function() {
    var input = document.getElementById("filter");
    input.addEventListener("input", filtering);

    refreshClients();
};


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

function buy()
{
    var product = document.getElementById('warzywa').value
    var clientid = document.getElementById('users').value
    console.log(product);
    console.log(clientid);
    var objectStore = db.transaction("client").objectStore("client");
    var request = objectStore.get(parseInt(clientid));
    var opened = window.open("");
    request.onsuccess = function (event) {
        var data = event.target.result;

        opened.document.write("<html>" +
            "<head>" +
            "<title>Zakup</title>" +
            "</head>" +
            "<body><h1>Faktura</h1>" +
            "<table><tr><th>Name</th><th>Surname</th><th>Phone</th><th>Email</th><th>Product</th></tr>" +
            "<tr><td>" +
            data.name +
            "</td><td>" +
            data.surname +
            "</td>" +
            "<td>" +
            data.phone +
            "</td>" +
            "<td>" +
            data.email +
            "</td><td>" +
            product +
            "</td></tr></table>" +
            "</body>" +
            "</html>");
    }


}

function refreshClients() {
    var select = document.getElementById('users')
    if (db) {
        var objectStore = db.transaction("client").objectStore("client");
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var string = cursor.value.name + " " + cursor.value.surname;
                var option = document.createElement('option');
                option.appendChild(document.createTextNode(string));
                option.value = cursor.key;
                select.appendChild(option);
                cursor.continue()
            }
        }
    }
}




