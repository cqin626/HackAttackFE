import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Messages from "../components/Messages";
import { fetchMessages, syncMessages } from "../services/messageService";

import type { Message } from "../types/messageType";

const MessagePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const syncAndFetch = async () => {
    try {
      await syncMessages();      // Wait for sync to complete
      const data = await fetchMessages();  // Then fetch messages
      setMessages(data);
    } catch (err) {
      console.error("Error syncing or fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  syncAndFetch();
}, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Your Current Messages</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Messages messages={messages} />
        )}
      </div>
    </>
  );
};

export default MessagePage;
