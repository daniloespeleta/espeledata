const fs = require('fs');
let code = fs.readFileSync('/opt/build/repo/split-i18n.js', 'utf8');

// I need to change: h = h.replace(/href="\/([a-z0-9-]+\.html)"/g, 'href="/en/$1"');
// to: h = h.replace(/href="\/([a-z0-9-]+)"/g, 'href="/en/$1"');
code = code.replace(
  "h = h.replace(/href=\"\\/([a-z0-9-]+\\.html)\"/g, 'href=\"/en/$1\"');",
  "h = h.replace(/href=\"\\/([a-z0-9-]+)\"/g, 'href=\"/en/$1\"');"
);

fs.writeFileSync('/opt/build/repo/split-i18n.js', code);
