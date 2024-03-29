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

/**
 * Select elements using querySelectorAll
 * Add window.scrollTo(top) on click
 *
 * @class ScrollToTop
 * @extends {HTMLElement}
 */
 class ScrollToTop extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["querySelector"];
  }
  connectedCallback() {
    this.addListener(this.getAttribute("querySelector"));
  }

  addListener(querySelector) {
    let elements = document.querySelectorAll(querySelector);
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];
      element.addEventListener("click", function (event) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      });
    }
  }
}
customElements.define("scroll-to-top", ScrollToTop);