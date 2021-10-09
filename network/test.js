var globalVar = {}

globalVar["test"] = function test(){
    console.log("work!")
}
globalVar["message1"] = function (method){
    return method
}

globalVar["show"] = e =>{
    console.log(e.data)
}

function main(){
    console.log("hi")
    const testdata = {"method":"show","data":"you done!"}

    /*var getProperty = function(propertyName,data){
        return globalVar[propertyName].call(this,data)
    }*/

    globalVar["show"].call(this,testdata)
}

main()
