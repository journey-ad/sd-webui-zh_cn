import { delegateEvent } from "./delegate-event";
import { doTranslate } from "./do-translate";
import { gradioApp } from "./gradio-app";

export function handleDropdown() {
    // process gradio dropdown menu
    delegateEvent(gradioApp(), 'mousedown', 'ul.options .item', function (event) {
      const { target } = event

      if (!target.classList.contains('item')) {
        // simulate click menu item
        target.closest('.item').dispatchEvent(new Event('mousedown', { bubbles: true }))
        return
      }

      const source = target.dataset.value
      const $labelEl = target?.closest('.wrap')?.querySelector('.wrap-inner .single-select') // the label element

      if (source && $labelEl) {
        // @ts-ignore
        $labelEl.title = titles?.[source] || '' // set title from hints.js
        $labelEl.textContent = "__biligual__will_be_replaced__" // marked as will be replaced
        doTranslate($labelEl, source, 'element') // translate the label element
      }
    });
  }