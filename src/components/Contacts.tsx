import React from "react";
import { ListGroup } from "react-bootstrap";
import { ContactContext, useContacts } from "../contexts/ContactsProvider";

export default function Contacts() {
  const { contacts } = useContacts() as ContactContext;

  return (
    <ListGroup variant="flush">
      {contacts.map((contact) => (
        <ListGroup.Item key={contact.id}>{contact.name}</ListGroup.Item>
      ))}
    </ListGroup>
  );
}
