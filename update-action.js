const fs = require('fs');
let code = fs.readFileSync('/opt/build/repo/split-i18n.js', 'utf8');
code = code.replace(/action="\\\/obrigado\\\.html"/g, 'action="/obrigado"');
fs.writeFileSync('/opt/build/repo/split-i18n.js', code);
