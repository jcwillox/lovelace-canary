import { html, LitElement } from "card-tools/src/lit-element";
import { createCard } from "card-tools/src/lovelace-element";
import { hass } from "card-tools/src/hass";
import { applyTheme } from "./styles";
import { logVersion } from "./logging";
import { registerCard } from "card-tools/src/editor";
import { moduleEnabled } from "./utils";
import { name, version } from "../package.json";
// allow dynamic updating of secondary info.
import "./secondary-info";
// adds three methods to add secondary info to entity rows.
import "./hui-generic-entity-row";
// adds the no_card option.
import "./ha-card";
// adds the in_card option.
import "./vertical-stack";
// adds the align option.
import "./hui-glance-card";
// adds hide warning option.
import "./hui-warning";

logVersion(name, version, "#fdd835", "#212121");

if (moduleEnabled("no_card")) {
  console.log("Module Enabled!");
} else {
  console.log("Module Disabled!");
}

class CanaryCard extends LitElement {
  static get properties() {
    return {
      _config: {},
      _hass: {}
    };
  }

  render() {
    return html`
      ${this._card}
      <style>
        ${this._config.style}
      </style>
    `;
  }

  setConfig(config) {
    this._config = config;
    this._card = createCard(config.card);
    this._hass = this._card.hass = hass();
  }

  set hass(hass) {
    this._hass = hass;
    this._card.hass = hass;
  }

  shouldUpdate(changedProps) {
    if (changedProps.has("_config")) {
      return true;
    }

    const oldHass = changedProps.get("_hass");

    return !oldHass || oldHass.themes !== this._hass.themes;
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (!this._config || !this._hass) return;

    const oldHass = changedProps.get("_hass");
    const oldConfig = changedProps.get("_config");

    if (
      !oldHass ||
      !oldConfig ||
      oldHass.themes !== this._hass.themes ||
      oldConfig.theme !== this._config.theme
    ) {
      applyTheme(this, this._hass.themes, this._config.theme);
    }
  }

  getCardSize() {
    return typeof this._card.getCardSize === "function"
      ? this._card.getCardSize()
      : 1;
  }
}

customElements.define("canary-card", CanaryCard);
registerCard("canary-card", "Canary");
