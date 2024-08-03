import { getI18n } from "../setup"
import { doTranslate } from "./do-translate"

const ignore_selector = [
    '.bilingual__trans_wrapper', // self
    '.resultsFlexContainer', // tag-autocomplete
    '#setting_sd_model_checkpoint select', // model checkpoint
    '#setting_sd_vae select', // vae model
    '#txt2img_styles, #img2txt_styles', // styles select
    '.extra-network-cards .card .actions .name', // extra network cards name
    'script, style, svg, g, path', // script / style / svg elements
]

export function translateEl(el, { deep = false, rich = false } = {}) {
    if (!getI18n) return // translation not ready.
    if (el.matches?.(ignore_selector)) return // ignore some elements.

    if (el.title) {
      doTranslate(el, el.title, 'title')
    }

    if (el.placeholder) {
      doTranslate(el, el.placeholder, 'placeholder')
    }

    if (el.tagName === 'OPTION') {
      doTranslate(el, el.textContent, 'option')
    }

    if (deep || rich) {
      Array.from(el.childNodes).forEach(node => {
        if ((node as Text).nodeName === '#text') {
          if (rich) {
            doTranslate(node, (node as Text).textContent, 'text')
            return
          }

          if (deep) {
            doTranslate(node, (node as Text).textContent, 'element')
          }
        } else if ((node as Text).childNodes.length > 0) {
          translateEl(node, { deep, rich })
        }
      })
    } else {
      doTranslate(el, el.textContent, 'element')
    }
  }