export function loader(dom, remove = false) {
    var _a;
    if (remove) {
        dom.innerHTML = '';
        if (dom.parentNode instanceof HTMLElement) {
            dom.parentNode.style.position = (_a = dom.getAttribute('stash-position'), (_a !== null && _a !== void 0 ? _a : ''));
        }
        return;
    }
    if (dom.parentNode instanceof HTMLElement) {
        dom.setAttribute('stash-position', dom.parentNode.style.position);
        dom.parentNode.style.position = 'relative';
    }
    dom.insertAdjacentHTML('afterbegin', `<div class="jk-loader">
        <div>
            <div><div></div></div>
            <div><div></div></div>
            <div><div></div></div>
            <div><div></div></div>
            <div><div></div></div>
        </div></div>`);
}
