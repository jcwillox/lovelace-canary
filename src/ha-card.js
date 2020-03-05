import { fireEvent } from "card-tools/src/event.js";
import { findConfig } from "./utils";

customElements.whenDefined("ha-card").then(() => {
  const HaCard = customElements.get("ha-card");

  HaCard.prototype.firstUpdated = function() {
    const config = findConfig(this);
    if (config && config.no_card === true) {
      this.style.boxShadow = "none";
      this.style.background = "none";
    }
  };

  fireEvent("ll-rebuild", {});
});
