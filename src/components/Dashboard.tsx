import React from "react";
import OpenConversation from "./OpenConversation";
import Sidebar from "./Sidebar";
import {
  ConversationContext,
  useConversations,
} from "../contexts/ConversationsProvider";

const Dashboard: React.FC<{ id: string }> = ({ id }) => {
  const { selectedConversation } = useConversations() as ConversationContext;

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar id={id} />
      {selectedConversation && <OpenConversation />}
    </div>
  );
};

export default Dashboard;
