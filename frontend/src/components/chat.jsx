'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://195.49.210.50:9000');

export default function ChatComponent({ client }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [onlineStatus, setOnlineStatus] = useState({});
    const [typingTimeout, setTypingTimeout] = useState(null);

    useEffect(() => {
        socket.on('message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        socket.on('clients', (clients) => {
            setOnlineStatus(clients);
        });

        return () => {
            socket.off('message');
            socket.off('clients');
        };
    }, []);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        if (typingTimeout) clearTimeout(typingTimeout);
        socket.emit('typing', true);

        setTypingTimeout(setTimeout(() => {
            socket.emit('typing', false);
        }, 5000));
    };

    const handleSendMessage = () => {
        socket.emit('message', { client, message });
        setMessage("");
        socket.emit('typing', false);
    };

    return (
        <div className="flex h-screen w-full flex-col">
            <header className="flex items-center gap-3 border-b bg-gray-100 px-4 py-3">
                <div className="flex-shrink-0">
                    <div className="relative w-10 h-10">
                        <img src="/favicon.ico" alt="Chat partner" className="w-full h-full rounded-full border-2 border-gray-200" />
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full text-sm font-medium text-gray-600">CP</div>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium">Chat Partner</h3>
                        <div className={`h-2 w-2 rounded-full ${Object.values(onlineStatus).some(status => status.online) ? 'bg-green-500' : 'bg-gray-500'}`} />
                    </div>
                    <p className="text-sm text-gray-500">
                        {Object.entries(onlineStatus).map(([id, status]) => {
                            if (id !== socket.id && status.online) {
                                return status.isTyping ? 'печатает...' : 'Online';
                            }
                            return null;
                        })}
                    </p>
                </div>
            </header>
            <div className="flex-1 overflow-auto p-4">
                <div className="grid gap-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.client === client ? 'justify-end' : 'items-start'} gap-3`}>
                            {msg.client !== client && (
                                <div className="relative w-10 h-10">
                                    <img src="/favicon.ico" alt="Chat partner" className="w-full h-full rounded-full border-2 border-gray-200" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full text-sm font-medium text-gray-600">CP</div>
                                </div>
                            )}
                            <div className={`grid gap-2 rounded-lg ${msg.client === client ? 'bg-blue-100' : 'bg-gray-100'} p-3 text-sm`}>
                                <p>{msg.message}</p>
                                <p className="text-gray-500">10:30 AM</p>
                            </div>
                            {msg.client === client && (
                                <div className="relative w-10 h-10">
                                    <img src="/favicon.ico" alt="You" className="w-full h-full rounded-full border-2 border-gray-200" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full text-sm font-medium text-gray-600">YO</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="border-t bg-gray-100 px-4 py-3">
                <div className="relative">
                    <textarea
                        placeholder="Type your message..."
                        name="message"
                        id="message"
                        rows={1}
                        value={message}
                        onChange={handleMessageChange}
                        className="min-h-[48px] w-full rounded-2xl resize-none p-4 border border-gray-200 border-neutral-400 shadow-sm pr-16"
                    />
                    <button
                        type="button"
                        onClick={handleSendMessage}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600"
                    >
                        <SendIcon className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function SendIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    );
}
