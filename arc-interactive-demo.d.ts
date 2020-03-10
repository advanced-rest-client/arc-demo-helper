/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   arc-interactive-demo.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {html, css, LitElement} from 'lit-element';

export {ArcInteractiveDemo};

declare class ArcInteractiveDemo extends LitElement {
  readonly tabs: any;

  /**
   * Currently selected state's index in the `states` array.
   * Change dispatches `state-chanegd` custom event.
   */
  selectedState: object|null;

  /**
   * True when the configuration panel is opened.
   */
  opened: boolean|null|undefined;

  /**
   * The list of general style states for the element.
   * It renders list of tabs with labels from this array.
   */
  states: Array<String|null>|null;

  /**
   * When set it renders the component in dark theme.
   */
  dark: boolean|null|undefined;
  constructor();
  firstUpdated(): void;
  render(): any;
  _stateChangeHandler(e: any): void;
  _toggleOptions(): void;
  _updateTabsAnimation(): void;
  _updateOptionsTabindex(): void;
  _activateOptionNode(node: any): void;
  _deactivateOptionNode(node: any): void;
}

declare global {

  interface HTMLElementTagNameMap {
    "arc-interactive-demo": ArcInteractiveDemo;
  }
}