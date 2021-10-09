const http = require("http");
const app = require("express")();
var path = require('path');
var htmlPath = path.join(__dirname);
app.use(require("express").static(htmlPath));
app.listen(9091, () => console.log("Listening on http port 9091"));
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening.. on 9090"));

const clients = {};
const gameSesson = {};
var messageManager = {};

//Message-----------------------------------------------------------------------------------------------------------
messageManager["joinSession"] = e => {
    const result = e
    const clientid = result.clientID
    if (clients[clientid] == null) return false;
    const roomKeys = Object.getOwnPropertyNames(gameSesson);
    const pets = result.pets;
    let room;


    roomKeys.forEach(e => {

        if (gameSesson[e].clients.length < gameSesson[e].size && !(gameSesson[e].clients.includes(clientid))) {
            room = gameSesson[e];
            room.clients.push(clientid);
            room.data["blue team"] = {id:clientid,pets:pets};

            return false;
        }
    })

    if (room == null) {
        const payload = {
            "method": "join",
            "room": room,
            "status": "fail"
        }
        clients[clientid].connection.send(JSON.stringify(payload))
    } else {
        const payload = {
            "method": "join",
            "room": room,
            "status": "success"
        }

        room.clients.forEach(e => {
            const con = clients[e].connection;
            con.send(JSON.stringify(payload))
        })
        Update(room.id)
    }
}

messageManager["createSession"] = e => {
    const result = e
    const clientid = result.clientID
    const roomID = guid()
    const pets = result.pets;

    gameSesson[roomID] = {
        "id": roomID,
        "clients": [clientid],
        "data": {"red team":{id:clientid,pets:pets}},
        "size": 2
    }

    const payload = {
        "method": "createSuccessful",
        "room": gameSesson[roomID]
    }

    const con = clients[clientid].connection;
    con.send(JSON.stringify(payload))
    Update(roomID)
}

messageManager["Chat"] = () => {
    const result = e
    let content = result.clientID + " : " + result.content + "\n";

    result.room.data += content
    gameSesson[result.room.id].data = result.room.data
    const payload = {
        "method": "Chat",
        "content": content
    }
    const foo = Object.getOwnPropertyNames(clients);

    foo.forEach(c => {
        clients[c].connection.send(JSON.stringify(payload))
    })
}

messageManager["getRoom"] = e => {
    
    const result = e
    const room = gameSesson[result.roomID]

    if (room == null) {
        const payload = {
            "method": "getRoom",
            "status": "fail"
        }
        clients[result.clientId].connection.send(JSON.stringify(payload))
        return false;
    }
    if (room.clients.length == 2) {

        room.clients = []
    }

    const clientId = result.clientId
    room.clients.push(clientId)

    const payload = {
        "method": "getRoom",
        "room": room,
        "status": "success"
    }
    room.clients.forEach(e => {
        clients[e].connection.send(JSON.stringify(payload))
    })
}

messageManager["attack"] = result => {
    const data = result.data

    const payload = {
        "method": "attack",
        "data": data
    }

    result.room.clients.forEach(e => {
        clients[e].connection.send(JSON.stringify(payload))
    })
}

messageManager["idExist"] = e => {
    
    const result = e
    if (clients[result.clientID] == null) return false;
    clients[result.clientID].connection = clients[result.deleteID].connection;
    delete clients[result.deleteID]
}
//-------------------------------------------------------------------------------------


const wsServer = new websocketServer({
    "httpServer": httpServer
});
wsServer.on("request", request => {
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("Opened!"));
    connection.on("close", () => console.log("Closed!"));
    connection.on("message", message => {

        const result = JSON.parse(message.utf8Data);

        messageManager[result.method].call(this,result)
    });

    //generate a new clientId
    const clientId = guid();
    clients[clientId] = {
        "connection": connection
    };

    const payload = {
        "method": "connect",
        "clientID": clientId
    };
    //send back the client connect
    connection.send(JSON.stringify(payload));

});

function Update(roomID) {

    const room = gameSesson[roomID]

    const payload = {
        "method": "update",
        "data": room.data
    }
    room.clients.forEach(e => {
        clients[e].connection.send(JSON.stringify(payload))
    })
    setTimeout(Update, 1000, roomID)
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substring(0, 3) + "-" + S4() + S4() + S4()).toLocaleLowerCase();