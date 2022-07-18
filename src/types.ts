import { HomeAssistant, LovelaceCard } from "custom-card-helpers";
import { LitElement, PropertyValues } from "lit";
import { LovelaceCardConfig } from "custom-card-helpers/src/types";
import { StyleInfo } from "lit/directives/style-map.js";

declare global {
  interface HTMLElementTagNameMap {
    "hui-error-card": LovelaceCard;
  }
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
