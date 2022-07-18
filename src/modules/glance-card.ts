import { extensionEnabled, moduleEnabled } from "../utils";
import { createModule } from "../module";

const MODULE = "glance-card";
const ELEMENT = "hui-glance-card";

type AlignmentOption = "left" | "center" | "right";
interface Config {
  align?: AlignmentOption;
}

if (moduleEnabled(MODULE)) {
  const getAlignment = function (alignment: AlignmentOption) {
    switch (alignment) {
      case "center":
        return "space-evenly";
      case "right":
        return "flex-end";
      default:
        return "flex-start";
    }
  };

  createModule<Config>(ELEMENT, function () {
    if (this._config?.align && extensionEnabled(this._config, "align")) {
      const el = this.shadowRoot?.querySelector<HTMLElement>(".entities");
      if (el) {
        el.style.justifyContent = getAlignment(this._config.align);
      }
    }
  });
}
