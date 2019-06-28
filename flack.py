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

user_list = ["raphael", "genie", "joseph", "alegreroza", "max"]
channel_list = ["Physics", "Coding", "Astronomy", "Books of the nineteenth century", "Folk music's relationships to rock"]
message_list = {}

@app.route("/")
def index():
    return render_template("index.html")

# Client submits a username
@socketio.on("process user")
def username(data):
    if data not in user_list and data != '':
        user_list.append(data)
    emit("get users", user_list, broadcast=True)

# Client requests a channel
@socketio.on("process channel")
def channel(data):
    if data not in channel_list and data != '':
        channel_list.append(data)
    channel_list.sort()
    emit("get channels", channel_list, broadcast=True)


# Server receives message sent by client
@socketio.on("process message")
def message(data):

    # Add data to the message_list channel array, or create it
    if data["channel"] in message_list:
        message_list[data["channel"]].append(data)
    else:
        message_list[data["channel"]] = [data]

    # Server sends client the data
    emit("get messages", message_list[data["channel"]], broadcast=True)


if __name__ == "__main__":
    print("OK, it should be running")
    socketio.run(app, host='0.0.0.0')
