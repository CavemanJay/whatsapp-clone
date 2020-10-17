import React, { useContext, useEffect, useState, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { Contact, Conversation, Message } from "../models";
import { ContactContext, useContacts } from "./ContactsProvider";
import { useSocket } from "./SocketProvider";

export interface ConversationContext {
  conversations: Conversation[];
  selectConversationIndex: Function;
  selectedConversation: Conversation;
  createConversation: Function;
  sendMessage: Function;
}

const ConversationsContext = React.createContext<
  ConversationContext | undefined
>(undefined);

export function useConversations() {
  return useContext(ConversationsContext);
}

export const ConversationsProvider: React.FC<React.PropsWithChildren<{
  id: string;
}>> = ({ children, id }) => {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>(
    "conversations",
    [{ messages: [], recipients: ["all"], selected: true }]
  );

  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const { contacts } = useContacts() as ContactContext;
  const socket = useSocket();

  const createConversation = (recipients: Contact[]) => {
    setConversations((prevConversations: Conversation[]) => [
      ...prevConversations,
      { recipients, messages: [] },
    ]);
  };

  const formattedConversations = conversations.map(
    (convo: Conversation, index: number) => {
      const recipients = convo.recipients.map((recipient: string) => {
        const contact = contacts.find(
          (contact: Contact) => contact.id === recipient
        );

        const name = (contact && contact.name) || recipient;
        return { id: recipient, name };
      });

      const messages = convo.messages.map((message: Message) => {
        const contact = contacts.find(
          (contact: Contact) => contact.id === message.sender
        );

        const name = (contact && contact.name) || message.sender;
        const fromMe = id === message.sender;

        return { ...message, senderName: name, fromMe };
      });

      const selected = index === selectedConversationIndex;
      return { ...convo, messages, recipients, selected };
    }
  );

  const addMessageToConversation = useCallback(
    ({
      recipients,
      text,
      sender,
    }: {
      recipients: string[];
      text: string;
      sender: string;
    }) => {
      setConversations((prev: Conversation[]) => {
        let madeChange = false;
        const newMessage = { sender, text };
        const newConvos = prev.map((convo: Conversation) => {
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

    return () => {
      socket.off("receive-message");
    };
  }, [socket, addMessageToConversation]);

  const sendMessage = (recipients: string[], text: string) => {
    socket?.emit("send-message", { recipients, text });

    addMessageToConversation({ recipients, text, sender: id as string });
  };

  const value: ConversationContext = {
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
};

function arrayEquality(a: any[], b: any[]) {
  if (a.length !== b.length) return false;

  a.sort();
  b.sort();

  return JSON.stringify(a) === JSON.stringify(b);
}
