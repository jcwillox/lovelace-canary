import { parseOldTemplate } from "card-tools/src/old-templates";
import { subscribeRenderTemplate } from "card-tools/src/templates.js";
import { HomeAssistant } from "custom-card-helpers";
import { oldExtractEntities } from "./templates";

interface SecondaryInfoConfig {
  template: Record<string, unknown> | string;
  variables?: {
    config?: {
      entity?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  entity_ids?: string[];
}

class SecondaryInfo extends HTMLElement {
  private _disconnected = true;
  private _data!: SecondaryInfoConfig;
  private _hass?: HomeAssistant;
  private _isJinjaTemplate = false;
  private _isOldTemplate = false;
  private _element?: Element;
  private _unsubRenderTemplate?: Promise<() => Promise<void>>;

  disconnectedCallback() {
    this._disconnect();
  }
  connectedCallback() {
    this._disconnected = false;
    if (!this._isJinjaTemplate) this._updateNonJinjaTemplates(this._hass);
    else this._connect();
  }

  _hasJinjaTemplate(data) {
    if (typeof data.template === "object") return false;
    if (data.template.includes("{%")) return true;
    return data.template.includes("{{");
  }

  set template(data) {
    this._data = JSON.parse(JSON.stringify(data));

    // ignore entity_ids it's not an array.
    if (!Array.isArray(this._data.entity_ids))
      this._data.entity_ids = undefined;

    // setup booleans for type of template.
    this._isJinjaTemplate = this._hasJinjaTemplate(this._data);
    this._isOldTemplate =
      !this._isJinjaTemplate && typeof this._data.template !== "object";

    if (!this._isJinjaTemplate) {
      if (typeof this._data.template === "string") {
        if (!this._data.entity_ids) {
          this._data.entity_ids = oldExtractEntities(
            this._data.template as string,
            this._data.variables?.config
          );
        }
      } else {
        // configure the monitored entity_id for secondary info object type.
        const entity =
          (this._data.template.entity as string) ||
          this._data.variables?.config?.entity;
        if (entity) {
          this._data.entity_ids = [entity];
        }
      }
    }
  }

  update() {
    this._disconnect().then(() => this._connect());
  }

  _getElement() {
    // ensure secondary info div exists.
    if (!this._element) {
      const element = this.parentNode?.querySelector(".secondary");
      if (element) {
        this._element = element;
        this._element.innerHTML = "Loading...";
      }
    }
    return this._element;
  }

  set hass(hass) {
    if (!this._isJinjaTemplate && !this._disconnected && this._data.template) {
      if (this._shouldUpdate(hass, this._data.entity_ids)) {
        this._updateNonJinjaTemplates(hass);
      }
    }
    this._hass = hass;
  }

  _updateNonJinjaTemplates(hass) {
    if (!hass || !this._getElement()) {
      return;
    }

    if (this._isOldTemplate) {
      if (this._element)
        this._element.innerHTML = parseOldTemplate(
          this._data.template,
          this._data.variables?.config
        );
    } else if (typeof this._data.template !== "string") {
      const template = this._data.template;
      const entity = this._data.entity_ids?.[0]; // exactly one can be configured for this type.

      if (!entity) {
        return;
      }

      let state = hass.states[entity];
      state = template.attribute
        ? state.attributes[template.attribute as string]
        : state.state;

      if (state && this._element) {
        this._element.innerHTML = `${template.prefix || ""}${state}${
          template.postfix || ""
        }`;
      }
    }
  }

  _shouldUpdate(newHass, entities) {
    if (!this._hass || !entities) return true;
    return entities.some(
      entity => newHass.states[entity] !== this._hass?.states[entity]
    );
  }

  async _connect() {
    if (!this._data) return;

    if (!this._isJinjaTemplate) return;

    if (this._unsubRenderTemplate) return;

    if (!this._getElement()) return;

    // show loading message if this is the first connection.
    this._unsubRenderTemplate = subscribeRenderTemplate(
      null,
      result => {
        this._element && (this._element.innerHTML = result);
      },
      this._data
    );

    await this._unsubRenderTemplate?.catch(() => {
      if (this._element)
        if (typeof this._data.template === "string") {
          this._element.innerHTML = this._data.template;
        } else {
          this._element.innerHTML = JSON.stringify(this._data.template);
        }
      this._unsubRenderTemplate = undefined;
    });
  }

  async _disconnect() {
    this._disconnected = true; // make sure we don't update needlessly.

    if (this._unsubRenderTemplate) {
      try {
        const unsub = await this._unsubRenderTemplate;
        this._unsubRenderTemplate = undefined;
        await unsub();
      } catch (e) {
        if (typeof e === "object" && e?.["code"] !== "not_found") throw e;
      }
    }
  }
}

customElements.define("secondary-info", SecondaryInfo);
