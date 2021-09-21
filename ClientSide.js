
let ws = new WebSocket("ws://138.19.212.222:9090");
//console.log(ws)

let clientID = null;
let room = null;
let clientInfo = null;

const fname = document.getElementById("fname");
const btnSub = document.getElementById("btnSub");
const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
let textarea = document.getElementById("w3review");

function pet01_attack(){
    let pet = clientInfo.pets[clientInfo.myteam]
    if(pet.state == "idle"){
        const payload = {
            "method":"attack",
            "data":clientInfo
        }
        ws.send(JSON.stringify(payload))
    }
    //console.log(pet.state)
}

//sent
if(btnJoin != null)btnJoin.addEventListener("click", e=>{
    joinSession()
})

function joinSession(){
    if(room == null){
        const payload = {
            "method":"joinSession",
            "clientID":clientID
        }
        ws.send(JSON.stringify(payload))
    }else
    console.log("Already join")
}

if(btnCreate != null)btnCreate.addEventListener("click", e=>{
    createSession()
})

function createSession(){
    if(room == null){
        const payload = {
            "method" : "createSession",
            "clientID" : clientID
        }
        ws.send(JSON.stringify(payload))
    }else
    console.log("Already create")
}

if(btnSub != null)btnSub.addEventListener("click", e =>{
    if(room != null){
        const payload = {
            "method" : "Chat",
            "content" : fname.value,
            "clientID" : clientID,
            "room" : room
        }
        
        ws.send(JSON.stringify(payload))
    }else
    console.log("room is null")
})

function getRoom(){
    
    let roomId = new URLSearchParams(window.location.search).get("roomID")
    if(roomId == null){
        window.location.replace("index.html");
        return false;
    }
    const payload = {
        "method":"getRoom",
        "clientId":clientID,
        "roomID":roomId
    }

    ws.send(JSON.stringify(payload))
    
}

function startGame(){
    let mapToTeam = {
        "0":"blue",
        "1":"red"
    }

    const data = {
        "clientId":clientID,
        "myteam":mapToTeam[room.clients.indexOf(clientID)],
        "enemyTeam":mapToTeam[1-room.clients.indexOf(clientID)],
        "pets":{"red":Pet01,"blue":Pet02},
        "room":room
    }
    clientInfo = data;
}

//receive
ws.onmessage = message =>{
    const response = JSON.parse(message.data);
    

    //connection
    if(response.method === "connect"){
        clientID = response.clientID;
        console.log("Client ID : "+ clientID);
        if(window.location.pathname == "/Matching.html")joinSession()
        else getRoom()
    }
    //Chat room
    if(response.method === "Chat"){
        textarea.value += response.content;
    }
    //create Success
    if(response.method === "createSuccessful"){
        room = response.room
        console.log(response.room)
    }
    //join Success
    if(response.method === "joinSuccessful"){
        room = response.room
        console.log(response.room)
        if(room.clients.length == room.size)window.location.replace("BattleScene.html?roomID="+room.id);
    }
    //join Fail
    if(response.method === "joinFail"){
        console.log("Join fail : "+response.room)
        createSession()
    }
    //update
    if(response.method === "update"){
        room.data = response.data
        if(textarea != null)textarea.value = room.data;
    }
    //getRoom
    if(response.method === "getRoom"){
        room = response.room
        //console.log("get room successful")
        //console.log(room)
        startGame()
    }
    //attack
    if(response.method === "attack"){
        //console.log("attack now!")
        if(response.data.clientId == clientID)clientInfo = response.data
        let yourPet = response.data.pets[response.data.myteam]
        let enemyPet = response.data.pets[response.data.enemyTeam]
        yourPet.pet = document.getElementById(yourPet.id)
        enemyPet.pet = document.getElementById(enemyPet.id)
        move(yourPet,response.data.myteam,response.data.enemyTeam,yourPet.position,enemyPet.position)
    }
}


