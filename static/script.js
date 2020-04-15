document.addEventListener('DOMContentLoaded', () =>{

    var okay_button = document.querySelector("#confirm-user");
    var username = document.querySelector(".username");
    var channel_name = document.querySelector("#channel_input");
    var create = document.querySelector("#create");
    // Connect to websocket
    //var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    
    // By default, submit button is disabled
    okay_button.disabled = true;
    create.disabled = true;

    // Enable button if there is some text in input field 
    username.onkeyup = function(e){
        
        // If spaces are given
        if ( e.which === 32 ){
            return false;
        }
        else{
            if ( username.value.length > 0 ){
                okay_button.disabled = false;
    
                // Now if button is clicked
                okay_button.onclick = () => {
                    okay_button.disabled = true;

                    // Initialise a new request
                    const request = new XMLHttpRequest();
                    request.open('POST', '/sign');

                    request.onload = () => {
                        
                        // Extract JSON data from request
                        const data = JSON.parse(request.responseText);
                    
                        if (data.success){
                            localStorage.setItem("username", username.value);
                            window.location.replace(`/user/${username.value}`);
                        }
                        else{
                            localStorage.clear();
                            alert("Please choose another display name");
                        }
                    }

                    // Data to send with request
                    const data = new FormData();
                    data.append('username', username.value);

                    // Send request
                    request.send(data);
                    return false; 
                }
            }
            else{
                okay_button.disabled = true;
            }
        }   
    }
    if(window.location.href === "http://localhost:5000/"){
        localStorage.clear();
        document.getElementById("nav-left").style.visibility = "hidden";
    }
    
    document.getElementById("#create-channel").onclick = () => {
        document.getElementById("#channel_input").style.display = "block";
        create.style.display = "block";
    }


    channel_name.onkeyup = function(e){
        
        // If spaces are given
        if ( e.which === 32 ){
            return false;
        }
        else{
            if ( channel_name.value.length > 0 ){
                create.disabled = false;
    
                // Now if button is clicked
                create.onclick = () => {
                    create.disabled = true;

                    // Initialise a new request
                    const request = new XMLHttpRequest();
                    request.open('POST', '/create-channel');

                    request.onload = () => {
                        
                        // Extract JSON data from request
                        const data = JSON.parse(request.responseText);
                    
                        if (data.success){
                            localStorage.setItem("channel", channel_name.value);
                            window.location.replace(`/user/${username.value}/${channel_name.value}`);
                        }
                        else{
                            localStorage.clear();
                            alert("Please choose another channel name");
                        }
                    }

                    // Data to send with request
                    const data = new FormData();
                    data.append('channel_name', channel_name.value);

                    // Send request
                    request.send(data);
                    return false; 
                }
            }
            else{
                create.disabled = true;
            }
        }   
    }

    if(localStorage.getItem("channel")){
        document.getElementById("heading").style.display = "none";
        document.getElementById("text").style.display = "block";
    }

});