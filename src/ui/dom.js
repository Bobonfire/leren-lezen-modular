export const $ = sel => document.querySelector(sel);
export function el(tag, props={}, ...children){
  const node = document.createElement(tag);
  Object.assign(node, props);
  children.flat().forEach(c => node.append(c && c.nodeType ? c : document.createTextNode(c)));
  return node;
}
