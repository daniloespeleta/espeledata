const fs = require('fs');
let code = fs.readFileSync('/opt/build/repo/scripts/validate-site-structure.ps1', 'utf8');

// I should not have changed the dictionary keys in validate-site-structure.ps1
// It still checks 'index.html', 'portfolio.html', etc., because the build outputs .html files even if pretty URLs are used
code = code.replace(/'\/' = @\{/g, "'index.html' = @{");
code = code.replace(/'portfolio' = @\{/g, "'portfolio.html' = @{");
code = code.replace(/'leea' = @\{/g, "'leea.html' = @{");
code = code.replace(/'notas' = @\{/g, "'notas.html' = @{");
code = code.replace(/'contact' = @\{/g, "'contact.html' = @{");

fs.writeFileSync('/opt/build/repo/scripts/validate-site-structure.ps1', code);
