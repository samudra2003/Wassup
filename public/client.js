const socket = io();
let username;
const textarea = document.querySelector('#textarea');
const messageArea = document.querySelector('.message_area');
let audio = new Audio('/facebook_chat.mp3');  


audio.preload = 'auto';

do {
    username = prompt('Please enter your name:');
} while (!username.trim());

socket.emit('join', username);

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
        sendMessage(e.target.value);
    }
});

function sendMessage(message) {
    let msg = {
        user: username,
        message: sanitizeInput(message.trim()),
        timestamp: new Date().toLocaleTimeString()
    };
    // Append message
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();
    // Send to server
    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    mainDiv.classList.add(type, 'message');

    let markup;
    if (msg.user === 'Admin') {
        markup = `
            <p class="system-message">${msg.message} <span>${msg.timestamp}</span></p>
        `;
    } else {
        markup = `
            <h4>${msg.user}</h4>
            <p>${msg.message} <span>${msg.timestamp}</span></p>
        `;
    }

    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
    
    if (type === 'incoming') {
        audio.play();
    }
}

// Receive the message
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Sanitize user input to prevent XSS attacks
function sanitizeInput(input) {
    const tempDiv = document.createElement('div');
    tempDiv.textContent = input;
    return tempDiv.innerHTML;
}
