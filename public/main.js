// Connecting to socket.io
var socket = io();

// The username is requested, sent to the server and displayed in the title
var username = prompt('What\'s your username?');
socket.emit('new_client', username);
document.title = username + ' - ' + document.title;

// When a message is received it's inserted in the page
socket.on('message', function(data) {
   insertMessage(data.username, data.message)
})

// When a new client connects, the information is displayed
socket.on('new_client', function(username) {
    $('#chat_zone').prepend('<p><em>' + username + ' has joined the chat!</em></p>');
})

socket.on('disc', function(username) {
    $('#chat_zone').prepend('<p><em>' + username + ' has left the chat!</em></p>');
})

// When the form is sent, the message is sent and displayed on the page
$('#chat_form').submit(function () {
   var message = $('#message').val();
   socket.emit('message', message); // Sends the message to the others
   insertMessage(username, message); // Also displays the message on our page
   $('#message').val('').focus(); // Empties the chat form and puts the focus back on it
   return false; // Blocks 'classic' sending of the form
});

// Adds a message to the page
function insertMessage(username, message) {
   $('#chat_zone').prepend('<p><strong>' + username + ':</strong> ' + message + '</p>');
}   