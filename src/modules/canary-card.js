import { html, LitElement } from "card-tools/src/lit-element";
import { createCard } from "card-tools/src/lovelace-element";
import { hass } from "card-tools/src/hass";
import { applyTheme } from "../styles";

class CanaryCard extends LitElement {
  static get properties() {
    return {
      _config: {},
      _hass: {},
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
    this._config = JSON.parse(JSON.stringify(config));
    this._card = createCard(this._config.card);
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