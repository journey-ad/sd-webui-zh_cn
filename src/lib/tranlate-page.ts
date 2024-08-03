import { getI18n } from "../setup"
import { createLogger } from "./create-logger"
import { querySelectorAll } from "./gradio-app"
import { translateEl } from "./translate-el"

export function translatePage() {
    if (!getI18n()) return

    const logger = createLogger()
    logger.time('Full Page')

    
    // Define arrays of selectors
    const majorSelectors = [
      "label span, fieldset span, button", // major label and button description text
      "textarea[placeholder], select, option", // text box placeholder and select element
      ".transition > div > span:not([class])", ".label-wrap > span", // collapse panel added by extension
      ".gradio-image>div.float", // image upload description
      ".gradio-file>div.float", // file upload description
      ".gradio-code>div.float", // code editor description
      "#modelmerger_interp_description .output-html", // model merger description
      "#modelmerger_interp_description .gradio-html", // model merger description
      "#lightboxModal span" // image preview lightbox
    ];

    const minorSelectors = [
      'div[data-testid="image"] > div > div', // description of image upload panel
      '#extras_image_batch > div', // description of extras image batch file upload panel
      ".output-html:not(#footer), .gradio-html:not(#footer), .output-markdown, .gradio-markdown", // output html exclude footer
      '#dynamic-prompting' // dynamic-prompting extension
    ];

    // Process major selectors
    majorSelectors.forEach(selector => {
      querySelectorAll(selector).forEach(el => translateEl(el, { deep: true }))
    });

    // Process minor selectors
    minorSelectors.forEach(selector => {
      querySelectorAll(selector).forEach(el => translateEl(el, { rich: true }))
    });

    logger.timeEnd('Full Page')
}
