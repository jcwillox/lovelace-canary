import { createModule } from "../module";
import { extensionEnabled, findConfig, moduleEnabled } from "../utils";

const MODULE = "warning";
const ELEMENT = "hui-warning";

interface Config {
  hide_warning?: boolean;
}

if (moduleEnabled(MODULE)) {
  createModule(ELEMENT, function () {
    const config: Config = findConfig(this);
    if (
      config.hide_warning === true &&
      extensionEnabled(config, "hide_warning")
    ) {
      this.style.display = "none";
    }
  });
}
