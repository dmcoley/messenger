// Connecting to socket.io
var socket = io();

// The username is requested, send to the server and display in the title
var username = prompt('What\'s your username?');
socket.emit('new_client', username);
document.title = username + ' - ' + document.title;
addUser(username);

// When a message is received it's inserted in the page
socket.on('message', function(data) {
   insertMessage(data.username, data.message)
})

// When a new client connects, the information is displayed
socket.on('new_client', function(username, all_users) {
	insertMessage(username + " has joined the chat!");
    updateUsers(all_users);
})

// Update the active users in the view when a client disconnects
socket.on('disc', function(username, all_users) {
	insertMessage(username + " has left the chat!");
    updateUsers(all_users);
})

// Update the active users in the view when a new client logs in
socket.on('login', function(all_users) {
	updateUsers(all_users);
})

// When the form is sent, the message is sent and displayed on the page
$('#chat_form').submit(function () {
   var message = $('#message').val();
   socket.emit('message', message); 
   insertMessage(username, message);
   $('#message').val('').focus();
   return false; // Blocks 'classic' sending of the form
});

// Adds a message to the page
function insertMessage(username, message) {
   // Update the Angular.js controller and eagerly apply it
   angular.element($('#chat_form')).scope().$apply(function() {
   	angular.element($('#chat_form')).scope().messages.push({
      Name: username,
      Message: message
    })});
} 

// Updates the users in the view to be the passed in collection of users
function updateUsers(usernames) {
	// Remove old users
	var listItems = $("#online_users li");
	var prevUsers = [];
	listItems.each(function(idx, li) {
	    var curr = $(li);
	    var name = curr.context.innerText;
	    prevUsers.push(name);
	    if (usernames.indexOf(name) == -1) {
	    	curr.remove();
	    }
	});

	// Add new users
	usernames.forEach(function(user) {
		if (prevUsers.indexOf(user) == -1) {
			addUser(user);
		}
	});
}  

// Adds the given user to the view
function addUser(user) {
	$('#online_users').append('<li><h1>' + user + '</h1></li>');
}