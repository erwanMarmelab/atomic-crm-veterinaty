import type { Animal } from "../types";
import { AnimalCreate } from "./AnimalCreate";
import { AnimalEdit } from "./AnimalEdit";
import { AnimalList } from "./AnimalList";
import { AnimalShow } from "./AnimalShow";

export default {
  list: AnimalList,
  show: AnimalShow,
  edit: AnimalEdit,
  create: AnimalCreate,
  recordRepresentation: (record: Animal) => record?.name ?? "",
};
