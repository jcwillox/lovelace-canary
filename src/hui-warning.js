import { fireEvent } from "card-tools/src/event.js";
import { findConfig } from "./utils";

customElements.whenDefined("hui-warning").then(() => {
  const WarningCard = customElements.get("hui-warning");

  WarningCard.prototype.firstUpdated = function() {
    const config = findConfig(this);
    if (config && config.hide_warning === true) {
      this.style.display = "none";
    }
  };

  fireEvent("ll-rebuild", {});
});
