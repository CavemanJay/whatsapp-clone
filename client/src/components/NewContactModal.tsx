import React, { useRef } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { ContactContext, useContacts } from "../contexts/ContactsProvider";

const NewContactModal: React.FC<{ closeModal(): void }> = ({ closeModal }) => {
  const idRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const { createContact } = useContacts() as ContactContext;

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    createContact(
      idRef?.current?.value as string,
      nameRef?.current?.value as string
    );
    closeModal();
  };

  return (
    <>
      <Modal.Header closeButton>Create Contact</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Id</Form.Label>
            <Form.Control type="text" ref={idRef} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" ref={nameRef} required />
          </Form.Group>
          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  );
};

export default NewContactModal;
