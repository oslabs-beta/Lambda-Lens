import { useState } from 'react';
import '../App.css';

const ChatContainer = () => {
    const [messages, setMessages] = useState<{ 
        role: 'user' | 'assistant';
        content: string 
    }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        setMessages(prevMessages => [
            ...prevMessages, 
            { role: 'user', content: input }
        ]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/data/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // console.log('Server response:', data);

            setMessages(prevMessages => [
                ...prevMessages, 
                // { role: 'user', content: input },
                { role: 'assistant', content: data.result || 'No response' }
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prevMessages => [
                ...prevMessages,
                { role: 'assistant', content: 'Assistant went wrong' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='chat-container'>
            <div className='chat-title'>Explore Your Metrics: Ask Me How! </div>
            <div id='chat' className='chat-window'>
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.role}`}>
                        <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
                        <p>{msg.content}</p>
                    </div>
                ))}
                {loading && <div className='chat-message assistant'><strong>Assistant:</strong><p>...</p></div>}
            </div>
            <div className='chat-input'>
                <input 
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Type your message here...'
                />
                <button onClick={handleSendMessage} disabled={loading}>Send</button>
            </div>
        </div>
    );
};

export default ChatContainer;