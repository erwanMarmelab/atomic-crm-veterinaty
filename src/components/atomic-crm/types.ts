import type { Identifier, RaRecord } from "ra-core";
import type { ComponentType } from "react";

import type { CONTACT_CREATED, CONTACT_NOTE_CREATED } from "./consts";

export type SignUpData = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

export type SalesFormData = {
  avatar?: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  administrator: boolean;
  disabled: boolean;
};

export type Sale = {
  first_name: string;
  last_name: string;
  administrator: boolean;
  avatar?: RAFile;
  disabled?: boolean;
  user_id: string;

  /**
   * This is a copy of the user's email, to make it easier to handle by react admin
   * DO NOT UPDATE this field directly, it should be updated by the backend
   */
  email: string;

  /**
   * This is used by the fake rest provider to store the password
   * DO NOT USE this field in your code besides the fake rest provider
   * @deprecated
   */
  password?: string;
} & Pick<RaRecord, "id">;

export type EmailAndType = {
  email: string;
  type: "Work" | "Home" | "Other";
};

export type PhoneNumberAndType = {
  number: string;
  type: "Work" | "Home" | "Other";
};

export type Contact = {
  first_name: string;
  last_name: string;
  title: string;
  email_jsonb: EmailAndType[];
  avatar?: Partial<RAFile>;
  linkedin_url?: string | null;
  first_seen: string;
  last_seen: string;
  has_newsletter: boolean;
  gender: string;
  sales_id?: Identifier;
  status: string;
  background: string;
  phone_jsonb: PhoneNumberAndType[];
} & Pick<RaRecord, "id">;

export type ContactNote = {
  contact_id: Identifier;
  text: string;
  date: string;
  sales_id: Identifier;
  status: string;
  attachments?: AttachmentNote[];
} & Pick<RaRecord, "id">;

export type ActivityContactCreated = {
  type: typeof CONTACT_CREATED;
  sales_id?: Identifier;
  contact: Contact;
  date: string;
} & Pick<RaRecord, "id">;

export type ActivityContactNoteCreated = {
  type: typeof CONTACT_NOTE_CREATED;
  sales_id?: Identifier;
  contactNote: ContactNote;
  date: string;
} & Pick<RaRecord, "id">;

export type Activity = RaRecord &
  (ActivityContactCreated | ActivityContactNoteCreated);

export interface RAFile {
  src: string;
  title: string;
  path?: string;
  rawFile: File;
  type?: string;
}

export type AttachmentNote = RAFile;

export type AnimalStatus = "active" | "deceased" | "lost";

export type Animal = {
  name: string;
  species: string;
  breed?: string | null;
  date_of_birth?: string | null;
  weight_kg?: number | null;
  microchip_number?: string | null;
  status: AnimalStatus;
  owner_id: Identifier;
} & Pick<RaRecord, "id">;

export type Consultation = {
  /** ISO date string for the visit date (required) */
  date: string;
  /** Reason for the consultation visit (required) */
  reason: string;
  /** Veterinary diagnosis (optional) */
  diagnosis?: string | null;
  /** Prescribed treatment (optional) */
  treatment?: string | null;
  /** ISO date string for the next appointment (optional) */
  next_appointment?: string | null;
  /** File references for radiographs, lab results, etc. */
  attachments?: AttachmentNote[];
  /** Reference to the animal patient (required) */
  animal_id: Identifier;
  /** Animal name joined from consultations_summary view */
  animal_name?: string;
  /** Owner first name joined from consultations_summary view */
  owner_first_name?: string;
  /** Owner last name joined from consultations_summary view */
  owner_last_name?: string;
} & Pick<RaRecord, "id">;

export interface LabeledValue {
  value: string;
  label: string;
}

export interface NoteStatus extends LabeledValue {
  color: string;
}

export interface ContactGender {
  value: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}
