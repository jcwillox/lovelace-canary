import { hass } from "card-tools/src/hass";
import { property, state } from "lit/decorators.js";
import { LitElement } from "lit";
import {
  applyThemesOnElement,
  computeCardSize,
  createThing,
  HomeAssistant,
  LovelaceCard
} from "custom-card-helpers";
import type { CanaryCardConfig } from "./types";

export class CanaryCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public _hass!: HomeAssistant;
  @property() private card!: LitElement & LovelaceCard;
  @state() private config!: CanaryCardConfig;

  render() {
    return this.card;
  }

  setConfig(config) {
    this.config = JSON.parse(JSON.stringify(config));
    this.card = createThing(this.config.card);
    if (!this._hass) {
      this._hass = hass() as HomeAssistant;
    }
  }

  firstUpdated() {
    if (typeof this.config.style === "object") {
      Object.assign(this.card.style, this.config.style);
    } else if (this.config.style) {
      const styleEl = document.createElement("style");
      styleEl.innerHTML = this.config.style;

      this.card.updateComplete.then(() => {
        (this.card.shadowRoot || this.card).appendChild(styleEl);
      });
    }
  }

  set hass(hass) {
    this._hass = hass;
    this.card.hass = hass;
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

    if (!this.config || !this._hass) return;

    const oldHass = changedProps.get("_hass");
    const oldConfig = changedProps.get("_config");

    if (
      !oldHass ||
      !oldConfig ||
      oldHass.themes !== this._hass.themes ||
      oldConfig.theme !== this.config.theme
    ) {
      applyThemesOnElement(this, this._hass.themes, this.config.theme);
    }
  }

  getCardSize() {
    return computeCardSize(this.card);
  }
}

(async () => {
  while (customElements.get("home-assistant") === undefined)
    await new Promise(resolve => window.setTimeout(resolve, 100));

  if (!customElements.get("canary-card")) {
    customElements.define("canary-card", CanaryCard);
    console.groupCollapsed(
      `%c ${__NAME__} %c ${__VERSION__} `,
      "color: #212121; background: #fdd835; font-weight: 700;",
      "color: #fdd835; background: #212121; font-weight: 700;"
    );
    console.info(`branch   : ${__BRANCH__}`);
    console.info(`commit   : ${__COMMIT__}`);
    console.info(`built at : ${__BUILD_TIME__}`);
    console.info(__REPO_URL__);
    console.groupEnd();
  }
})();
