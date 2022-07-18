import { StyleInfo } from "lit/directives/style-map";

export function mapStyle(styleObject: StyleInfo, prefix = "") {
  return Object.keys(styleObject)
    .reduce((styles: string[], rule) => {
      return [...styles, `${prefix}${rule}: ${styleObject[rule]};`];
    }, [])
    .join(" ");
}
