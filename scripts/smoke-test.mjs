import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const requiredSelectors = [
  'id="screen-home"',
  'id="nav-emoji"',
  'id="nav-cvc"',
  'id="nav-clock"',
  'id="nav-math"',
  'id="btn-audio"',
  'id="screen-emoji"',
  'id="screen-cvc"',
  'id="screen-clock"',
  'id="screen-math"',
];

async function assertFile(relativePath) {
  await readFile(path.join(root, relativePath), 'utf8');
}

async function verifyEntry(relativePath, expectedScript, expectedStylesheet) {
  const html = await readFile(path.join(root, relativePath), 'utf8');

  for (const selector of requiredSelectors) {
    if (!html.includes(selector)) {
      throw new Error(`${relativePath} mist ${selector}`);
    }
  }

  if (!html.includes(`src="${expectedScript}"`)) {
    throw new Error(`${relativePath} verwijst niet naar ${expectedScript}`);
  }

  if (!html.includes(`href="${expectedStylesheet}"`)) {
    throw new Error(`${relativePath} verwijst niet naar ${expectedStylesheet}`);
  }

  const scriptPath = path.normalize(path.join(path.dirname(relativePath), expectedScript));
  const stylesheetPath = path.normalize(path.join(path.dirname(relativePath), expectedStylesheet));
  await assertFile(scriptPath);
  await assertFile(stylesheetPath);
}

await verifyEntry('index.html', './public/app.js', './public/styles.css');
await verifyEntry('public/index.html', './app.js', './styles.css');

const styles = await readFile(path.join(root, 'public/styles.css'), 'utf8');
for (const token of ['.toolbar', '@media (max-width: 520px)', ':focus-visible']) {
  if (!styles.includes(token)) {
    throw new Error(`Responsive/focus CSS mist ${token}`);
  }
}

console.log('Smoke test passed: entrypoints, assets, controls, and responsive CSS are present.');
