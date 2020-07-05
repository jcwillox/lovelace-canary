import { fireEvent } from "card-tools/src/event";

export function createModule(element, firstUpdated) {
  customElements.whenDefined(element).then(() => {
    const Element = customElements.get(element);
    const oFirstUpdated = Element.prototype.firstUpdated;

    Element.prototype.firstUpdated = function (changedProperties) {
      oFirstUpdated.call(this, changedProperties);
      firstUpdated.call(this, changedProperties);
    };

    fireEvent("ll-rebuild", {});
  });
}
