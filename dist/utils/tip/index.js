export class Tip {
    constructor() {
        this.dom_stash = [];
    }
    push(message, time = 1000, callback = null, parentNode = null) {
        let div = document.createElement('div');
        div.insertAdjacentHTML('afterbegin', `<span class="jk-text-trim">${message}</span>`);
        let w, h;
        div.className = 'jk-tip';
        this.dom_stash.forEach((D) => {
            D.style.top = parseInt(D.style.top) - 60 + 'px';
        });
        this.dom_stash.push(div);
        if (!parentNode) {
            document.getElementsByTagName("BODY")[0].appendChild(div);
        }
        else {
            parentNode.append(div);
        }
        if (!parentNode) {
            w = (window.innerWidth - 320) / 2;
            h = window.innerHeight / 2 - 15;
            div.style.position = 'fixed';
        }
        else {
            w = (parentNode.offsetWidth - 320) / 2;
            h = parentNode.offsetHeight / 2 - 15;
            div.style.position = 'absolute';
        }
        div.style.top = h + 'px';
        div.style.left = w + 'px';
        setTimeout(() => {
            let dom = this.dom_stash.shift();
            if (dom instanceof HTMLElement && dom.parentNode instanceof HTMLElement)
                dom.parentNode.removeChild(dom);
            if (typeof callback === 'function')
                callback();
        }, time);
    }
}
