import os

from flask import Flask, redirect, render_template, request, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

display_name = []

@app.route("/", methods=["POST","GET"])
def index():

    if request.method == "POST":
        name_exists = False
        for i in range(len(display_name)):

            if request.form.get("display-name") == display_name[i]:
                name_exists = True
            else:
                name_exists = False    
        
        if name_exists == False:
            display_name.append(request.form.get("display-name"))
            
            return redirect(url_for("main"))

    return render_template("index.html")

@app.route("/main", methods=["POST","GET"])
def main():
    return render_template("index.html", name_exists = True )

if __name__ == '__main__':
    app.run(debug=True)