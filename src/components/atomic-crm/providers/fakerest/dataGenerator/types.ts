import type { Contact, ContactNote, Sale } from "../../../types";
import type { ConfigurationContextValue } from "../../../root/ConfigurationContext";

export interface Db {
  contacts: Contact[];
  contact_notes: ContactNote[];
  sales: Sale[];
  configuration: Array<{ id: number; config: ConfigurationContextValue }>;
}
