import os
import requests
import unicodedata as ud

from datetime import datetime
from flask import Flask, redirect, render_template, request, url_for, jsonify, session
from flask_session import Session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
socketio = SocketIO(app)

#list of users and channels 
user_list = []
channel_list = []

#dictionary to keep track of messages and users
textdict = {}


@app.route("/")
def index():

    #if user had joined a channel before, then display that channel
    if "channel_name" in session:
        return redirect(url_for('main_channel', username = session["username"], channel_name = session["channel_name"]))

    #if user has newly joined the application, the display the main page
    elif "username" in session:
        return redirect(url_for('main', username = session["username"]))

    #user has not joined the application, then display the page where user can login
    else:
        return render_template("index.html")

@app.route("/logout")
def logout():
    #forget user
    session.clear()
    return redirect(url_for('index'))

#for AJAX request 
@app.route("/sign", methods=["POST"])
def sign():

    #get username from html 
    username = request.form.get("username")
    
    if request.method == "POST":

        #check if username does not exist in list 
        if username not in user_list:

            #append and store in session
            user_list.append(username)
            session["username"] = username

            print("Session: " , session["username"])
            print(*user_list, sep='\n')

            return jsonify({"success":True})

        #if username exists in the list
        else:
            print(*user_list, sep='\n')
            return jsonify({"success":False})


#when user has provided a valid display name, then display the main.html
@app.route("/user/<string:username>")
def main(username):
    return render_template("main.html", username = username)

#for AJAX request
@app.route("/create-channel", methods=["POST"])
def create_channel():

    #get the channel name from html
    channel_name = request.form.get("channel-name")

    if request.method == "POST":

        #check if channel name does not exist in the list
        if channel_name not in channel_list:

            #append channel name and store in session
            channel_list.append(channel_name)
            session["channel_name"] = channel_name

            print("Session: " , session["channel_name"])
            print("channel list:")
            print(*channel_list, sep='\n')

            #make a key of the channel created in the textdict with empty array as its value
            textdict[channel_name] = []
            print("textdict:")
            print(textdict)

            return jsonify({"success":True} )
        
        else:
            print(*channel_list, sep='\n')
            return jsonify({"success":False})


#displaying the selected channel page
@app.route("/user/<username>/<channel_name>", methods=["GET", "POST"])
def main_channel(username, channel_name):

    if request.method == "GET":

        session["channel_name"] = channel_name
       
        print(f"Channel name:", session["channel_name"])
        print(f"Userame:", session["username"])
        print("channel list: ")
        print(*channel_list)
        print("textdict:")
        print(textdict)

        return render_template("main.html", channel_name = channel_name, username = username)
    
    #AJAX request to display previous messages. This will be generated from javascript file whenever a user goes to a channel
    elif request.method == "POST":
        return jsonify({'list_of_messages': textdict[ channel_list[ channel_list.index(session["channel_name" ] ) ] ]})
        

#for AJAX request 
@app.route("/channel-list", methods = ["POST"])
def channels():

    #display the list of channels
    print("channel list")
    print(*channel_list, sep='\n')

    return jsonify({
        "list":channel_list
    })


@socketio.on("send message")
def message(data):

    #the text any user enters 
    text_message = data["text_message"]
    print("text_message:")
    print(*text_message)
    
    #decode the emoji. Normal text will remain same, only the emojis will be decoded
    emoji = text_message.encode('latin1').decode("utf8")
    print(emoji)

    #current date and time
    time = datetime.now().strftime("%d-%m-%Y %H:%M")

    #a list of messages 
    list_of_messages = textdict[channel_list[ channel_list.index(session["channel_name" ] ) ]]

    list_of_messages.append({'text_message': emoji, 'username':session["username"], 'channel_name': session["channel_name"], 'time': time})
    print(list_of_messages)  
    
    #if length of messages reaches 100
    if len(list_of_messages) == 100: 
        del list_of_messages[0]

    text_list = {'text_message': emoji, 'username':session["username"], 'channel_name': session["channel_name"], 'time': time}
    
    emit("message", text_list, broadcast=True)


if __name__ == '__main__':
    app.run(debug=True)