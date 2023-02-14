import { hass } from "card-tools/src/hass";
import { applyThemesOnElement } from "custom-card-helpers";
import { StyleInfo } from "lit/directives/style-map.js";
import { NO_CARD_STYLE } from "../const";
import { createModule } from "../module";
import { mapStyle } from "../styles";
import { extensionEnabled, findConfig, moduleEnabled } from "../utils";

const MODULE = "generic-card";
const ELEMENT = "ha-card";

interface Config {
  canary_theme?: string;
  canary_style?: StyleInfo;
  no_card?: boolean;
}

if (moduleEnabled(MODULE)) {
  createModule(ELEMENT, function () {
    const config: Config = findConfig(this);
    if (!config) return;

    // ha-card elements have default transition that we need to temporarily disable.
    this.style.transition = "none";

    if (config.canary_theme && extensionEnabled(config, "canary_theme")) {
      applyThemesOnElement(
        this,
        this.hass ? this.hass.themes : hass().themes,
        config.canary_theme
      );
    }

    if (config.canary_style && extensionEnabled(config, "canary_style")) {
      this.style.cssText += mapStyle(config.canary_style);
    }

    if (config.no_card === true && extensionEnabled(config, "no_card")) {
      Object.assign(this.style, NO_CARD_STYLE);
    }

    // flush css.
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.offsetHeight;

    // restore transition.
    this.style.transition = "";
  });
}
