import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('https://backend-75tr.onrender.com/api/messages/conversations');
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `https://backend-75tr.onrender.com/api/messages/project/${selectedConversation.projectId}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post('https://backend-75tr.onrender.com/api/messages', {
        projectId: selectedConversation.projectId,
        content: newMessage
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
      
      <div className="bg-white rounded-lg shadow-lg h-[600px] flex">
        {/* Conversations List */}
        <div className="w-1/3 border-r">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Conversations</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {conversations.map((conversation) => (
              <div
                key={conversation.projectId}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?.projectId === conversation.projectId ? 'bg-blue-50' : ''
                }`}
              >
                <h3 className="font-semibold">{conversation.projectTitle}</h3>
                <p className="text-sm text-gray-600">
                  {conversation.otherUserName}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(conversation.lastMessageAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b">
                <h3 className="font-semibold">{selectedConversation.projectTitle}</h3>
                <p className="text-sm text-gray-600">
                  Chat with {selectedConversation.otherUserName}
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 ${
                      message.senderId === selectedConversation.currentUserId ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
                        message.senderId === selectedConversation.currentUserId
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
