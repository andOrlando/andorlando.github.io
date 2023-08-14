import { marked as _marked } from "marked"
import { markedHighlight } from "marked-highlight"
import hljs from "highlight.js"

//set up marked
const options = markedHighlight({
  /*langPrefix: 'hljs language-',*/
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    let res = hljs.highlight(code, { language }).value;
    return res
  }
})
options.mangle = false;
options.headerIds = false;

_marked.use(options);

export const ROOT_DIR="../"
export const marked=_marked
