let username;

function setUsername() {
    username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username);
        window.location.href = 'chat.html';
    } else {
        alert("Please enter a username");
    }
}

function createRoom() {
    const roomName = document.getElementById('roomName').value;
    const roomPassword = document.getElementById('roomPassword').value;
    if (roomName) {
        localStorage.setItem(roomName, JSON.stringify({
            password: roomPassword,
            messages: []
        }));
        joinRoom(roomName);
    } else {
        alert("Please enter a room name");
    }
}

function joinRoom(roomName) {
    roomName = roomName || document.getElementById('roomName').value;
    const roomPassword = document.getElementById('roomPassword').value;

    const roomData = JSON.parse(localStorage.getItem(roomName));
    if (roomData) {
        if (roomData.password && roomData.password !== roomPassword) {
            alert("Incorrect password for private room");
        } else {
            localStorage.setItem('currentRoom', roomName);
            displayMessages(roomData.messages);
        }
    } else {
        alert("Room does not exist");
    }
}

function displayMessages(messages) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.username}: ${message.text}`;
        messagesDiv.appendChild(messageElement);
    });
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput').value;
    const roomName = localStorage.getItem('currentRoom');
    if (messageInput && roomName) {
        const roomData = JSON.parse(localStorage.getItem(roomName));
        const message = { username: localStorage.getItem('username'), text: messageInput };
        roomData.messages.push(message);
        localStorage.setItem(roomName, JSON.stringify(roomData));
        displayMessages(roomData.messages);
        document.getElementById('messageInput').value = '';
    }
}

window.onload = function() {
    const currentRoom = localStorage.getItem('currentRoom');
    if (currentRoom) {
        const roomData = JSON.parse(localStorage.getItem(currentRoom));
        if (roomData) {
            displayMessages(roomData.messages);
        }
    }
}
