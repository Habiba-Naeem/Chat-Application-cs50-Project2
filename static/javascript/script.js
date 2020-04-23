function add_list_items(data, list_div, ul){

    if ( list_div.style.display === "none" ){

        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }

        for ( let i = 0; i < data["list"].length; i++ ){
            const li = document.createElement('li');
            const a = document.createElement('a');

            var text = document.createTextNode(data["list"][i]);
            
            a.href = `/user/${localStorage.getItem("username")}/${data["list"][i]}`;
            a.appendChild(text);

            li.className = "listitems";
            li.appendChild(a);
    
            ul.append(li);
        }
        list_div.style.display = "block";
    }
    else{
        list_div.style.display = "none";
    }
    return false;  
}


document.addEventListener('DOMContentLoaded', () => {
    var okay_button = document.querySelector("#confirm-user");
    var username = document.querySelector(".username");

    var create_channel_button = document.querySelector("#create-channel-button");
    var create_channel_div = document.querySelector("#create-channel-div");
    var create = document.querySelector("#create");
    var channel_list_button = document.querySelector("#channel-list");
    var channel_list_div = document.querySelector("#channel-list-div");
    var channel_list_ul = document.querySelector('#channel-list-ul');
    //document.querySelector(".nav-left").style.visibility = "hidden";
    
    if(okay_button){
        okay_button.addEventListener("click", () => {
            // Initialise a new request
            const request = new XMLHttpRequest();
            request.open('POST', '/sign');
            
            request.onload = () =>{
                // Extract JSON data from request
                const data = JSON.parse(request.responseText);
                        
                if (data.success){
                    localStorage.setItem("username", username.value);
                    window.location.replace(`/user/${username.value}`);
                }
                else{
                    alert("Please choose another display name");
                }
            }
            // Data to send with request
            const data = new FormData();
            data.append('username', username.value);
    
            // Send request
            request.send(data);
            return false;
        })
    };

    if(create_channel_button){
        create_channel_button.addEventListener("click", () => {
            if ( create_channel_div.style.display === "none" ){
                create_channel_div.style.display = "block";
            }
            else{
                create_channel_div.style.display = "none";
            }
        });
    };

    if(create){
        create.addEventListener("click", () => {
            // Initialise a new request
            const request = new XMLHttpRequest();
            request.open('POST', '/create-channel');
            
            request.onload = () =>{
                // Extract JSON data from request
                const data = JSON.parse(request.responseText);
                        
                if (data.success){
                    localStorage.setItem("channel-name", document.querySelector("#channel-input").value)
                    window.location.replace(`/user/${localStorage.getItem("username")}/${localStorage.getItem("channel-name")}`);
                }
                else{
                    alert("Please choose another channel name or join the existing channel");
                }
            }
            // Data to send with request
            const data = new FormData();
            data.append('channel-name', document.querySelector("#channel-input").value);
    
            // Send request
            request.send(data);
            return false;
        })
    };

    if (localStorage.getItem("channel-name")){
        document.querySelector("#text").style.display = "inline-block";
    }
    
    if (channel_list_button){

        channel_list_button.addEventListener("click", () =>{
            // Initialise a new request
            const request = new XMLHttpRequest();
            request.open('POST', '/channel-list');
            
            request.onload = () =>{
                // Extract JSON data from request
                const data = JSON.parse(request.responseText);   
                add_list_items(data, channel_list_div, channel_list_ul);
            }
            request.send();
            return false;
        })
    }
});
