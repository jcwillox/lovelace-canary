export const DEFAULT_SECONDARY_INFO = [
  "entity-id",
  "last-changed",
  "last-updated",
  "last-triggered",
  "position",
  "tilt-position",
  "brightness",
];

// language=CSS
export const VERTICAL_STACK_IN_CARD_STYLE = `
    #root > *:not(:first-child) {
      margin-top: -24px;
    }
`;

export const NO_CARD_STYLE = {
  boxShadow: "none",
  background: "none",
  border: "none",
};
