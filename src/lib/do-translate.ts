import { getI18n, getI18nScope, getScopedSource, getConfig } from "../setup"
import { checkRegex } from "./check-regax"
import { htmlEncode } from "./html-encode"
import { parseHtmlStringToElement } from "./parse-html-string-to-element"

const re_num = /^[\.\d]+$/
const re_emoji = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u

export function doTranslate(el, source, type) {
    if (!getI18n) return // translation not ready.
    source = source.trim()
    if (!source) return
    if (re_num.test(source)) return
    if (re_emoji.test(source)) return

    let translation = getI18n[source] || checkRegex(source),
      scopes = getScopedSource[source]

    if (scopes) {
      console.log('scope', el, source, scopes);
      for (let scope of scopes) {
        if (el.parentElement.closest(scope)) {
          translation = getI18nScope[scope][source]
          break
        }
      }
    }

    if (!translation || source === translation) {
      if (el.textContent === '__biligual__will_be_replaced__') el.textContent = source // restore original text if translation not exist
      if (el.nextSibling?.className === 'bilingual__trans_wrapper') el.nextSibling.remove() // remove exist translation if translation not exist
      return
    }

    const config = getConfig()

    if (config?.order === "Original First") {
      [source, translation] = [translation, source]
    }

    switch (type) {
        case 'text':
          el.textContent = translation;
          break;
      
        case 'element':
          const htmlStr = `<div class="bilingual__trans_wrapper">${htmlEncode(translation)}<em>${htmlEncode(source)}</em></div>`;
          const htmlEl = parseHtmlStringToElement(htmlStr);
      
          if (el.hasChildNodes()) {
            const textNode = Array.from(el.childNodes).find(node =>
              (node as Text).nodeType === Node.TEXT_NODE && // Ensure it's a text node
              (node as Text).textContent?.trim() === source ||
              (node as Text).textContent?.trim() === '__bilingual__will_be_replaced__'
            ) as Text | undefined;
      
            if (textNode) {
              textNode.textContent = '';
              if (textNode.nextSibling?.nodeType === Node.ELEMENT_NODE && (textNode.nextSibling as HTMLElement).className === 'bilingual__trans_wrapper') {
                textNode.nextSibling.remove();
              }
              if (textNode.parentNode && htmlEl) { // Ensure htmlEl is not null
                textNode.parentNode.insertBefore(htmlEl, textNode.nextSibling);
              }
            }
          } else {
            el.textContent = '';
            if (el.nextSibling?.nodeType === Node.ELEMENT_NODE && (el.nextSibling as HTMLElement).className === 'bilingual__trans_wrapper') {
              el.nextSibling.remove();
            }
            if (el.parentNode && htmlEl) { // Ensure htmlEl is not null
              el.parentNode.insertBefore(htmlEl, el.nextSibling);
            }
          }
          break;
      
        case 'option':
          el.textContent = `${translation} (${source})`;
          break;
      
        case 'title':
          el.title = `${translation}\n${source}`;
          break;
      
        case 'placeholder':
          el.placeholder = `${translation}\n\n${source}`;
          break;
      
        default:
          return translation;
      }      
  }