import { opts } from "./config/opts";
import { createLogger } from "./lib/create-logger";
import { doTranslate } from "./lib/do-translate";
import { gradioApp } from "./lib/gradio-app";
import { translateEl } from "./lib/translate-el";
import { getI18n, setup } from "./setup";

const customCSS = 
    `
    .bilingual__trans_wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    font-size: 13px;
    line-height: 1;
    }

    .bilingual__trans_wrapper em {
    font-style: normal;
    }

    #txtimg_hr_finalres .bilingual__trans_wrapper em,
    #tab_ti .output-html .bilingual__trans_wrapper em,
    #tab_ti .gradio-html .bilingual__trans_wrapper em,
    #sddp-dynamic-prompting .gradio-html .bilingual__trans_wrapper em,
    #available_extensions .extension-tag .bilingual__trans_wrapper em,
    #available_extensions .date_added .bilingual__trans_wrapper em,
    #available_extensions+p>.bilingual__trans_wrapper em,
    .gradio-image div[data-testid="image"] .bilingual__trans_wrapper em {
    display: none;
    }

    #settings .bilingual__trans_wrapper:not(#settings .tabitem .bilingual__trans_wrapper),
    label>span>.bilingual__trans_wrapper,
    fieldset>span>.bilingual__trans_wrapper,
    .label-wrap>span>.bilingual__trans_wrapper,
    .w-full>span>.bilingual__trans_wrapper,
    .context-menu-items .bilingual__trans_wrapper,
    .single-select .bilingual__trans_wrapper, ul.options .inner-item + .bilingual__trans_wrapper,
    .output-html .bilingual__trans_wrapper:not(th .bilingual__trans_wrapper),
    .gradio-html .bilingual__trans_wrapper:not(th .bilingual__trans_wrapper, .posex_cont .bilingual__trans_wrapper),
    .output-markdown .bilingual__trans_wrapper,
    .gradio-markdown .bilingual__trans_wrapper,
    .gradio-image>div.float .bilingual__trans_wrapper,
    .gradio-file>div.float .bilingual__trans_wrapper,
    .gradio-code>div.float .bilingual__trans_wrapper,
    .posex_setting_cont .bilingual__trans_wrapper:not(.posex_bg .bilingual__trans_wrapper), /* Posex extension */
    #dynamic-prompting .bilingual__trans_wrapper
    {
    font-size: 12px;
    align-items: flex-start;
    }

    #extensions label .bilingual__trans_wrapper,
    #available_extensions td .bilingual__trans_wrapper,
    .label-wrap>span>.bilingual__trans_wrapper {
    font-size: inherit;
    line-height: inherit;
    }

    .label-wrap>span:first-of-type {
    font-size: 13px;
    line-height: 1;
    }

    #txt2img_script_container > div {
    margin-top: var(--layout-gap, 12px);
    }

    textarea::placeholder {
    line-height: 1;
    padding: 4px 0;
    }

    label>span {
    line-height: 1;
    }

    div[data-testid="image"] .start-prompt {
    background-color: rgba(255, 255, 255, .6);
    color: #222;
    transition: opacity .2s ease-in-out;
    }
    div[data-testid="image"]:hover .start-prompt {
    opacity: 0;
    }

    .label-wrap > span.icon {
    width: 1em;
    height: 1em;
    transform-origin: center center;
    }

    .gradio-dropdown ul.options li.item {
    padding: 0.3em 0.4em !important;
    }

    /* Posex extension */
    .posex_bg {
    white-space: nowrap;
    }
    `

export function init() {
    // Add style to dom
    const styleEl = document.createElement('style');

    if (styleEl.textContent) {
        styleEl.textContent = customCSS;
    } else {
      styleEl.appendChild(document.createTextNode(customCSS));
    }
    gradioApp().appendChild(styleEl);

    let loaded = false
    let _count = 0

    const observer = new MutationObserver(mutations => {
    // @ts-ignore
      if (window.localization && Object.keys(window.localization).length) return; // disabled if original translation enabled
      if (Object.keys(opts).length === 0) return; // does nothing if opts is not loaded

      let _nodesCount = 0, _now = performance.now()

      for (const mutation of mutations) {
        if (mutation.type === 'characterData') {
          if (mutation.target?.parentElement?.parentElement?.tagName === 'LABEL') {
            translateEl(mutation.target)
          }
        } else if (mutation.type === 'attributes') {
          _nodesCount++
          translateEl(mutation.target)
        } else {
            mutation.addedNodes.forEach(node => {
                if (node instanceof Element && node.className === 'bilingual__trans_wrapper') return; // NodeがElement型であることを確認
    
                _nodesCount++;
                if (node.nodeType === 1 && node instanceof Element && /(output|gradio)-(html|markdown)/.test(node.className)) { // nodeがElement型であることを確認
                    translateEl(node, { rich: true });
                } else if (node.nodeType === 3) {
                    doTranslate(node, node.textContent, 'text');
                } else {
                    translateEl(node, { deep: true });
                }
            });
        }
      }

      if (_nodesCount > 0) {
        const logger = createLogger()
        logger.info(`UI Update #${_count++}: ${performance.now() - _now} ms, ${_nodesCount} nodes`, mutations)
      }

      if (loaded) return;
      const i18n = getI18n()
      if (i18n) return;

      loaded = true
      setup()
    })

    observer.observe(gradioApp(), {
      characterData: true,
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['title', 'placeholder']
    })
  }