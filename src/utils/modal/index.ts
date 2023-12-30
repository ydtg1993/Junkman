import {createDOMFromTree} from "../../aid/dombuilder";
import {Icon} from "../../index";
import {generateUniqueString} from "../../aid/random";

export class Modal {
    protected xhr: { url: string, method?: string, data?: {}, callback?: () => void } | undefined;
    protected content: string | HTMLElement | undefined;
    protected DOM!: HTMLElement;
    protected title: string = '';
    protected windowStyles: { width?: any, height?: any, top?: string, right?: string, bottom?: string, left?: string } = {
        width: '80%',
        height: '80%',
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        left: 'auto',
    };
    protected parentNode: HTMLElement = document.body;
    protected fullscreen: boolean = false;
    protected gauze: boolean = false;
    protected unique: string = '';
    protected window_position_mem:[string,string] = ['',''];
    protected window_aspect_mem:[string,string] = ['',''];
    protected timeout: number = -1;
    protected headerHidden: boolean = false;

    constructor() {
        this.unique = generateUniqueString(10);
    }

    public setContent(content: any) {
        if (typeof content === 'object') {
            this.xhr = content;
            this.xhr = Object.assign({
                method: 'GET',
                url: '',
                data: {},
                callback: () => {
                },
            }, content);
        } else if (typeof content === 'string' || (content instanceof HTMLElement)) {
            this.content = content;
        } else {
            console.error('type of content error!');
        }
        return this;
    }

    public setOptions(options: {
        title?:string,
        aspect?: { width?: string, height?: string },
        position: { x?: string, y?: string },
        fullscreen?:boolean,
        close?:boolean,
        gauze?:boolean,
        headerHidden?:boolean,
        timeout?:number,
    }) {
        if(options.title){
            this.title = options.title;
        }
        if(options.gauze){
            this.gauze = options.gauze;
        }
        if(options.fullscreen){
            this.fullscreen = options.fullscreen;
        }
        if(options.timeout){
            this.timeout = options.timeout;
        }
        if(options.headerHidden){
            this.headerHidden = options.headerHidden;
        }
        if(options.aspect) {
            if (options.aspect.width) {
                this.windowStyles.width = options.aspect.width;
            }
            if (options.aspect.height) {
                this.windowStyles.height = options.aspect.height;
            }
        }
        if(options.position) {
            if (options.position.x) {
                this.window_position_mem[0] = options.position.x;
                if (options.position.x.charAt(0) === 'L') {
                    this.windowStyles.left = options.position.x.substring(1);
                } else if (options.position.x.charAt(0) === 'R') {
                    this.windowStyles.right = options.position.x.substring(1);
                }
            }
            if (options.position.y) {
                this.window_position_mem[1] = options.position.y;
                if (options.position.y.charAt(0) === 'T') {
                    this.windowStyles.top = options.position.y.substring(1);
                } else if (options.position.y.charAt(0) === 'B') {
                    this.windowStyles.bottom = options.position.y.substring(1);
                }
            }
        }
        return this;
    }

    public setParentNode(parentNode: HTMLElement) {
        this.parentNode = parentNode;
        return this;
    }

    public close() {
        this.parentNode.removeChild(this.DOM);
    }

    public getUniqueCode() {
        return this.unique;
    }

    private buildHeader() {
        let header = {
            className: 'jk-modal-header', nodes: [
                {textContent: this.title}
            ]
        };
        //@ts-ignore
        header.nodes.push({events: {click: () => {
            if(this.window_aspect_mem[0] === ''){
                this.buildFullscreen();
            }else {
                this.resize();
            }
        }}, nodes: Icon.aspect});
        header.nodes.push({
            // @ts-ignore
            events: {click: () => this.close()}, nodes: Icon.close,styles: {margin:'0 5px 0 10px'},
        });
        return header;
    }

    private autoPos() {
        let w = this.DOM.querySelector('.jk-modal-window');
        if(!(w instanceof HTMLElement))return;
        let pos_mem_x = this.window_position_mem[0];
        if (pos_mem_x === '') {
            let left = (window.innerWidth - w.clientWidth) / 2;
            w.style.left = left + 'px';
        }else{
            if (pos_mem_x.charAt(0) === 'L') {
                w.style.left = pos_mem_x.substring(1);
            } else if (pos_mem_x.charAt(0) === 'R') {
                w.style.right = pos_mem_x.substring(1);
            }
        }
        let pos_mem_y = this.window_position_mem[1];
        if (pos_mem_y === '') {
            let top = (window.innerHeight - w.clientHeight) / 2;
            w.style.top = top + 'px';
        }else {
            if (pos_mem_y.charAt(0) === 'T') {
                w.style.top = pos_mem_y.substring(1);
            } else if (pos_mem_y.charAt(0) === 'B') {
                w.style.bottom = pos_mem_y.substring(1);
            }
        }
    }

    private buildFullscreen(){
        let w = this.DOM.querySelector('.jk-modal-window');
        if(!(w instanceof HTMLElement))return;
        this.window_aspect_mem = [w.clientWidth + 'px',w.clientHeight + 'px'];
        w.style.width = '100%';
        w.style.height = '100%';
        // @ts-ignore
        w.style.inset = '0';
    }

    private resize(){
        let w = this.DOM.querySelector('.jk-modal-window');
        if(!(w instanceof HTMLElement))return;
        w.style.width = this.window_aspect_mem[0];
        w.style.height = this.window_aspect_mem[1];
        this.window_aspect_mem = ['',''];
        this.autoPos();
    }

    make() {
        let domTree = {
            className: 'jk jk-modal', attributes: {unique: this.unique},
            nodes: [
                {
                    className: 'jk-modal-window',
                    styles: this.windowStyles,
                    nodes: [
                        {className: 'jk-modal-body', nodes: this.content},
                    ]
                }
            ]
        };

        if(!this.headerHidden){
            // @ts-ignore
            domTree.nodes[0].nodes.unshift(this.buildHeader());
        }

        if (this.gauze) {
            // @ts-ignore
            domTree.nodes.push({className: 'gauze', events: {click: () => this.close()}});
        }

        this.DOM = createDOMFromTree(domTree, this.parentNode);
        this.autoPos();
        this.fullscreen && this.buildFullscreen();
        this.timeout>0 && setTimeout(()=>this.close(),this.timeout*1000);

    }
}