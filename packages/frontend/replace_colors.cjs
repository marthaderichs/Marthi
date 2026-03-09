const fs = require('fs');
const path = require('path');

const replacements = {
  '#FF4D4D': '#FFB5A7',
  '#FFD93D': '#FFC8DD',
  '#4DA6FF': '#A2D2FF',
  '#FF8C42': '#FFDAC1',
  '#00E676': '#B5EAD7',
  '#9D4EDD': '#CDB4DB',
  '#FFFBEB': '#FAFAFA',
  '#FF9F1C': '#FFDAC1'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [oldColor, newColor] of Object.entries(replacements)) {
    if (content.includes(oldColor)) {
      content = content.split(oldColor).join(newColor);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
