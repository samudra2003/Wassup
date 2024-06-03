const socket = io();
let username;
let textarea = document.querySelector('#textarea');
let messagearea = document.querySelector('.message_area');

do {
    username = prompt('Please enter your name:');
} while (!username);

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
});

function sendMessage(message) {
    let msg = {
        user: username,
        message: message.trim()
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
    let className = type;
    mainDiv.classList.add(className, 'message');
    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messagearea.appendChild(mainDiv);
}

// Receive the message
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

function scrollToBottom() {
    messagearea.scrollTop = messagearea.scrollHeight;
}
