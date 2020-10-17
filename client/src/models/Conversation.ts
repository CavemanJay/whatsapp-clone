import { Contact, Message } from ".";

export interface Conversation {
  recipients: any[];
  messages: Message[];
  selected: boolean;
}
