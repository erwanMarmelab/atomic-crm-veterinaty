import { datatype, date, random } from "faker/locale/en_US";

import type { Vaccination } from "../../../types";
import type { Db } from "./types";

const VACCINE_NAMES = [
  "Rabies",
  "Distemper",
  "Parvovirus",
  "Adenovirus",
  "Bordetella",
  "Leptospirosis",
  "Lyme Disease",
  "Influenza",
  "Feline Herpesvirus",
  "Feline Calicivirus",
  "Feline Panleukopenia",
  "Feline Leukemia",
  "Chlamydophila felis",
  "Equine Influenza",
  "Tetanus",
];

/**
 * Computes the expiry date by adding validity_months months to administered_on.
 * Mirrors the logic in the DB view so FakeRest produces consistent data.
 */
export function computeExpiresOn(
  administeredOn: Date,
  validityMonths: number,
): string {
  const expiry = new Date(administeredOn);
  expiry.setMonth(expiry.getMonth() + validityMonths);
  return expiry.toISOString();
}

/**
 * Generates demo vaccination records linked to existing animals,
 * with varied expiry dates (some expired, some valid, some expiring soon).
 */
export const generateVaccinations = (db: Db, size = 200): Vaccination[] => {
  return Array.from(Array(size).keys()).map((id) => {
    const animal = random.arrayElement(db.animals);

    // Produce a mix: 1/3 expired, 1/3 expiring soon, 1/3 valid
    const scenario = id % 3;
    let administeredOn: Date;
    let validityMonths: number;

    if (scenario === 0) {
      // Expired: administered > 2 years ago, valid for 12 months
      validityMonths = 12;
      administeredOn = date.past(3);
      // Force it to be old enough that it's expired
      administeredOn.setFullYear(administeredOn.getFullYear() - 2);
    } else if (scenario === 1) {
      // Expiring soon: administered ~1 year ago, valid for 12 months + small fudge
      validityMonths = 12;
      administeredOn = new Date();
      administeredOn.setMonth(administeredOn.getMonth() - validityMonths);
      // Add 15–25 days to put expiry 5–15 days from now
      const fudgeDays = 15 + datatype.number({ min: 0, max: 10 });
      administeredOn.setDate(administeredOn.getDate() + fudgeDays);
    } else {
      // Valid: administered recently with generous validity
      validityMonths = 12 + datatype.number({ min: 0, max: 24 });
      administeredOn = date.past(1);
    }

    return {
      id,
      animal_id: animal.id,
      vaccine_name: random.arrayElement(VACCINE_NAMES),
      administered_on: administeredOn.toISOString(),
      validity_months: validityMonths,
      expires_on: computeExpiresOn(administeredOn, validityMonths),
    };
  });
};
