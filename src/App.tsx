import { CRM } from "@/components/atomic-crm/root/CRM";

/**
 * Vet CRM application entry point.
 *
 * Branding: title "Vet CRM", sage-green (#4CAF7D) primary palette,
 * off-white (#F9F9F7) background, Inter font, French as default locale.
 * Theme tokens are defined in src/index.css; logo assets are in public/logos/.
 */
const App = () => (
  <CRM
    title="Vet CRM"
    darkModeLogo="./logos/logo_vet_crm_dark.svg"
    lightModeLogo="./logos/logo_vet_crm_light.svg"
  />
);

export default App;
