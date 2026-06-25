import { CreateBase, Form } from "ra-core";
import { useLocation } from "react-router";
import { Card, CardContent } from "@/components/ui/card";

import { ConsultationInputs } from "./ConsultationInputs";
import { FormToolbar } from "../layout/FormToolbar";

/**
 * Create page for a new consultation.
 *
 * When navigated from an animal show page with router state
 * `{ record: { animal_id: X } }`, ra-core pre-populates the form
 * and the animal field is hidden.
 */
export const ConsultationCreate = () => {
  const location = useLocation();
  const locationRecord = (location.state as { record?: Record<string, unknown> } | null)
    ?.record;
  const hasPreselectedAnimal =
    locationRecord != null && "animal_id" in locationRecord;

  return (
    <CreateBase redirect="show">
      <div className="mt-2 flex lg:mr-72">
        <div className="flex-1">
          <Form>
            <Card>
              <CardContent>
                <ConsultationInputs hideAnimalField={hasPreselectedAnimal} />
                <FormToolbar />
              </CardContent>
            </Card>
          </Form>
        </div>
      </div>
    </CreateBase>
  );
};
