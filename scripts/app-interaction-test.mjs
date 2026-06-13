import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

class ClassList {
  constructor(element) {
    this.element = element;
  }

  add(...names) {
    const classes = new Set(this.element.className.split(/\s+/).filter(Boolean));
    names.forEach((name) => classes.add(name));
    this.element.className = [...classes].join(' ');
  }

  remove(...names) {
    const removed = new Set(names);
    this.element.className = this.element.className
      .split(/\s+/)
      .filter((name) => name && !removed.has(name))
      .join(' ');
  }

  contains(name) {
    return this.element.className.split(/\s+/).includes(name);
  }
}

class TestNode {
  constructor(tagName = '') {
    this.tagName = tagName.toUpperCase();
    this.nodeType = 1;
    this.id = '';
    this.className = '';
    this.dataset = {};
    this.style = {};
    this.attributes = {};
    this.childNodes = [];
    this.parentNode = null;
    this.onclick = null;
    this.disabled = false;
    this._textContent = '';
    this.classList = new ClassList(this);
  }

  get children() {
    return this.childNodes.filter((child) => child.nodeType === 1);
  }

  get textContent() {
    return this._textContent + this.childNodes.map((child) => child.textContent).join('');
  }

  set textContent(value) {
    this._textContent = String(value);
    this.childNodes = [];
  }

  get innerHTML() {
    return '';
  }

  set innerHTML(value) {
    if (value !== '') {
      throw new Error('De test-DOM ondersteunt alleen het leegmaken van innerHTML.');
    }
    this._textContent = '';
    this.childNodes = [];
  }

  get offsetWidth() {
    return 0;
  }

  append(...nodes) {
    nodes.flat().forEach((node) => {
      const child = node?.nodeType ? node : new TestTextNode(String(node));
      child.parentNode = this;
      this.childNodes.push(child);
    });
  }

  appendChild(node) {
    this.append(node);
    return node;
  }

  click() {
    if (!this.disabled && typeof this.onclick === 'function') {
      this.onclick();
    }
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'id') this.id = String(value);
    if (name === 'class') this.className = String(value);
  }

  querySelectorAll(selector) {
    return queryAll(this, selector);
  }

  remove() {
    if (!this.parentNode) return;
    this.parentNode.childNodes = this.parentNode.childNodes.filter((child) => child !== this);
  }
}

class TestTextNode extends TestNode {
  constructor(text) {
    super();
    this.nodeType = 3;
    this._textContent = text;
  }
}

class TestDocument {
  constructor() {
    this.body = new TestNode('body');
  }

  createElement(tagName) {
    return new TestNode(tagName);
  }

  createElementNS(_namespace, tagName) {
    return new TestNode(tagName);
  }

  createTextNode(text) {
    return new TestTextNode(text);
  }

  querySelector(selector) {
    return queryAll(this.body, selector)[0] || null;
  }

  querySelectorAll(selector) {
    return queryAll(this.body, selector);
  }
}

function queryAll(root, selector) {
  const parts = selector.trim().split(/\s+/);
  let candidates = descendants(root);

  for (const [index, part] of parts.entries()) {
    candidates = candidates.filter((node) => matches(node, part));
    if (index < parts.length - 1) {
      candidates = candidates.flatMap(descendants);
    }
  }

  return candidates;
}

function descendants(root) {
  return root.children.flatMap((child) => [child, ...descendants(child)]);
}

function matches(node, selector) {
  if (selector.startsWith('#')) return node.id === selector.slice(1);
  if (selector.startsWith('.')) return node.classList.contains(selector.slice(1));

  const [tagName, className] = selector.split('.');
  return node.tagName === tagName.toUpperCase()
    && (!className || node.classList.contains(className));
}

function appendElement(document, tagName, { id = '', className = '' } = {}) {
  const element = document.createElement(tagName);
  element.id = id;
  element.className = className;
  document.body.append(element);
  return element;
}

function createAppDocument() {
  const document = new TestDocument();
  const home = appendElement(document, 'div', { id: 'screen-home', className: 'card' });

  ['stars', 'streak', 'countdown-home', 'btn-audio'].forEach((id) => {
    const tagName = id === 'btn-audio' ? 'button' : 'span';
    const element = document.createElement(tagName);
    element.id = id;
    home.append(element);
  });

  ['emoji', 'cvc', 'clock', 'math'].forEach((mode) => {
    const button = document.createElement('button');
    button.id = `nav-${mode}`;
    home.append(button);
    appendElement(document, 'div', { id: `screen-${mode}`, className: 'card hidden' });
  });

  appendElement(document, 'div', { id: 'trophy-grid' });
  appendElement(document, 'div', { id: 'sticker-next' });
  appendElement(document, 'div', { id: 'confetti' });
  appendElement(document, 'div', { id: 'sticker-float' });
  appendElement(document, 'div', { id: 'pause-overlay' });
  appendElement(document, 'b', { id: 'pause-remaining' });
  return document;
}

const bundle = await readFile(path.join(process.cwd(), 'public/app.js'), 'utf8');

for (const mode of ['emoji', 'cvc', 'clock', 'math']) {
  const document = createAppDocument();
  const storage = new Map();
  const context = {
    document,
    history: { back() {}, pushState() {} },
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
    },
    window: {},
    setInterval: () => 1,
    clearInterval() {},
    setTimeout: () => 1,
    clearTimeout() {},
    Date,
    Math,
    Set,
    console,
  };

  vm.runInNewContext(bundle, context, { filename: 'public/app.js' });

  const button = document.querySelector(`#nav-${mode}`);
  if (button?.tagName !== 'BUTTON' || typeof button.onclick !== 'function') {
    throw new Error(`Navigatieknop nav-${mode} heeft geen clickhandler.`);
  }

  button.click();

  const screen = document.querySelector(`#screen-${mode}`);
  if (screen.classList.contains('hidden') || screen.children.length === 0) {
    throw new Error(`Navigatie naar screen-${mode} mount geen zichtbaar spel.`);
  }
}

console.log('Interaction test passed: all four native buttons mount their game.');
