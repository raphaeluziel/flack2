import os

# To enable websockets in VPS
import eventlet
from eventlet import wsgi

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

# This looks for secret stuff in a .env file
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

message_list = []

@app.route("/")
def index():
    return render_template("index.html")


# Server receives message sent by client
@socketio.on("process message")
def message(data):
    #print(data)
    message_list.append(data)
    #print("python - messages: {}".format(message_list))

    # Server sends client the data
    emit("information", message_list, broadcast=True)


if __name__ == "__main__":
    print("OK, it should be running")
    socketio.run(app, host='0.0.0.0')
