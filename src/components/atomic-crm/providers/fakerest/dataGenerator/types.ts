import type { Animal, Consultation, Contact, ContactNote, Sale } from "../../../types";
import type { ConfigurationContextValue } from "../../../root/ConfigurationContext";

export interface Db {
  animals: Animal[];
  consultations: Consultation[];
  contacts: Contact[];
  contact_notes: ContactNote[];
  sales: Sale[];
  configuration: Array<{ id: number; config: ConfigurationContextValue }>;
}
