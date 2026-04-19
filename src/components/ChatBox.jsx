import React, { useState } from 'react';

const ChatBox = ({ messages, onSendMessage, userId }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;
    onSendMessage(text);
    setText('');
  };

  return (
    <div className="chat-box">
      <div className="messages-container">
        {messages.map(msg => (
          <div key={msg.id} className={msg.userId === userId ? 'message my-message' : 'message other-message'}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
