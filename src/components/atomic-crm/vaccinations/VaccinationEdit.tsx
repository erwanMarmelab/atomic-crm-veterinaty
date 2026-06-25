import { EditBase, Form, useEditContext } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import type { Vaccination } from "../types";
import { VaccinationInputs } from "./VaccinationInputs";
import { FormToolbar } from "../layout/FormToolbar";

/**
 * Edit page for an existing vaccination record.
 */
export const VaccinationEdit = () => (
  <EditBase redirect="show">
    <VaccinationEditContent />
  </EditBase>
);

const VaccinationEditContent = () => {
  const { isPending, record } = useEditContext<Vaccination>();
  if (isPending || !record) return null;

  return (
    <div className="mt-2 flex lg:mr-72">
      <div className="flex-1">
        <Form record={record}>
          <Card>
            <CardContent>
              <VaccinationInputs />
              <FormToolbar />
            </CardContent>
          </Card>
        </Form>
      </div>
    </div>
  );
};
