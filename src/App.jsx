import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = "YOUR_API_KEY";

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Gemini! Ask me anything!",
      sentTime: "just now",
      sender: "Gemini"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToGemini(message);
  };

  async function processMessageToGemini(message) {
    const apiRequestBody = {
      contents: [{
        parts: [{ text: message }]
      }]
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody)
        }
      );

      const data = await response.json();
      setMessages(prevMessages => [...prevMessages, {
        message: data.candidates[0].content.parts[0].text,
        sender: "Gemini"
      }]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
    }
  }

  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "700px"  }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="Gemini is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
