
//test------------------------------------------
var i = 4;
function loopMove() {
    if (i == 9) i = 0;
    move(Pet01, "red", "blue", 1, 5);
    i++;
}
//----------------------------------------------
var animState = {
    'idle': "Texture/test.gif",
    'backward': "Texture/test.gif",
    'attack': "https://www.w3schools.com/jsref/hackanm.gif"
}

function getIndexByValue(array, value) {
    return array.indexOf(array.find(element => element.id === value));
}

function move(pet, myteam, enemyTeam, Myposition, targetposition, enemyPets) {
    let ref = pet
    
    if (ref.state != "idle") return;
    ref["pet"] = document.getElementById(ref.id)
    ref["img"] = document.getElementById(ref.id).getElementsByTagName("img")[0]
    ref.src = getPositionAtCenter(document.getElementsByClassName(myteam)[Myposition]);
    ref.end = getPositionAtCenter(document.getElementsByClassName(enemyTeam)[targetposition]);
    ref.forward = caldistance(ref.src, ref.end, ref.speed);
    ref.state = "forward";

    moveAnim();

    function attack() {
        ref.state = "attack";
        ref.img.src = animState[ref.state];

        setTimeout(() => {
            if (document.getElementsByClassName(enemyTeam)[targetposition].getElementsByTagName("div").length != 0) {

                var enemy = document.getElementsByClassName(enemyTeam)[targetposition].getElementsByTagName("div")[0];

                const pets = enemyPets;
                var Enemy_obj = pets[getIndexByValue(pets , enemy.id)];
                Enemy_obj.hp--;
                console.log("Enemy HP: " + Enemy_obj.hp)
            }
            backward();
        }, 3000);

    }

    function backward() {
        var src = ref.end;
        var end = ref.src;

        ref.forward = caldistance(src, end, ref.speed);
        ref.state = "backward";
        ref.img.src = animState[ref.state];

        moveAnim();
    }

    function moveAnim() {

        ref.currentPos.x = ref.currentPos.x + ref.forward.x;
        ref.currentPos.y = ref.currentPos.y + ref.forward.y;
        ref.pet.style.left = ref.currentPos.x + "px";
        ref.pet.style.top = ref.currentPos.y + "px";

        ref.forward.d--;

        if (ref.forward.d != 0) {
            setTimeout(moveAnim, ref.mytime, ref);
        }
        else {
            if (ref.state == "forward") attack();
            if (ref.state == "backward") ref.state = "idle";
        }
    }
}



function getPositionAtCenter(element) {
    const { top, left, width, height } = element.getBoundingClientRect();
    return {
        x: left + width / 2,
        y: top + height / 2

    };
}

function caldistance(src, end, speed) {
    var dist = Math.sqrt((end.x - src.x) * (end.x - src.x) + (end.y - src.y) * (end.y - src.y));
    var length = {
        x: (end.x - src.x) / Math.ceil(dist / speed),
        y: (end.y - src.y) / Math.ceil(dist / speed),
        d: Math.ceil(dist / speed)
    };
    return length;
}
