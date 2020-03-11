import { html, LitElement } from 'lit-element';
import '@anypoint-web-components/anypoint-tabs/anypoint-tabs.js';
import '@anypoint-web-components/anypoint-tabs/anypoint-tab.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import { close } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import styles from './ArcInteractiveStyles.js';

export class ArcInteractiveDemo extends LitElement {
  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      /**
       * True when the configuration panel is opened.
       */
      opened: { type: Boolean },
      /**
       * The list of general style states for the element.
       * It renders list of tabs with labels from this array.
       *
       * @type {Array<String>}
       */
      states: { type: Array },
      /**
       * Currently selected state's index in the `states` array.
       * Change dispatches `state-chanegd` custom event.
       * @type {Object}
       */
      selectedState: { type: Number },
      /**
       * When set it renders the component in dark theme.
       */
      dark: { type: Boolean, reflect: true }
    };
  }

  get tabs() {
    return this.shadowRoot.querySelector('anypoint-tabs');
  }

  get selectedState() {
    return this._selectedState;
  }

  set selectedState(value) {
    const old = this._selectedState;
    if (old === value) {
      return;
    }
    this._selectedState = value;
    this.requestUpdate('selectedState', old);
    this.dispatchEvent(new CustomEvent('state-chanegd', {
      detail: {
        value,
        state: this.states[value]
      }
    }));
  }

  get opened() {
    return this._opened;
  }

  set opened(value) {
    const old = this._opened;
    if (old === value) {
      return;
    }
    this._opened = value;
    this.requestUpdate('opened', old);
    this._updateTabsAnimation();
    this._updateOptionsTabindex();
  }

  constructor() {
    super();
    this.opened = false;
    this.states = [];
    this.selectedState = 0;
  }

  firstUpdated() {
    this._updateOptionsTabindex();
  }

  _stateChangeHandler(e) {
    this.selectedState = e.detail.value;
  }

  _toggleOptions() {
    this.opened = !this.opened;
  }

  _updateTabsAnimation() {
    if (this._updateTabsTimer) {
      clearTimeout(this._updateTabsTimer);
    }
    this._updateTabsTimer = setTimeout(() => {
      this._updateTabsTimer = undefined;
      this.tabs.notifyResize();
    }, 120);
  }

  _updateOptionsTabindex() {
    const slot = this.shadowRoot.querySelector('slot[name="options"]');
    if (!slot) {
      return;
    }
    const nodes = slot.assignedNodes();
    const opened = this.opened;
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      if (node.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }
      if (opened) {
        this._activateOptionNode(node);
      } else {
        this._deactivateOptionNode(node);
      }
    }
  }

  _activateOptionNode(node) {
    const old = node.dataset.oldTabindex;
    if (!old) {
      return;
    }
    node.setAttribute('tabindex', old);
    node.setAttribute('aria-hidden', 'false');
    delete node.dataset.oldTabindex;
  }

  _deactivateOptionNode(node) {
    const current = node.getAttribute('tabindex');
    if (!current) {
      return;
    }
    node.dataset.oldTabindex = current;
    node.setAttribute('tabindex', '-1');
    node.setAttribute('aria-hidden', 'true');
  }

  render() {
    return html`
    <div class="demo-content">
      <div class="content-selector">
        ${this._tabsTemplate()}
        ${this._triggerTemplate()}
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
    </div>
    ${this._configTemplate()}
    `;
  }

  _tabsTemplate() {
    const { states, selectedState } = this;
    return html`<anypoint-tabs
      .selected="${selectedState}"
      @selected-changed="${this._stateChangeHandler}"
      aria-label="Element state selection">
      ${states.map((item) => html`
        <anypoint-tab
          aria-label="Activate to enable state ${item}"
          aria-controls="stateContent"
        >${item}</anypoint-tab>
      `)}
    </anypoint-tabs>`;
  }

  _triggerTemplate() {
    const { opened } = this;
    return html`<anypoint-button
      ?hidden=${opened}
      @click="${this._toggleOptions}"
      tabindex="${opened ? '-1': '0'}"
      aria-label="Toggle configuration options"
      aria-controls="cnfPanel"
    >Options</anypoint-button>`;
  }

  _configTemplate() {
    const { opened } = this;
    const klass = opened ? 'opened' : '';
    const hdn = opened ? 'false' : 'true';
    return html`
    <div id="cnfPanel" class="demo-config ${klass}" aria-hidden="${hdn}">
      <div class="config-title">
        <h3>Configuration</h3>
        <anypoint-icon-button
          title="Close panel"
          aria-label="Close configuration panel"
          tabindex="${opened ? '0': '-1'}"
          @click="${this._toggleOptions}"
        >
          <span class="icon">${close}</span>
        </anypoint-icon-button>
      </div>
      <div class="options">
        <slot name="options"></slot>
      </div>
    </div>`;
  }
}