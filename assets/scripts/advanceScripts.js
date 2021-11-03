/**
 * This is an indelectual property of AdvanceServices (advancesvs.com)
 * Copying this software may result in legal implications.
 * Developed by @michelakis
 */

/**
 * Select an element by id and call the click function
 * Requires targetId & keyboardKey attributes
 *
 * @class ClickIt
 * @extends {HTMLElement}
 */
class ClickIt extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["keyboardKey", "targetId"];
  }
  connectedCallback() {
    this.addListener(
      this.getAttribute("keyboardKey"),
      this.getAttribute("targetId")
    );
  }

  addListener(keyboardKey, targetId) {
    window.addEventListener("keypress", function (event) {
      if (event.key === keyboardKey) {
        event.preventDefault();
        this._shadowRoot.getElementById(targetId).click();
      }
    });
  }
}

customElements.define("click-element", ClickIt);
