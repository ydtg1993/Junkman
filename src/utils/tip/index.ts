export class Tip {
    private dom_stash: HTMLElement[] = [];
    private parent_node: HTMLElement|null = document.getElementsByTagName("BODY")[0];
    private width:string|number = 320;

    constructor(options:{width?:string|number,parentNode?: HTMLElement})
    {
        if(typeof options == 'object') {
            if (options.hasOwnProperty('parentNode')) {
                this.parent_node = options.parentNode;
            }
            if (options.hasOwnProperty('width')) {
                this.width = options.width;
            }
        }
    }

    push(message: string, time: number = 1000, callback: (() => void) | null = null) {
        let div = document.createElement('div');
        let widthStyle = this.width;
        if(typeof this.width == 'number'){
            widthStyle = this.width +'px';
        }
        div.insertAdjacentHTML('afterbegin', `<span class="jk-text-trim" style="width:${widthStyle}">${message}</span>`);
        let w, h;
        div.className = 'jk-tip';
        this.dom_stash.forEach((D) => {
            D.style.top = parseInt(D.style.top) - 60 + 'px';
        });
        this.dom_stash.push(div);

        this.parent_node.append(div);

        if (!this.parent_node) {
            w = (window.innerWidth - div.firstChild.clientWidth) / 2;
            h = window.innerHeight / 2 - 15;
            div.style.position = 'fixed';
        } else {
            w = (this.parent_node.offsetWidth - div.firstChild.clientWidth) / 2;
            h = this.parent_node.offsetHeight / 2 - 15;
            div.style.position = 'absolute';
        }
        div.style.top = h + 'px';
        div.style.left = w + 'px';
        setTimeout(() => {
            let dom = this.dom_stash.shift();
            if(dom instanceof HTMLElement && dom.parentNode instanceof HTMLElement) dom.parentNode.removeChild(dom);
            if (typeof callback === 'function') callback();
        }, time);
    }
}