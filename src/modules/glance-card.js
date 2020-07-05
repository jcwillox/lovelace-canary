import { extensionEnabled, moduleEnabled } from "../utils";
import { createModule } from "../module";

const MODULE = "glance-card";
const ELEMENT = "hui-glance-card";

if (moduleEnabled(MODULE)) {
  const getAlignment = function (alignment) {
    switch (alignment) {
      case "center":
        return "space-evenly";
      case "right":
        return "flex-end";
      default:
        return "flex-start";
    }
  };

  createModule(ELEMENT, function () {
    if (this._config.align && extensionEnabled(this._config, "align")) {
      this.shadowRoot.querySelector(
        ".entities"
      ).style.justifyContent = getAlignment(this._config.align);
    }
  });
}
