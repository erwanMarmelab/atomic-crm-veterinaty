import { EditBase, Form, useEditContext } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import type { Consultation } from "../types";
import { ConsultationInputs } from "./ConsultationInputs";
import { FormToolbar } from "../layout/FormToolbar";

/**
 * Edit page for an existing consultation.
 */
export const ConsultationEdit = () => (
  <EditBase redirect="show">
    <ConsultationEditContent />
  </EditBase>
);

const ConsultationEditContent = () => {
  const { isPending, record } = useEditContext<Consultation>();
  if (isPending || !record) return null;

  return (
    <div className="mt-2 flex lg:mr-72">
      <div className="flex-1">
        <Form record={record}>
          <Card>
            <CardContent>
              <ConsultationInputs />
              <FormToolbar />
            </CardContent>
          </Card>
        </Form>
      </div>
    </div>
  );
};
