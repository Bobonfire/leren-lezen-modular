export const $ = sel => document.querySelector(sel);
export function el(tag, props = {}, ...children){
  const node = document.createElement(tag);
  const { dataset, ...rest } = props || {};
  // Assign normal properties (id, className, textContent, onclick, etc.)
  Object.assign(node, rest);
  // Assign data-* attributes safely
  if (dataset) {
    for (const [key, value] of Object.entries(dataset)) {
      node.dataset[key] = value;
    }
  }
  // Append children (DOM nodes or text)
  children.flat().forEach(c => {
    if (c == null) return;
    node.append(c && c.nodeType ? c : document.createTextNode(c));
  });
  return node;
}
