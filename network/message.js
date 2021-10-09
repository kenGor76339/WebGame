var messageManager = {}

messageManager["connect"] = e =>{
    const response = e
    if(sessionStorage.getItem("clientId") == null){
        sessionStorage.setItem("clientId",response.clientID)
        clientID = sessionStorage.getItem("clientId");
        
    }else{
        const payload = {
            "method":"idExist",
            "clientID":clientID,
            "deleteID":response.clientID
        }
        ws.send(JSON.stringify(payload))
        
    }
    console.log("Client ID : "+ clientID);
    if(window.location.pathname == "/Matching.html")joinSession()
    else getRoom()
    
}

messageManager["chat"] = e =>{
    const response = e
    textarea.value += response.content;
}

messageManager["createSuccessful"] = e =>{
    const response = e
    room = response.room
    console.log(response.room)
    sessionStorage.setItem("room",JSON.stringify(room))
}


messageManager["join"] = e =>{
    const response = e
    if(response.status == "fail"){
        console.log("Join fail : "+response.room)
        if(room == null){
            createSession()
        }else console.log("room : "+JSON.parse(sessionStorage.getItem("room")))
    }else{
        room = response.room
        console.log(response.room)
        if(room.clients.length == room.size)window.location.replace("BattleScene.html?roomID="+room.id);
    }
    
}


messageManager["update"] = response => {
    if(response.data != "")room.data = response.data
}

messageManager["getRoom"] = e => {
    const response = e
    if(response.status == "fail")window.location.replace("index.html");
    else{
        room = response.room
        startGame()
    }
    
}

messageManager["attack"] = response => {
    const data = response.data;
    
    move(data.pet,data.myteam,data.enemyTeam,data.myPosition,data.targetPosition,data.enemyPets)
    if(data.myteam == clientInfo.myteam.name){
        clientInfo.myteam.pets[getIndexByValue(clientInfo.myteam.pets , data.pet.id)] = data.pet
        clientInfo.enemyTeam.pets = data.enemyPets
    }else{
        clientInfo.myteam.pets = data.enemyPets
    }
}

