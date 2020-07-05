import { fireEvent } from "card-tools/src/event.js";
import { extensionEnabled, findConfig } from "./utils";
import { applyTheme } from "./styles";
import { NO_CARD_STYLE } from "./const";
import { hass } from "card-tools/src/hass";

customElements.whenDefined("ha-card").then(() => {
  const HaCard = customElements.get("ha-card");
  const firstUpdated = HaCard.prototype.firstUpdated;

  HaCard.prototype.firstUpdated = function () {
    firstUpdated.call(this);
    const config = findConfig(this);
    if (!config) return;

    // ha-card elements have default transition that we need to temporarily disable.
    this.style.transition = "none";

    if (config.no_card === true && extensionEnabled(config, "no_card")) {
      Object.assign(this.style, NO_CARD_STYLE);
    }

    if (config.canary_style && extensionEnabled(config, "canary_style")) {
      Object.assign(this.style, config.canary_style);
    }

    if (config.canary_theme && extensionEnabled(config, "canary_theme")) {
      applyTheme(this, hass().themes, config.canary_theme);
    }

    // flush css.
    this.offsetHeight;
    // restore transition.
    this.style.transition = "";
  };

  fireEvent("ll-rebuild", {});
});
