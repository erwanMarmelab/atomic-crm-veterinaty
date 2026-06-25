import type { Vaccination } from "../types";
import { VaccinationCreate } from "./VaccinationCreate";
import { VaccinationEdit } from "./VaccinationEdit";
import { VaccinationList } from "./VaccinationList";
import { VaccinationShow } from "./VaccinationShow";

export default {
  list: VaccinationList,
  show: VaccinationShow,
  edit: VaccinationEdit,
  create: VaccinationCreate,
  recordRepresentation: (record: Vaccination) => record?.vaccine_name ?? "",
};
