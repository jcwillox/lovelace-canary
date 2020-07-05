import { NO_CARD_STYLE, VERTICAL_STACK_IN_CARD_STYLE } from "../const";
import { extensionEnabled, moduleEnabled } from "../utils";
import { createModule } from "../module";

const MODULE = "vertical-stack";
const ELEMENT = "hui-vertical-stack-card";

if (moduleEnabled(MODULE)) {
  const applyStyles = async function (element) {
    // exit clause.
    if (!element) return;

    await element.updateComplete;

    if (element.tagName === "HA-CARD") {
      element.style.transition = "none";
      Object.assign(element.style, NO_CARD_STYLE);
      element.offsetHeight;
      element.style.transition = "";
    }

    // depth search.
    if (element.firstElementChild) {
      await applyStyles(element.firstElementChild);
    }
    if (element.shadowRoot) {
      await applyStyles(element.shadowRoot.firstElementChild);
    }
    // breadth search.
    if (element.nextElementSibling) {
      await applyStyles(element.nextElementSibling);
    }
  };

  createModule(ELEMENT, function () {
    if (
      this._config.in_card === true &&
      extensionEnabled(this._config, "in_card")
    ) {
      // remove space between cards in the stack add ha-card background.
      let styleElement = document.createElement("style");
      styleElement.innerHTML = VERTICAL_STACK_IN_CARD_STYLE;
      this.shadowRoot.appendChild(styleElement);

      // remove style from all ha-card child elements.
      let divElement = this.shadowRoot.querySelector("#root");
      applyStyles(divElement);
    }
  });
}
