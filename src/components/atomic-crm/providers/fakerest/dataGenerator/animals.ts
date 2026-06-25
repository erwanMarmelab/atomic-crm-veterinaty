import { random, datatype, date } from "faker/locale/en_US";

import type { Animal, AnimalStatus } from "../../../types";
import type { Db } from "./types";

const SPECIES = [
  "Dog",
  "Cat",
  "Rabbit",
  "Bird",
  "Guinea pig",
  "Hamster",
  "Turtle",
  "Horse",
  "Snake",
  "Ferret",
];

const BREEDS_BY_SPECIES: Record<string, string[]> = {
  Dog: [
    "Labrador Retriever",
    "German Shepherd",
    "Golden Retriever",
    "Bulldog",
    "Poodle",
    "Beagle",
    "Rottweiler",
    "Yorkshire Terrier",
    "Mixed breed",
  ],
  Cat: [
    "Persian",
    "Maine Coon",
    "Siamese",
    "Ragdoll",
    "Bengal",
    "Sphynx",
    "British Shorthair",
    "Mixed breed",
  ],
  Rabbit: ["Holland Lop", "Mini Rex", "Lionhead", "Dutch", "Flemish Giant"],
  Bird: ["Canary", "Parakeet", "Cockatiel", "Parrot", "Finch"],
  Horse: ["Thoroughbred", "Quarter Horse", "Arabian", "Appaloosa", "Paint"],
};

const ANIMAL_NAMES = [
  "Bella",
  "Max",
  "Luna",
  "Charlie",
  "Lucy",
  "Cooper",
  "Molly",
  "Buddy",
  "Daisy",
  "Rocky",
  "Lola",
  "Bear",
  "Sadie",
  "Duke",
  "Zoe",
  "Jack",
  "Lily",
  "Tucker",
  "Chloe",
  "Oliver",
  "Pepper",
  "Shadow",
  "Ruby",
  "Simba",
  "Coco",
  "Milo",
  "Nala",
  "Zeus",
  "Ginger",
  "Rex",
];

const ANIMAL_STATUSES: AnimalStatus[] = [
  "active",
  "active",
  "active",
  "active",
  "deceased",
  "lost",
];

/**
 * Generates demo animal records linked to existing contacts.
 */
export const generateAnimals = (db: Db, size = 300): Animal[] => {
  return Array.from(Array(size).keys()).map((id) => {
    const species = random.arrayElement(SPECIES);
    const breedsForSpecies = BREEDS_BY_SPECIES[species];
    const breed = breedsForSpecies
      ? random.arrayElement(breedsForSpecies)
      : undefined;

    const dob = date.past(15);
    const weightKg = parseFloat(
      datatype.float({ min: 0.2, max: 80, precision: 0.1 }).toFixed(1),
    );
    const hasMicrochip = datatype.boolean();
    const microchip_number = hasMicrochip
      ? datatype
          .number({ min: 100000000000000, max: 999999999999999 })
          .toString()
      : null;

    const owner = random.arrayElement(db.contacts);

    return {
      id,
      name: random.arrayElement(ANIMAL_NAMES),
      species,
      breed: breed ?? null,
      date_of_birth: dob.toISOString(),
      weight_kg: weightKg,
      microchip_number,
      status: random.arrayElement(ANIMAL_STATUSES),
      owner_id: owner.id,
    };
  });
};
