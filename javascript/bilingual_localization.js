var m={bilingual_localization_enabled:!0,bilingual_localization_logger:!1,bilingual_localization_file:"None",bilingual_localization_dirs:"{}",bilingual_localization_order:"Translation First"};function w(){const i=new Map,n={badge:!0,label:"Logger",enable:!1};return new Proxy(console,{get:(r,t)=>{if(t==="init")return(f)=>{n.label=f,n.enable=!0};if(!(t in r))return;return(...f)=>{if(!n.enable)return;let a=["#39cfe1","#006cab"],o,c;switch(t){case"error":a=["#f70000","#a70000"];break;case"warn":a=["#f7b500","#b58400"];break;case"time":if(o=f[0],i.has(o))console.warn(`Timer '${o}' already exists`);else i.set(o,performance.now());return;case"timeEnd":if(o=f[0],c=i.get(o),c===void 0)console.warn(`Timer '${o}' does not exist`);else i.delete(o),console.log(`${o}: ${performance.now()-c} ms`);return;case"groupEnd":n.badge=!0;break}const e=n.badge?[`%c${n.label}`,`color: #fff; background: linear-gradient(180deg, ${a[0]}, ${a[1]}); text-shadow: 0px 0px 1px #0003; padding: 3px 5px; border-radius: 4px;`]:[];if(r[t](...e,...f),t==="group"||t==="groupCollapsed")n.badge=!1}}})}function q(i){let n=new XMLHttpRequest;return n.open("GET",`file=${i}`,!1),n.send(null),n.responseText}function C(i){try{i=i.trim();let n=i.split("/");if(i[0]!=="/"||n.length<3)return i=i.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&"),new RegExp(i);const r=n[n.length-1],t=i.lastIndexOf("/");return i=i.substring(1,t),new RegExp(i,r)}catch(n){return null}}function D(i,n,r,t){i.addEventListener(n,function(f){var a=f.target;while(a!==i){if(a.matches(r))t.call(a,f);a=a.parentNode}})}function x(){const i=document.getElementsByTagName("gradio-app"),n=i.length===0?document:i[0];if(n!==document)n.getElementById=function(r){return document.getElementById(r)};return n.shadowRoot?n.shadowRoot:n}function _(...i){return x()?.querySelectorAll(...i)||new NodeList}function M(){D(x(),"mousedown","ul.options .item",function(i){const{target:n}=i;if(!n.classList.contains("item")){n.closest(".item").dispatchEvent(new Event("mousedown",{bubbles:!0}));return}const r=n.dataset.value,t=n?.closest(".wrap")?.querySelector(".wrap-inner .single-select");if(r&&t)t.title=titles?.[r]||"",t.textContent="__biligual__will_be_replaced__",p(t,r,"element")})}function u(i,{deep:n=!1,rich:r=!1}={}){if(!l)return;if(i.matches?.(E))return;if(i.title)p(i,i.title,"title");if(i.placeholder)p(i,i.placeholder,"placeholder");if(i.tagName==="OPTION")p(i,i.textContent,"option");if(n||r)Array.from(i.childNodes).forEach((t)=>{if(t.nodeName==="#text"){if(r){p(t,t.textContent,"text");return}if(n)p(t,t.textContent,"element")}else if(t.childNodes.length>0)u(t,{deep:n,rich:r})});else p(i,i.textContent,"element")}var E=[".bilingual__trans_wrapper",".resultsFlexContainer","#setting_sd_model_checkpoint select","#setting_sd_vae select","#txt2img_styles, #img2txt_styles",".extra-network-cards .card .actions .name","script, style, svg, g, path"];function y(){if(!l())return;const i=w();i.time("Full Page");const n=["label span, fieldset span, button","textarea[placeholder], select, option",".transition > div > span:not([class])",".label-wrap > span",".gradio-image>div.float",".gradio-file>div.float",".gradio-code>div.float","#modelmerger_interp_description .output-html","#modelmerger_interp_description .gradio-html","#lightboxModal span"],r=['div[data-testid="image"] > div > div',"#extras_image_batch > div",".output-html:not(#footer), .gradio-html:not(#footer), .output-markdown, .gradio-markdown","#dynamic-prompting"];n.forEach((t)=>{_(t).forEach((f)=>u(f,{deep:!0}))}),r.forEach((t)=>{_(t).forEach((f)=>u(f,{rich:!0}))}),i.timeEnd("Full Page")}function T(){z={enabled:m.bilingual_localization_enabled,file:m.bilingual_localization_file,dirs:m.bilingual_localization_dirs,order:m.bilingual_localization_order,enableLogger:m.bilingual_localization_logger};let{enabled:i,file:n,dirs:r,enableLogger:t}=z;if(!i||n==="None"||r==="None")return;const f=JSON.parse(r),a=w();if(t)a.init("Bilingual");a.log("Bilingual Localization initialized.");const o=/^##(?<scope>.+)##(?<skey>.+)$/;B=JSON.parse(q(f[n]),(c,e)=>{if(c.startsWith("@@")){const g=C(c.slice(2));if(g instanceof RegExp)O.set(g,e)}else{const g=c.match(o);if(g&&g.groups){let{scope:b,skey:s}=g.groups;if(b.startsWith("@"))b=b.slice(1);else b="#"+b;if(!b.length)return e;R[b]||={},R[b][s]=e,L[s]||=[],L[s].push(b)}else return e}}),y(),M()}function l(){return B}function H(){return O}function S(){return R}function h(){return L}function k(){return z}var B=null,O=new Map,R={},L={},z=null;function v(i){const n=H();for(let[r,t]of n.entries())if(r instanceof RegExp){if(r.test(i))return w().log("regex",r,i,t),i.replace(r,t)}else console.warn("Expected regex to be an instance of RegExp, but it was a string.");return i}function $(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function F(i){const n=document.createElement("template");return n.insertAdjacentHTML("afterbegin",i),n.firstElementChild}function p(i,n,r){if(!l)return;if(n=n.trim(),!n)return;if(I.test(n))return;if(J.test(n))return;let t=l[n]||v(n),f=h[n];if(f){console.log("scope",i,n,f);for(let o of f)if(i.parentElement.closest(o)){t=S[o][n];break}}if(!t||n===t){if(i.textContent==="__biligual__will_be_replaced__")i.textContent=n;if(i.nextSibling?.className==="bilingual__trans_wrapper")i.nextSibling.remove();return}if(k()?.order==="Original First")[n,t]=[t,n];switch(r){case"text":i.textContent=t;break;case"element":const o=`<div class="bilingual__trans_wrapper">${$(t)}<em>${$(n)}</em></div>`,c=F(o);if(i.hasChildNodes()){const e=Array.from(i.childNodes).find((g)=>g.nodeType===Node.TEXT_NODE&&g.textContent?.trim()===n||g.textContent?.trim()==="__bilingual__will_be_replaced__");if(e){if(e.textContent="",e.nextSibling?.nodeType===Node.ELEMENT_NODE&&e.nextSibling.className==="bilingual__trans_wrapper")e.nextSibling.remove();if(e.parentNode&&c)e.parentNode.insertBefore(c,e.nextSibling)}}else{if(i.textContent="",i.nextSibling?.nodeType===Node.ELEMENT_NODE&&i.nextSibling.className==="bilingual__trans_wrapper")i.nextSibling.remove();if(i.parentNode&&c)i.parentNode.insertBefore(c,i.nextSibling)}break;case"option":i.textContent=`${t} (${n})`;break;case"title":i.title=`${t}\n${n}`;break;case"placeholder":i.placeholder=`${t}\n\n${n}`;break;default:return t}}var I=/^[\.\d]+$/,J=/[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u;function A(){const i=document.createElement("style");if(i.textContent)i.textContent=P;else i.appendChild(document.createTextNode(P));x().appendChild(i);let n=!1,r=0;new MutationObserver((f)=>{if(window.localization&&Object.keys(window.localization).length)return;if(Object.keys(m).length===0)return;let a=0,o=performance.now();for(let e of f)if(e.type==="characterData"){if(e.target?.parentElement?.parentElement?.tagName==="LABEL")u(e.target)}else if(e.type==="attributes")a++,u(e.target);else e.addedNodes.forEach((g)=>{if(g instanceof Element&&g.className==="bilingual__trans_wrapper")return;if(a++,g.nodeType===1&&g instanceof Element&&/(output|gradio)-(html|markdown)/.test(g.className))u(g,{rich:!0});else if(g.nodeType===3)p(g,g.textContent,"text");else u(g,{deep:!0})});if(a>0)w().info(`UI Update #${r++}: ${performance.now()-o} ms, ${a} nodes`,f);if(n)return;if(l())return;n=!0,T()}).observe(x(),{characterData:!0,childList:!0,subtree:!0,attributes:!0,attributeFilter:["title","placeholder"]})}var P=`
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
    `;document.addEventListener("DOMContentLoaded",()=>{A()});
