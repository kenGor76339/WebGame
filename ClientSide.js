
let ws = new WebSocket("ws://138.19.212.222:9090");
//console.log(ws)

let clientID = sessionStorage.getItem("clientId");
let room = JSON.parse(sessionStorage.getItem("room"));
let clientInfo = null;


function joinSession() {

    if (room == null) {
        const pets = JSON.parse(sessionStorage.getItem("pets"));

        const payload = {
            "method": "joinSession",
            "clientID": clientID,
            "pets": pets
        }
        ws.send(JSON.stringify(payload))
    } else
        console.log("Already join %o", room)
}

function createSession() {
    if (room == null) {
        const pets = JSON.parse(sessionStorage.getItem("pets"));

        const payload = {
            "method": "createSession",
            "clientID": clientID,
            "pets": pets
        }
        ws.send(JSON.stringify(payload))
    } else
        console.log("Already create")
}

function getRoom() {

    let roomId = new URLSearchParams(window.location.search).get("roomID")
    if (roomId == null) {
        window.location.replace("index.html");
        return false;
    }
    const payload = {
        "method": "getRoom",
        "clientId": clientID,
        "roomID": roomId
    }

    ws.send(JSON.stringify(payload))

}

function startGame() {
    let mapToTeam = {
        "0": "blue team",
        "1": "red team",
    }

    const myteam = mapToTeam[room.clients.indexOf(clientID)]
    const enemyTeam = mapToTeam[1 - room.clients.indexOf(clientID)]

    const data = {
        "clientId": clientID,
        "myteam": { name: myteam, pets: room.data[myteam].pets },
        "enemyTeam": { name: enemyTeam, pets: room.data[enemyTeam].pets },
        "room": room
    }
    clientInfo = data;


    for (let i = 0; i < clientInfo.myteam.pets.length; i++) {
        SetupPet(i)
        for (let a = 1; a <= 3; a++) {
            let element = document.getElementById("card" + i + a)
            let func = null;
            if (a == 1) {
                func = clientInfo.myteam.pets[i].getSkill(6)

            }
            else func = clientInfo.myteam.pets[i].getCard()

            element.onclick = func.action
            element.innerHTML = "<h1 style='color:red'>" + func.name + "</h1>"
        }
        let element = document.getElementsByClassName(clientInfo.myteam.name)[clientInfo.myteam.pets[i].position]
        element.innerHTML = "<div id='" + clientInfo.myteam.pets[i].id + "' class='Pet'><img style='z-index:1' src='Texture/test.gif'></div>"
        element = document.getElementsByClassName(clientInfo.enemyTeam.name)[clientInfo.enemyTeam.pets[i].position]
        element.innerHTML = "<div id='" + clientInfo.enemyTeam.pets[i].id + "' class='Pet'><img style='filter: grayscale(100%);z-index:2' src='Texture/test.gif'></div>"
    }
}

function printTest() {
    console.log(room)
}

function SetupPet(i) {
    clientInfo.myteam.pets[i].component.head = Allcomponent[clientInfo.myteam.pets[i].component.head];
    clientInfo.myteam.pets[i].component.feet = Allcomponent[clientInfo.myteam.pets[i].component.feet];
    clientInfo.myteam.pets[i].component.hand = Allcomponent[clientInfo.myteam.pets[i].component.hand];
    clientInfo.myteam.pets[i].component.body = Allcomponent[clientInfo.myteam.pets[i].component.body];
    clientInfo.myteam.pets[i].component.tail = Allcomponent[clientInfo.myteam.pets[i].component.tail];
    clientInfo.myteam.pets[i].myteam = clientInfo.myteam.name;
    clientInfo.myteam.pets[i].enemyTeam = clientInfo.enemyTeam.name;

    clientInfo.myteam.pets[i] = new Pet(clientInfo.myteam.pets[i])

    clientInfo.enemyTeam.pets[i].component.head = Allcomponent[clientInfo.enemyTeam.pets[i].component.head];
    clientInfo.enemyTeam.pets[i].component.feet = Allcomponent[clientInfo.enemyTeam.pets[i].component.feet];
    clientInfo.enemyTeam.pets[i].component.hand = Allcomponent[clientInfo.enemyTeam.pets[i].component.hand];
    clientInfo.enemyTeam.pets[i].component.body = Allcomponent[clientInfo.enemyTeam.pets[i].component.body];
    clientInfo.enemyTeam.pets[i].component.tail = Allcomponent[clientInfo.enemyTeam.pets[i].component.tail];
    clientInfo.enemyTeam.pets[i].myteam = clientInfo.enemyTeam.name;
    clientInfo.enemyTeam.pets[i].enemyTeam = clientInfo.myteam.name;

    clientInfo.enemyTeam.pets[i] = new Pet(clientInfo.enemyTeam.pets[i])
}

function pet_attack(data) {
    if (data.pet.state == "idle") {
        const payload = {
            "method": "attack",
            "data": data,
            "room":room
        }
        ws.send(JSON.stringify(payload))
    }
}

//receive
ws.onmessage = message => {
    const response = JSON.parse(message.data);

    messageManager[response.method].call(this, response)
}


