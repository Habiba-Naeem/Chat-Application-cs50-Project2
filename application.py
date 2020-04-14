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


@app.route("/sign", methods=["POST"])
def sign():

    username = request.form.get("username")
    
    if username not in user_list:
        user_list.append(username)
        session["username"] = username
        print("Session: " , session["username"])
        print(*user_list, sep='\n')
        return jsonify({"success":True} )
    
    else:
        print(*user_list, sep='\n')
        return jsonify({"success":False})    

@app.route("/user/<username>", methods=["GET", "POST"])
def main(username):
    return render_template("main.html")

if __name__ == '__main__':
    app.run(debug=True)