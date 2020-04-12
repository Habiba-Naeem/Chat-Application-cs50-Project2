var display_name = [];

document.addEventListener('DOMContentLoaded', () =>{
    var okay_button = document.querySelector('#name');
    var name = document.querySelector(".name");
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
                    display_name.push(name.value);
                    localStorage.setItem("name", name.value);
                    name.value = "";
                    okay_button.disabled = true;
                }
            }
            else{
                okay_button.disabled = true;
            }
        }
        
    }
    //start by loading the index page 

});