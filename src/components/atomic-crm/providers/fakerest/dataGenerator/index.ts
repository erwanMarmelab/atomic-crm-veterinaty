import { generateAnimals } from "./animals";
import { generateConsultations } from "./consultations";
import { generateContactNotes } from "./contactNotes";
import { generateContacts } from "./contacts";
import { finalize } from "./finalize";
import { generateSales } from "./sales";
import { generateVaccinations } from "./vaccinations";
import type { Db } from "./types";

export default (): Db => {
  const db = {} as Db;
  db.sales = generateSales(db);
  db.contacts = generateContacts(db);
  db.contact_notes = generateContactNotes(db);
  db.animals = generateAnimals(db);
  db.consultations = generateConsultations(db);
  db.vaccinations = generateVaccinations(db);
  db.configuration = [
    {
      id: 1,
      config: {} as Db["configuration"][number]["config"],
    },
  ];
  finalize(db);

  return db;
};
