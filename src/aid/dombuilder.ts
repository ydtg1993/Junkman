export function createDOMFromTree(node: any, parent: HTMLElement): HTMLElement {
    let tag = 'div';
    if (node.hasOwnProperty('tag')) tag = node.tag;

    const dom = document.createElement(tag);
    if (node.hasOwnProperty('className')) dom.className = node.className;

    if (node.hasOwnProperty('attributes')) {
        for (let k in node.attributes) {
            if (node.attributes.hasOwnProperty(k)) dom.setAttribute(k, node.attributes[k]);
        }
    }

    if (node.hasOwnProperty('textContent')) dom.textContent = node.textContent;

    if (node.hasOwnProperty('styles')) {
        for (let k in node.styles) {
            if (node.styles.hasOwnProperty(k)) {
                // @ts-ignore
                dom.style[k] = node.styles[k];
            }
        }
    }

    if (node.hasOwnProperty('events')) {
        for (let e in node.events) {
            if (node.events.hasOwnProperty(e)) {
                dom.addEventListener(e, (event) => node.events[e](event, dom), false);
            }
        }
    }

    if (node.hasOwnProperty('nodes')) {
        if (typeof node.nodes === 'string') {
            dom.insertAdjacentHTML('afterbegin', node.nodes);
        } else {
            node.nodes.forEach((childNode: any) => {
                createDOMFromTree(childNode, dom);
            });
        }
    }

    parent.appendChild(dom);
    return dom;
}