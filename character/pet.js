class Pet {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.component = data.component;
        this.myteam = data.myteam;
        this.enemyTeam = data.enemyTeam;

        this.hp = this.component.head.hp;
        this.speed = this.component.feet.speed;
        this.attack = this.component.hand.attack;
        this.defence = this.component.body.defence;
        this.criticalA = this.component.tail.criticalA;


        this.position = data.position;
        this.state = data.state;
        this.setSkill(this.component)

    }

    setSkill(skill, index) { //for specific skill
        this.skill[index] = skill
    }

    spell(target, index) {
        return this.skill[index].action(target);
    }

    getCard() {
        return this.skill[Math.floor(Math.random() * this.skill.length)]
    }

    setSkill(component) {
        this.skill = []
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 3; j++) {
                this.skill[i * 3 + j] = component[Object.keys(component)[i]].skill[j]
                this.skill[i * 3 + j].action = component[Object.keys(component)[i]].skill[j].action.bind(this)
                
            }
        }
    }

    getSkill(number) {
        return this.skill[number]
    }

    getSkillSize() {
        return this.skill.length;
    }
}

var Allcomponent = {
    "head base": {
        hp: 10,
        skill: [
            {
                name: "head skill 01",
                action: e => {
                    alert("head skill 01")
                }
            },
            {
                name: "head skill 02",
                action: e => {
                    alert("head skill 02")
                }
            },
            {
                name: "head skill 03",
                action: e => {
                    alert("head skill 03")
                }
            }
        ]
    },
    "feet base": {
        speed: 10,
        skill: [
            {
                name: "feet skill 01",
                action: e => {
                    alert("feet skill 01")
                }
            },
            {
                name: "feet skill 02",
                action: e => {
                    alert("feet skill 02")
                }
            },
            {
                name: "feet skill 03",
                action: e => {
                    alert("feet skill 03")
                }
            }
        ]
    },
    "hand base": {
        attack: 10,
        skill: [
            {
                name: "hand skill 01",
                action: function() {
                    console.log("hand skill 01")
                    
                    const tmp = clientInfo.myteam.pets[getIndexByValue(clientInfo.myteam.pets , this.id)]

                    const pet = {
                        id: tmp.id,
                        HP: tmp.hp,
                        position: tmp.position,
                        src: null,
                        end: null,
                        speed: tmp.speed,
                        mytime: 1,
                        forward: null,
                        currentPos: { x: 0, y: 0 },
                        state: tmp.state,
                    }

                    const payload = {
                        pet : pet,
                        myteam : this.myteam,
                        enemyTeam : this.enemyTeam,
                        myPosition : this.position,
                        targetPosition : clientInfo.enemyTeam.pets[0].position,
                        enemyPets : clientInfo.enemyTeam.pets
                    }

                    pet_attack(payload)
                }
            },
            {
                name: "hand skill 02",
                action: e => {
                    alert("hand skill 02")
                }
            },
            {
                name: "hand skill 03",
                action: e => {
                    alert("hand skill 03")
                }
            }
        ]
    },
    "body base": {
        defence: 10,
        skill: [
            {
                name: "body skill 01",
                action: e => {
                    alert("body skill 01")
                }
            },
            {
                name: "body skill 02",
                action: e => {
                    alert("body skill 02")
                }
            },
            {
                name: "body skill 03",
                action: e => {
                    alert("body skill 03")
                }
            }
        ]
    },
    "tail base": {
        criticalA: 0.1,
        skill: [
            {
                name: "tail skill 01",
                action: e => {
                    alert("tail skill 01")
                }
            },
            {
                name: "tail skill 02",
                action: e => {
                    alert("tail skill 02")
                }
            },
            {
                name: "tail skill 03",
                action: e => {
                    alert("tail skill 03")
                }
            }
        ]
    }
}