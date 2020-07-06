import { logVersion } from "./logging";
import { name, version } from "../package.json";
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
import "./modules/canary-card"

logVersion(name, version, "#fdd835", "#212121");