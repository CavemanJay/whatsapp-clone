import React, { useRef } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { v4 as uuid } from "uuid";

const Login: React.FC<{ onIdSubmit(id: string): void }> = ({ onIdSubmit }) => {
  const idRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    onIdSubmit(idRef?.current?.value as string);
  };
  const createNewId = () => {
    onIdSubmit(uuid());
  };

  return (
    <Container
      className="align-items-center d-flex"
      style={{ height: "100vh" }}
    >
      <Form className="w-100" onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Enter Your ID</Form.Label>
          <Form.Control type="text" ref={idRef} required />
        </Form.Group>
        <Button type="submit" className="mr-2">
          Login
        </Button>
        <Button onClick={createNewId} variant="secondary">
          Create A New Id
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
