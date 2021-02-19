import { extensionEnabled, findConfig, moduleEnabled } from "../utils";
import { applyTheme, mapStyle } from "../styles";
import { NO_CARD_STYLE } from "../const";
import { hass } from "card-tools/src/hass";
import { createModule } from "../module";

const MODULE = "generic-card";
const ELEMENT = "ha-card";

if (moduleEnabled(MODULE)) {
  createModule(ELEMENT, function () {
    const config = findConfig(this);
    if (!config) return;

    // ha-card elements have default transition that we need to temporarily disable.
    this.style.transition = "none";
    this.style.cssText = "";

    if (config.canary_theme && extensionEnabled(config, "canary_theme")) {
      applyTheme(this, hass().themes, config.canary_theme);
    }

    if (config.canary_style && extensionEnabled(config, "canary_style")) {
      this.style.cssText += mapStyle(config.canary_style);
    }

    if (config.no_card === true && extensionEnabled(config, "no_card")) {
      Object.assign(this.style, NO_CARD_STYLE);
    }

    // flush css.
    this.offsetHeight;
    // restore transition.
    this.style.transition = "";
  });
}
