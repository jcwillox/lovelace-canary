import { extensionEnabled, findConfig, moduleEnabled } from "./utils";
import { createModule } from "./module";

const MODULE = "warning";
const ELEMENT = "hui-warning";

if (moduleEnabled(MODULE)) {
  createModule(ELEMENT, function () {
    const config = findConfig(this);
    if (
      config &&
      config.hide_warning === true &&
      extensionEnabled(config, "hide_warning")
    ) {
      this.style.display = "none";
    }
  });
}
