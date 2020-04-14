document.addEventListener('DOMContentLoaded', () =>{

    var okay_button = document.querySelector('#confirm-user');
    var username = document.querySelector(".username");

    //document.getElementById("nav-left").style.visibility = "hidden";
    // Connect to websocket
    //var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    
    // By default, submit button is disabled
    okay_button.disabled = true;


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
   
});