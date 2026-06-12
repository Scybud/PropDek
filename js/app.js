import {
  loadComponent,
  closeModal,
} from "https://scybud.github.io/scybud-ui/js/ui.js";
import { handleFormSteps } from "./components/form.js";


document.addEventListener("DOMContentLoaded", () => {
    const addProperty = document.querySelectorAll(".add-property");
    addProperty.forEach((btn) => {
        btn.addEventListener("click", async() => {
            await loadComponent(
              "../components/modals/add-property.html",
              "modalContainer",
            );

            await handleFormSteps();
        })
    })
})