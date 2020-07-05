export function mapStyle(styleObject, prefix = "") {
  return Object.keys(styleObject)
    .reduce((style, rule) => {
      return [...style, `${prefix}${rule}: ${styleObject[rule]};`];
    }, [])
    .join(" ");
}

export function coerceObject(data = {}) {
  return Array.isArray(data)
    ? data.reduce((obj, item) => ({ ...obj, ...item }), {})
    : data;
}

export function applyTheme(element, themes, localTheme) {
  if (localTheme in themes.themes) {
    for (const [key, value] of Object.entries(themes.themes[localTheme])) {
      element.style.setProperty("--" + key, value);
    }
  }
}
