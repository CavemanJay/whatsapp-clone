import React from "react";
import { ListGroup } from "react-bootstrap";
import {
  ConversationContext,
  useConversations,
} from "../contexts/ConversationsProvider";

export default function Conversations() {
  const {
    conversations,
    selectConversationIndex,
  } = useConversations() as ConversationContext;

  return (
    <ListGroup variant="flush">
      {conversations.map((convo, index) => (
        <ListGroup.Item
          key={index}
          action
          active={convo.selected}
          onClick={() => selectConversationIndex(index)}
        >
          {convo.recipients.map((r) => r.name).join(", ")}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
