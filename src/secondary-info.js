import { subscribeRenderTemplate } from "card-tools/src/templates.js";
import { parseOldTemplate } from "card-tools/src/old-templates";
import { oldExtractEntities } from "./templates";

class SecondaryInfo extends HTMLElement {
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
    // console.log("Template", data);
    this._data = JSON.parse(JSON.stringify(data));

    // ignore entity_ids it's not an array.
    if (!Array.isArray(this._data.entity_ids))
      this._data.entity_ids = undefined;

    // setup booleans for type of template.
    this._isJinjaTemplate = this._hasJinjaTemplate(this._data);
    this._isOldTemplate =
      !this._isJinjaTemplate && typeof this._data.template !== "object";

    if (!this._isJinjaTemplate) {
      if (this._isOldTemplate) {
        if (!this._data.entity_ids) {
          this._data.entity_ids = oldExtractEntities(
            this._data.template,
            this._data.variables.config
          );
        }
      } else {
        // configure the monitored entity_id for secondary info object type.
        this._data.entity_ids = [
          this._data.template.entity || this._data.variables.config.entity
        ];
      }
    }
  }

  update() {
    this._disconnect().then(() => this._connect());
    // console.log("Update", this._data.template)
  }

  _getElement() {
    // ensure secondary info div exists.
    if (!this._element) {
      let element = this.parentNode.querySelector(".secondary");
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
    if (!hass) return;

    if (this._isOldTemplate) {
      this._getElement().innerHTML = parseOldTemplate(
        this._data.template,
        this._data.variables.config
      );
      // console.log(this._data.template);
    } else {
      let template = this._data.template;
      let entity = this._data.entity_ids[0]; // exactly one can be configured for this type.
      // console.log(template);

      let state = hass.states[entity];
      state = template.attribute
        ? state.attributes[template.attribute]
        : state.state;

      if (state) {
        this._getElement().innerHTML = `${template.prefix ||
          ""}${state}${template.postfix || ""}`;
      }
    }
  }

  _shouldUpdate(newHass, entities) {
    if (!this._hass || !entities) return true;
    return entities.some(
      entity => newHass.states[entity] !== this._hass.states[entity]
    );
  }

  async _connect() {
    if (!this._data) return;

    if (!this._isJinjaTemplate) return;

    if (this._unsubRenderTemplate) return;

    // show loading message if this if the first connection.
    this._getElement();

    this._unsubRenderTemplate = subscribeRenderTemplate(
      null,
      result => {
        this._getElement().innerHTML = result;
        // console.log(this._data.template);
      },
      this._data
    );

    await this._unsubRenderTemplate.catch(() => {
      this._getElement().innerHTML = this._data.template;
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
        if (e.code !== "not_found") throw e;
      }
    }
  }
}

customElements.define("secondary-info", SecondaryInfo);
