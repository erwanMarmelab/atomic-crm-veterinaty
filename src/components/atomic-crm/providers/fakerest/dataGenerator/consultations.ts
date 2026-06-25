import { datatype, date, random } from "faker/locale/en_US";

import type { Consultation } from "../../../types";
import type { Db } from "./types";

const REASONS = [
  "Annual check-up",
  "Vaccination",
  "Injury assessment",
  "Digestive issue",
  "Skin condition",
  "Dental examination",
  "Post-surgery follow-up",
  "Respiratory issue",
  "Eye examination",
  "Behavioral concern",
  "Weight management consultation",
  "Parasite treatment",
  "Ear infection",
  "Wound care",
  "Pre-travel health certificate",
];

const DIAGNOSES = [
  "Mild dehydration — recommend increased water intake",
  "Otitis externa — ear infection",
  "Dermatitis — allergic reaction",
  "Dental calculus — cleaning recommended",
  "Healthy — no concerns",
  "Mild obesity — dietary adjustment advised",
  "Conjunctivitis — eye drops prescribed",
  "Upper respiratory infection",
  "Flea allergy dermatitis",
  "Gastroenteritis — dietary rest recommended",
];

const TREATMENTS = [
  "Prescribed antibiotics (Amoxicillin 250mg) for 7 days",
  "Ear drops twice daily for 10 days",
  "Anti-inflammatory medication",
  "Professional dental cleaning performed",
  "Flea and tick preventive applied",
  "Dietary plan established — reduce caloric intake by 20%",
  "Wound cleaned and bandaged",
  "Corticosteroid cream applied topically",
  "Deworming treatment administered",
  "Supportive care — rest and bland diet",
];

/**
 * Returns a random date within the current ISO week (Mon 00:00 – Sun 23:59).
 */
function randomDateThisWeek(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diffToMonday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const randomMs =
    weekStart.getTime() +
    Math.random() * (weekEnd.getTime() - weekStart.getTime());
  return new Date(randomMs);
}

/**
 * Generates demo consultation records linked to existing animals.
 * Every 20th record receives a next_appointment within the current week so that
 * the "Appointments This Week" dashboard widget always has data in the demo.
 */
export const generateConsultations = (db: Db, size = 600): Consultation[] => {
  return Array.from(Array(size).keys()).map((id) => {
    const animal = random.arrayElement(db.animals);
    const visitDate = date.past(3);
    const hasDiagnosis = datatype.boolean();
    const hasTreatment = hasDiagnosis && datatype.boolean();

    // Every 20th record has a next_appointment this week for demo widget visibility
    let nextAppointmentDate: Date | null;
    if (id % 20 === 0) {
      nextAppointmentDate = randomDateThisWeek();
    } else {
      const hasNextAppointment = datatype.boolean();
      nextAppointmentDate = hasNextAppointment
        ? date.future(1, visitDate)
        : null;
    }

    return {
      id,
      animal_id: animal.id,
      date: visitDate.toISOString(),
      reason: random.arrayElement(REASONS),
      diagnosis: hasDiagnosis ? random.arrayElement(DIAGNOSES) : null,
      treatment: hasTreatment ? random.arrayElement(TREATMENTS) : null,
      next_appointment: nextAppointmentDate
        ? nextAppointmentDate.toISOString()
        : null,
      attachments: [],
    };
  });
};
