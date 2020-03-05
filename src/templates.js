export function oldExtractEntities(template, variables = null) {
  let RE_TEMPLATES = /\[\[\s(.*?)\s\]\]/g;

  let entity_ids = [];

  let matches = template.matchAll(RE_TEMPLATES);

  for (const match of matches) {
    const FUNCTION = /^[a-zA-Z0-9_]+\(.*\)$/;
    const EXPR = /([^=<>!]+)\s*(?:==|!=|<|>|<=|>=)\s*([^=<>!]+)/;
    const SPECIAL = /^\{.+\}$/;
    const CONDITION = /^[a-zA-Z0-9_]+\((.*?),/;

    if (FUNCTION.test(match[1].trim())) {
      let conditionMatch = match[1].trim().match(CONDITION)[1];
      let splitExpression = conditionMatch.match(EXPR);

      for (let i = 1; i < splitExpression.length; i++) {
        let parts = splitExpression[i].trim().split(".");
        if (parts.length > 1) {
          if (SPECIAL.test(parts[0])) {
            if (variables.entity && parts[0].includes("{entity}")) {
              entity_ids.push(variables.entity);
            }
          } else {
            entity_ids.push(`${parts[0]}.${parts[1]}`);
          }
        }
      }
    } else {
      let parts = match[1].trim().split(".");
      if (parts.length > 1) {
        if (SPECIAL.test(parts[0])) {
          if (variables.entity && parts[0] === "{entity}") {
            entity_ids.push(variables.entity);
          }
        } else {
          entity_ids.push(`${parts[0]}.${parts[1]}`);
        }
      }
    }
  }

  return Array.from(new Set(entity_ids));
}

// light.bed_light [[ light.bed_light ]] [[ sensor.time.state ]] [[ light.kitchen_light.attributes.icon ]] [[ {user} ]] [[  if(light.bed_light == light.desk_leds, "The lights are on", "Its dark")  ]]
