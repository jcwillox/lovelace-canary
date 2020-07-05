import { extensionEnabled, findConfig, moduleEnabled } from "./utils";
import { applyTheme } from "./styles";
import { NO_CARD_STYLE } from "./const";
import { hass } from "card-tools/src/hass";
import { createModule } from "./module";

const MODULE = "ha-card";
const ELEMENT = "ha-card";

if (moduleEnabled(MODULE)) {
  createModule(ELEMENT, function () {
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
  });
}
