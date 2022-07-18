export function oldExtractEntities(
  template: string,
  variables: Record<string, unknown> = {}
) {
  const RE_TEMPLATES = /\[\[\s(.*?)\s]]/g;

  const entity_ids: string[] = [];

  const matches = template.matchAll(RE_TEMPLATES);

  for (const match of matches) {
    const FUNCTION = /^\w+\(.*\)$/;
    const EXPR = /([^=<>!]+)\s*(?:==|!=|<|>|<=|>=)\s*([^=<>!]+)/;
    const SPECIAL = /^\{.+}$/;
    const CONDITION = /^\w+\((.*?),/;

    if (FUNCTION.test(match[1].trim())) {
      const conditionMatch = match[1].trim().match(CONDITION)?.[1];
      const splitExpression = conditionMatch?.match(EXPR) || [];

      for (let i = 1; i < splitExpression.length; i++) {
        const parts = splitExpression[i].trim().split(".");
        if (parts.length > 1) {
          if (SPECIAL.test(parts[0])) {
            if (variables.entity && parts[0].includes("{entity}")) {
              entity_ids.push(variables.entity as string);
            }
          } else {
            entity_ids.push(`${parts[0]}.${parts[1]}`);
          }
        }
      }
    } else {
      const parts = match[1].trim().split(".");
      if (parts.length > 1) {
        if (SPECIAL.test(parts[0])) {
          if (variables.entity && parts[0] === "{entity}") {
            entity_ids.push(variables.entity as string);
          }
        } else {
          entity_ids.push(`${parts[0]}.${parts[1]}`);
        }
      }
    }
  }

  return Array.from(new Set(entity_ids));
}
