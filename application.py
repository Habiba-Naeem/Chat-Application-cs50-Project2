import os

from flask import Flask, redirect, render_template, request, url_for, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

display_name = []

@app.route("/")
def index():
    #return redirect(url_for("main"))
    return render_template("index.html")

@app.route("/sign", methods=["POST"])
def sign():

    name = request.form.get("name")
    
    if name not in display_name:
        display_name.append(name)
        print(*display_name, sep='\n')
        return jsonify({"success":True} )
    
    else:
        print(*display_name, sep='\n')
        return jsonify({"success":False})    

if __name__ == '__main__':
    app.run(debug=True)