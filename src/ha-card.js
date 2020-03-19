import { fireEvent } from "card-tools/src/event.js";
import { extensionEnabled, findConfig } from "./utils";

customElements.whenDefined("ha-card").then(() => {
  const HaCard = customElements.get("ha-card");
  const firstUpdated = HaCard.prototype.firstUpdated;

  HaCard.prototype.firstUpdated = function() {
    firstUpdated.call(this);
    const config = findConfig(this);
    if (
      config &&
      config.no_card === true &&
      extensionEnabled(config, "no_card")
    ) {
      this.style.boxShadow = "none";
      this.style.background = "none";
    }
  };

  fireEvent("ll-rebuild", {});
});
