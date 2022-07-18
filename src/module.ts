import { FirstUpdatedFn } from "./types";
import { fireEvent } from "custom-card-helpers";

export function createModule<Config = Record<string, unknown>>(
  element: string,
  firstUpdated: FirstUpdatedFn<Config>
) {
  customElements.whenDefined(element).then(() => {
    const el = customElements.get(element) as CustomElementConstructor;
    const oFirstUpdated = el.prototype.firstUpdated;

    el.prototype.firstUpdated = function (changedProperties) {
      oFirstUpdated.call(this, changedProperties);
      firstUpdated.call(this, changedProperties);
    };

    fireEvent(window, "ll-rebuild", {});
  });
}
