document.addEventListener('DOMContentLoaded', () =>{

    var okay_button = document.querySelector('#name');
    var name = document.querySelector(".name");
    var old_user_button =  document.querySelector('#old-user');
    // Connect to websocket
    //var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    

    // By default, submit button is disabled
    okay_button.disabled = true;


    // Enable button if there is some text in input field 
    name.onkeyup = function(e){
        // If spaces are given
        if ( e.which === 32 ){
            return false;
        }
        else{
            if ( name.value.length > 0 ){
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
                        console.log(data);
                        if (data.success){
                            localStorage.setItem("name", name.value);
                            document.getElementById("display-name").style.visibility = "hidden";
                            document.getElementById("nav-left").style.visibility = "visible";
                        }
                        else{
                            alert("Please choose another display name")
                        }
                    }

                    // Data to send with request
                    const data = new FormData();
                    data.append('name', name.value);

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
    //start by loading the index page 

});