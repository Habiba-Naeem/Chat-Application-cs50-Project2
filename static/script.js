var display_name = [];
document.addEventListener('DOMContentLoaded', () =>{
    
    // Connect to websocket
    //var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    document.querySelector(".submit").onclick = () =>{
        let name = document.querySelector(".name").value;
        display_name.push(name);
    
    /*document.querySelector("#form1").onsubmit = () => {
        let name = document.querySelector(".name").value;
        display_name.push(name);*/
        /*if (localStorage.getItem("name") == name){
            alert("Name exists");
        }
        else{
            display_name.push(name);
            localStorage.setItem("name", name);
        }*/
        /*
        for (let i = 0; i < display_name.length; i++ ){
            if ( name === display_name[i] ){
                alert("Name exists");
                break;
            }
            else{
                display_name.push(name);
                localStorage.setItem("name", name);
                break;
            }
        };*/
    };

});