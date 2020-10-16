import React, { useContext, useEffect, useState, useCallback } from "react";
import Contacts from "../components/Contacts";
import useLocalStorage from "../hooks/useLocalStorage";
import { useContacts } from "./ContactsProvider";
import { useSocket } from "./SocketProvider";

const ConversationsContext = React.createContext();

export function useConversations() {
  return useContext(ConversationsContext);
}

export function ConversationsProvider({ children, id }) {
  const [conversations, setConversations] = useLocalStorage(
    "conversations",
    []
  );
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const { contacts } = useContacts();
  const socket = useSocket();

  const createConversation = (recipients) => {
    setConversations((prevConversations) => [
      ...prevConversations,
      { recipients, messages: [] },
    ]);
  };

  const formattedConversations = conversations.map((convo, index) => {
    const recipients = convo.recipients.map((recipient) => {
      const contact = contacts.find((contact) => contact.id === recipient);

      const name = (contact && contact.name) || recipient;
      return { id: recipient, name };
    });

    const messages = convo.messages.map((message) => {
      const contact = contacts.find((contact) => contact.id === message.sender);

      const name = (contact && contact.name) || message.sender;
      const fromMe = id === message.sender;

      return { ...message, senderName: name, fromMe };
    });

    const selected = index === selectedConversationIndex;
    return { ...convo, messages, recipients, selected };
  });

  const addMessageToConversation = useCallback(
    ({ recipients, text, sender }) => {
      setConversations((prev) => {
        let madeChange = false;
        const newMessage = { sender, text };
        const newConvos = prev.map((convo) => {
          if (arrayEquality(convo.recipients, recipients)) {
            madeChange = true;
            return { ...convo, messages: [...convo.messages, newMessage] };
          }

          return convo;
        });

        if (madeChange) {
          return newConvos;
        } else {
          return [...prev, { recipients, messages: [newMessage] }];
        }
      });
    },
    [setConversations]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("receive-message", addMessageToConversation);

    return () => socket.off("receive-message");
  }, [socket, addMessageToConversation]);

  const sendMessage = (recipients, text) => {
    socket.emit("send-message", { recipients, text });

    addMessageToConversation({ recipients, text, sender: id });
  };

  const value = {
    conversations: formattedConversations,
    selectConversationIndex: setSelectedConversationIndex,
    selectedConversation: formattedConversations[selectedConversationIndex],
    createConversation,
    sendMessage,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

function arrayEquality(a, b) {
  if (a.length !== b.length) return false;

  a.sort();
  b.sort();

  return JSON.stringify(a) === JSON.stringify(b);
}
