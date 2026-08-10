const fs = require('fs');
let code = fs.readFileSync('/opt/build/repo/split-i18n.js', 'utf8');

const lines = code.split('\n');
const fixedLines = lines.map(line => {
  if (line.includes('obrigado') && line.includes('replace') && line.includes('action=')) {
    return "    h = h.split('action=\"/obrigado\"').join('action=\"/en/obrigado\"');";
  }
  return line;
});

fs.writeFileSync('/opt/build/repo/split-i18n.js', fixedLines.join('\n'));
