import { NO_CARD_STYLE, VERTICAL_STACK_IN_CARD_STYLE } from "../const";
import { extensionEnabled, moduleEnabled } from "../utils";
import { createModule } from "../module";
import { LovelaceCard } from "custom-card-helpers";

const MODULE = "vertical-stack";
const ELEMENT = "hui-vertical-stack-card";

interface CardWithStyles extends LovelaceCard, CustomElementConstructor {
  styles?: {
    cssText: string;
  };
}

interface Config {
  in_card?: boolean;
}

if (moduleEnabled(MODULE)) {
  const applyStyles = async function (element) {
    // exit clause.
    if (!element) return;

    await element.updateComplete;

    if (element.tagName === "HA-CARD") {
      element.style.transition = "none";
      Object.assign(element.style, NO_CARD_STYLE);
      // flush css
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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

  // require ha-card to be defined so that we can take its style
  customElements.whenDefined("ha-card").then(() => {
    const IN_CARD_STYLE =
      VERTICAL_STACK_IN_CARD_STYLE +
      (customElements.get("ha-card") as CardWithStyles).styles?.cssText;

    createModule<Config>(ELEMENT, function () {
      if (
        this._config?.in_card === true &&
        extensionEnabled(this._config, "in_card")
      ) {
        // remove space between cards in the stack add ha-card background.
        const styleElement = document.createElement("style");
        styleElement.innerHTML = IN_CARD_STYLE;
        this.shadowRoot?.appendChild(styleElement);

        // remove style from all ha-card child elements.
        const divElement = this.shadowRoot?.querySelector("#root");
        applyStyles(divElement);
      }
    });
  });
}
