import { lovelace } from "card-tools/src/hass";

export const findConfig = function(node) {
  if (node.config) return node.config;
  if (node._config) return node._config;
  if (node.host) return findConfig(node.host);
  if (node.parentElement) return findConfig(node.parentElement);
  if (node.parentNode) return findConfig(node.parentNode);
  return null;
};

const lovelaceConfig = lovelace();
const canaryConfig = lovelaceConfig && lovelaceConfig.config.canary;

export function moduleEnabled(module) {
  if (canaryConfig && canaryConfig.disable) {
    return !canaryConfig.disable.includes(module);
  }
  return true;
}

export function extensionEnabled(config, extension) {
  let disableConfig = config.disable_canary;
  // check: all extensions are enabled.
  if (!disableConfig) return true;
  // check: all extensions are disabled.
  if (disableConfig === true) return false;
  // check: specific extensions are disabled.
  return !disableConfig.includes(extension);
}
