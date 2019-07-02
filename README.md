# Project 2 - Flack

CS50 - Web Programming with Python and JavaScript

This project is a work messaging service that uses sockets.  Users are first asked to create a display name, then either choose a channel from a list, or create one of their own.  Then the user is taken to the main messaging application, where they can send messages on a specific channel, and broadcast that message to all other users on that same channel.

The index.js file is where most of the code is, and it handles the client side.  Here is where messages are sent to the server, received and processed for display.  The flack.py receives data from the client, and pretty much just adds, deletes information, then sends it back to the client.  The index.html is the main, and only page, and the css handles it's stylng.

For my personal touch, I chose to add a delete button to each message, where a user can delete his or her own message.  I was not able to figure out how to do the private messaging, or how to handle file uploads.  That's a TODO.

The working website is at https://flack.raphaeluziel.net.
