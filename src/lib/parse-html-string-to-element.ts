export function parseHtmlStringToElement(htmlStr) {
    const template = document.createElement('template')
    template.insertAdjacentHTML('afterbegin', htmlStr)
    return template.firstElementChild
}