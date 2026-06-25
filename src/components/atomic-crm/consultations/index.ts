import type { Consultation } from "../types";
import { ConsultationCreate } from "./ConsultationCreate";
import { ConsultationEdit } from "./ConsultationEdit";
import { ConsultationList } from "./ConsultationList";
import { ConsultationShow } from "./ConsultationShow";

export default {
  list: ConsultationList,
  show: ConsultationShow,
  edit: ConsultationEdit,
  create: ConsultationCreate,
  recordRepresentation: (record: Consultation) =>
    record?.date ? new Date(record.date).toLocaleDateString() : "",
};
