import { EditBase, Form, useEditContext } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import type { Animal } from "../types";
import { AnimalInputs } from "./AnimalInputs";
import { FormToolbar } from "../layout/FormToolbar";

/**
 * Edit page for an existing animal patient.
 */
export const AnimalEdit = () => (
  <EditBase redirect="show">
    <AnimalEditContent />
  </EditBase>
);

const AnimalEditContent = () => {
  const { isPending, record } = useEditContext<Animal>();
  if (isPending || !record) return null;

  return (
    <div className="mt-2 flex lg:mr-72">
      <div className="flex-1">
        <Form record={record}>
          <Card>
            <CardContent>
              <AnimalInputs />
              <FormToolbar />
            </CardContent>
          </Card>
        </Form>
      </div>
    </div>
  );
};
