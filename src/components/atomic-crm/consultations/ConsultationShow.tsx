import {
  RecordRepresentation,
  ShowBase,
  useShowContext,
  useTranslate,
} from "ra-core";
import { EditButton } from "@/components/admin/edit-button";
import { DateField } from "@/components/admin/date-field";
import { FileField } from "@/components/admin/file-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { Card, CardContent } from "@/components/ui/card";

import type { Consultation } from "../types";
import { AsideSection } from "../misc/AsideSection";

/**
 * Show page for a consultation (clinic visit).
 */
export const ConsultationShow = () => (
  <ShowBase>
    <ConsultationShowContent />
  </ShowBase>
);

const ConsultationShowContent = () => {
  const { record, isPending } = useShowContext<Consultation>();
  const translate = useTranslate();

  if (isPending || !record) return null;

  return (
    <div className="mt-2 mb-2 flex gap-8">
      <div className="flex-1">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-semibold">
                {translate("resources.consultations.title", {
                  date: new Date(record.date).toLocaleDateString(),
                })}
              </h5>
              <EditButton />
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">
                  {translate("resources.consultations.fields.date")}
                </span>
                <div>
                  <DateField source="date" />
                </div>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">
                  {translate("resources.consultations.fields.reason")}
                </span>
                <div>{record.reason}</div>
              </div>

              {record.diagnosis && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    {translate("resources.consultations.fields.diagnosis")}
                  </span>
                  <div className="whitespace-pre-line">{record.diagnosis}</div>
                </div>
              )}

              {record.treatment && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    {translate("resources.consultations.fields.treatment")}
                  </span>
                  <div className="whitespace-pre-line">{record.treatment}</div>
                </div>
              )}

              {record.next_appointment && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    {translate(
                      "resources.consultations.fields.next_appointment",
                    )}
                  </span>
                  <div>
                    <DateField source="next_appointment" />
                  </div>
                </div>
              )}

              {record.attachments && record.attachments.length > 0 && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    {translate("resources.consultations.fields.attachments")}
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <FileField
                      source="attachments"
                      src="src"
                      title="title"
                      target="_blank"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="hidden sm:block w-72 min-w-72 text-sm">
        <AsideSection
          title={translate("resources.consultations.fields.animal_id")}
        >
          <ReferenceField reference="animals" source="animal_id" link="show">
            <RecordRepresentation />
          </ReferenceField>
        </AsideSection>
      </div>
    </div>
  );
};
