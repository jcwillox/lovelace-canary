import { HomeAssistant, LovelaceCard } from "custom-card-helpers";
import { LovelaceCardConfig } from "custom-card-helpers/src/types";
import { LitElement, PropertyValues } from "lit";
import { StyleInfo } from "lit/directives/style-map.js";

declare global {
  interface HTMLElementTagNameMap {
    "hui-error-card": LovelaceCard;
  }

  const __NAME__: string;
  const __BRANCH__: string;
  const __COMMIT__: string;
  const __VERSION__: string;
  const __REPO_URL__: string;
  const __BUILD_TIME__: string;
}

export interface CanaryCardConfig extends LovelaceCardConfig {
  theme?: string;
  style?: string | StyleInfo;
  card: LovelaceCardConfig;
}

export interface LovelaceElement<Config = Record<string, unknown>>
  extends LitElement {
  hass?: HomeAssistant;
  config?: Config;
  _config?: Config;
}

export type FirstUpdatedFn<Config> = (
  this: LovelaceElement<Config>,
  changedProperties: PropertyValues
) => void;
