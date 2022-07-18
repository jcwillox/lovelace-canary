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
import "./modules/canary-card";

console.groupCollapsed(
  `%c ${__NAME__} %c ${__VERSION__} `,
  `color: #212121; background: #fdd835; font-weight: 700;`,
  `color: #fdd835; background: #212121; font-weight: 700;`
);
console.info(`BRANCH   : ${__BRANCH__}`);
console.info(`COMMIT   : ${__COMMIT__}`);
console.info(`BUILT AT : ${__BUILD_TIME__}`);
console.info(__REPO_URL__);
console.groupEnd();
