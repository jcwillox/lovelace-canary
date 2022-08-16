import { name } from "../package.json";
import { fireEvent } from "custom-card-helpers";

// allow dynamic updating of secondary info.
import "./secondary-info";
// adds three methods to add secondary info to entity rows.
import "./modules/generic-entity-row";
// adds the no_card option.
import "./modules/generic-card";
// adds the in_card option.
import "./modules/vertical-stack";
// adds the align option.
import "./modules/glance-card";
// adds hide warning option.
import "./modules/warning";
// adds the canary-card card.
import "./canary-card";

function getResources() {
  const scriptElements = document.querySelectorAll("script");
  const retVal: string[] = [];
  for (const script of scriptElements) {
    if (script?.innerText?.trim()?.startsWith("import(")) {
      const imports = script.innerText.split("\n")?.map(e => e.trim());
      for (const imp of imports) {
        retVal.push(imp.replace(/^import\("/, "").replace(/"\);/, ""));
      }
    }
  }
  return retVal;
}

const resources = getResources();
if (resources.some(r => r.endsWith(name + ".js"))) {
  console.info(`${name} is loaded as a module`);
} else {
  fireEvent(window, "ll-rebuild", {});
  console.info(
    `You may not be getting optimal performance out of ${name}.\nSee https://github.com/thomasloven/lovelace-card-mod#performance-improvements`
  );
}
