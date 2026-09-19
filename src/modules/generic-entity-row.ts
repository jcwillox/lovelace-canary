import { hass, provideHass } from "card-tools/src/hass";
import { hasOldTemplate } from "card-tools/src/old-templates";
import { hasTemplate } from "card-tools/src/templates";
import { applyThemesOnElement } from "custom-card-helpers";
import { StyleInfo } from "lit/directives/style-map.js";
import { DEFAULT_SECONDARY_INFO } from "../const";
import { createModule } from "../module";
import { mapStyle } from "../styles";
import { LovelaceElement } from "../types";
import { extensionEnabled, moduleEnabled } from "../utils";

const MODULE = "generic-entity-row";
const ELEMENT = "hui-generic-entity-row";

interface Config {
  entity?: string;
  entity_ids?: string[];
  secondary_info?: string | string[] | Record<string, unknown>;
  canary_theme?: string;
  canary_style?: string | StyleInfo;
}

function isNativeSecondaryInfo(row: LovelaceElement<Config>) {
  const secondaryInfo = row.config?.secondary_info;
  if (Array.isArray(secondaryInfo)) return true;
  if (typeof secondaryInfo !== "string") return false;
  if (DEFAULT_SECONDARY_INFO.includes(secondaryInfo)) return true;
  const entity = row.config?.entity;
  const stateObj = entity && (row.hass ?? hass())?.states[entity];
  return !!stateObj && secondaryInfo in stateObj.attributes;
}

interface SecondaryInfoElement extends HTMLElement {
  template?: Record<string, unknown>;
}

declare global {
  interface HTMLElementTagNameMap {
    "secondary-info": SecondaryInfoElement;
  }
}

if (moduleEnabled(MODULE)) {
  createModule<Config>(ELEMENT, function () {
    if (
      this.config?.secondary_info &&
      extensionEnabled(this.config, "secondary_info")
    ) {
      // ensure we don't overwrite the default secondary info behaviour.
      if (!isNativeSecondaryInfo(this)) {
        if (
          typeof this.config.secondary_info === "object" ||
          hasOldTemplate(this.config.secondary_info) ||
          hasTemplate(this.config.secondary_info)
        ) {
          // create secondary info element to track state changes.
          const secondaryInfoElement = document.createElement("secondary-info");

          secondaryInfoElement.template = {
            template: this.config.secondary_info,
            variables: { config: this.config, entity: this.config.entity },
            entity_ids: this.config.entity_ids,
          };

          this.shadowRoot?.appendChild(secondaryInfoElement);

          provideHass(secondaryInfoElement);
        } else {
          // set the secondary info to plain text.
          const secondaryInfoDiv = this.shadowRoot?.querySelector(".secondary");
          if (secondaryInfoDiv) {
            secondaryInfoDiv.innerHTML = this.config.secondary_info;
          }
        }
      }
    }

    if (
      this.config?.canary_theme &&
      extensionEnabled(this.config, "canary_theme")
    ) {
      applyThemesOnElement(this, hass().themes, this.config.canary_theme);
    }

    if (
      this.config?.canary_style &&
      extensionEnabled(this.config, "canary_style")
    ) {
      if (typeof this.config.canary_style === "string") {
        const styleEl = document.createElement("style");
        styleEl.innerHTML = this.config.canary_style;
        this.appendChild(styleEl);
      } else {
        this.style.cssText += mapStyle(this.config.canary_style);
      }
    }
  });
}
