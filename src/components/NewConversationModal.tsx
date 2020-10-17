import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { ContactContext, useContacts } from "../contexts/ContactsProvider";
import {
  ConversationContext,
  useConversations,
} from "../contexts/ConversationsProvider";

const NewConversationModal: React.FC<{ closeModal(): void }> = ({
  closeModal,
}) => {
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const { contacts } = useContacts() as ContactContext;
  const { createConversation } = useConversations() as ConversationContext;

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    createConversation(selectedContactIds);
    closeModal();
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedContactIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((prevId) => prevId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <>
      <Modal.Header closeButton>Create Conversation</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {contacts.map((contact) => (
            <Form.Group controlId={contact.id} key={contact.id}>
              <Form.Check
                type="checkbox"
                checked={selectedContactIds.includes(contact.id)}
                label={contact.name}
                onChange={() => handleCheckboxChange(contact.id)}
              />
            </Form.Group>
          ))}
          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  );
};

export default NewConversationModal;
