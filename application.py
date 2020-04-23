import os

from flask import Flask, redirect, render_template, request, url_for, jsonify, session
from flask_session import Session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
socketio = SocketIO(app)

user_list = []
channel_list = []

@app.route("/")
def index():

    if session:
        return redirect(url_for('main', username = session["username"]))

    return render_template("index.html")

@app.route("/logout")
def logout():

    #forget user
    session.clear()
    return redirect(url_for('index'))


@app.route("/sign", methods=["POST", "GET"])
def sign():
    username = request.form.get("username")
    
    if request.method == "POST":
        if username not in user_list:
            user_list.append(username)
            session["username"] = username
            print("Session: " , session["username"])
            print(*user_list, sep='\n')
            return jsonify({"success":True})
            #return redirect(url_for('main', username = username ))
        else:
            print(*user_list, sep='\n')
            return jsonify({"success":False})

@app.route("/user/<string:username>")
def main(username):
    return render_template("main.html", username = username)

@app.route("/create-channel", methods=["POST"])
def create_channel():
    channel_name = request.form.get("channel-name")
    if request.method == "POST":
        if channel_name not in channel_list:
            channel_list.append(channel_name)
            session["channel_name"] = channel_name
            print("Session: " , session["channel_name"])
            print(*channel_list, sep='\n')
            return jsonify({"success":True} )
        
        else:
            print(*channel_list, sep='\n')
            return jsonify({"success":False})

@app.route("/user/<username>/<channel_name>", methods=["GET", "POST"])
def main_channel(username, channel_name):
    return render_template("main.html", channel_name = channel_name)

@app.route("/channel-list", methods = ["POST"])
def channels():
    print(*channel_list, sep='\n')
    return jsonify({
        "list":channel_list
    })

if __name__ == '__main__':
    app.run(debug=True)