export const DEFAULT_SECONDARY_INFO = [
  "entity-id",
  "last-changed",
  "last-triggered",
];

export const VERTICAL_STACK_IN_CARD_STYLE =
  `
    #root > *:not(:first-child) {
      margin-top: -24px;
    }
` + customElements.get("ha-card").getStyles().cssText;

export const NO_CARD_STYLE = {
  boxShadow: "none",
  background: "none",
};
