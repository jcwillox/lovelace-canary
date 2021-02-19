export const DEFAULT_SECONDARY_INFO = [
  "entity-id",
  "last-changed",
  "last-triggered",
  "position",
  "tilt-position",
  "brightness"
];

export const VERTICAL_STACK_IN_CARD_STYLE = `
    #root > *:not(:first-child) {
      margin-top: -24px;
    }
`;

export const NO_CARD_STYLE = {
  boxShadow: "none",
  background: "none",
};
