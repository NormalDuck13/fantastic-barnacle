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
        // Store room details in Firestore
        firebase.firestore().collection('rooms').doc(roomName).set({
            password: roomPassword
        });
        joinRoom(roomName);
    } else {
        alert("Please enter a room name");
    }
}

function joinRoom(roomName) {
    roomName = roomName || document.getElementById('roomName').value;
    const roomPassword = document.getElementById('roomPassword').value;

    firebase.firestore().collection('rooms').doc(roomName).get()
    .then(doc => {
        if (doc.exists) {
            const roomData = doc.data();
            if (roomData.password && roomData.password !== roomPassword) {
                alert("Incorrect password for private room");
            } else {
                localStorage.setItem('roomName', roomName);
                listenForMessages(roomName);
            }
        } else {
            alert("Room does not exist");
        }
    });
}

function listenForMessages(roomName) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    firebase.firestore().collection('rooms').doc(roomName).collection('messages').orderBy('timestamp')
    .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
            const message = doc.data();
            const messageElement = document.createElement('div');
            messageElement.textContent = `${message.username}: ${message.text}`;
            messagesDiv.appendChild(messageElement);
        });
    });
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput').value;
    const roomName = localStorage.getItem('roomName');
    if (messageInput && roomName) {
        firebase.firestore().collection('rooms').doc(roomName).collection('messages').add({
            username: localStorage.getItem('username'),
            text: messageInput,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById('messageInput').value = '';
    }
}
