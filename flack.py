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


user_list = ["raphael", "genie", "joseph", "alegreroza"]
channel_list = ["Physics", "Coding", "Astronomy", "Books of the nineteenth century", "Folk music's relationships to rock", "Teaching high school physics", "Ballroom dancing"]
messages = {}

@app.route("/")
def index():
    return render_template("index.html")


# Client submits a username
@socketio.on("process user")
def username(data):
    if data not in user_list:
        user_list.append(data)
    emit("get users", user_list, broadcast=True)


# Client requests a channel
@socketio.on("process channel")
def channel(data):

    # Add channel if not in list
    if data not in channel_list and data != '':
        channel_list.append(data)

    # Sort list, ignoring case
    channel_list.sort(key=str.lower)

    # Send client the new list
    emit("get channels", channel_list, broadcast=True)


# Server receives message sent by client
@socketio.on("process message")
def message(data):

    # Add data to the message_list channel array, or create it
    if data["channel"] in messages:
        messages[data["channel"]].append(data)
    else:
        messages[data["channel"]] = [data]

    # Limit the number of messages stored in server
    limit = 100
    if len(messages[data["channel"]]) > limit:
        messages[data["channel"]].pop(0)

    # Server sends client the data
    emit("get messages", messages[data["channel"]], broadcast=True)


# Server deletes message
@socketio.on("delete message")
def delete(data):

    if data in messages[data["channel"]]:
        messages[data["channel"]].remove(data)

    # Server sends client the new message list
    emit("get messages", messages[data["channel"]], broadcast=True)


if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0')
