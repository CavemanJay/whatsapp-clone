import React, { useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { Contact } from "../models";

export interface ContactContext {
  contacts: Contact[];
  createContact(id: string, name: string): void;
}

/**
 * @internal
 */
const ContactsContext = React.createContext<ContactContext | undefined>(
  undefined
);

export function useContacts() {
  return useContext(ContactsContext);
}

export const ContactsProvider: React.FC = ({ children }) => {
  const [contacts, setContacts] = useLocalStorage<Contact[]>("contacts", []);

  const createContact = (id: string, name: string) => {
    setContacts((prevContacts: Contact[]) => [...prevContacts, { id, name }]);
  };

  return (
    <ContactsContext.Provider value={{ contacts, createContact }}>
      {children}
    </ContactsContext.Provider>
  );
};
