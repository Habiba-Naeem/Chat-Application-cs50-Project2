// add_list_items() will create the list of channel when "Channel List" button is clicked
function add_list_items(data, list_div, ul){

    // When the div is not displayed
    if ( list_div.style.display === "none" ){

        // Remove the list items
        while ( ul.firstChild ) {
            ul.removeChild( ul.firstChild );
        };

        // Add channels to the list
        for ( let i = 0; i < data["list"].length; i++ ){

            const li = document.createElement('li');
            const a = document.createElement('a');

            // text contains the name of the channel
            var text = document.createTextNode(data["list"][i]);
           
            a.href = `/user/${localStorage.getItem("username")}/${data["list"][i]}`;
            a.appendChild(text);

            li.className = "listitems";
            li.appendChild(a);
    
            ul.append(li);

            // when the channel name is clicked 
            a.addEventListener("click", () => {
                localStorage.setItem("channel-name", a.innerHTML);
                console.log(localStorage.getItem("channel-name"));
            })
        }

        // to display the div
        list_div.style.display = "block";
    }
    // If the div was already displayed, then set it to none
    else{
        list_div.style.display = "none";
    }
    return false;  
}


document.addEventListener('DOMContentLoaded', () => {

    // buttons:
    var okay_button = document.querySelector("#confirm-user");
    var logout = document.querySelector("#logout");
    var create_channel_button = document.querySelector("#create-channel-button");
    var create = document.querySelector("#create");
    var emoji = document.querySelector("#emoji");
    var channel_list_button = document.querySelector("#channel-list");

    // input field
    var username = document.querySelector(".username");

    // div
    var create_channel_div = document.querySelector("#create-channel-div");
    var channel_list_div = document.querySelector("#channel-list-div");
    

    // unordered list 
    var channel_list_ul = document.querySelector('#channel-list-ul');
    
    // invisible side bar
    document.querySelector(".nav-left").style.visibility = "hidden";
    
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    

    // if user has logged in then show the side bar
    if(localStorage.getItem("username")){
        document.querySelector(".nav-left").style.visibility = "visible";
    }

    // user confirms the display name
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

    // if user logout then clear the localStorage
    if(logout){
        logout.addEventListener("click", () =>{
            localStorage.clear();
            window.location.replace('/logout');
        })
    };

    // to display the div where user can create a channel
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

    // to display the list of channels
    if (channel_list_button){

        channel_list_button.addEventListener("click", () =>{
            
            // Initialise a new request
            const request = new XMLHttpRequest();
            request.open('POST', '/channel-list');
            
            request.onload = () =>{
                // Extract JSON data from request
                const data = JSON.parse(request.responseText);   

                // sending the json response from server, the div to display channel list, and the unordered list
                add_list_items(data, channel_list_div, channel_list_ul);
            }
            request.send();
            return false;
        })
    }

    // when user creates a channel
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

    // add emoji to the text
    if (emoji){

        var div = document.querySelector("#emoji-div");

        // to create 16 emojis
        for ( let i = 0; i < 16; i++){

            var emo1 = document.createElement("button");
            emo1.id = "emos";

            if( i < 10){
                emo1.innerHTML = String.fromCodePoint('0x1F60'+i);
                console.log(emo1);
                div.appendChild(emo1);
            }
            // change i to hexadecimal
            else{
                hexString = i.toString(16).toUpperCase();
                emo1.innerHTML = String.fromCodePoint('0x1F60'+ hexString);
                console.log(emo1);
                div.appendChild(emo1);
            }
        }
        // when the smiley face emoji is clicked
        emoji.addEventListener("click", () => {
            if ( div.style.display === "none" ){
                div.style.display = "inline-block";
            }
            else{
                div.style.display = "none";
            }
            document.querySelector("#text").append(div);
        });

        // when user selects from the group of emojis
        var emos = document.querySelectorAll("#emos");
        if (emos){
            emos.forEach( emos => {
                emos.addEventListener("click", () =>{
                    document.querySelector("#message").value += emos.innerHTML;
                });
            })
        };
    };

    // previous 100 messages to be displayed
    if (localStorage.getItem("channel-name")){
        // display the fieldset
        document.querySelector("#text").style.display = "inline-block";

        // Initialise a new request
        const request = new XMLHttpRequest();
        request.open('POST', `/user/${localStorage.getItem("username")}/${localStorage.getItem("channel-name")}`);
        
        request.onload = () => {
            // Extract JSON data from request
            const data = JSON.parse(request.responseText);
            console.log(data);
            for (let i = 0; i < data["list_of_messages"].length ; i++){

                const p = document.createElement('p');
                const span1 = document.createElement('span');
                const span2 = document.createElement('span');


                var text = document.createTextNode(data["list_of_messages"][i]["text_message"]);
                console.log("existsit text :", text);
                p.appendChild(text);
                
                        
                var user =  document.createTextNode(data["list_of_messages"][i]["username"]);
                console.log(user);
                span1.appendChild(user);

                var time =  document.createTextNode(data["list_of_messages"][i]["time"]);
                console.log(time);
                span2.appendChild(time);


                const div = document.createElement('div');
                div.className = "messages-div";

                div.appendChild(p);
                div.appendChild(span1);
                div.appendChild(span2);
                document.querySelector(".all-messages").append(div);
                // bring the scroll bar to bottom
                document.querySelector(".all-messages").scrollTop = document.querySelector(".all-messages").scrollHeight;

            }
        }
        request.send();
    }

    // When connected, configure buttons
    socket.on('connect', () => {
        document.querySelector('#send-message').addEventListener("click", () => {
            const text_message = document.querySelector("#message").value;

            socket.emit('send message', {'text_message':text_message});
        });
    });

    // When a new message is announced, add to the unordered list
    socket.on('message', function(data){
        if (localStorage.getItem("channel-name") === data["channel_name"]){
            const p = document.createElement('p');
            const span1 = document.createElement('span');
            const span2 = document.createElement('span');

            var text = document.createTextNode(data["text_message"]);
            console.log("text:", text);
            p.appendChild(text);
            
            var user =  document.createTextNode(data["username"]);
            console.log(user);
            span1.appendChild(user);

            var time =  document.createTextNode(data["time"]);
            console.log(time);
            span2.appendChild(time);


            const div = document.createElement('div');
            div.className = "messages-div";

            div.appendChild(p);
            div.appendChild(span1);
            div.appendChild(span2);
            document.querySelector(".all-messages").append(div);
        }
    });

});
