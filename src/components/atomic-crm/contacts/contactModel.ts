import { Mars, NonBinary, Venus } from "lucide-react";

import type { Contact, ContactGender } from "../types";

export const defaultEmailJsonb = [{ email: null, type: null }];
export const defaultPhoneJsonb = [{ number: null, type: null }];

const cleanContactArrayFields = (data: Contact) => {
  const cleanedEmailJsonb =
    data.email_jsonb?.filter((e) => e.email != null) || [];
  const cleanedPhoneJsonb =
    data.phone_jsonb?.filter((p) => p.number != null) || [];
  return {
    ...data,
    phone_jsonb: cleanedPhoneJsonb.length > 0 ? cleanedPhoneJsonb : null,
    email_jsonb: cleanedEmailJsonb.length > 0 ? cleanedEmailJsonb : null,
  };
};

export const cleanupContactForCreate = (data: Contact) => {
  return cleanContactArrayFields({
    ...data,
    first_seen: new Date().toISOString(),
    last_seen: new Date().toISOString(),
  });
};

export const cleanupContactForEdit = cleanContactArrayFields;

type TranslateFn = (key: string, options?: { [key: string]: any }) => string;

export const contactGenderDefaultLabels: Record<string, string> = {
  male: "He/Him",
  female: "She/Her",
  nonbinary: "They/Them",
};

const personalInfoTypeMap: Record<string, string> = {
  Work: "work",
  Home: "home",
  Other: "other",
};

export const contactGender: ContactGender[] = [
  {
    value: "male",
    label: "resources.contacts.inputs.genders.male",
    icon: Mars,
  },
  {
    value: "female",
    label: "resources.contacts.inputs.genders.female",
    icon: Venus,
  },
  {
    value: "nonbinary",
    label: "resources.contacts.inputs.genders.nonbinary",
    icon: NonBinary,
  },
];

export const translateContactGenderLabel = (
  gender: { value: string; label: string },
  translate: TranslateFn,
) =>
  translate(gender.label, {
    _: contactGenderDefaultLabels[gender.value] ?? gender.label,
  });

export const translatePersonalInfoTypeLabel = (
  type: string,
  translate: TranslateFn,
) =>
  translate(
    `resources.contacts.inputs.personal_info_types.${personalInfoTypeMap[type] ?? type.toLowerCase()}`,
    {
      _: type,
    },
  );
