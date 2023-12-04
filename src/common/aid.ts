export class Aid {
    static loading(dom: HTMLElement, remove = false) {
        if (remove) {
            dom.innerHTML = '';
            if (dom.parentNode instanceof HTMLElement) {
                dom.parentNode.style.position =  dom.getAttribute('stash-position');
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
}