
document.getElementsByClassName("red")[1].innerHTML = "<div id='Pet01' class='Pet'><img src='https://www.w3schools.com/tags/img_girl.jpg'/></div>";
document.getElementsByClassName("blue")[4].innerHTML = "<div id='Pet02' class='Pet'><img style='filter: grayscale(100%)' src='https://www.w3schools.com/tags/img_girl.jpg'/></div>";

//test------------------------------------------
var i = 4;
function loopMove(){
    if(i==9)i = 0;
    move(i);
    i++;
}
//----------------------------------------------
var animState = {
    'idle' :  "https://www.w3schools.com/tags/img_girl.jpg",
    'backward' :  "https://www.w3schools.com/tags/img_girl.jpg",
    'attack' : "https://www.w3schools.com/jsref/hackanm.gif"
}
var Pet01 = {
    id:"Pet01",
    HP : 10,
    position:1,
    src : null,
    end : null,
    speed : 10,
    mytime : 1,
    forward : null,
    currentPos : {x:0,y:0},
    pet : document.getElementById("Pet01"),
    img : document.getElementById("Pet01").getElementsByTagName("img")[0],
    state : "idle"
};

var Pet02 = {
    id:"Pet02",
    HP : 10,
    position:4,
    src : null,
    end : null,
    speed : 10,
    mytime : 1,
    forward : null,
    currentPos : {x:0,y:0},
    pet : document.getElementById("Pet02"),
    img : document.getElementById("Pet02").getElementsByTagName("img")[0],
    state : "idle"
};
var IdToClass = {
    'Pet01' : Pet01,
    'Pet02' : Pet02
}



function move(ref,myteam,enemyTeam,position,target){

    var obj = ref;
    if(obj.state != "idle")return;
    obj.src = getPositionAtCenter(document.getElementsByClassName(myteam)[position]);
    obj.end = getPositionAtCenter(document.getElementsByClassName(enemyTeam)[target]);
    obj.forward = caldistance(obj.src,obj.end,obj.speed);
    obj.state = "forward";
    
    moveAnim();
    
    function attack(){
        obj.state = "attack";
        obj.img.src = animState[obj.state];
       setTimeout(() => {
            if(document.getElementsByClassName(enemyTeam)[target].getElementsByTagName("div").length != 0){
               
               var enemy = document.getElementsByClassName(enemyTeam)[target].getElementsByTagName("div")[0];
               
               var Enemy_obj = IdToClass[enemy.id];
               Enemy_obj.HP--;
               console.log("Enemy HP: "+Enemy_obj.HP)
            }
            
            //console.log("end attack");
            backward();
        }, 3000);
        
    }

    function backward(){
        var src = obj.end;
        var end = obj.src;
        
        obj.forward = caldistance(src,end,obj.speed);
        obj.state = "backward";
        obj.img.src = animState[obj.state];

        moveAnim();
    
    }

    function moveAnim(){
        
        obj.currentPos.x = obj.currentPos.x + obj.forward.x;
        obj.currentPos.y = obj.currentPos.y + obj.forward.y;
        obj.pet.style.left = obj.currentPos.x + "px";
        obj.pet.style.top = obj.currentPos.y + "px";
        
        obj.forward.d--;

        if(obj.forward.d != 0){
            setTimeout(moveAnim ,obj.mytime ,obj);
        }
        else {
            //console.log("end Move");
            if(obj.state == "forward")attack();
            if(obj.state == "backward")obj.state = "idle";
        }    
    }
} 



function getPositionAtCenter(element) {
    const {top, left, width, height} = element.getBoundingClientRect();
    return {
      x: left + width / 2,
      y: top + height / 2
      
    };
  }
  
 function caldistance(src,end,speed){
     var dist = Math.sqrt((end.x-src.x)*(end.x-src.x)+(end.y-src.y)*(end.y-src.y));
     var length = {
       x : (end.x-src.x)/Math.ceil(dist/speed),
       y : (end.y-src.y)/Math.ceil(dist/speed),
       d : Math.ceil(dist/speed)
   };
   return length;
 }
 